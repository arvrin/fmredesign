/**
 * New Project Creation Page
 * Create new projects with comprehensive form and auto-discovery integration
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, Users, Target, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';
import { adminToast } from '@/lib/admin/toast';
import type { ProjectInput, ProjectType } from '@/lib/admin/project-types';
import { PROJECT_TEMPLATES } from '@/lib/admin/project-types';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface TalentMember {
  id: string;
  name: string;
  category: string;
  skills: string[];
  availability: string;
  hourlyRate: number;
}

interface Discovery {
  id: string;
  clientId: string;
  projectOverview: {
    projectName: string;
    projectType: string;
    projectDescription: string;
    timeline: {
      startDate: string;
      desiredLaunch: string;
    };
    projectScope: string[];
    successMetrics: string[];
  };
  budgetResources: {
    totalBudget: {
      amount: number;
    };
  };
  contentCreative: {
    contentStrategy: {
      contentTypes: string[];
      postingFrequency: string;
    };
  };
}

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const discoveryId = searchParams.get('discoveryId');

  const [clients, setClients] = useState<Client[]>([]);
  const [talent, setTalent] = useState<TalentMember[]>([]);
  const [discovery, setDiscovery] = useState<Discovery | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ProjectInput>({
    clientId: '',
    discoveryId: discoveryId || undefined,
    name: '',
    description: '',
    type: 'social_media',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedHours: 40,
    projectManager: '',
    assignedTalent: [],
    budget: 50000,
    hourlyRate: 1000,
    contentRequirements: {
      postsPerWeek: 5,
      platforms: ['instagram', 'facebook'],
      contentTypes: ['post', 'story', 'reel']
    },
    tags: [],
    notes: ''
  });

  // Load data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Load clients
        const clientsResponse = await fetch('/api/clients');
        const clientsResult = await clientsResponse.json();
        if (clientsResult.success) {
          setClients(clientsResult.data);
        }

        // Load talent (if talent API exists)
        try {
          const talentResponse = await fetch('/api/talent?type=talents&status=approved');
          const talentResult = await talentResponse.json();
          if (talentResult.success) {
            setTalent(talentResult.data || []);
          }
        } catch (error) {
          // Talent API might not exist yet, that's okay
        }

        // Load discovery if ID provided
        if (discoveryId) {
          try {
            const discoveryResponse = await fetch(`/api/discovery?sessionId=${discoveryId}`);
            const discoveryResult = await discoveryResponse.json();
            if (discoveryResult.success && discoveryResult.data) {
              const discoveryData = discoveryResult.data;
              setDiscovery(discoveryData);
              
              // Pre-populate form with discovery data
              setFormData(prev => ({
                ...prev,
                clientId: discoveryData.clientId || '',
                name: discoveryData.projectOverview?.projectName || '',
                description: discoveryData.projectOverview?.projectDescription || '',
                type: discoveryData.projectOverview?.projectType || 'social_media',
                startDate: discoveryData.projectOverview?.timeline?.startDate || prev.startDate,
                endDate: discoveryData.projectOverview?.timeline?.desiredLaunch || prev.endDate,
                budget: discoveryData.budgetResources?.totalBudget?.amount || prev.budget,
                contentRequirements: {
                  postsPerWeek: discoveryData.contentCreative?.contentStrategy?.postingFrequency === 'daily' ? 7 : 
                               discoveryData.contentCreative?.contentStrategy?.postingFrequency === '3-4 times/week' ? 4 : 5,
                  platforms: ['instagram', 'facebook'],
                  contentTypes: discoveryData.contentCreative?.contentStrategy?.contentTypes || ['post', 'story']
                },
                tags: discoveryData.projectOverview?.projectScope || []
              }));
            }
          } catch (error) {
            console.error('Error loading discovery:', error);
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [discoveryId]);

  // Update form when project type changes
  useEffect(() => {
    const template = PROJECT_TEMPLATES[formData.type as keyof typeof PROJECT_TEMPLATES];
    if (template) {
      setFormData(prev => ({
        ...prev,
        estimatedHours: template.estimatedHours || prev.estimatedHours,
        contentRequirements: template.contentRequirements || prev.contentRequirements
      }));
    }
  }, [formData.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin/projects');
      } else {
        adminToast.error(`Error creating project: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      adminToast.error('Failed to create project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fm-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto mb-4"></div>
          <p className="text-fm-neutral-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fm-neutral-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/projects')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-fm-neutral-900">
              {discoveryId ? 'Create Project from Discovery' : 'Create New Project'}
            </h1>
            <p className="text-fm-neutral-600">
              {discoveryId ? 'Project details pre-populated from discovery session' : 'Set up a new client project'}
            </p>
          </div>
        </div>

        {/* Discovery Info Banner */}
        {discovery && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Discovery Session Found</h3>
                <p className="text-green-700">Project details have been pre-populated from the discovery session.</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-fm-neutral-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Client *
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.company})
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  placeholder="Enter project name"
                  required
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Project Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ProjectType }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  required
                >
                  <option value="social_media">Social Media</option>
                  <option value="web_development">Web Development</option>
                  <option value="branding">Branding</option>
                  <option value="seo">SEO</option>
                  <option value="paid_ads">Paid Ads</option>
                  <option value="content_marketing">Content Marketing</option>
                  <option value="full_service">Full Service</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  placeholder="Describe the project objectives and scope"
                />
              </div>
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-fm-neutral-900 mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline & Budget
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  required
                />
              </div>

              {/* Estimated Hours */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  min="0"
                  step="1"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Budget (₹) *
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              {/* Hourly Rate */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Hourly Rate (₹)
                </label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>

          {/* Team Assignment */}
          <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-fm-neutral-900 mb-6 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Assignment
            </h2>
            
            <div className="space-y-6">
              {/* Project Manager */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Project Manager *
                </label>
                <input
                  type="text"
                  value={formData.projectManager}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectManager: e.target.value }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  placeholder="Enter project manager name"
                  required
                />
              </div>

              {/* Assigned Talent */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Assigned Team Members
                </label>
                {talent.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {talent.slice(0, 6).map(member => (
                      <div key={member.id} className="flex items-center p-3 border border-fm-neutral-200 rounded-lg">
                        <input
                          type="checkbox"
                          id={`talent-${member.id}`}
                          checked={formData.assignedTalent.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, assignedTalent: [...prev.assignedTalent, member.id] }));
                            } else {
                              setFormData(prev => ({ ...prev, assignedTalent: prev.assignedTalent.filter(id => id !== member.id) }));
                            }
                          }}
                          className="mr-3"
                        />
                        <label htmlFor={`talent-${member.id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium text-fm-neutral-900">{member.name}</div>
                          <div className="text-sm text-fm-neutral-600">{member.category} • ₹{member.hourlyRate}/hr</div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-fm-neutral-500">No talent members available. You can assign team members after creating the project.</p>
                )}
              </div>
            </div>
          </div>

          {/* Content Requirements */}
          <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-fm-neutral-900 mb-6 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Content Requirements
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Posts Per Week */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Posts Per Week
                </label>
                <input
                  type="number"
                  value={formData.contentRequirements.postsPerWeek}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contentRequirements: {
                      ...prev.contentRequirements,
                      postsPerWeek: parseInt(e.target.value) || 0
                    }
                  }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  min="0"
                />
              </div>

              {/* Platforms */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {['instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'website'].map(platform => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.contentRequirements.platforms.includes(platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              contentRequirements: {
                                ...prev.contentRequirements,
                                platforms: [...prev.contentRequirements.platforms, platform]
                              }
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              contentRequirements: {
                                ...prev.contentRequirements,
                                platforms: prev.contentRequirements.platforms.filter(p => p !== platform)
                              }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="capitalize text-sm">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-fm-neutral-900 mb-6">Additional Information</h2>
            
            <div className="space-y-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="Enter tags separated by commas (e.g., urgent, social-media, campaign)"
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
                  placeholder="Additional notes or special requirements for this project"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/projects')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Creating Project...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}