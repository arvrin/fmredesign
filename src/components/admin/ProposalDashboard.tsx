/**
 * Proposal Dashboard - FreakingMinds
 * Manage and track all client proposals
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Copy,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  BarChart3
} from 'lucide-react';
import { 
  DashboardCard as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardButton as Button,
  MetricCard
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { ProposalStorage } from '@/lib/admin/proposal-storage';
import { Proposal } from '@/lib/admin/proposal-types';
import { ProposalPDFGenerator } from '@/lib/admin/proposal-pdf-generator';

interface ProposalDashboardProps {
  onCreateNew: () => void;
  onEditProposal: (proposal: Proposal) => void;
}

export function ProposalDashboard({ onCreateNew, onEditProposal }: ProposalDashboardProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [stats, setStats] = useState(ProposalStorage.getProposalStats());
  const [pdfGenerator] = useState(() => new ProposalPDFGenerator());

  // Load proposals
  useEffect(() => {
    loadProposals();
  }, []);

  // Filter proposals based on search and filters
  useEffect(() => {
    let filtered = proposals;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(proposal =>
        proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.proposalNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.client.prospectInfo?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.client.prospectInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.proposalType === typeFilter);
    }

    setFilteredProposals(filtered);
  }, [proposals, searchQuery, statusFilter, typeFilter]);

  const loadProposals = () => {
    const allProposals = ProposalStorage.getProposals();
    setProposals(allProposals);
    setStats(ProposalStorage.getProposalStats());
  };

  const handleDeleteProposal = (proposalId: string) => {
    if (confirm('Are you sure you want to delete this proposal?')) {
      ProposalStorage.deleteProposal(proposalId);
      loadProposals();
    }
  };

  const handleDuplicateProposal = (proposalId: string) => {
    const duplicated = ProposalStorage.duplicateProposal(proposalId);
    if (duplicated) {
      onEditProposal(duplicated);
    }
  };

  const handleStatusUpdate = (proposalId: string, newStatus: Proposal['status']) => {
    ProposalStorage.updateProposalStatus(proposalId, newStatus);
    loadProposals();
  };

  const handlePreviewProposal = async (proposal: Proposal) => {
    try {
      const pdfDataUri = await pdfGenerator.generateProposal(proposal);
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Proposal Preview - ${proposal.proposalNumber}</title>
              <style>body { margin: 0; padding: 0; }</style>
            </head>
            <body>
              <embed src="${pdfDataUri}" width="100%" height="100%" type="application/pdf">
            </body>
          </html>
        `);
      }
    } catch (error) {
      console.error('Error previewing proposal:', error);
      alert('Error generating preview');
    }
  };

  const getStatusBadgeVariant = (status: Proposal['status']) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'outline';
      case 'viewed': return 'default';
      case 'approved': return 'success';
      case 'declined': return 'destructive';
      case 'expired': return 'secondary';
      case 'converted': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'draft': return <Edit className="w-3 h-3" />;
      case 'sent': return <Send className="w-3 h-3" />;
      case 'viewed': return <Eye className="w-3 h-3" />;
      case 'approved': return <CheckCircle className="w-3 h-3" />;
      case 'declined': return <XCircle className="w-3 h-3" />;
      case 'expired': return <Clock className="w-3 h-3" />;
      case 'converted': return <TrendingUp className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proposal Dashboard</h1>
          <p className="text-gray-600">Manage and track your client proposals</p>
        </div>
        <Button variant="admin" onClick={onCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Proposal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Proposals"
          value={stats.total.toString()}
          subtitle={`${stats.draft} drafts, ${stats.sent} sent`}
          icon={<FileText className="w-6 h-6" />}
          variant="admin"
        />
        <MetricCard
          title="Approval Rate"
          value={`${stats.approvalRate.toFixed(1)}%`}
          subtitle={`${stats.approved} approved proposals`}
          icon={<TrendingUp className="w-6 h-6" />}
          variant="admin"
        />
        <MetricCard
          title="Total Value"
          value={formatCurrency(ProposalStorage.getTotalProposalValue())}
          subtitle="All active proposals"
          icon={<DollarSign className="w-6 h-6" />}
          variant="admin"
        />
        <MetricCard
          title="Converted Value"
          value={formatCurrency(ProposalStorage.getTotalProposalValue('converted'))}
          subtitle={`${stats.converted} converted`}
          icon={<CheckCircle className="w-6 h-6" />}
          variant="admin"
        />
      </div>

      {/* Filters and Search */}
      <Card variant="admin">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="viewed">Viewed</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
                <option value="expired">Expired</option>
                <option value="converted">Converted</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="sm:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
              >
                <option value="all">All Types</option>
                <option value="retainer">Retainer</option>
                <option value="project">Project</option>
                <option value="audit">Audit</option>
                <option value="consultation">Consultation</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <Card variant="admin">
            <CardContent className="p-8 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {proposals.length === 0 ? 'No proposals yet' : 'No proposals match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {proposals.length === 0 
                  ? 'Create your first proposal to get started'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {proposals.length === 0 && (
                <Button variant="admin" onClick={onCreateNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Proposal
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredProposals.map((proposal) => (
            <Card key={proposal.id} variant="admin" className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {proposal.title}
                      </h3>
                      <Badge 
                        variant={getStatusBadgeVariant(proposal.status)}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(proposal.status)}
                        {proposal.status}
                      </Badge>
                      <Badge variant="outline">
                        {proposal.proposalType}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {proposal.proposalNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(proposal.createdAt).toLocaleDateString('en-IN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(proposal.investment.total)}
                      </span>
                      {proposal.validUntil && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Valid until {new Date(proposal.validUntil).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Client: </span>
                      {proposal.client.prospectInfo?.company || 
                       proposal.client.prospectInfo?.name || 
                       'Existing Client'}
                      {proposal.client.prospectInfo?.email && (
                        <span className="text-gray-500 ml-2">
                          ({proposal.client.prospectInfo.email})
                        </span>
                      )}
                    </div>

                    {proposal.servicePackages.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Services: </span>
                        {proposal.servicePackages.slice(0, 2).map(pkg => pkg.name).join(', ')}
                        {proposal.servicePackages.length > 2 && (
                          <span className="text-gray-500">
                            {' '}and {proposal.servicePackages.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreviewProposal(proposal)}
                      title="Preview PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditProposal(proposal)}
                      title="Edit Proposal"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateProposal(proposal.id)}
                      title="Duplicate Proposal"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    
                    {proposal.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(proposal.id, 'sent')}
                        title="Mark as Sent"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {(proposal.status === 'sent' || proposal.status === 'viewed') && (
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusUpdate(proposal.id, 'approved')}
                          title="Mark as Approved"
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusUpdate(proposal.id, 'declined')}
                          title="Mark as Declined"
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProposal(proposal.id)}
                      title="Delete Proposal"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}