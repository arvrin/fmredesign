'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import { adminToast } from '@/lib/admin/toast';

interface QuickAddProjectProps {
  onClose: () => void;
  onCreated?: () => void;
}

export function QuickAddProject({ onClose, onCreated }: QuickAddProjectProps) {
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('social_media');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    fetch('/api/clients')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setClients(
            (res.data || [])
              .filter((c: any) => c.status === 'active')
              .map((c: any) => ({ id: c.id, name: c.name }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !name) {
      adminToast.error('Client and project name are required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          name,
          type,
          startDate,
          endDate: endDate || undefined,
          budget: budget ? Number(budget) : 0,
          status: 'planning',
          priority: 'medium',
          estimatedHours: 40,
          hourlyRate: 1000,
          description: '',
        }),
      });
      const json = await res.json();
      if (json.success || res.ok) {
        adminToast.success('Project created');
        onCreated?.();
        onClose();
      } else {
        adminToast.error(json.error || 'Failed to create project');
      }
    } catch {
      adminToast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Client *</label>
        <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
          <option value="">Select client...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Project Name *</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q1 Social Media Campaign" />
      </div>

      <div>
        <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Type</label>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="social_media">Social Media</option>
          <option value="website">Website</option>
          <option value="branding">Branding</option>
          <option value="seo">SEO</option>
          <option value="content">Content</option>
          <option value="video">Video</option>
          <option value="other">Other</option>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Start Date</label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-1">End Date</label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Budget (INR)</label>
        <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-fm-neutral-100">
        <Link
          href="/admin/projects/new"
          className="text-sm text-fm-magenta-600 hover:text-fm-magenta-700 flex items-center gap-1"
        >
          Full form <ExternalLink className="w-3 h-3" />
        </Link>
        <div className="flex items-center gap-2">
          <DashboardButton variant="secondary" size="sm" type="button" onClick={onClose}>
            Cancel
          </DashboardButton>
          <DashboardButton variant="primary" size="sm" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </DashboardButton>
        </div>
      </div>
    </form>
  );
}
