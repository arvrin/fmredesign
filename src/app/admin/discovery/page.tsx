/**
 * Discovery Dashboard
 * Overview of all discovery sessions
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DiscoverySession, DISCOVERY_SECTIONS } from '@/lib/admin/discovery-types';
import { DiscoveryService } from '@/lib/admin/discovery-service';
import { 
  DashboardButton, 
  DashboardCard, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  MetricCard 
} from '@/design-system';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  BarChart3,
  Users,
  Calendar
} from 'lucide-react';

export default function DiscoveryDashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<DiscoverySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/discovery');
      const result = await response.json();
      
      if (result.success) {
        setSessions(result.data || []);
      }
    } catch (error) {
      console.error('Error loading discovery sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.companyFundamentals?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.projectOverview?.projectName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-fm-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-fm-neutral-100 text-fm-neutral-800';
      default: return 'bg-fm-neutral-100 text-fm-neutral-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-fm-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto mb-4"></div>
          <p className="text-fm-neutral-600">Loading discovery sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fm-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-fm-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 bg-clip-text text-transparent">Discovery Sessions</h1>
              <p className="text-fm-neutral-600 font-medium">Comprehensive client analysis and requirement gathering</p>
            </div>
            
            <DashboardButton
              variant="admin"
              size="lg"
              onClick={() => router.push('/admin/discovery/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Discovery
            </DashboardButton>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <MetricCard
              title="Total Sessions"
              value={sessions.length}
              subtitle="All discovery sessions"
              icon={<FileText className="w-6 h-6" />}
              variant="admin"
            />
            
            <MetricCard
              title="In Progress"
              value={sessions.filter(s => s.status === 'in_progress').length}
              subtitle="Active sessions"
              icon={<Clock className="w-6 h-6" />}
              variant="admin"
              change={{
                value: Math.round((sessions.filter(s => s.status === 'in_progress').length / (sessions.length || 1)) * 100),
                type: 'neutral',
                period: 'of total'
              }}
            />
            
            <MetricCard
              title="Completed"
              value={sessions.filter(s => s.status === 'completed').length}
              subtitle="Finished sessions"
              icon={<CheckCircle className="w-6 h-6" />}
              variant="admin"
              change={{
                value: Math.round((sessions.filter(s => s.status === 'completed').length / (sessions.length || 1)) * 100),
                type: 'increase',
                period: 'completion rate'
              }}
            />
            
            <MetricCard
              title="Avg Completion"
              value={`${sessions.length > 0 
                ? Math.round(sessions.reduce((acc, s) => acc + (s.completedSections?.length || 0), 0) / sessions.length / 10 * 100)
                : 0}%`}
              subtitle="Progress across all"
              icon={<BarChart3 className="w-6 h-6" />}
              variant="admin"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <DashboardCard variant="admin" className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company or project name..."
                className="pl-10 pr-4 py-2 w-full border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </DashboardCard>
      </div>

      {/* Sessions List */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-fm-neutral-400" />
            <p className="text-fm-neutral-600 mb-4">
              {sessions.length === 0 ? 'No discovery sessions yet' : 'No sessions match your filters'}
            </p>
            {sessions.length === 0 && (
              <DashboardButton
                onClick={() => router.push('/admin/discovery/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Start First Discovery
              </DashboardButton>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl border border-fm-neutral-200 shadow-sm">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        {getStatusIcon(session.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-fm-neutral-900">
                            {session.companyFundamentals?.companyName || 'Untitled Company'}
                          </h3>
                          <p className="text-fm-neutral-600 text-sm">
                            {session.projectOverview?.projectName || 'Untitled Project'} • 
                            {session.projectOverview?.projectType?.replace('_', ' ') || 'Unknown Type'}
                          </p>
                        </div>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-fm-neutral-500">Progress:</span>
                          <p className="font-medium">
                            {session.completedSections?.length || 0}/10 sections
                            <span className="text-fm-neutral-400">
                              ({Math.round(((session.completedSections?.length || 0) / 10) * 100)}%)
                            </span>
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-fm-neutral-500">Created:</span>
                          <p className="font-medium">
                            {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : 'Unknown'}
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-fm-neutral-500">Updated:</span>
                          <p className="font-medium">
                            {session.updatedAt ? new Date(session.updatedAt).toLocaleDateString() : 'Unknown'}
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-fm-neutral-500">Assigned To:</span>
                          <p className="font-medium">{session.assignedTo || 'Unassigned'}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-fm-neutral-600 mb-1">
                          <span>Completion Progress</span>
                          <span>{Math.round(((session.completedSections?.length || 0) / 10) * 100)}%</span>
                        </div>
                        <div className="w-full bg-fm-neutral-200 rounded-full h-2">
                          <div 
                            className="bg-fm-magenta-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((session.completedSections?.length || 0) / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <DashboardButton
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/discovery/new?sessionId=${session.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {session.status === 'completed' ? 'View' : 'Continue'}
                      </DashboardButton>
                      
                      {session.status === 'completed' && (
                        <DashboardButton
                          variant="admin"
                          size="sm"
                          onClick={() => router.push(`/admin/discovery/${session.id}/report`)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Report
                        </DashboardButton>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}