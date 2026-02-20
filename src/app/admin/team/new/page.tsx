/**
 * Add New Team Member Page
 * Comprehensive form for adding new team members
 * Migrated to react-hook-form + Zod validation
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Save,
  User,
  Briefcase,
  DollarSign,
  Settings,
  Award,
} from 'lucide-react';
import {
  DashboardCard as Card,
  CardContent,
  CardHeader,
  CardTitle,
  DashboardButton
} from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import {
  TeamRole,
  TeamDepartment,
  TEAM_ROLES,
  TEAM_DEPARTMENTS,
  COMMON_SKILLS
} from '@/lib/admin/types';
import { adminToast } from '@/lib/admin/toast';
import { createTeamMemberSchema } from '@/lib/validations/schemas';

// Extend the base schema with additional form-specific fields
const teamFormSchema = createTeamMemberSchema.extend({
  compensation: z.object({
    type: z.string(),
    amount: z.number().min(0),
    currency: z.string(),
    billingRate: z.number().min(0),
  }).optional(),
});

type TeamFormData = z.infer<typeof teamFormSchema>;

export default function NewTeamMemberPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      type: 'employee',
      status: 'active',
      role: 'content-writer',
      department: 'creative',
      seniority: 'junior',
      skills: [],
      compensation: {
        type: 'salary',
        amount: 0,
        currency: 'INR',
        billingRate: 0
      },
      workType: 'full-time',
      location: 'office',
      capacity: 40,
      startDate: new Date().toISOString().split('T')[0],
      notes: ''
    }
  });

  const onSubmit = async (data: TeamFormData) => {
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!result.success) {
        adminToast.error(result.error || 'Failed to create team member');
        return;
      }

      adminToast.success('Team member created successfully');
      router.push('/admin/team');
    } catch (error) {
      console.error('Error creating team member:', error);
      adminToast.error('Failed to create team member');
    }
  };

  // Flatten all errors for the top-level error display
  const errorMessages = Object.values(errors)
    .map(err => {
      if (err && 'message' in err && typeof err.message === 'string') return err.message;
      return null;
    })
    .filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Team Member"
        description="Create a new team member profile"
        icon={<User className="w-6 h-6" />}
        actions={
          <DashboardButton
            variant="secondary"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </DashboardButton>
        }
      />

      {/* Error Display */}
      {errorMessages.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errorMessages.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card variant="admin">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-fm-magenta-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                {...register('name')}
                placeholder="Enter full name"
                required
                error={errors.name?.message}
              />

              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                placeholder="Enter email address"
                required
                error={errors.email?.message}
              />

              <Input
                label="Phone Number"
                type="tel"
                {...register('phone')}
                placeholder="Enter phone number"
                required
                error={errors.phone?.message}
              />

              <Input
                label="Start Date"
                type="date"
                {...register('startDate')}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Role & Department */}
        <Card variant="admin">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-fm-magenta-600" />
              Role & Department
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Employment Type"
                {...register('type')}
                required
              >
                <option value="employee">Employee</option>
                <option value="freelancer">Freelancer</option>
                <option value="contractor">Contractor</option>
              </Select>

              <Select
                label="Department"
                {...register('department')}
                required
                error={errors.department?.message}
              >
                {Object.entries(TEAM_DEPARTMENTS).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </Select>

              <Select
                label="Seniority Level"
                {...register('seniority')}
                required
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="director">Director</option>
              </Select>
            </div>

            <Select
              label="Job Role"
              {...register('role')}
              required
              error={errors.role?.message}
            >
              {Object.entries(TEAM_ROLES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
          </CardContent>
        </Card>

        {/* Work Details */}
        <Card variant="admin">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-fm-magenta-600" />
              Work Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Work Type"
                {...register('workType')}
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </Select>

              <Select
                label="Location"
                {...register('location')}
                required
              >
                <option value="office">Office</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </Select>

              <Controller
                name="capacity"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Weekly Capacity (Hours)"
                    type="number"
                    min={1}
                    max={60}
                    value={field.value ?? 40}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 40)}
                    required
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Compensation */}
        <Card variant="admin">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-fm-magenta-600" />
              Compensation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Compensation Type"
                {...register('compensation.type')}
                required
              >
                <option value="salary">Salary</option>
                <option value="hourly">Hourly</option>
                <option value="project-based">Project-based</option>
              </Select>

              <Controller
                name="compensation.amount"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Amount (INR)"
                    type="number"
                    min={0}
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    placeholder="Enter amount"
                    required
                  />
                )}
              />

              <Controller
                name="compensation.billingRate"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Client Billing Rate (INR/hour)"
                    type="number"
                    min={0}
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    placeholder="Enter billing rate"
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card variant="admin">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-fm-magenta-600" />
              Skills & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-fm-neutral-900 mb-3">
                  Select Skills
                </label>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {COMMON_SKILLS.map((skill) => {
                        const selected = (field.value || []).includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              const current = field.value || [];
                              if (selected) {
                                field.onChange(current.filter((s: string) => s !== skill));
                              } else {
                                field.onChange([...current, skill]);
                              }
                            }}
                            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                              selected
                                ? 'bg-fm-magenta-100 text-fm-magenta-700 border-fm-magenta-300'
                                : 'bg-white text-fm-neutral-700 border-fm-neutral-300 hover:border-fm-magenta-300'
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card variant="admin">
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                Notes (Optional)
              </label>
              <textarea
                rows={4}
                {...register('notes')}
                className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 resize-none"
                placeholder="Any additional notes about this team member..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-fm-neutral-200">
          <DashboardButton
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Creating...' : 'Create Team Member'}
          </DashboardButton>
        </div>
      </form>
    </div>
  );
}
