/**
 * Professional Proposal Generator - FreakingMinds
 * Comprehensive proposal creation system for digital marketing services
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Save, 
  Eye, 
  Calculator,
  User,
  Calendar,
  FileText,
  CreditCard,
  RefreshCw,
  Building,
  Target,
  Lightbulb,
  CheckCircle,
  Clock,
  DollarSign
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
import { ClientService } from '@/lib/admin/client-service';
import { ProposalNumbering } from '@/lib/admin/proposal-numbering';
import { ProposalStorage } from '@/lib/admin/proposal-storage';
import { ProposalPDFGenerator } from '@/lib/admin/proposal-pdf-generator';
import { 
  Proposal, 
  ProspectClient, 
  ServicePackage, 
  DIGITAL_MARKETING_PACKAGES, 
  PRICING_MODIFIERS,
  DEFAULT_PROPOSAL_CONTENT,
  PricingStructure,
  ProjectTimeline
} from '@/lib/admin/proposal-types';

interface SelectedPackage {
  package: ServicePackage;
  variant?: string;
  quantity: number;
  customPrice?: number;
  notes?: string;
}

interface InvoiceClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  gstNumber?: string;
}

interface ProposalFormNewProps {
  initialProposal?: Proposal | null;
  onSaveSuccess?: () => void;
}

export function ProposalFormNew({ initialProposal, onSaveSuccess }: ProposalFormNewProps) {
  const [proposal, setProposal] = useState<Proposal>(() => {
    if (initialProposal) {
      return initialProposal;
    }
    
    return {
      id: `prop-${Date.now()}`,
      proposalNumber: ProposalNumbering.getNextProposalNumber(),
      title: 'Digital Marketing Proposal',
      client: {
        isExisting: true,
        clientId: '',
        prospectInfo: undefined
      },
      servicePackages: [],
      timeline: {
        kickoff: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
        milestones: [],
        completion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 months from now
        ongoingSupport: true
      },
      investment: {
        packages: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        paymentTerms: '50-50'
      },
      proposalType: 'retainer',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      status: 'draft',
      executiveSummary: '',
      problemStatement: '',
      proposedSolution: '',
      whyFreakingMinds: DEFAULT_PROPOSAL_CONTENT.whyFreakingMinds,
      nextSteps: DEFAULT_PROPOSAL_CONTENT.nextSteps,
      termsAndConditions: DEFAULT_PROPOSAL_CONTENT.termsAndConditions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin',
      template: 'professional',
      includeCaseStudies: true,
      includeTestimonials: true
    };
  });

  const [clients, setClients] = useState<InvoiceClient[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackage[]>(() => {
    if (initialProposal && initialProposal.servicePackages.length > 0) {
      return initialProposal.servicePackages.map(pkg => ({
        package: pkg,
        quantity: 1,
        variant: undefined
      }));
    }
    return [];
  });
  const [clientSizeMultiplier, setClientSizeMultiplier] = useState<string>('medium');
  const [urgencyMultiplier, setUrgencyMultiplier] = useState<string>('standard');
  const [retainerDuration, setRetainerDuration] = useState<string>('6-months');
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(false);
  const [pdfGenerator] = useState(() => new ProposalPDFGenerator());

  // Load clients
  useEffect(() => {
    const loadClients = async () => {
      try {
        const invoiceClients = await ClientService.getInvoiceClients();
        setClients(invoiceClients || []);
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    };
    loadClients();
  }, []);

  // Calculate pricing whenever selections change
  useEffect(() => {
    calculateTotalPricing();
  }, [selectedPackages, clientSizeMultiplier, urgencyMultiplier, retainerDuration]);

  const calculateTotalPricing = () => {
    let subtotal = 0;
    const packages = selectedPackages.map(selected => {
      let basePrice = selected.customPrice || selected.package.basePrice;
      
      // Apply variant multiplier
      if (selected.variant && selected.package.variants) {
        const variant = selected.package.variants.find(v => v.name === selected.variant);
        if (variant) {
          basePrice *= variant.priceMultiplier;
        }
      }
      
      // Apply modifiers
      basePrice *= PRICING_MODIFIERS.clientSize[clientSizeMultiplier] || 1;
      basePrice *= PRICING_MODIFIERS.urgency[urgencyMultiplier] || 1;
      
      const totalPrice = basePrice * selected.quantity;
      subtotal += totalPrice;
      
      return {
        packageId: selected.package.id,
        variant: selected.variant,
        quantity: selected.quantity,
        price: totalPrice
      };
    });

    // Apply retainer discount
    let discount = 0;
    if (proposal.proposalType === 'retainer' && retainerDuration in PRICING_MODIFIERS.retainerDiscount) {
      discount = subtotal * PRICING_MODIFIERS.retainerDiscount[retainerDuration];
    }

    const total = subtotal - discount;

    const newInvestment: PricingStructure = {
      packages,
      subtotal,
      discount,
      discountReason: discount > 0 ? `${retainerDuration.replace('-', ' ')} retainer discount` : undefined,
      total,
      paymentTerms: proposal.investment.paymentTerms,
      retainerDiscount: discount > 0 ? PRICING_MODIFIERS.retainerDiscount[retainerDuration] : undefined
    };

    setProposal(prev => ({
      ...prev,
      investment: newInvestment,
      servicePackages: selectedPackages.map(s => s.package)
    }));
  };

  const addServicePackage = (packageId: string) => {
    const servicePackage = DIGITAL_MARKETING_PACKAGES.find(pkg => pkg.id === packageId);
    if (servicePackage) {
      setSelectedPackages(prev => [...prev, {
        package: servicePackage,
        quantity: 1
      }]);
    }
  };

  const removeServicePackage = (index: number) => {
    setSelectedPackages(prev => prev.filter((_, i) => i !== index));
  };

  const updateSelectedPackage = (index: number, updates: Partial<SelectedPackage>) => {
    setSelectedPackages(prev => prev.map((pkg, i) => 
      i === index ? { ...pkg, ...updates } : pkg
    ));
  };

  const selectClient = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setProposal(prev => ({
        ...prev,
        client: {
          isExisting: true,
          clientId: clientId,
          prospectInfo: undefined
        }
      }));
      
      // Set client size based on existing client data
      // This would be enhanced with actual client size data
      setClientSizeMultiplier('medium'); // Default, could be determined from client data
    }
  };

  const toggleClientType = () => {
    setProposal(prev => ({
      ...prev,
      client: {
        isExisting: !prev.client.isExisting,
        clientId: '',
        prospectInfo: prev.client.isExisting ? {
          name: '',
          email: '',
          company: '',
          industry: '',
          companySize: 'medium'
        } : undefined
      }
    }));
  };

  const updateProspectInfo = (field: keyof ProspectClient, value: string) => {
    setProposal(prev => ({
      ...prev,
      client: {
        ...prev.client,
        prospectInfo: prev.client.prospectInfo ? {
          ...prev.client.prospectInfo,
          [field]: value
        } : undefined
      }
    }));
  };

  const handleSave = () => {
    try {
      // Generate proposal number if not present
      if (!proposal.proposalNumber || proposal.proposalNumber.startsWith('PROP-')) {
        setProposal(prev => ({
          ...prev,
          proposalNumber: ProposalNumbering.getNextProposalNumber()
        }));
      }

      ProposalStorage.saveProposal(proposal);
      alert('Proposal saved successfully!');
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Error saving proposal:', error);
      alert('Error saving proposal. Please try again.');
    }
  };

  const handlePreview = async () => {
    try {
      // Basic validation
      if (!proposal.client.clientId && !proposal.client.prospectInfo?.company) {
        alert('Please select a client or add prospect information before generating preview.');
        return;
      }
      
      if (selectedPackages.length === 0) {
        alert('Please add at least one service package.');
        return;
      }

      const pdfDataUri = await pdfGenerator.generateProposal(proposal, proposal.template);
      
      // Try different approaches for opening PDF
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
      } else {
        // Fallback: try direct window.open
        window.open(pdfDataUri, '_blank');
      }
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      alert(`Error generating PDF preview: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDownload = async () => {
    try {
      // Basic validation
      if (!proposal.client.clientId && !proposal.client.prospectInfo?.company) {
        alert('Please select a client or add prospect information before downloading.');
        return;
      }
      
      if (selectedPackages.length === 0) {
        alert('Please add at least one service package.');
        return;
      }

      await pdfGenerator.downloadProposal(proposal, proposal.template);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please check the console for details.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column - Proposal Form */}
        <div className="space-y-6">
          {/* Header */}
          <Card variant="admin">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">Proposal #</label>
                      <input
                        type="text"
                        value={proposal.proposalNumber}
                        onChange={(e) => {
                          const newNumber = e.target.value;
                          setProposal(prev => ({ ...prev, proposalNumber: newNumber }));
                          
                          if (ProposalNumbering.isValidFormat(newNumber)) {
                            ProposalNumbering.updateFromManualProposal(newNumber);
                          }
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm font-semibold text-gray-900 w-32"
                        placeholder="PM164/2025"
                      />
                    </div>
                    <p className="text-sm text-gray-600">{proposal.status} • Created {new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">Next auto: {ProposalNumbering.previewNextProposalNumber()}</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {proposal.proposalType}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handlePreview}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="admin" size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proposal Details */}
          <Card variant="admin">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-fm-magenta-600" />
                <CardTitle>Proposal Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposal Title
                </label>
                <input
                  type="text"
                  value={proposal.title}
                  onChange={(e) => setProposal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                  placeholder="Digital Marketing Strategy Proposal"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Type
                  </label>
                  <select
                    value={proposal.proposalType}
                    onChange={(e) => setProposal(prev => ({ ...prev, proposalType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                  >
                    <option value="retainer">Monthly Retainer</option>
                    <option value="project">One-time Project</option>
                    <option value="audit">Audit & Strategy</option>
                    <option value="consultation">Consultation</option>
                    <option value="hybrid">Hybrid Model</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={proposal.validUntil}
                    onChange={(e) => setProposal(prev => ({ ...prev, validUntil: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card variant="admin">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-fm-magenta-600" />
                  <CardTitle>Client Information</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={toggleClientType}>
                  {proposal.client.isExisting ? 'New Prospect' : 'Existing Client'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {proposal.client.isExisting ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Existing Client
                  </label>
                  <select
                    value={proposal.client.clientId || ''}
                    onChange={(e) => selectClient(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                  >
                    <option value="">Choose a client... ({clients.length} available)</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} - {client.email}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={proposal.client.prospectInfo?.company || ''}
                      onChange={(e) => updateProspectInfo('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={proposal.client.prospectInfo?.name || ''}
                      onChange={(e) => updateProspectInfo('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                      placeholder="Contact Person"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={proposal.client.prospectInfo?.email || ''}
                      onChange={(e) => updateProspectInfo('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                      placeholder="email@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={proposal.client.prospectInfo?.industry || ''}
                      onChange={(e) => updateProspectInfo('industry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                      placeholder="Technology, Healthcare, etc."
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Packages */}
          <Card variant="admin">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-fm-magenta-600" />
                  <CardTitle>Service Packages</CardTitle>
                </div>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addServicePackage(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-fm-magenta-500"
                  >
                    <option value="">Add Service Package...</option>
                    {DIGITAL_MARKETING_PACKAGES.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ₹{pkg.basePrice.toLocaleString('en-IN')}
                        {pkg.billingType === 'monthly' ? '/month' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPackages.map((selected, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{selected.package.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{selected.package.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {selected.package.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeServicePackage(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selected.package.variants && selected.package.variants.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
                        <select
                          value={selected.variant || ''}
                          onChange={(e) => updateSelectedPackage(index, { variant: e.target.value || undefined })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                        >
                          <option value="">Standard</option>
                          {selected.package.variants.map(variant => (
                            <option key={variant.name} value={variant.name}>
                              {variant.name} ({(variant.priceMultiplier * 100 - 100) > 0 ? '+' : ''}{Math.round((variant.priceMultiplier - 1) * 100)}%)
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={selected.quantity}
                        onChange={(e) => updateSelectedPackage(index, { quantity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custom Price (Optional)</label>
                      <input
                        type="number"
                        placeholder={`${selected.package.basePrice}`}
                        value={selected.customPrice || ''}
                        onChange={(e) => updateSelectedPackage(index, { customPrice: parseFloat(e.target.value) || undefined })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                      />
                    </div>
                  </div>
                  
                  {/* Deliverables */}
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Deliverables:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selected.package.deliverables.map((deliverable, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {deliverable}
                        </li>
                      ))}
                      {selected.variant && selected.package.variants && (
                        selected.package.variants
                          .find(v => v.name === selected.variant)
                          ?.additionalDeliverables.map((deliverable, i) => (
                            <li key={`variant-${i}`} className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" />
                              {deliverable}
                            </li>
                          ))
                      )}
                    </ul>
                  </div>
                </div>
              ))}
              
              {selectedPackages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No service packages selected yet.</p>
                  <p className="text-sm">Choose from our pre-built packages above.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Modifiers */}
          {selectedPackages.length > 0 && (
            <Card variant="admin">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-fm-magenta-600" />
                    <CardTitle>Pricing Configuration</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvancedPricing(!showAdvancedPricing)}
                  >
                    {showAdvancedPricing ? 'Simple' : 'Advanced'} Pricing
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Size</label>
                    <select
                      value={clientSizeMultiplier}
                      onChange={(e) => setClientSizeMultiplier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                    >
                      <option value="startup">Startup ({Math.round(PRICING_MODIFIERS.clientSize.startup * 100 - 100)}%)</option>
                      <option value="small">Small Business ({Math.round(PRICING_MODIFIERS.clientSize.small * 100 - 100)}%)</option>
                      <option value="medium">Medium Business (Base Price)</option>
                      <option value="large">Large Business (+{Math.round(PRICING_MODIFIERS.clientSize.large * 100 - 100)}%)</option>
                      <option value="enterprise">Enterprise (+{Math.round(PRICING_MODIFIERS.clientSize.enterprise * 100 - 100)}%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                    <select
                      value={urgencyMultiplier}
                      onChange={(e) => setUrgencyMultiplier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                    >
                      <option value="standard">Standard Timeline</option>
                      <option value="priority">Priority (+{Math.round(PRICING_MODIFIERS.urgency.priority * 100 - 100)}%)</option>
                      <option value="rush">Rush Delivery (+{Math.round(PRICING_MODIFIERS.urgency.rush * 100 - 100)}%)</option>
                    </select>
                  </div>
                  {proposal.proposalType === 'retainer' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Retainer Period</label>
                      <select
                        value={retainerDuration}
                        onChange={(e) => setRetainerDuration(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500"
                      >
                        <option value="3-months">3 Months (-{Math.round(PRICING_MODIFIERS.retainerDiscount['3-months'] * 100)}%)</option>
                        <option value="6-months">6 Months (-{Math.round(PRICING_MODIFIERS.retainerDiscount['6-months'] * 100)}%)</option>
                        <option value="12-months">12 Months (-{Math.round(PRICING_MODIFIERS.retainerDiscount['12-months'] * 100)}%)</option>
                        <option value="24-months">24 Months (-{Math.round(PRICING_MODIFIERS.retainerDiscount['24-months'] * 100)}%)</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                  <select
                    value={proposal.investment.paymentTerms}
                    onChange={(e) => setProposal(prev => ({
                      ...prev,
                      investment: { ...prev.investment, paymentTerms: e.target.value as any }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 max-w-md"
                  >
                    <option value="50-50">50% Advance, 50% on Delivery</option>
                    <option value="monthly">Monthly Billing (Retainer)</option>
                    <option value="quarterly">Quarterly Billing</option>
                    <option value="milestone-based">Milestone Based Payments</option>
                    <option value="upfront">100% Upfront</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Proposal Summary & Pricing */}
        <div className="space-y-6">
          {/* Pricing Summary */}
          <div className="grid grid-cols-1 gap-4">
            <MetricCard
              title="Subtotal"
              value={`₹${proposal.investment.subtotal.toLocaleString('en-IN')}`}
              subtitle="Before discounts"
              icon={<Calculator className="w-6 h-6" />}
              variant="admin"
            />
            {proposal.investment.discount > 0 && (
              <MetricCard
                title="Discount"
                value={`-₹${proposal.investment.discount.toLocaleString('en-IN')}`}
                subtitle={proposal.investment.discountReason || 'Applied discount'}
                icon={<DollarSign className="w-6 h-6" />}
                variant="secondary"
              />
            )}
            <MetricCard
              title="Total Investment"
              value={`₹${proposal.investment.total.toLocaleString('en-IN')}`}
              subtitle={`${proposal.proposalType === 'monthly' ? 'per month' : 'project total'}`}
              icon={<CreditCard className="w-6 h-6" />}
              variant="success"
              className="ring-2 ring-fm-magenta-200"
            />
          </div>

          {/* Proposal Preview */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Proposal Preview</CardTitle>
              <CardDescription>Live preview of your proposal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-sm max-h-96 overflow-y-auto">
                {/* Header */}
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="/logo.png" 
                        alt="Freaking Minds Logo" 
                        className="h-12 w-auto object-contain"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-fm-magenta-600">FREAKING MINDS</h3>
                        <p className="text-xs text-gray-600">Digital Marketing Proposal</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h4 className="text-lg font-bold">PROPOSAL</h4>
                      <p className="text-gray-600">#{proposal.proposalNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-4">{proposal.title}</h2>

                {/* Client Info */}
                {(proposal.client.clientId || proposal.client.prospectInfo?.company) && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Prepared for:</h3>
                    {proposal.client.isExisting && proposal.client.clientId ? (
                      <div>
                        {(() => {
                          const client = clients.find(c => c.id === proposal.client.clientId);
                          return client ? (
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-gray-600">{client.email}</p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    ) : proposal.client.prospectInfo && (
                      <div>
                        <p className="font-medium">{proposal.client.prospectInfo.company}</p>
                        <p className="text-gray-600">{proposal.client.prospectInfo.name}</p>
                        <p className="text-gray-600">{proposal.client.prospectInfo.email}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Services Overview */}
                {selectedPackages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Proposed Services:</h3>
                    <div className="space-y-3">
                      {selectedPackages.map((selected, index) => (
                        <div key={index} className="border-l-4 border-fm-magenta-500 pl-3">
                          <h4 className="font-medium text-gray-900">{selected.package.name}</h4>
                          <p className="text-sm text-gray-600">{selected.package.description}</p>
                          <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {selected.package.timeline}
                            </span>
                            {selected.variant && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {selected.variant}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Investment Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Investment Summary:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{proposal.investment.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {proposal.investment.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({proposal.investment.discountReason}):</span>
                        <span>-₹{proposal.investment.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total Investment:</span>
                      <span className="text-fm-magenta-600">₹{proposal.investment.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Valid Until */}
                <div className="text-center text-sm text-gray-600 border-t pt-4">
                  <p>This proposal is valid until: {new Date(proposal.validUntil).toLocaleDateString()}</p>
                  <p className="mt-2 text-xs">Thank you for considering Freaking Minds for your digital marketing needs.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}