'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import { adminToast } from '@/lib/admin/toast';

interface QuickAddContentProps {
  onClose: () => void;
  onCreated?: () => void;
}

export function QuickAddContent({ onClose, onCreated }: QuickAddContentProps) {
  const [projects, setProjects] = useState<{ id: string; name: string; clientId: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('post');
  const [platform, setPlatform] = useState('instagram');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setProjects(
            (res.data || [])
              .filter((p: any) => p.status === 'active')
              .map((p: any) => ({ id: p.id, name: p.name, clientId: p.clientId }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      adminToast.error('Title is required');
      return;
    }
    setLoading(true);
    try {
      const selectedProject = projects.find((p) => p.id === projectId);
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectId || undefined,
          clientId: selectedProject?.clientId || undefined,
          title,
          type,
          platform,
          scheduledDate,
          status: 'draft',
          description: '',
          content: '',
        }),
      });
      const json = await res.json();
      if (json.success || res.ok) {
        adminToast.success('Content created');
        onCreated?.();
        onClose();
      } else {
        adminToast.error(json.error || 'Failed to create content');
      }
    } catch {
      adminToast.error('Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Project</label>
        <Select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          <option value="">No project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Title *</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Monday motivation post" />
      </div>

      <div>
        <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Type</label>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="post">Post</option>
          <option value="story">Story</option>
          <option value="reel">Reel</option>
          <option value="carousel">Carousel</option>
          <option value="video">Video</option>
          <option value="article">Article</option>
          <option value="ad">Ad</option>
          <option value="email">Email</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Platform</label>
        <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="linkedin">LinkedIn</option>
          <option value="twitter">Twitter</option>
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
          <option value="website">Website</option>
          <option value="email">Email</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Scheduled Date</label>
        <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-fm-neutral-100">
        <Link
          href="/admin/content/new"
          className="text-sm text-fm-magenta-600 hover:text-fm-magenta-700 flex items-center gap-1"
        >
          Full form <ExternalLink className="w-3 h-3" />
        </Link>
        <div className="flex items-center gap-2">
          <DashboardButton variant="secondary" size="sm" type="button" onClick={onClose}>
            Cancel
          </DashboardButton>
          <DashboardButton variant="primary" size="sm" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Content'}
          </DashboardButton>
        </div>
      </div>
    </form>
  );
}
