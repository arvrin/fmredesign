/**
 * New Content Creation Page
 * Professional content creation interface with project integration
 * Migrated to react-hook-form + Zod validation
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Hash,
  AtSign,
  Save,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';
import { adminToast } from '@/lib/admin/toast';
import { createContentSchema } from '@/lib/validations/schemas';
import type { Project } from '@/lib/admin/project-types';

// Extend the base schema to include the content body field and array fields
const contentFormSchema = createContentSchema.extend({
  content: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type ContentFormData = z.infer<typeof contentFormSchema>;

const inputClass = 'w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700';
const errorInputClass = 'w-full px-3 py-2 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700';
const errorClass = 'text-red-500 text-sm mt-1';

export default function NewContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('projectId');

  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [talent, setTalent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [hashtagInput, setHashtagInput] = useState('');
  const [mentionInput, setMentionInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      projectId: projectId || '',
      title: '',
      description: '',
      content: '',
      type: 'post',
      platform: 'instagram',
      scheduledDate: '',
      assignedDesigner: '',
      assignedWriter: '',
      hashtags: [],
      mentions: [],
      tags: []
    }
  });

  // Watch projectId for sidebar info
  const watchedProjectId = useWatch({ control, name: 'projectId' });
  const watchedContent = useWatch({ control, name: 'content' });
  const watchedHashtags = useWatch({ control, name: 'hashtags' });
  const watchedMentions = useWatch({ control, name: 'mentions' });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsResponse, clientsResponse, talentResponse] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/clients'),
          fetch('/api/talent')
        ]);

        const projectsResult = await projectsResponse.json();
        const clientsResult = await clientsResponse.json();
        const talentResult = await talentResponse.json();

        if (projectsResult.success) setProjects(projectsResult.data);
        if (clientsResult.success) setClients(clientsResult.data);
        if (talentResult.success) setTalent(talentResult.data);

        // If projectId is provided, pre-select it
        if (projectId && projectsResult.success) {
          const project = projectsResult.data.find((p: Project) => p.id === projectId);
          if (project) {
            setValue('projectId', project.id);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [projectId, setValue]);

  const addHashtag = () => {
    if (hashtagInput.trim()) {
      const current = watchedHashtags || [];
      if (!current.includes(hashtagInput.trim())) {
        setValue('hashtags', [...current, hashtagInput.trim()]);
      }
      setHashtagInput('');
    }
  };

  const removeHashtag = (index: number) => {
    const current = watchedHashtags || [];
    setValue('hashtags', current.filter((_: string, i: number) => i !== index));
  };

  const addMention = () => {
    if (mentionInput.trim()) {
      const current = watchedMentions || [];
      if (!current.includes(mentionInput.trim())) {
        setValue('mentions', [...current, mentionInput.trim()]);
      }
      setMentionInput('');
    }
  };

  const removeMention = (index: number) => {
    const current = watchedMentions || [];
    setValue('mentions', current.filter((_: string, i: number) => i !== index));
  };

  const onSubmit = async (data: ContentFormData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin/content?created=true');
      } else {
        adminToast.error(result.error || 'Failed to create content');
      }
    } catch (error) {
      console.error('Error creating content:', error);
      adminToast.error('Error creating content');
    } finally {
      setLoading(false);
    }
  };

  const selectedProject = projects.find(p => p.id === watchedProjectId);

  return (
    <div className="min-h-screen bg-fm-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/content')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-fm-neutral-900">New Content</h1>
            <p className="text-fm-neutral-600">Create new content for your content calendar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-fm-neutral-900 mb-4">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Project *
                    </label>
                    <select
                      {...register('projectId')}
                      className={errors.projectId ? errorInputClass : inputClass}
                    >
                      <option value="">Select a project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name} - {clients.find(c => c.id === project.clientId)?.name || 'Unknown Client'}
                        </option>
                      ))}
                    </select>
                    {errors.projectId && <p className={errorClass}>{errors.projectId.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Scheduled Date *
                    </label>
                    <input
                      type="datetime-local"
                      {...register('scheduledDate')}
                      className={errors.scheduledDate ? errorInputClass : inputClass}
                    />
                    {errors.scheduledDate && <p className={errorClass}>{errors.scheduledDate.message}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    placeholder="Enter content title"
                    className={errors.title ? errorInputClass : inputClass}
                  />
                  {errors.title && <p className={errorClass}>{errors.title.message}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    placeholder="Brief description of the content"
                    rows={3}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Content Type *
                    </label>
                    <select
                      {...register('type')}
                      className={errors.type ? errorInputClass : inputClass}
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
                    {errors.type && <p className={errorClass}>{errors.type.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Platform *
                    </label>
                    <select
                      {...register('platform')}
                      className={errors.platform ? errorInputClass : inputClass}
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
                    {errors.platform && <p className={errorClass}>{errors.platform.message}</p>}
                  </div>
                </div>
              </div>

              {/* Content Details */}
              <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-fm-neutral-900 mb-4">Content Details</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                    Content Body
                  </label>
                  <textarea
                    {...register('content')}
                    placeholder="Write your content here..."
                    rows={6}
                    className={inputClass}
                  />
                  <p className="text-sm text-fm-neutral-500 mt-1">
                    Character count: {(watchedContent || '').length}
                  </p>
                </div>

                {/* Hashtags */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                    Hashtags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <div className="flex-1 relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
                      <input
                        type="text"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        placeholder="Add hashtag (without #)"
                        className="w-full pl-10 pr-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                      />
                    </div>
                    <Button type="button" onClick={addHashtag} variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(watchedHashtags || []).map((tag: string, index: number) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-50 text-blue-600 rounded-full">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeHashtag(index)}
                          className="text-blue-400 hover:text-blue-600 ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mentions */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                    Mentions
                  </label>
                  <div className="flex gap-2 mb-2">
                    <div className="flex-1 relative">
                      <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
                      <input
                        type="text"
                        value={mentionInput}
                        onChange={(e) => setMentionInput(e.target.value)}
                        placeholder="Add mention (without @)"
                        className="w-full pl-10 pr-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMention())}
                      />
                    </div>
                    <Button type="button" onClick={addMention} variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(watchedMentions || []).map((mention: string, index: number) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-green-50 text-green-600 rounded-full">
                        @{mention}
                        <button
                          type="button"
                          onClick={() => removeMention(index)}
                          className="text-green-400 hover:text-green-600 ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Assignment */}
              <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-fm-neutral-900 mb-4">Team Assignment</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Assigned Designer
                    </label>
                    <select
                      {...register('assignedDesigner')}
                      className={inputClass}
                    >
                      <option value="">Select designer</option>
                      {talent.filter(t => t.role === 'designer').map(person => (
                        <option key={person.id} value={person.name}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Assigned Writer
                    </label>
                    <select
                      {...register('assignedWriter')}
                      className={inputClass}
                    >
                      <option value="">Select writer</option>
                      {talent.filter(t => t.role === 'writer' || t.role === 'content_writer').map(person => (
                        <option key={person.id} value={person.name}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
                <h3 className="font-semibold text-fm-neutral-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {(loading || isSubmitting) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create Content
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push('/admin/content')}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Project Info */}
              {selectedProject && (
                <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
                  <h3 className="font-semibold text-fm-neutral-900 mb-4">Project Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-fm-neutral-500">Project:</span>
                      <p className="font-medium">{selectedProject.name}</p>
                    </div>
                    <div>
                      <span className="text-fm-neutral-500">Client:</span>
                      <p className="font-medium">
                        {clients.find(c => c.id === selectedProject.clientId)?.name || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <span className="text-fm-neutral-500">Content Requirements:</span>
                      <p className="text-xs text-fm-neutral-600">
                        {selectedProject.contentRequirements?.postsPerWeek} posts/week
                      </p>
                      <p className="text-xs text-fm-neutral-600">
                        Platforms: {selectedProject.contentRequirements?.platforms?.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Guidelines */}
              <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
                <h3 className="font-semibold text-fm-neutral-900 mb-4">Content Guidelines</h3>
                <div className="space-y-3 text-sm text-fm-neutral-600">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p>Schedule content at least 24 hours in advance for review</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p>Include relevant hashtags to increase discoverability</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Assign team members for faster content creation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
