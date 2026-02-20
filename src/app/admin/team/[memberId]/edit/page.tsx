/**
 * Edit Team Member Page
 * Comprehensive form for editing existing team members
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  User,
  Briefcase,
  DollarSign,
  Settings,
  Award,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import {
  DashboardCard as Card,
  CardContent,
  CardHeader,
  CardTitle,
  DashboardButton
} from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import {
  TeamMember,
  TeamRole,
  TeamDepartment,
  TEAM_ROLES,
  TEAM_DEPARTMENTS,
  COMMON_SKILLS
} from '@/lib/admin/types';
import { adminToast } from '@/lib/admin/toast';

interface EditTeamMemberProps {
  params: Promise<{
    memberId: string;
  }>;
}

export default function EditTeamMemberPage({ params }: EditTeamMemberProps) {
  const router = useRouter();
  const { memberId } = use(params);
  const [originalMember, setOriginalMember] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<Partial<TeamMember>>({});
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    loadMemberData();
  }, [memberId]);

  const loadMemberData = async () => {
    try {
      const res = await fetch(`/api/team?id=${memberId}`);
      const result = await res.json();

      if (result.success && result.data) {
        setOriginalMember(result.data);
        setFormData(result.data);
        setSelectedSkills(result.data.skills || []);
      }
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompensationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      compensation: {
        ...prev.compensation!,
        [field]: value
      }
    }));
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];

    setSelectedSkills(newSkills);
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      const res = await fetch('/api/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: memberId, ...formData }),
      });
      const result = await res.json();

      if (!result.success) {
        const errorMsg = result.error || 'Failed to update team member';
        setErrors(Array.isArray(errorMsg) ? errorMsg : [errorMsg]);
        setIsSubmitting(false);
        return;
      }

      adminToast.success('Team member updated successfully');
      router.push(`/admin/team/${memberId}`);
    } catch (error) {
      console.error('Error updating team member:', error);
      setErrors(['Failed to update team member. Please try again.']);
      adminToast.error('Failed to update team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/team?id=${memberId}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete team member');
      }

      adminToast.success('Team member deleted successfully');
      router.push('/admin/team');
    } catch (error) {
      console.error('Error deleting team member:', error);
      setErrors(['Failed to delete team member. Please try again.']);
      adminToast.error('Failed to delete team member');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!originalMember || !formData.name) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<User className="h-6 w-6" />}
          title="Team Member Not Found"
          description="The requested team member could not be found."
          action={
            <DashboardButton onClick={() => router.push('/admin/team')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </DashboardButton>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${originalMember.name}`}
        description="Update team member information"
        icon={<User className="w-6 h-6" />}
        actions={
          <div className="flex items-center gap-3">
            <DashboardButton
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/team/${memberId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </DashboardButton>
            <DashboardButton
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Member
            </DashboardButton>
          </div>
        }
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-fm-neutral-900">Delete Team Member</h3>
            </div>
            <p className="text-fm-neutral-600 mb-6">
              Are you sure you want to delete {originalMember.name}? This action cannot be undone and will remove all their assignments and data.
            </p>
            <div className="flex items-center justify-end gap-3">
              <DashboardButton
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </DashboardButton>
              <DashboardButton
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DashboardButton>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />

              <Select
                label="Status"
                value={formData.status || 'active'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
                <option value="terminated">Terminated</option>
              </Select>
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
                value={formData.type || 'employee'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                required
              >
                <option value="employee">Employee</option>
                <option value="freelancer">Freelancer</option>
                <option value="contractor">Contractor</option>
              </Select>

              <Select
                label="Department"
                value={formData.department || 'creative'}
                onChange={(e) => handleInputChange('department', e.target.value as TeamDepartment)}
                required
              >
                {Object.entries(TEAM_DEPARTMENTS).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </Select>

              <Select
                label="Seniority Level"
                value={formData.seniority || 'junior'}
                onChange={(e) => handleInputChange('seniority', e.target.value)}
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
              value={formData.role || 'content-writer'}
              onChange={(e) => handleInputChange('role', e.target.value as TeamRole)}
              required
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
                value={formData.workType || 'full-time'}
                onChange={(e) => handleInputChange('workType', e.target.value)}
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </Select>

              <Select
                label="Location"
                value={formData.location || 'office'}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              >
                <option value="office">Office</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </Select>

              <Input
                label="Weekly Capacity (Hours)"
                type="number"
                min={1}
                max={60}
                value={formData.capacity || 40}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 40)}
                required
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
                value={formData.compensation?.type || 'salary'}
                onChange={(e) => handleCompensationChange('type', e.target.value)}
                required
              >
                <option value="salary">Salary</option>
                <option value="hourly">Hourly</option>
                <option value="project-based">Project-based</option>
              </Select>

              <Input
                label="Amount (INR)"
                type="number"
                min={0}
                value={formData.compensation?.amount || 0}
                onChange={(e) => handleCompensationChange('amount', parseFloat(e.target.value) || 0)}
                required
              />

              <Input
                label="Client Billing Rate (INR/hour)"
                type="number"
                min={0}
                value={formData.compensation?.billingRate || 0}
                onChange={(e) => handleCompensationChange('billingRate', parseFloat(e.target.value) || 0)}
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
                <label className="block text-sm font-medium text-fm-neutral-700 mb-3">
                  Update Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-fm-magenta-100 text-fm-magenta-700 border-fm-magenta-300'
                          : 'bg-white text-fm-neutral-700 border-fm-neutral-300 hover:border-fm-magenta-300'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
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
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                rows={4}
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500 resize-none"
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
            onClick={() => router.push(`/admin/team/${memberId}`)}
            disabled={isSubmitting}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="submit"
            variant="admin"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Updating...' : 'Update Team Member'}
          </DashboardButton>
        </div>
      </form>
    </div>
  );
}
