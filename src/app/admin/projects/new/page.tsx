/**
 * New Project Creation Page
 * Create new projects with comprehensive form and auto-discovery integration
 * Migrated to react-hook-form + Zod validation
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Calendar, DollarSign, Users, Target, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';
import { adminToast } from '@/lib/admin/toast';
import type { ProjectType } from '@/lib/admin/project-types';
import { PROJECT_TEMPLATES } from '@/lib/admin/project-types';
import { createProjectSchema } from '@/lib/validations/schemas';
import { useTeamMembers } from '@/hooks/admin/useTeamMembers';
import { TEAM_ROLES } from '@/lib/admin/types';

// Extend the base schema with the extra fields the form uses
// that are not in the API schema (assignedTalent, contentRequirements nested)
const projectFormSchema = createProjectSchema.extend({
  assignedTalent: z.array(z.string()).optional(),
  contentRequirements: z.object({
    postsPerWeek: z.number(),
    platforms: z.array(z.string()),
    contentTypes: z.array(z.string()),
  }).optional(),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

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

const inputClass = 'w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700';
const selectClass = inputClass;
const errorClass = 'text-sm text-red-500 mt-1';

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const discoveryId = searchParams.get('discoveryId');

  const { teamMembers } = useTeamMembers();
  const [clients, setClients] = useState<Client[]>([]);
  const [talent, setTalent] = useState<TalentMember[]>([]);
  const [discovery, setDiscovery] = useState<Discovery | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
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
    }
  });

  // Watch the type field to update template defaults
  const watchedType = useWatch({ control, name: 'type' });

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
          const talentResponse = await fetch('/api/talent?type=assignable');
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
              const postsPerWeek = discoveryData.contentCreative?.contentStrategy?.postingFrequency === 'daily' ? 7 :
                discoveryData.contentCreative?.contentStrategy?.postingFrequency === '3-4 times/week' ? 4 : 5;

              reset({
                clientId: discoveryData.clientId || '',
                discoveryId: discoveryId,
                name: discoveryData.projectOverview?.projectName || '',
                description: discoveryData.projectOverview?.projectDescription || '',
                type: discoveryData.projectOverview?.projectType || 'social_media',
                priority: 'medium',
                startDate: discoveryData.projectOverview?.timeline?.startDate || new Date().toISOString().split('T')[0],
                endDate: discoveryData.projectOverview?.timeline?.desiredLaunch || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                estimatedHours: 40,
                projectManager: '',
                assignedTalent: [],
                budget: discoveryData.budgetResources?.totalBudget?.amount || 50000,
                hourlyRate: 1000,
                contentRequirements: {
                  postsPerWeek,
                  platforms: ['instagram', 'facebook'],
                  contentTypes: discoveryData.contentCreative?.contentStrategy?.contentTypes || ['post', 'story']
                },
                tags: discoveryData.projectOverview?.projectScope || [],
                notes: ''
              });
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
  }, [discoveryId, reset]);

  // Update form when project type changes
  useEffect(() => {
    const template = PROJECT_TEMPLATES[watchedType as keyof typeof PROJECT_TEMPLATES];
    if (template) {
      if (template.estimatedHours) {
        setValue('estimatedHours', template.estimatedHours);
      }
      if (template.contentRequirements) {
        setValue('contentRequirements', template.contentRequirements);
      }
    }
  }, [watchedType, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="secondary"
            onClick={() => router.push('/admin/projects')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-fm-neutral-900">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                  {...register('clientId')}
                  className={selectClass}
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.company})
                    </option>
                  ))}
                </select>
                {errors.clientId && <p className={errorClass}>{errors.clientId.message}</p>}
              </div>

              {/* Project Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={inputClass}
                  placeholder="Enter project name"
                />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Project Type *
                </label>
                <select
                  {...register('type')}
                  className={selectClass}
                >
                  <option value="social_media">Social Media</option>
                  <option value="web_development">Web Development</option>
                  <option value="branding">Branding</option>
                  <option value="seo">SEO</option>
                  <option value="paid_ads">Paid Ads</option>
                  <option value="content_marketing">Content Marketing</option>
                  <option value="full_service">Full Service</option>
                </select>
                {errors.type && <p className={errorClass}>{errors.type.message}</p>}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className={selectClass}
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
                  {...register('description')}
                  className={inputClass}
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
                  {...register('startDate')}
                  className={inputClass}
                />
                {errors.startDate && <p className={errorClass}>{errors.startDate.message}</p>}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  {...register('endDate')}
                  className={inputClass}
                />
                {errors.endDate && <p className={errorClass}>{errors.endDate.message}</p>}
              </div>

              {/* Estimated Hours */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Estimated Hours
                </label>
                <Controller
                  name="estimatedHours"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className={inputClass}
                      min="0"
                      step="1"
                    />
                  )}
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Budget (₹) *
                </label>
                <Controller
                  name="budget"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className={inputClass}
                      min="0"
                      step="1000"
                    />
                  )}
                />
                {errors.budget && <p className={errorClass}>{errors.budget.message}</p>}
              </div>

              {/* Hourly Rate */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Hourly Rate (₹)
                </label>
                <Controller
                  name="hourlyRate"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className={inputClass}
                      min="0"
                      step="100"
                    />
                  )}
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
                <select
                  {...register('projectManager')}
                  className={selectClass}
                >
                  <option value="">Select project manager</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.name}>
                      {member.name} — {TEAM_ROLES[member.role]}
                    </option>
                  ))}
                </select>
                {errors.projectManager && <p className={errorClass}>{errors.projectManager.message}</p>}
              </div>

              {/* Assigned Talent */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Assigned Team Members
                </label>
                {talent.length > 0 ? (
                  <Controller
                    name="assignedTalent"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {talent.slice(0, 6).map(member => (
                          <div key={member.id} className="flex items-center p-3 border border-fm-neutral-200 rounded-lg">
                            <input
                              type="checkbox"
                              id={`talent-${member.id}`}
                              checked={(field.value || []).includes(member.id)}
                              onChange={(e) => {
                                const current = field.value || [];
                                if (e.target.checked) {
                                  field.onChange([...current, member.id]);
                                } else {
                                  field.onChange(current.filter((id: string) => id !== member.id));
                                }
                              }}
                              className="mr-3"
                            />
                            <label htmlFor={`talent-${member.id}`} className="flex-1 cursor-pointer">
                              <div className="font-medium text-fm-neutral-900">{member.name}</div>
                              <div className="text-sm text-fm-neutral-600">{member.category} &bull; ₹{member.hourlyRate}/hr</div>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  />
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
                <Controller
                  name="contentRequirements.postsPerWeek"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className={inputClass}
                      min="0"
                    />
                  )}
                />
              </div>

              {/* Platforms */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Platforms
                </label>
                <Controller
                  name="contentRequirements.platforms"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {['instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'website'].map(platform => (
                        <label key={platform} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(field.value || []).includes(platform)}
                            onChange={(e) => {
                              const current = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...current, platform]);
                              } else {
                                field.onChange(current.filter((p: string) => p !== platform));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="capitalize text-sm">{platform}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
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
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Enter tags separated by commas (e.g., urgent, social-media, campaign)"
                      onChange={(e) => field.onChange(e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                      defaultValue={(field.value || []).join(', ')}
                      className={inputClass}
                    />
                  )}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={4}
                  {...register('notes')}
                  className={inputClass}
                  placeholder="Additional notes or special requirements for this project"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/admin/projects')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Creating Project...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
