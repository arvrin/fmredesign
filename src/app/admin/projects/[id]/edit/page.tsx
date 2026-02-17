/**
 * Edit Project Page
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { DashboardButton, DashboardCard, CardContent, CardHeader, CardTitle } from '@/design-system';
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
        alert('Error saving: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setProject(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fm-magenta-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8" style={{ textAlign: 'center' }}>
        <p className="text-fm-neutral-600 mb-4">Project not found</p>
        <Link href="/admin/projects" className="text-fm-magenta-600 hover:underline">Back to Projects</Link>
      </div>
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
        <DashboardButton variant="admin" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
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
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Project Name</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Description</label>
            <textarea
              value={project.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Status</label>
              <select
                value={project.status}
                onChange={(e) => updateField('status', e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
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
              <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Priority</label>
              <select
                value={project.priority}
                onChange={(e) => updateField('priority', e.target.value as ProjectPriority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Progress (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={project.progress}
                onChange={(e) => updateField('progress', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-1">End Date</label>
              <input
                type="date"
                value={project.endDate || ''}
                onChange={(e) => updateField('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Client Satisfaction (0-100)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={project.clientSatisfaction || ''}
                onChange={(e) => updateField('clientSatisfaction', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
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
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Notes</label>
            <textarea
              value={project.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={(project.tags || []).join(', ')}
              onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
              placeholder="e.g. urgent, redesign, phase-2"
            />
          </div>
        </CardContent>
      </DashboardCard>
    </div>
  );
}
