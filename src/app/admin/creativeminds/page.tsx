/**
 * CreativeMinds Admin Dashboard
 * Talent management and application review
 */

'use client';

import { useState, useEffect } from 'react';
import { TalentApplication, TalentProfile, TALENT_CATEGORIES } from '@/lib/admin/talent-types';
import { Button } from '@/design-system/components/primitives/Button';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle,
  Clock,
  Star,
  Eye,
  UserCheck,
  UserX,
  MoreHorizontal,
  Instagram,
  Linkedin,
  Youtube,
  Globe
} from 'lucide-react';

type Tab = 'applications' | 'talents' | 'analytics';

export default function CreativeMindsAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('applications');
  const [applications, setApplications] = useState<TalentApplication[]>([]);
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
            applicationId
          })
        });
        
        const result = await response.json();
        if (result.success) {
          loadData(); // Refresh data
          alert('Application approved and talent added to network!');
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
              reviewedBy: 'admin'
            }
          })
        });
        
        const result = await response.json();
        if (result.success) {
          loadData();
          alert('Application rejected.');
        }
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesSearch = app.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         talent.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-fm-neutral-50">
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
                <span>{applications.filter(a => a.status === 'submitted').length} Pending Reviews</span>
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
              Applications ({applications.filter(a => a.status === 'submitted').length})
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
        
        {activeTab === 'talents' && (
          <TalentsList 
            talents={filteredTalents}
            isLoading={isLoading}
          />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsView 
            applications={applications}
            talents={talents}
          />
        )}
      </div>
    </div>
  );
}

function ApplicationsList({ 
  applications, 
  isLoading, 
  onAction 
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
        <ApplicationCard 
          key={application.id} 
          application={application}
          onAction={onAction}
        />
      ))}
    </div>
  );
}

function ApplicationCard({ 
  application, 
  onAction 
}: { 
  application: TalentApplication;
  onAction: (id: string, action: 'approve' | 'reject') => void;
}) {
  const [expanded, setExpanded] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
                  {application.personalInfo.email} • {application.personalInfo.location.city}
                </p>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                {application.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <span className="text-fm-neutral-500">Category:</span>
                <p className="font-medium">{TALENT_CATEGORIES[application.professionalDetails.category].label}</p>
              </div>
              <div>
                <span className="text-fm-neutral-500">Experience:</span>
                <p className="font-medium">{application.professionalDetails.yearsOfExperience} years</p>
              </div>
              <div>
                <span className="text-fm-neutral-500">Applied:</span>
                <p className="font-medium">{new Date(application.applicationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-fm-neutral-500">Availability:</span>
                <p className="font-medium">{application.availability.hoursPerWeek}h/week</p>
              </div>
            </div>

            {/* Social Media Stats */}
            {(application.socialMedia.instagram || application.socialMedia.youtube) && (
              <div className="flex items-center gap-4 text-sm mb-4">
                {application.socialMedia.instagram && (
                  <div className="flex items-center gap-1">
                    <Instagram className="h-4 w-4 text-pink-500" />
                    <span>{application.socialMedia.instagram.followers.toLocaleString()} followers</span>
                  </div>
                )}
                {application.socialMedia.youtube && (
                  <div className="flex items-center gap-1">
                    <Youtube className="h-4 w-4 text-red-500" />
                    <span>{application.socialMedia.youtube.subscribers.toLocaleString()} subscribers</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
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
                  variant="outline"
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
              <div>
                <h4 className="font-medium text-fm-neutral-900 mb-2">Bio</h4>
                <p className="text-sm text-fm-neutral-600 mb-4">{application.personalInfo.bio}</p>
                
                <h4 className="font-medium text-fm-neutral-900 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {application.professionalDetails.skills.slice(0, 6).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-fm-magenta-50 text-fm-magenta-700 text-xs rounded">
                      {skill.name}
                    </span>
                  ))}
                  {application.professionalDetails.skills.length > 6 && (
                    <span className="px-2 py-1 bg-fm-neutral-100 text-fm-neutral-600 text-xs rounded">
                      +{application.professionalDetails.skills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-fm-neutral-900 mb-2">Preferences</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-fm-neutral-500">Min. Project Value:</span>
                    <span>₹{application.preferences.minimumProjectValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fm-neutral-500">Remote Work:</span>
                    <span>{application.availability.remoteWork ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fm-neutral-500">Languages:</span>
                    <span>{application.personalInfo.languages.join(', ')}</span>
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

function TalentsList({ 
  talents, 
  isLoading 
}: { 
  talents: TalentProfile[];
  isLoading: boolean;
}) {
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
            {TALENT_CATEGORIES[talent.professionalDetails.category].label}
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
      
      {/* Social Media */}
      <div className="flex items-center gap-3 mb-4">
        {talent.socialMedia.instagram && (
          <div className="flex items-center gap-1 text-xs">
            <Instagram className="h-3 w-3 text-pink-500" />
            <span>{talent.socialMedia.instagram.followers.toLocaleString()}</span>
          </div>
        )}
        {talent.socialMedia.youtube && (
          <div className="flex items-center gap-1 text-xs">
            <Youtube className="h-3 w-3 text-red-500" />
            <span>{talent.socialMedia.youtube.subscribers.toLocaleString()}</span>
          </div>
        )}
        {talent.socialMedia.linkedin && (
          <Linkedin className="h-3 w-3 text-blue-600" />
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-fm-neutral-900">
          ₹{talent.preferences.minimumProjectValue.toLocaleString()}+
        </span>
        <Button size="sm" variant="outline">
          View Profile
        </Button>
      </div>
    </div>
  );
}

function AnalyticsView({ 
  applications, 
  talents 
}: { 
  applications: TalentApplication[];
  talents: TalentProfile[];
}) {
  const stats = {
    totalApplications: applications.length,
    pendingReview: applications.filter(a => a.status === 'submitted').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    activeTalents: talents.length,
    topCategory: Object.entries(
      applications.reduce((acc, app) => {
        acc[app.professionalDetails.category] = (acc[app.professionalDetails.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
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
            {TALENT_CATEGORIES[stats.topCategory as keyof typeof TALENT_CATEGORIES]?.label || 'None'}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">Application Status Distribution</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Submitted</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-fm-neutral-200 rounded-full">
                <div 
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${(applications.filter(a => a.status === 'submitted').length / stats.totalApplications) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm">{applications.filter(a => a.status === 'submitted').length}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Approved</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-fm-neutral-200 rounded-full">
                <div 
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${(stats.approved / stats.totalApplications) * 100}%` }}
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
                  style={{ width: `${(stats.rejected / stats.totalApplications) * 100}%` }}
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