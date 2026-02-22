/**
 * Edit Project Page
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { DashboardButton, DashboardCard, CardContent, CardHeader, CardTitle } from '@/design-system';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { adminToast } from '@/lib/admin/toast';
import type { Project, ProjectStatus, ProjectPriority, ProjectType } from '@/lib/admin/project-types';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const found = result.data.find((p: Project) => p.id === id);
          setProject(found || null);
        }
      })
      .catch(err => console.error('Error loading project:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!project) return;
    setSaving(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          name: project.name,
          description: project.description,
          status: project.status,
          priority: project.priority,
          endDate: project.endDate,
          progress: project.progress,
          assignedTalent: project.assignedTalent,
          notes: project.notes,
          tags: project.tags,
          clientSatisfaction: project.clientSatisfaction,
        }),
      });
      const result = await response.json();
      if (result.success) {
        router.push(`/admin/projects/${id}`);
      } else {
        adminToast.error('Error saving: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving project:', error);
      adminToast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setProject(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (loading) {
    return <LoadingSpinner size="sm" />;
  }

  if (!project) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-6 h-6" />}
        title="Project Not Found"
        description="The requested project could not be found."
        action={<Link href="/admin/projects"><DashboardButton variant="secondary">Back to Projects</DashboardButton></Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/projects/${id}`} className="text-fm-neutral-500 hover:text-fm-neutral-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-fm-neutral-900">Edit Project</h1>
            <p className="text-sm text-fm-neutral-500">{project.name}</p>
          </div>
        </div>
        <DashboardButton variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </DashboardButton>
      </div>

      {/* Basic Info */}
      <DashboardCard variant="admin">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Project Name</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Description</label>
            <textarea
              value={project.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Status</label>
              <select
                value={project.status}
                onChange={(e) => updateField('status', e.target.value as ProjectStatus)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Priority</label>
              <select
                value={project.priority}
                onChange={(e) => updateField('priority', e.target.value as ProjectPriority)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Progress (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={project.progress}
                onChange={(e) => updateField('progress', parseInt(e.target.value) || 0)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">End Date</label>
              <input
                type="date"
                value={project.endDate || ''}
                onChange={(e) => updateField('endDate', e.target.value)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Client Satisfaction (0-100)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={project.clientSatisfaction || ''}
                onChange={(e) => updateField('clientSatisfaction', parseInt(e.target.value) || 0)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              />
            </div>
          </div>
        </CardContent>
      </DashboardCard>

      {/* Notes & Tags */}
      <DashboardCard variant="admin">
        <CardHeader>
          <CardTitle>Notes & Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Notes</label>
            <textarea
              value={project.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              value={(project.tags || []).join(', ')}
              onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="e.g. urgent, redesign, phase-2"
            />
          </div>
        </CardContent>
      </DashboardCard>
    </div>
  );
}
