'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  DashboardLayout,
  MetricCard,
  DashboardCard as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardButton as Button
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/Input';
import { 
  CalendarDays,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileText,
  MessageSquare,
  Shield,
  Mail,
  BarChart3,
  Target,
  Calendar,
  Activity,
  Award,
  Briefcase,
  PieChart
} from 'lucide-react';

interface ClientProfile {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  status: string;
  health: string;
  accountManager: string;
  contractDetails: {
    value: number;
    currency: string;
    startDate: string;
    endDate?: string;
  };
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
}

interface ContentItem {
  id: string;
  title: string;
  status: string;
  type: string;
  platform: string;
  scheduledDate: string;
}

export default function ClientDashboard() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = params.clientId as string;
  const token = searchParams.get('token');

  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Authentication state
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [requestingAccess, setRequestingAccess] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    
    const validateAuthentication = async () => {
      if (token) {
        // Validate token
        try {
          const response = await fetch(`/api/client-portal/${clientId}/auth?token=${token}`);
          if (response.ok) {
            setIsAuthenticated(true);
            setAuthLoading(false);
            fetchClientData();
            return;
          }
        } catch (err) {
          console.error('Token validation failed:', err);
        }
      }
      
      setIsAuthenticated(false);
      setAuthLoading(false);
    };

    const fetchClientData = async () => {
      try {
        setLoading(true);
        
        // Fetch client profile
        const clientResponse = await fetch(`/api/client-portal/${clientId}/profile`);
        if (!clientResponse.ok) {
          if (clientResponse.status === 404) {
            setError('Client not found. Please check your link.');
            return;
          }
          throw new Error('Failed to fetch client profile');
        }
        const clientData = await clientResponse.json();
        setClientProfile(clientData.data);

        // Fetch projects
        const projectsResponse = await fetch(`/api/client-portal/${clientId}/projects`);
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.data || []);
        }

        // Fetch content
        const contentResponse = await fetch(`/api/client-portal/${clientId}/content`);
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          setContentItems(contentData.data || []);
        }

      } catch (err) {
        console.error('Error fetching client data:', err);
        setError('Failed to load client data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    validateAuthentication();
  }, [clientId, token]);

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setAuthError('Please enter your email address');
      return;
    }

    setRequestingAccess(true);
    setAuthError(null);

    try {
      const response = await fetch(`/api/client-portal/${clientId}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          requestAccess: true
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to portal with token
        const portalUrl = data.data.portalUrl;
        window.location.href = portalUrl;
      } else {
        setAuthError(data.error || 'Failed to request access');
      }
    } catch (err) {
      console.error('Error requesting access:', err);
      setAuthError('Failed to request access. Please try again.');
    } finally {
      setRequestingAccess(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fm-magenta-50 via-orange-50/30 to-fm-magenta-50 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Verifying access...</p>
        </Card>
      </div>
    );
  }

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fm-magenta-50 via-orange-50/30 to-fm-magenta-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <Card variant="glass" className="overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-fm-magenta-600/10 to-fm-orange-500/10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fm-magenta-500 to-fm-orange-500 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-fm-magenta-600 to-fm-orange-600 bg-clip-text text-transparent">
                FreakingMinds Client Portal
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your Progress Hub - Enter your email to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleRequestAccess} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@company.com"
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-fm-magenta-500 focus:ring-fm-magenta-500 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                {authError && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-3">
                    <AlertCircle className="h-4 w-4" />
                    <span>{authError}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="client"
                  size="lg"
                  fullWidth
                  loading={requestingAccess}
                >
                  {requestingAccess ? 'Requesting Access...' : 'Access Your Dashboard'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50/50 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
                <p className="font-medium">Need assistance?</p>
                <p className="mt-1">Contact your dedicated account manager for immediate support.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fm-magenta-50 via-orange-50/30 to-fm-magenta-50 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </Card>
      </div>
    );
  }

  if (error || !clientProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fm-magenta-50 via-orange-50/30 to-fm-magenta-50 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-gray-900 font-semibold text-lg">{error || 'Client not found'}</p>
          <p className="text-gray-600 mt-2">Please contact your account manager for assistance.</p>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Calculate metrics for the dashboard
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalProjects = projects.length;
  const thisMonthContent = contentItems.filter(c => {
    const itemDate = new Date(c.scheduledDate);
    const now = new Date();
    return itemDate.getMonth() === now.getMonth() && 
           itemDate.getFullYear() === now.getFullYear();
  }).length;
  
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const avgProgress = projects.length > 0 ? 
    Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0;

  // Navigation items for client dashboard
  const navigationItems = [
    {
      label: 'Overview',
      href: `/client/${clientId}`,
      icon: <BarChart3 className="w-5 h-5" />,
      active: true
    },
    {
      label: 'Projects',
      href: `/client/${clientId}/projects`,
      icon: <Briefcase className="w-5 h-5" />,
      badge: activeProjects > 0 ? activeProjects : undefined
    },
    {
      label: 'Content',
      href: `/client/${clientId}/content`,
      icon: <Calendar className="w-5 h-5" />,
      badge: thisMonthContent > 0 ? thisMonthContent : undefined
    },
    {
      label: 'Reports',
      href: `/client/${clientId}/reports`,
      icon: <PieChart className="w-5 h-5" />
    },
    {
      label: 'Support',
      href: `/client/${clientId}/support`,
      icon: <MessageSquare className="w-5 h-5" />
    }
  ];

  return (
    <DashboardLayout
      variant="client"
      navigation={navigationItems}
      user={{
        name: clientProfile.name,
        email: `contact@${clientProfile.name.toLowerCase().replace(/\s+/g, '')}.com`,
        role: clientProfile.industry
      }}
    >
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {clientProfile.logo && (
              <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-fm-magenta-100 shadow-lg">
                <img 
                  src={clientProfile.logo} 
                  alt={clientProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-fm-magenta-600 to-fm-orange-600 bg-clip-text text-transparent">
                Welcome back, {clientProfile.name}
              </h1>
              <p className="text-gray-600 mt-1 font-medium capitalize">
                {clientProfile.industry} • Managed by {clientProfile.accountManager}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={getStatusColor(clientProfile.status)} variant="secondary">
              {clientProfile.status}
            </Badge>
            <div className={`flex items-center px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border ${getHealthColor(clientProfile.health)}`}>
              <Activity className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium capitalize">{clientProfile.health}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          subtitle="Currently in progress"
          icon={<Briefcase className="w-6 h-6" />}
          change={{
            value: totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0,
            type: activeProjects > 0 ? 'increase' : 'neutral',
            period: 'of total'
          }}
          variant="client"
        />

        <MetricCard
          title="Content This Month"
          value={thisMonthContent}
          subtitle="Scheduled publications"
          icon={<Calendar className="w-6 h-6" />}
          change={{
            value: 15,
            type: 'increase',
            period: 'vs last month'
          }}
          variant="client"
        />

        <MetricCard
          title="Contract Value"
          value={clientProfile.contractDetails.value}
          subtitle={`Total project investment`}
          icon={<TrendingUp className="w-6 h-6" />}
          formatter={(val) => new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: clientProfile.contractDetails.currency,
            minimumFractionDigits: 0,
            notation: 'compact'
          }).format(Number(val))}
          variant="client"
        />

        <MetricCard
          title="Overall Progress"
          value={`${avgProgress}%`}
          subtitle="Across all projects"
          icon={<Target className="w-6 h-6" />}
          change={{
            value: avgProgress > 50 ? 8 : -3,
            type: avgProgress > 50 ? 'increase' : 'decrease',
            period: 'this quarter'
          }}
          variant="client"
        />
      </div>

      {/* Projects & Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Projects */}
        <Card variant="client" hover glow>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">Recent Projects</CardTitle>
              </div>
              <Badge variant="outline" className="bg-fm-magenta-50 text-fm-magenta-700 border-fm-magenta-200">
                {projects.length} Total
              </Badge>
            </div>
            <CardDescription>Track progress across all your active initiatives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No projects found</p>
                <p className="text-gray-500 text-sm">New projects will appear here</p>
              </div>
            ) : (
              projects.slice(0, 3).map((project) => (
                <Card key={project.id} variant="glass" className="border-fm-magenta-100">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <Badge className={getStatusColor(project.status)} variant="secondary">
                          {project.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(project.startDate).toLocaleDateString()} - 
                        {new Date(project.endDate).toLocaleDateString()}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-fm-magenta-600">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-fm-magenta-500 to-fm-magenta-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-gray-600">
                          Budget: {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            minimumFractionDigits: 0,
                            notation: 'compact'
                          }).format(project.budget)}
                        </span>
                        <Button variant="ghost" size="sm" className="text-fm-magenta-600 hover:bg-fm-magenta-50">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {projects.length > 3 && (
              <div className="pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="w-full text-fm-magenta-600 hover:bg-fm-magenta-50">
                  View All {projects.length} Projects
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Calendar */}
        <Card variant="client" hover glow>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fm-orange-500 to-fm-orange-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">Content Calendar</CardTitle>
              </div>
              <Badge variant="outline" className="bg-fm-orange-50 text-fm-orange-700 border-fm-orange-200">
                {thisMonthContent} This Month
              </Badge>
            </div>
            <CardDescription>Upcoming content and publications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentItems.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No content scheduled</p>
                <p className="text-gray-500 text-sm">Content items will appear here</p>
              </div>
            ) : (
              contentItems.slice(0, 4).map((item) => (
                <Card key={item.id} variant="glass" className="border-fm-orange-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                            {item.platform}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{item.type}</span>
                          <span>•</span>
                          <span>{new Date(item.scheduledDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(item.status)} variant="secondary">
                        {item.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {contentItems.length > 4 && (
              <div className="pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="w-full text-fm-orange-600 hover:bg-fm-orange-50">
                  View Full Calendar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card variant="glass" hover>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </div>
            <CardDescription>Frequently used features and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" size="lg" className="w-full justify-start text-left h-auto p-4">
              <FileText className="w-5 h-5 mr-3 text-fm-magenta-600" />
              <div>
                <div className="font-medium">Project Reports</div>
                <div className="text-sm text-gray-500">View detailed progress reports</div>
              </div>
            </Button>
            <Button variant="ghost" size="lg" className="w-full justify-start text-left h-auto p-4">
              <MessageSquare className="w-5 h-5 mr-3 text-fm-magenta-600" />
              <div>
                <div className="font-medium">Contact Manager</div>
                <div className="text-sm text-gray-500">Get in touch with {clientProfile.accountManager}</div>
              </div>
            </Button>
            <Button variant="ghost" size="lg" className="w-full justify-start text-left h-auto p-4">
              <Award className="w-5 h-5 mr-3 text-fm-magenta-600" />
              <div>
                <div className="font-medium">Success Metrics</div>
                <div className="text-sm text-gray-500">Track ROI and performance</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Support & Resources */}
        <Card variant="glass" hover>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">Support & Resources</CardTitle>
            </div>
            <CardDescription>Get help and access important information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-fm-magenta-50 to-fm-orange-50 border border-fm-magenta-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-fm-magenta-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Account Manager</p>
                  <p className="text-sm text-gray-600">{clientProfile.accountManager}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-fm-orange-50 to-fm-magenta-50 border border-fm-orange-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-fm-orange-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-fm-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Contract Period</p>
                  <p className="text-sm text-gray-600">
                    {new Date(clientProfile.contractDetails.startDate).toLocaleDateString()} - 
                    {clientProfile.contractDetails.endDate 
                      ? new Date(clientProfile.contractDetails.endDate).toLocaleDateString()
                      : ' Ongoing'
                    }
                  </p>
                </div>
              </div>
            </div>

            <Button variant="client" size="lg" className="w-full">
              <MessageSquare className="w-5 h-5 mr-2" />
              Get Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}