'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase,
  Calendar,
  Clock,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Filter,
  Download,
  Activity,
  BarChart3,
  PieChart,
  MessageSquare,
  ChevronRight,
  Eye
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'review' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  team: string[];
  deliverables: {
    total: number;
    completed: number;
  };
  milestones: {
    name: string;
    date: string;
    status: 'upcoming' | 'in-progress' | 'completed';
  }[];
  lastUpdate: string;
}

export default function ClientProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    // Simulate fetching projects data
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          name: 'Website Redesign',
          description: 'Complete overhaul of company website with modern design and improved UX',
          status: 'active',
          priority: 'high',
          progress: 65,
          startDate: '2024-01-15',
          endDate: '2024-04-15',
          budget: 500000,
          spent: 325000,
          team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
          deliverables: { total: 12, completed: 8 },
          milestones: [
            { name: 'Design Approval', date: '2024-02-01', status: 'completed' },
            { name: 'Development Phase 1', date: '2024-02-28', status: 'completed' },
            { name: 'Testing & QA', date: '2024-03-15', status: 'in-progress' },
            { name: 'Launch', date: '2024-04-15', status: 'upcoming' }
          ],
          lastUpdate: '2 hours ago'
        },
        {
          id: '2',
          name: 'Social Media Campaign Q1',
          description: 'Comprehensive social media strategy and content creation for Q1',
          status: 'completed',
          priority: 'medium',
          progress: 100,
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          budget: 150000,
          spent: 145000,
          team: ['Sarah Wilson', 'Tom Brown'],
          deliverables: { total: 30, completed: 30 },
          milestones: [
            { name: 'Strategy Finalized', date: '2024-01-10', status: 'completed' },
            { name: 'Content Creation', date: '2024-02-15', status: 'completed' },
            { name: 'Campaign Launch', date: '2024-03-01', status: 'completed' }
          ],
          lastUpdate: '1 week ago'
        },
        {
          id: '3',
          name: 'SEO Optimization',
          description: 'Technical SEO audit and implementation for better search rankings',
          status: 'active',
          priority: 'high',
          progress: 40,
          startDate: '2024-02-01',
          endDate: '2024-05-01',
          budget: 200000,
          spent: 80000,
          team: ['Alex Chen', 'Lisa Park'],
          deliverables: { total: 8, completed: 3 },
          milestones: [
            { name: 'SEO Audit', date: '2024-02-15', status: 'completed' },
            { name: 'Technical Implementation', date: '2024-03-30', status: 'in-progress' },
            { name: 'Content Optimization', date: '2024-04-15', status: 'upcoming' },
            { name: 'Performance Review', date: '2024-05-01', status: 'upcoming' }
          ],
          lastUpdate: '5 hours ago'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['active', 'planning', 'review'].includes(project.status);
    if (filter === 'completed') return project.status === 'completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planning': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'review': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const navigationItems = [
    {
      label: 'Overview',
      href: `/client/${clientId}`,
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      label: 'Projects',
      href: `/client/${clientId}/projects`,
      icon: <Briefcase className="w-5 h-5" />,
      active: true
    },
    {
      label: 'Content',
      href: `/client/${clientId}/content`,
      icon: <Calendar className="w-5 h-5" />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fm-magenta-50 via-orange-50/30 to-fm-magenta-50 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading projects...</p>
        </Card>
      </div>
    );
  }

  // Calculate summary metrics
  const activeProjects = projects.filter(p => ['active', 'planning', 'review'].includes(p.status)).length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);

  return (
    <DashboardLayout
      variant="client"
      navigation={navigationItems}
      user={{
        name: 'Client Name',
        email: 'client@example.com',
        role: 'Industry'
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fm-magenta-600 to-fm-orange-600 bg-clip-text text-transparent">
              Your Projects
            </h1>
            <p className="text-gray-600 mt-1 font-medium">Track progress and milestones across all initiatives</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-fm-magenta-600">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          subtitle="Currently in progress"
          icon={<Briefcase className="w-6 h-6" />}
          variant="client"
          change={{
            value: 2,
            type: 'increase',
            period: 'this month'
          }}
        />
        
        <MetricCard
          title="Completed"
          value={completedProjects}
          subtitle="Successfully delivered"
          icon={<CheckCircle2 className="w-6 h-6" />}
          variant="client"
        />
        
        <MetricCard
          title="Total Investment"
          value={totalBudget}
          subtitle="Across all projects"
          icon={<DollarSign className="w-6 h-6" />}
          variant="client"
          formatter={(val) => new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            notation: 'compact'
          }).format(Number(val))}
        />
        
        <MetricCard
          title="Overall Progress"
          value={`${avgProgress}%`}
          subtitle="Average completion"
          icon={<Target className="w-6 h-6" />}
          variant="client"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant={filter === 'all' ? 'client' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Projects ({projects.length})
        </Button>
        <Button 
          variant={filter === 'active' ? 'client' : 'ghost'}
          size="sm"
          onClick={() => setFilter('active')}
        >
          Active ({activeProjects})
        </Button>
        <Button 
          variant={filter === 'completed' ? 'client' : 'ghost'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed ({completedProjects})
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} variant="client" hover glow className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} 
                         title={`${project.priority} priority`} />
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(project.status)} variant="secondary">
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-semibold text-fm-magenta-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-fm-magenta-500 to-fm-orange-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Timeline</div>
                  <div className="flex items-center text-sm font-medium">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                    {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Budget Used</div>
                  <div className="flex items-center text-sm font-medium">
                    <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                    {Math.round((project.spent / project.budget) * 100)}% 
                    <span className="text-gray-500 ml-1">
                      ({new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        notation: 'compact'
                      }).format(project.spent)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Deliverables</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-fm-magenta-600">
                      {project.deliverables.completed}
                    </span>
                    <span className="text-sm text-gray-500">of {project.deliverables.total} completed</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full bg-gradient-to-br from-fm-magenta-400 to-fm-orange-400 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {member.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600 font-medium">+{project.team.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="pt-3">
                <div className="text-sm font-medium text-gray-700 mb-3">Upcoming Milestones</div>
                <div className="space-y-2">
                  {project.milestones
                    .filter(m => m.status !== 'completed')
                    .slice(0, 2)
                    .map((milestone, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {milestone.status === 'in-progress' ? (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <Target className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={milestone.status === 'in-progress' ? 'font-medium' : 'text-gray-600'}>
                            {milestone.name}
                          </span>
                        </div>
                        <span className="text-gray-500">
                          {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-gray-500">Updated {project.lastUpdate}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-fm-magenta-600 hover:bg-fm-magenta-50"
                  onClick={() => router.push(`/client/${clientId}/projects/${project.id}`)}
                >
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card variant="glass" className="p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "You don't have any projects yet"
              : `No ${filter} projects at the moment`}
          </p>
        </Card>
      )}
    </DashboardLayout>
  );
}