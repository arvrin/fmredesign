/**
 * Team Member Documents Management Page
 * Manage documents, contracts, and files for team members
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Upload,
  Plus,
  User,
  FolderOpen
} from 'lucide-react';
import {
  DashboardCard as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardButton
} from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { TeamMember } from '@/lib/admin/types';

interface TeamMemberDocumentsProps {
  params: Promise<{
    memberId: string;
  }>;
}

export default function TeamMemberDocumentsPage({ params }: TeamMemberDocumentsProps) {
  const router = useRouter();
  const { memberId } = use(params);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMemberData();
  }, [memberId]);

  const loadMemberData = async () => {
    try {
      const res = await fetch(`/api/team?id=${memberId}`);
      const result = await res.json();

      if (result.success && result.data) {
        setMember(result.data);
      }
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setIsLoading(false);
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

  if (!member) {
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
        title={`${member.name} - Documents`}
        description="Document Management"
        actions={
          <div className="flex items-center gap-3">
            <DashboardButton
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/admin/team/${memberId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </DashboardButton>
            <DashboardButton variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </DashboardButton>
          </div>
        }
      />

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="admin">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-fm-magenta-600 mx-auto mb-4" />
            <h3 className="font-medium text-fm-neutral-900 mb-2">Contracts & Agreements</h3>
            <p className="text-sm text-fm-neutral-600 mb-4">Employment contracts, NDAs, agreements</p>
            <DashboardButton variant="secondary" size="sm">
              View (0)
            </DashboardButton>
          </CardContent>
        </Card>

        <Card variant="admin">
          <CardContent className="p-6 text-center">
            <FolderOpen className="w-12 h-12 text-fm-magenta-600 mx-auto mb-4" />
            <h3 className="font-medium text-fm-neutral-900 mb-2">HR Documents</h3>
            <p className="text-sm text-fm-neutral-600 mb-4">Payroll, benefits, performance reviews</p>
            <DashboardButton variant="secondary" size="sm">
              View (0)
            </DashboardButton>
          </CardContent>
        </Card>

        <Card variant="admin">
          <CardContent className="p-6 text-center">
            <Upload className="w-12 h-12 text-fm-magenta-600 mx-auto mb-4" />
            <h3 className="font-medium text-fm-neutral-900 mb-2">Project Files</h3>
            <p className="text-sm text-fm-neutral-600 mb-4">Work samples, project deliverables</p>
            <DashboardButton variant="secondary" size="sm">
              View (0)
            </DashboardButton>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card variant="admin">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-fm-magenta-600" />
            All Documents
          </CardTitle>
          <CardDescription>
            Manage all documents and files for this team member
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="Document Management Coming Soon"
            description="File upload, document organization, version control, and secure document sharing will be available here."
            action={
              <div className="flex items-center gap-4">
                <DashboardButton
                  variant="secondary"
                  onClick={() => router.push(`/admin/team/${memberId}`)}
                >
                  Back to Profile
                </DashboardButton>
                <DashboardButton variant="primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Document
                </DashboardButton>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
