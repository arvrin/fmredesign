/**
 * Edit Content Item Page
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { DashboardButton, DashboardCard, CardContent, CardHeader, CardTitle } from '@/design-system';
import { adminToast } from '@/lib/admin/toast';
import type { ContentItem, ContentStatus, ContentType, Platform } from '@/lib/admin/project-types';
import { useTeamMembers } from '@/hooks/admin/useTeamMembers';
import { TEAM_ROLES } from '@/lib/admin/types';

export default function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getByRoles } = useTeamMembers();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const found = result.data.find((c: ContentItem) => c.id === id);
          setItem(found || null);
        }
      })
      .catch(err => console.error('Error loading content:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!item) return;
    setSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          title: item.title,
          description: item.description,
          content: item.content,
          type: item.type,
          platform: item.platform,
          scheduledDate: item.scheduledDate,
          status: item.status,
          assignedDesigner: item.assignedDesigner,
          assignedWriter: item.assignedWriter,
          imageUrl: item.imageUrl,
          videoUrl: item.videoUrl,
          hashtags: item.hashtags,
          mentions: item.mentions,
          tags: item.tags,
          clientFeedback: item.clientFeedback,
          revisionNotes: item.revisionNotes,
        }),
      });
      const result = await response.json();
      if (result.success) {
        router.push(`/admin/content/${id}`);
      } else {
        adminToast.error('Error saving: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving content:', error);
      adminToast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setItem(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fm-magenta-600" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-8" style={{ textAlign: 'center' }}>
        <p className="text-fm-neutral-600 mb-4">Content item not found</p>
        <Link href="/admin/content" className="text-fm-magenta-600 hover:underline">Back to Content</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/content/${id}`} className="text-fm-neutral-500 hover:text-fm-neutral-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-fm-neutral-900">Edit Content</h1>
            <p className="text-sm text-fm-neutral-500">{item.title}</p>
          </div>
        </div>
        <DashboardButton variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </DashboardButton>
      </div>

      {/* Basic Info */}
      <DashboardCard variant="admin">
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Title</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Description</label>
            <textarea
              value={item.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Content / Caption</label>
            <textarea
              value={item.content || ''}
              onChange={(e) => updateField('content', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Status</label>
              <select
                value={item.status}
                onChange={(e) => updateField('status', e.target.value as ContentStatus)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="approved">Approved</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="revision_needed">Revision Needed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Platform</label>
              <select
                value={item.platform}
                onChange={(e) => updateField('platform', e.target.value as Platform)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="website">Website</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Content Type</label>
              <select
                value={item.type}
                onChange={(e) => updateField('type', e.target.value as ContentType)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
              >
                <option value="post">Post</option>
                <option value="story">Story</option>
                <option value="reel">Reel</option>
                <option value="carousel">Carousel</option>
                <option value="video">Video</option>
                <option value="article">Article</option>
                <option value="ad">Ad</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Scheduled Date</label>
              <input
                type="date"
                value={item.scheduledDate || ''}
                onChange={(e) => updateField('scheduledDate', e.target.value)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              />
            </div>
          </div>
        </CardContent>
      </DashboardCard>

      {/* Assignments */}
      <DashboardCard variant="admin">
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Assigned Designer</label>
              <select
                value={item.assignedDesigner || ''}
                onChange={(e) => updateField('assignedDesigner', e.target.value)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
              >
                <option value="">Select designer</option>
                {getByRoles(['graphic-designer', 'ui-ux-designer', 'video-editor']).map(member => (
                  <option key={member.id} value={member.name}>
                    {member.name} — {TEAM_ROLES[member.role]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Assigned Writer</label>
              <select
                value={item.assignedWriter || ''}
                onChange={(e) => updateField('assignedWriter', e.target.value)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
              >
                <option value="">Select writer</option>
                {getByRoles(['content-writer', 'copywriter']).map(member => (
                  <option key={member.id} value={member.name}>
                    {member.name} — {TEAM_ROLES[member.role]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </DashboardCard>

      {/* Media */}
      <DashboardCard variant="admin">
        <CardHeader>
          <CardTitle>Media URLs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Image URL</label>
              <input
                type="url"
                value={item.imageUrl || ''}
                onChange={(e) => updateField('imageUrl', e.target.value)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Video URL</label>
              <input
                type="url"
                value={item.videoUrl || ''}
                onChange={(e) => updateField('videoUrl', e.target.value)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </DashboardCard>

      {/* Hashtags, Mentions, Tags */}
      <DashboardCard variant="admin">
        <CardHeader>
          <CardTitle>Hashtags & Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Hashtags (comma-separated)</label>
            <input
              type="text"
              value={(item.hashtags || []).join(', ')}
              onChange={(e) => updateField('hashtags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="#marketing, #design, #socialmedia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Mentions (comma-separated)</label>
            <input
              type="text"
              value={(item.mentions || []).join(', ')}
              onChange={(e) => updateField('mentions', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="@user1, @brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              value={(item.tags || []).join(', ')}
              onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="campaign-name, q1-2026"
            />
          </div>
        </CardContent>
      </DashboardCard>

      {/* Feedback */}
      <DashboardCard variant="admin">
        <CardHeader>
          <CardTitle>Feedback & Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Client Feedback</label>
            <textarea
              value={item.clientFeedback || ''}
              onChange={(e) => updateField('clientFeedback', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="Client feedback or comments..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Revision Notes</label>
            <textarea
              value={item.revisionNotes || ''}
              onChange={(e) => updateField('revisionNotes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="Notes on revisions needed..."
            />
          </div>
        </CardContent>
      </DashboardCard>
    </div>
  );
}
