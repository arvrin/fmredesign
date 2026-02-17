'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  DashboardCard as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardButton as Button
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Target,
  Briefcase,
  Download,
  Users,
  FileText,
  Share2,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import { getStatusColor, getPriorityColor } from '@/lib/client-portal/status-colors';
import { downloadCSV } from '@/lib/client-portal/export';

interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  progress: number;
  startDate: string;
  endDate: string;
  estimatedHours: number;
  budget: number;
  spent: number;
  milestones: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    isCompleted: boolean;
    completedAt?: string;
  }[];
  deliverables: {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    dueDate: string;
  }[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const { clientId, slug } = useClientPortal();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!clientId || !projectId) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/client-portal/${clientId}/projects?limit=50`);
        if (res.ok) {
          const data = await res.json();
          const found = (data.data || []).find((p: any) => p.id === projectId);
          if (found) {
            setProject(found);
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [clientId, projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fm-magenta-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <Briefcase className="w-16 h-16 text-fm-neutral-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-fm-neutral-900 mb-2">Project Not Found</h2>
        <p className="text-fm-neutral-600 mb-6">The project you&apos;re looking for doesn&apos;t exist.</p>
        <Link href={`/client/${slug}/projects`}>
          <Button variant="client" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const budgetPercent = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;
  const completedMilestones = project.milestones.filter(m => m.isCompleted).length;
  const completedDeliverables = project.deliverables.filter(d => d.status === 'completed').length;

  const handleExport = () => {
    const headers = ['Section', 'Item', 'Status', 'Date'];
    const rows: string[][] = [
      ['Project', project.name, project.status, `${project.startDate} to ${project.endDate}`],
      ['Progress', `${project.progress}%`, '', ''],
      ['Budget', `${project.spent} / ${project.budget}`, `${budgetPercent}% used`, ''],
      ...project.milestones.map(m => ['Milestone', m.title, m.isCompleted ? 'Completed' : 'Upcoming', m.dueDate]),
      ...project.deliverables.map(d => ['Deliverable', d.title, d.status, d.dueDate || '']),
    ];
    downloadCSV(`project-${project.id}.csv`, headers, rows);
  };

  const handleShare = async () => {
    try {
      setShareLoading(true);
      const res = await fetch(`/api/client-portal/${clientId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType: 'project',
          resourceId: projectId,
          label: project.name,
          expiresInDays: 30,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const fullUrl = `${window.location.origin}${json.data.url}`;
        setShareUrl(fullUrl);
      }
    } catch (err) {
      console.error('Error creating share link:', err);
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/client/${slug}/projects`}
          className="inline-flex items-center text-sm text-fm-magenta-600 hover:text-fm-magenta-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-display font-bold text-fm-neutral-900">
                {project.name}
              </h1>
              <div
                className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`}
                role="img"
                aria-label={`${project.priority} priority`}
              />
            </div>
            <p className="text-fm-neutral-600 font-medium">{project.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(project.status)} variant="secondary">
              {project.status}
            </Badge>
            <Button variant="ghost" size="sm" className="text-fm-magenta-600" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-fm-magenta-600"
              onClick={handleShare}
              disabled={shareLoading}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {shareLoading ? 'Sharing...' : 'Share'}
            </Button>
          </div>
        </div>

        {/* Share URL Popover */}
        {shareUrl && (
          <div className="mt-4 p-4 bg-fm-neutral-50 border border-fm-neutral-200 rounded-lg flex items-center space-x-3">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 text-sm bg-white border border-fm-neutral-300 rounded-md px-3 py-2 text-fm-neutral-700"
            />
            <Button variant="client" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShareUrl(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card variant="client">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-fm-magenta-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-fm-magenta-600" />
              </div>
              <div>
                <p className="text-sm text-fm-neutral-600">Progress</p>
                <p className="text-xl font-bold text-fm-neutral-900">{project.progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="client">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-fm-magenta-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-fm-magenta-600" />
              </div>
              <div>
                <p className="text-sm text-fm-neutral-600">Budget Used</p>
                <p className="text-xl font-bold text-fm-neutral-900">{budgetPercent}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="client">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-fm-magenta-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-fm-magenta-600" />
              </div>
              <div>
                <p className="text-sm text-fm-neutral-600">Milestones</p>
                <p className="text-xl font-bold text-fm-neutral-900">{completedMilestones}/{project.milestones.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="client">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-fm-magenta-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-fm-magenta-600" />
              </div>
              <div>
                <p className="text-sm text-fm-neutral-600">Deliverables</p>
                <p className="text-xl font-bold text-fm-neutral-900">{completedDeliverables}/{project.deliverables.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card variant="client" className="mb-8" hover glow>
        <CardHeader>
          <CardTitle className="text-xl">Overall Progress</CardTitle>
          <CardDescription>
            {project.startDate && project.endDate
              ? `${new Date(project.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} — ${new Date(project.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
              : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-fm-neutral-600">Completion</span>
              <span className="font-semibold text-fm-magenta-600">{project.progress}%</span>
            </div>
            <div className="w-full bg-fm-neutral-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-fm-magenta-500 to-fm-magenta-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            {/* Budget breakdown */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-fm-neutral-100">
              <div>
                <p className="text-sm text-fm-neutral-600 mb-1">Budget</p>
                <p className="text-lg font-semibold text-fm-neutral-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: 'compact' }).format(project.budget)}
                </p>
              </div>
              <div>
                <p className="text-sm text-fm-neutral-600 mb-1">Spent</p>
                <p className="text-lg font-semibold text-fm-neutral-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: 'compact' }).format(project.spent)}
                  <span className="text-sm font-normal text-fm-neutral-500 ml-1">({budgetPercent}%)</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Milestones */}
        <Card variant="client" hover glow>
          <CardHeader>
            <CardTitle className="text-xl">Milestones</CardTitle>
            <CardDescription>{completedMilestones} of {project.milestones.length} completed</CardDescription>
          </CardHeader>
          <CardContent>
            {project.milestones.length > 0 ? (
              <div className="space-y-4">
                {project.milestones.map((milestone, idx) => (
                  <div key={milestone.id || idx} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      milestone.isCompleted
                        ? 'bg-green-100 text-green-600'
                        : 'bg-fm-neutral-100 text-fm-neutral-400'
                    }`}>
                      {milestone.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${milestone.isCompleted ? 'text-fm-neutral-500 line-through' : 'text-fm-neutral-900'}`}>
                          {milestone.title}
                        </h4>
                        <span className="text-xs text-fm-neutral-500">
                          {milestone.dueDate
                            ? new Date(milestone.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                            : ''}
                        </span>
                      </div>
                      {milestone.description && (
                        <p className="text-sm text-fm-neutral-600 mt-1">{milestone.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-fm-neutral-500">
                <Target className="w-10 h-10 mx-auto mb-2 text-fm-neutral-300" />
                <p>No milestones defined yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deliverables */}
        <Card variant="client" hover glow>
          <CardHeader>
            <CardTitle className="text-xl">Deliverables</CardTitle>
            <CardDescription>{completedDeliverables} of {project.deliverables.length} completed</CardDescription>
          </CardHeader>
          <CardContent>
            {project.deliverables.length > 0 ? (
              <div className="space-y-3">
                {project.deliverables.map((deliverable, idx) => (
                  <div key={deliverable.id || idx} className="flex items-center justify-between p-3 rounded-lg bg-fm-neutral-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        deliverable.status === 'completed' ? 'bg-green-500' :
                        deliverable.status === 'in-progress' ? 'bg-yellow-500' : 'bg-fm-neutral-300'
                      }`} />
                      <div>
                        <p className="font-medium text-fm-neutral-900 text-sm">{deliverable.title}</p>
                        {deliverable.description && (
                          <p className="text-xs text-fm-neutral-500 mt-0.5">{deliverable.description}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(deliverable.status)} variant="secondary">
                      {deliverable.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-fm-neutral-500">
                <FileText className="w-10 h-10 mx-auto mb-2 text-fm-neutral-300" />
                <p>No deliverables defined yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="mt-8">
          <p className="text-sm text-fm-neutral-600 mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 text-xs bg-fm-neutral-100 text-fm-neutral-600 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
