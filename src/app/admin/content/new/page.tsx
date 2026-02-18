/**
 * New Content Creation Page
 * Professional content creation interface with project integration
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft,
  Calendar,
  FileText,
  Image,
  Video,
  Repeat,
  Hash,
  AtSign,
  Upload,
  Save,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';
import { adminToast } from '@/lib/admin/toast';
import type { ContentInput, ContentType, Platform, Project } from '@/lib/admin/project-types';

export default function NewContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('projectId');

  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [talent, setTalent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<ContentInput>({
    projectId: projectId || '',
    title: '',
    description: '',
    content: '',
    type: 'post' as ContentType,
    platform: 'instagram' as Platform,
    scheduledDate: '',
    assignedDesigner: '',
    assignedWriter: '',
    hashtags: [],
    mentions: [],
    tags: []
  });

  const [hashtagInput, setHashtagInput] = useState('');
  const [mentionInput, setMentionInput] = useState('');
  const [tagInput, setTagInput] = useState('');

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

        // If projectId is provided, pre-select it and load project details
        if (projectId && projectsResult.success) {
          const project = projectsResult.data.find((p: Project) => p.id === projectId);
          if (project) {
            setFormData(prev => ({
              ...prev,
              projectId: project.id
            }));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [projectId]);

  const handleInputChange = (field: keyof ContentInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !formData.hashtags.includes(hashtagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim()]
      }));
      setHashtagInput('');
    }
  };

  const removeHashtag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter((_, i) => i !== index)
    }));
  };

  const addMention = () => {
    if (mentionInput.trim() && !formData.mentions.includes(mentionInput.trim())) {
      setFormData(prev => ({
        ...prev,
        mentions: [...prev.mentions, mentionInput.trim()]
      }));
      setMentionInput('');
    }
  };

  const removeMention = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mentions: prev.mentions.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectId) newErrors.projectId = 'Project is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.type) newErrors.type = 'Content type is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';

    // Check if scheduled date is in the future
    if (formData.scheduledDate) {
      const selectedDate = new Date(formData.scheduledDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      if (selectedDate < now) {
        newErrors.scheduledDate = 'Scheduled date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'video':
      case 'reel':
        return <Video className="h-4 w-4" />;
      case 'carousel':
        return <Repeat className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      default:
        return <Image className="h-4 w-4" />;
    }
  };

  const selectedProject = projects.find(p => p.id === formData.projectId);

  return (
    <div className="min-h-screen bg-fm-neutral-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
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
            <h1 className="text-3xl font-bold text-fm-neutral-900">New Content</h1>
            <p className="text-fm-neutral-600">Create new content for your content calendar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      value={formData.projectId}
                      onChange={(e) => handleInputChange('projectId', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 ${errors.projectId ? 'border-red-500' : 'border-fm-neutral-300'}`}
                      required
                    >
                      <option value="">Select a project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name} - {clients.find(c => c.id === project.clientId)?.name || 'Unknown Client'}
                        </option>
                      ))}
                    </select>
                    {errors.projectId && <p className="text-red-500 text-sm mt-1">{errors.projectId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Scheduled Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 ${errors.scheduledDate ? 'border-red-500' : 'border-fm-neutral-300'}`}
                      required
                    />
                    {errors.scheduledDate && <p className="text-red-500 text-sm mt-1">{errors.scheduledDate}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter content title"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 ${errors.title ? 'border-red-500' : 'border-fm-neutral-300'}`}
                    required
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the content"
                    rows={3}
                    className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Content Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value as ContentType)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 ${errors.type ? 'border-red-500' : 'border-fm-neutral-300'}`}
                      required
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
                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Platform *
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => handleInputChange('platform', e.target.value as Platform)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 ${errors.platform ? 'border-red-500' : 'border-fm-neutral-300'}`}
                      required
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
                    {errors.platform && <p className="text-red-500 text-sm mt-1">{errors.platform}</p>}
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
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your content here..."
                    rows={6}
                    className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  />
                  <p className="text-sm text-fm-neutral-500 mt-1">
                    Character count: {formData.content.length}
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
                    <Button type="button" onClick={addHashtag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.hashtags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-50 text-blue-600 rounded-full">
                        #{tag}
                        <button 
                          type="button" 
                          onClick={() => removeHashtag(index)}
                          className="text-blue-400 hover:text-blue-600 ml-1"
                        >
                          ×
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
                    <Button type="button" onClick={addMention} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.mentions.map((mention, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-green-50 text-green-600 rounded-full">
                        @{mention}
                        <button 
                          type="button" 
                          onClick={() => removeMention(index)}
                          className="text-green-400 hover:text-green-600 ml-1"
                        >
                          ×
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
                      value={formData.assignedDesigner}
                      onChange={(e) => handleInputChange('assignedDesigner', e.target.value)}
                      className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
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
                      value={formData.assignedWriter}
                      onChange={(e) => handleInputChange('assignedWriter', e.target.value)}
                      className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
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
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
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
                    variant="outline"
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