/**
 * CreativeMinds Admin Dashboard
 * Talent management and application review
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { TalentApplication, TalentProfile, TALENT_CATEGORIES, CURRENCIES } from '@/lib/admin/talent-types';
import { Button } from '@/design-system/components/primitives/Button';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Eye,
  UserCheck,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  ExternalLink,
} from 'lucide-react';

type Tab = 'applications' | 'talents' | 'analytics';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export default function CreativeMindsAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('applications');
  const [applications, setApplications] = useState<TalentApplication[]>([]);
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'applications') {
        const response = await fetch('/api/talent?type=applications');
        const result = await response.json();
        if (result.success) {
          setApplications(result.data);
        }
      } else if (activeTab === 'talents') {
        const response = await fetch('/api/talent?type=talents&status=approved');
        const result = await response.json();
        if (result.success) {
          setTalents(result.data);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        const response = await fetch('/api/talent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'approve_application',
            applicationId,
          }),
        });

        const result = await response.json();
        if (result.success) {
          loadData();
          showToast('Application approved and talent added to network!', 'success');
        } else {
          showToast('Failed to approve application', 'error');
        }
      } else {
        const response = await fetch('/api/talent', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'application',
            id: applicationId,
            updates: {
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'admin',
            },
          }),
        });

        const result = await response.json();
        if (result.success) {
          loadData();
          showToast('Application rejected.', 'success');
        } else {
          showToast('Failed to reject application', 'error');
        }
      }
    } catch (error) {
      console.error('Error updating application:', error);
      showToast('Failed to update application', 'error');
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesSearch =
      app.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredTalents = talents.filter((talent) => {
    const matchesSearch =
      talent.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-fm-neutral-50">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all animate-in slide-in-from-right ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white border-b border-fm-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-fm-neutral-900">CreativeMinds Network</h1>
              <p className="text-fm-neutral-600">Manage talent applications and network members</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{talents.length} Active Talents</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>{applications.filter((a) => a.status === 'submitted').length} Pending Reviews</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-fm-neutral-200 mt-6">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'applications'
                  ? 'border-fm-magenta-500 text-fm-magenta-600'
                  : 'border-transparent text-fm-neutral-600 hover:text-fm-neutral-900'
              }`}
            >
              Applications ({applications.filter((a) => a.status === 'submitted').length})
            </button>
            <button
              onClick={() => setActiveTab('talents')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'talents'
                  ? 'border-fm-magenta-500 text-fm-magenta-600'
                  : 'border-transparent text-fm-neutral-600 hover:text-fm-neutral-900'
              }`}
            >
              Network ({talents.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'analytics'
                  ? 'border-fm-magenta-500 text-fm-magenta-600'
                  : 'border-transparent text-fm-neutral-600 hover:text-fm-neutral-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 w-full border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            />
          </div>

          {activeTab === 'applications' && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {activeTab === 'applications' && (
          <ApplicationsList
            applications={filteredApplications}
            isLoading={isLoading}
            onAction={handleApplicationAction}
          />
        )}

        {activeTab === 'talents' && <TalentsList talents={filteredTalents} isLoading={isLoading} />}

        {activeTab === 'analytics' && (
          <AnalyticsView applications={applications} talents={talents} />
        )}
      </div>
    </div>
  );
}

/* ─── Helpers ─── */

function getCurrencySymbol(code?: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol || '₹';
}

function SocialPill({
  href,
  icon: Icon,
  label,
  color,
}: {
  href: string;
  icon: any;
  label: string;
  color: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80 ${color}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
      <ExternalLink className="h-3 w-3 opacity-60" />
    </a>
  );
}

function PriceRange({
  label,
  min,
  max,
  symbol,
}: {
  label: string;
  min: number;
  max: number;
  symbol: string;
}) {
  if (!min && !max) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-fm-neutral-500">{label}:</span>
      <span className="font-medium">
        {symbol}
        {min.toLocaleString()}
        {max > 0 && max !== min ? ` – ${symbol}${max.toLocaleString()}` : ''}
      </span>
    </div>
  );
}

/* ─── Applications ─── */

function ApplicationsList({
  applications,
  isLoading,
  onAction,
}: {
  applications: TalentApplication[];
  isLoading: boolean;
  onAction: (id: string, action: 'approve' | 'reject') => void;
}) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto mb-4"></div>
        <p className="text-fm-neutral-600">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 mx-auto mb-4 text-fm-neutral-400" />
        <p className="text-fm-neutral-600">No applications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} onAction={onAction} />
      ))}
    </div>
  );
}

function ApplicationCard({
  application,
  onAction,
}: {
  application: TalentApplication;
  onAction: (id: string, action: 'approve' | 'reject') => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const pricing = (application as any).pricing;
  const portfolioLinks = (application as any).portfolioLinks;
  const sym = getCurrencySymbol(application.preferences?.currency);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-fm-neutral-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-fm-neutral-900">
                  {application.personalInfo.fullName}
                </h3>
                <p className="text-fm-neutral-600 text-sm">
                  {application.personalInfo.email} &bull; {application.personalInfo.location.city}
                </p>
              </div>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  application.status
                )}`}
              >
                {application.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <span className="text-fm-neutral-500">Category:</span>
                <p className="font-medium">
                  {TALENT_CATEGORIES[application.professionalDetails.category]?.label}
                </p>
              </div>
              <div>
                <span className="text-fm-neutral-500">Experience:</span>
                <p className="font-medium">{application.professionalDetails.yearsOfExperience} years</p>
              </div>
              <div>
                <span className="text-fm-neutral-500">Applied:</span>
                <p className="font-medium">
                  {new Date(application.applicationDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-fm-neutral-500">Pricing:</span>
                <p className="font-medium">
                  {pricing?.hourlyRate?.max > 0
                    ? `${sym}${pricing.hourlyRate.min}–${pricing.hourlyRate.max}/hr`
                    : pricing?.projectRate?.max > 0
                    ? `${sym}${pricing.projectRate.min}–${pricing.projectRate.max}/proj`
                    : `${sym}${application.preferences.minimumProjectValue.toLocaleString()}+`}
                </p>
              </div>
            </div>

            {/* Compact social links — clickable */}
            <div className="flex items-center gap-3 text-sm flex-wrap">
              {application.socialMedia.instagram && (
                <a
                  href={`https://instagram.com/${application.socialMedia.instagram.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <span>{application.socialMedia.instagram.followers.toLocaleString()}</span>
                  <ExternalLink className="h-3 w-3 opacity-40" />
                </a>
              )}
              {application.socialMedia.youtube && (
                <a
                  href={application.socialMedia.youtube.channel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <Youtube className="h-4 w-4 text-red-500" />
                  <span>{application.socialMedia.youtube.subscribers.toLocaleString()}</span>
                  <ExternalLink className="h-3 w-3 opacity-40" />
                </a>
              )}
              {application.socialMedia.linkedin && (
                <a
                  href={application.socialMedia.linkedin.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  <span>LinkedIn</span>
                  <ExternalLink className="h-3 w-3 opacity-40" />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              icon={<Eye className="h-4 w-4" />}
            >
              {expanded ? 'Less' : 'View'}
            </Button>

            {application.status === 'submitted' && (
              <>
                <Button
                  size="sm"
                  onClick={() => onAction(application.id, 'approve')}
                  icon={<CheckCircle className="h-4 w-4" />}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onAction(application.id, 'reject')}
                  icon={<XCircle className="h-4 w-4" />}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>

        {expanded && (
          <div className="mt-6 pt-6 border-t border-fm-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-5">
                <div>
                  <h4 className="font-medium text-fm-neutral-900 mb-2">Bio</h4>
                  <p className="text-sm text-fm-neutral-600">{application.personalInfo.bio}</p>
                </div>

                <div>
                  <h4 className="font-medium text-fm-neutral-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {application.professionalDetails.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-fm-magenta-50 text-fm-magenta-700 text-xs rounded"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {application.professionalDetails.tools &&
                  application.professionalDetails.tools.length > 0 &&
                  application.professionalDetails.tools[0] !== '' && (
                    <div>
                      <h4 className="font-medium text-fm-neutral-900 mb-2">Tools</h4>
                      <div className="flex flex-wrap gap-1">
                        {application.professionalDetails.tools.map((tool, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-fm-neutral-100 text-fm-neutral-700 text-xs rounded"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Social Links */}
                <div>
                  <h4 className="font-medium text-fm-neutral-900 mb-2">Social Links</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.socialMedia.instagram && (
                      <SocialPill
                        href={`https://instagram.com/${application.socialMedia.instagram.handle}`}
                        icon={Instagram}
                        label={`@${application.socialMedia.instagram.handle}`}
                        color="bg-pink-50 text-pink-700 border-pink-200"
                      />
                    )}
                    {application.socialMedia.youtube && (
                      <SocialPill
                        href={application.socialMedia.youtube.channel}
                        icon={Youtube}
                        label="YouTube"
                        color="bg-red-50 text-red-700 border-red-200"
                      />
                    )}
                    {application.socialMedia.linkedin && (
                      <SocialPill
                        href={application.socialMedia.linkedin.profileUrl}
                        icon={Linkedin}
                        label="LinkedIn"
                        color="bg-blue-50 text-blue-700 border-blue-200"
                      />
                    )}
                    {application.socialMedia.behance && (
                      <SocialPill
                        href={application.socialMedia.behance.profileUrl}
                        icon={Globe}
                        label="Behance"
                        color="bg-indigo-50 text-indigo-700 border-indigo-200"
                      />
                    )}
                    {application.socialMedia.dribbble && (
                      <SocialPill
                        href={application.socialMedia.dribbble.profileUrl}
                        icon={Globe}
                        label="Dribbble"
                        color="bg-pink-50 text-pink-700 border-pink-200"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Portfolio Links */}
                {portfolioLinks &&
                  (portfolioLinks.websiteUrl ||
                    portfolioLinks.workSampleUrls?.some((u: string) => u)) && (
                    <div>
                      <h4 className="font-medium text-fm-neutral-900 mb-2">Portfolio</h4>
                      <div className="space-y-2">
                        {portfolioLinks.websiteUrl && (
                          <a
                            href={portfolioLinks.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-fm-magenta-600 hover:underline"
                          >
                            <Globe className="h-4 w-4" />
                            {portfolioLinks.websiteUrl}
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </a>
                        )}
                        {portfolioLinks.workSampleUrls
                          ?.filter((u: string) => u)
                          .map((url: string, i: number) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Work Sample {i + 1}
                            </a>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Pricing */}
                {pricing && (
                  <div>
                    <h4 className="font-medium text-fm-neutral-900 mb-2">Pricing</h4>
                    <div className="space-y-1.5 bg-fm-neutral-50 rounded-lg p-3">
                      <PriceRange
                        label="Hourly"
                        min={pricing.hourlyRate?.min || 0}
                        max={pricing.hourlyRate?.max || 0}
                        symbol={sym}
                      />
                      <PriceRange
                        label="Per-project"
                        min={pricing.projectRate?.min || 0}
                        max={pricing.projectRate?.max || 0}
                        symbol={sym}
                      />
                      <PriceRange
                        label="Monthly retainer"
                        min={pricing.retainerRate?.min || 0}
                        max={pricing.retainerRate?.max || 0}
                        symbol={sym}
                      />
                      {pricing.openToNegotiation && (
                        <p className="text-xs text-green-600 mt-1">Open to negotiation</p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-fm-neutral-900 mb-2">Preferences</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-fm-neutral-500">Min. Project Value:</span>
                      <span>
                        {sym}
                        {application.preferences.minimumProjectValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fm-neutral-500">Remote Work:</span>
                      <span>{application.availability.remoteWork ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fm-neutral-500">Commitment:</span>
                      <span className="capitalize">
                        {application.availability.projectCommitment?.replace('_', ' ') || 'Both'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fm-neutral-500">Communication:</span>
                      <span className="capitalize">
                        {application.preferences.communicationStyle || 'Mixed'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fm-neutral-500">Languages:</span>
                      <span>{application.personalInfo.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Talents List ─── */

function TalentsList({ talents, isLoading }: { talents: TalentProfile[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto mb-4"></div>
        <p className="text-fm-neutral-600">Loading talents...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {talents.map((talent) => (
        <TalentCard key={talent.id} talent={talent} />
      ))}
    </div>
  );
}

function TalentCard({ talent }: { talent: TalentProfile }) {
  return (
    <div className="bg-white rounded-xl border border-fm-neutral-200 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-fm-neutral-900">
            {talent.personalInfo.fullName}
          </h3>
          <p className="text-fm-neutral-600 text-sm">
            {TALENT_CATEGORIES[talent.professionalDetails.category]?.label}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{talent.ratings.overallRating.toFixed(1)}</span>
          <span className="text-xs text-fm-neutral-500">({talent.ratings.totalReviews})</span>
        </div>
      </div>

      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-fm-neutral-500">Experience:</span>
          <span>{talent.professionalDetails.yearsOfExperience} years</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fm-neutral-500">Availability:</span>
          <span className="capitalize">{talent.availability.currentStatus.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fm-neutral-500">Location:</span>
          <span>{talent.personalInfo.location.city}</span>
        </div>
      </div>

      {/* Social Media — clickable */}
      <div className="flex items-center gap-3 mb-4">
        {talent.socialMedia.instagram && (
          <a
            href={`https://instagram.com/${talent.socialMedia.instagram.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:underline"
          >
            <Instagram className="h-3 w-3 text-pink-500" />
            <span>{talent.socialMedia.instagram.followers.toLocaleString()}</span>
          </a>
        )}
        {talent.socialMedia.youtube && (
          <a
            href={talent.socialMedia.youtube.channel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:underline"
          >
            <Youtube className="h-3 w-3 text-red-500" />
            <span>{talent.socialMedia.youtube.subscribers.toLocaleString()}</span>
          </a>
        )}
        {talent.socialMedia.linkedin && (
          <a
            href={talent.socialMedia.linkedin.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:underline"
          >
            <Linkedin className="h-3 w-3 text-blue-600" />
          </a>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-fm-neutral-900">
          {getCurrencySymbol(talent.preferences?.currency)}
          {talent.preferences.minimumProjectValue.toLocaleString()}+
        </span>
        <Button size="sm" variant="secondary">
          View Profile
        </Button>
      </div>
    </div>
  );
}

/* ─── Analytics ─── */

function AnalyticsView({
  applications,
  talents,
}: {
  applications: TalentApplication[];
  talents: TalentProfile[];
}) {
  const stats = {
    totalApplications: applications.length,
    pendingReview: applications.filter((a) => a.status === 'submitted').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    activeTalents: talents.length,
    topCategory:
      Object.entries(
        applications.reduce((acc, app) => {
          acc[app.professionalDetails.category] =
            (acc[app.professionalDetails.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None',
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-fm-neutral-600">Applications</span>
          </div>
          <div className="text-2xl font-bold text-fm-neutral-900">{stats.totalApplications}</div>
        </div>

        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-fm-neutral-600">Pending Review</span>
          </div>
          <div className="text-2xl font-bold text-fm-neutral-900">{stats.pendingReview}</div>
        </div>

        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-fm-neutral-600">Active Talents</span>
          </div>
          <div className="text-2xl font-bold text-fm-neutral-900">{stats.activeTalents}</div>
        </div>

        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-5 w-5 text-fm-magenta-600" />
            <span className="text-sm font-medium text-fm-neutral-600">Top Category</span>
          </div>
          <div className="text-lg font-semibold text-fm-neutral-900">
            {TALENT_CATEGORIES[stats.topCategory as keyof typeof TALENT_CATEGORIES]?.label ||
              'None'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">
          Application Status Distribution
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Submitted</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-fm-neutral-200 rounded-full">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{
                    width: `${
                      stats.totalApplications > 0
                        ? (stats.pendingReview / stats.totalApplications) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm">{stats.pendingReview}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Approved</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-fm-neutral-200 rounded-full">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{
                    width: `${
                      stats.totalApplications > 0
                        ? (stats.approved / stats.totalApplications) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm">{stats.approved}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Rejected</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-fm-neutral-200 rounded-full">
                <div
                  className="h-2 bg-red-500 rounded-full"
                  style={{
                    width: `${
                      stats.totalApplications > 0
                        ? (stats.rejected / stats.totalApplications) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm">{stats.rejected}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
