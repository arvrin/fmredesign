/**
 * Team Member Documents Management Page
 * Manage documents, contracts, and files for team members
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
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
  DashboardButton as Button
} from '@/design-system';
import { TeamService } from '@/lib/admin/team-service';
import { TeamMember } from '@/lib/admin/types';

interface TeamMemberDocumentsProps {
  params: {
    memberId: string;
  };
}

export default function TeamMemberDocumentsPage({ params }: TeamMemberDocumentsProps) {
  const router = useRouter();
  const { memberId } = params;
  const [member, setMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMemberData();
  }, [memberId]);

  const loadMemberData = async () => {
    try {
      const memberData = TeamService.getTeamMemberById(memberId);
      setMember(memberData);
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fm-magenta-600"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <User className="w-16 h-16 text-fm-neutral-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-fm-neutral-900 mb-2">Team Member Not Found</h2>
        <p className="text-fm-neutral-600 mb-6">The requested team member could not be found.</p>
        <Button onClick={() => router.push('/admin/team')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Team
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push(`/admin/team/${memberId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-fm-magenta-100 flex items-center justify-center text-fm-magenta-600 font-bold">
                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-fm-neutral-900">{member.name}</h1>
                <p className="text-fm-magenta-600 font-medium">Document Management</p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="admin"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="admin">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-fm-magenta-600 mx-auto mb-4" />
            <h3 className="font-medium text-fm-neutral-900 mb-2">Contracts & Agreements</h3>
            <p className="text-sm text-fm-neutral-600 mb-4">Employment contracts, NDAs, agreements</p>
            <Button variant="outline" size="sm">
              View (0)
            </Button>
          </CardContent>
        </Card>

        <Card variant="admin">
          <CardContent className="p-6 text-center">
            <FolderOpen className="w-12 h-12 text-fm-magenta-600 mx-auto mb-4" />
            <h3 className="font-medium text-fm-neutral-900 mb-2">HR Documents</h3>
            <p className="text-sm text-fm-neutral-600 mb-4">Payroll, benefits, performance reviews</p>
            <Button variant="outline" size="sm">
              View (0)
            </Button>
          </CardContent>
        </Card>

        <Card variant="admin">
          <CardContent className="p-6 text-center">
            <Upload className="w-12 h-12 text-fm-magenta-600 mx-auto mb-4" />
            <h3 className="font-medium text-fm-neutral-900 mb-2">Project Files</h3>
            <p className="text-sm text-fm-neutral-600 mb-4">Work samples, project deliverables</p>
            <Button variant="outline" size="sm">
              View (0)
            </Button>
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
        <CardContent className="text-center py-12">
          <FileText className="w-16 h-16 text-fm-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-fm-neutral-900 mb-2">Document Management Coming Soon</h3>
          <p className="text-fm-neutral-500 mb-6">
            File upload, document organization, version control, and secure document 
            sharing will be available here.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline"
              onClick={() => router.push(`/admin/team/${memberId}`)}
            >
              Back to Profile
            </Button>
            <Button variant="admin">
              <Upload className="w-4 h-4 mr-2" />
              Upload First Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}