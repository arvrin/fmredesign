/**
 * Team Member Documents Management Page
 * Upload, list, filter, download, and delete documents for team members
 */

'use client';

import { use, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Upload,
  Plus,
  User,
  FolderOpen,
  Trash2,
  Download,
  X,
  Shield,
  Award,
  File,
  Loader2
} from 'lucide-react';
import {
  DashboardCard as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardButton
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useTeamMember } from '@/hooks/admin/useTeamMember';
import { adminToast } from '@/lib/admin/toast';
import type { TeamDocument } from '@/lib/admin/types';

interface TeamMemberDocumentsProps {
  params: Promise<{
    memberId: string;
  }>;
}

const DOC_TYPES = [
  { value: 'all', label: 'All', icon: FolderOpen },
  { value: 'contract', label: 'Contracts', icon: FileText },
  { value: 'nda', label: 'NDAs', icon: Shield },
  { value: 'certificate', label: 'Certificates', icon: Award },
  { value: 'resume', label: 'Resumes', icon: User },
  { value: 'other', label: 'Other', icon: File },
] as const;

type DocType = 'contract' | 'nda' | 'certificate' | 'resume' | 'other';

const TYPE_COLORS: Record<DocType, string> = {
  contract: 'bg-blue-100 text-blue-700',
  nda: 'bg-red-100 text-red-700',
  certificate: 'bg-green-100 text-green-700',
  resume: 'bg-purple-100 text-purple-700',
  other: 'bg-fm-neutral-100 text-fm-neutral-700',
};

export default function TeamMemberDocumentsPage({ params }: TeamMemberDocumentsProps) {
  const router = useRouter();
  const { memberId } = use(params);
  const { member, loading: isLoading, refresh } = useTeamMember(memberId);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Upload form state
  const [uploadType, setUploadType] = useState<DocType>('other');
  const [uploadName, setUploadName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const documents: (TeamDocument & { storagePath?: string })[] = member?.documents || [];
  const filtered = activeFilter === 'all' ? documents : documents.filter(d => d.type === activeFilter);

  const getCategoryCount = (type: string) => {
    if (type === 'all') return documents.length;
    return documents.filter(d => d.type === type).length;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('memberId', memberId);
      formData.append('type', uploadType);
      if (uploadName.trim()) formData.append('name', uploadName.trim());

      const res = await fetch('/api/team/documents', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (!result.success) throw new Error(result.error || 'Upload failed');

      adminToast.success('Document uploaded successfully');
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadName('');
      setUploadType('other');
      refresh();
    } catch (error: any) {
      adminToast.error(error.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    setDeleting(docId);

    try {
      const res = await fetch(`/api/team/documents?memberId=${memberId}&docId=${docId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Delete failed');

      adminToast.success('Document deleted');
      refresh();
    } catch (error: any) {
      adminToast.error(error.message || 'Failed to delete document');
    } finally {
      setDeleting(null);
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
            <DashboardButton variant="primary" onClick={() => setShowUploadModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </DashboardButton>
          </div>
        }
      />

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {DOC_TYPES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={`p-4 rounded-lg border transition-all text-left ${
              activeFilter === value
                ? 'border-fm-magenta-600 bg-fm-magenta-50 ring-1 ring-fm-magenta-600'
                : 'border-fm-neutral-200 bg-white hover:border-fm-neutral-300'
            }`}
          >
            <Icon className={`w-5 h-5 mb-2 ${activeFilter === value ? 'text-fm-magenta-600' : 'text-fm-neutral-500'}`} />
            <p className={`text-sm font-medium ${activeFilter === value ? 'text-fm-magenta-700' : 'text-fm-neutral-900'}`}>
              {label}
            </p>
            <p className="text-xs text-fm-neutral-500">{getCategoryCount(value)} file{getCategoryCount(value) !== 1 ? 's' : ''}</p>
          </button>
        ))}
      </div>

      {/* Documents List */}
      <Card variant="admin">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-fm-magenta-600" />
            {activeFilter === 'all' ? 'All Documents' : DOC_TYPES.find(t => t.value === activeFilter)?.label || 'Documents'}
          </CardTitle>
          <CardDescription>
            {filtered.length} document{filtered.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-fm-neutral-50 rounded-lg border border-fm-neutral-200"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-fm-magenta-100 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-fm-magenta-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-fm-neutral-900 truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={TYPE_COLORS[doc.type]}>
                          {doc.type}
                        </Badge>
                        <span className="text-xs text-fm-neutral-500">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-fm-neutral-500 hover:text-fm-magenta-600 hover:bg-fm-magenta-50 rounded-md transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deleting === doc.id}
                      className="p-2 text-fm-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      {deleting === doc.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title={activeFilter === 'all' ? 'No documents yet' : `No ${activeFilter} documents`}
              description="Upload a document to get started."
              action={
                <DashboardButton variant="primary" onClick={() => setShowUploadModal(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </DashboardButton>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 50 }}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-fm-neutral-900">Upload Document</h3>
              <button
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); setUploadName(''); }}
                className="p-1 text-fm-neutral-500 hover:text-fm-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">File</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.txt"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setSelectedFile(f);
                    if (!uploadName) setUploadName(f.name);
                  }
                }}
                className="w-full text-sm text-fm-neutral-700 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border file:border-fm-neutral-300 file:text-sm file:font-medium file:bg-fm-neutral-50 file:text-fm-neutral-700 hover:file:bg-fm-neutral-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Document Type</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as DocType)}
                className="w-full h-10 px-3 py-2 text-sm bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 appearance-none"
              >
                <option value="contract">Contract</option>
                <option value="nda">NDA</option>
                <option value="certificate">Certificate</option>
                <option value="resume">Resume</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Name (optional)</label>
              <input
                type="text"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="Document name"
                className="w-full h-10 px-3 py-2 text-sm bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <DashboardButton
                variant="ghost"
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); setUploadName(''); }}
              >
                Cancel
              </DashboardButton>
              <DashboardButton
                variant="primary"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload
                  </>
                )}
              </DashboardButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
