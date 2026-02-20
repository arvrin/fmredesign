'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardCard as Card, CardContent, CardHeader, CardTitle, DashboardButton } from '@/design-system';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import { adminToast } from '@/lib/admin/toast';
import { AGENCY_SERVICES } from '@/lib/admin/types';
import { formatContractCurrency, type Contract, type ContractServiceItem } from '@/lib/admin/contract-types';
import {
  Plus,
  FileText,
  Trash2,
  Send,
  Edit2,
  Save,
  X,
  AlertCircle,
  DollarSign,
} from 'lucide-react';

interface Props {
  clientId: string;
}

const EMPTY_SERVICE: ContractServiceItem = {
  serviceId: '',
  name: '',
  description: '',
  quantity: 1,
  unitPrice: 0,
  total: 0,
};

// Currency is now dynamic per contract — see formatContractCurrency()

export default function ContractsTab({ clientId }: Props) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [contractNumber, setContractNumber] = useState('');
  const [services, setServices] = useState<ContractServiceItem[]>([{ ...EMPTY_SERVICE }]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [billingCycle, setBillingCycle] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');

  const totalValue = services.reduce((sum, s) => sum + s.total, 0);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contracts?clientId=${clientId}`);
      const json = await res.json();
      if (json.success) setContracts(json.data || []);
    } catch (err) {
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const resetForm = () => {
    setTitle('');
    setContractNumber('');
    setServices([{ ...EMPTY_SERVICE }]);
    setCurrency('INR');
    setStartDate('');
    setEndDate('');
    setPaymentTerms('');
    setBillingCycle('');
    setTermsAndConditions('');
    setRevisionNotes('');
    setEditingId(null);
    setShowForm(false);
  };

  const populateForm = (c: Contract) => {
    setTitle(c.title);
    setContractNumber(c.contractNumber || '');
    setServices(c.services.length > 0 ? c.services : [{ ...EMPTY_SERVICE }]);
    setCurrency(c.currency || 'INR');
    setStartDate(c.startDate || '');
    setEndDate(c.endDate || '');
    setPaymentTerms(c.paymentTerms || '');
    setBillingCycle(c.billingCycle || '');
    setTermsAndConditions(c.termsAndConditions || '');
    setRevisionNotes(c.revisionNotes || '');
    setEditingId(c.id);
    setShowForm(true);
  };

  const updateService = (idx: number, patch: Partial<ContractServiceItem>) => {
    setServices((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, ...patch } : s))
    );
  };

  const handleSave = async () => {
    if (!title.trim() || services.length === 0) {
      adminToast.error('Title and at least one service are required');
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? {
            id: editingId,
            title,
            contractNumber: contractNumber || undefined,
            services,
            totalValue,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            paymentTerms: paymentTerms || undefined,
            billingCycle: billingCycle || undefined,
            termsAndConditions: termsAndConditions || undefined,
            revisionNotes: revisionNotes || undefined,
          }
        : {
            clientId,
            title,
            contractNumber: contractNumber || undefined,
            services,
            totalValue,
            currency,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            paymentTerms: paymentTerms || undefined,
            billingCycle: billingCycle || undefined,
            termsAndConditions: termsAndConditions || undefined,
          };

      const res = await fetch('/api/contracts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error);

      adminToast.success(editingId ? 'Contract updated' : 'Contract created');
      resetForm();
      fetchContracts();
    } catch (err) {
      console.error('Error saving contract:', err);
      adminToast.error('Failed to save contract');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (contractId: string, status: string) => {
    try {
      const res = await fetch('/api/contracts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contractId, status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      adminToast.success(`Contract ${status === 'sent' ? 'sent to client' : 'updated'}`);
      fetchContracts();
    } catch (err) {
      console.error('Error updating contract status:', err);
      adminToast.error('Failed to update contract');
    }
  };

  const handleDelete = async (contractId: string) => {
    if (!confirm('Delete this contract?')) return;
    try {
      const res = await fetch(`/api/contracts?id=${contractId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      adminToast.success('Contract deleted');
      fetchContracts();
    } catch (err) {
      console.error('Error deleting contract:', err);
      adminToast.error('Failed to delete contract');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {editingId ? 'Edit Contract' : 'New Contract'}
              </CardTitle>
              <DashboardButton variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </DashboardButton>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contract Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Social Media Retainer Q1 2026"
              />
              <Input
                label="Contract Number"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                placeholder="Optional reference number"
              />
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-3">
                Services *
              </label>
              {services.map((svc, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end mb-2">
                  <div className="col-span-4">
                    <Select
                      label={idx === 0 ? 'Service' : undefined}
                      value={svc.serviceId || ''}
                      onChange={(e) => {
                        const found = AGENCY_SERVICES.find((s) => s.id === e.target.value);
                        updateService(idx, {
                          serviceId: found?.id || '',
                          name: found?.name || '',
                          unitPrice: found?.suggestedRate || 0,
                          total: (found?.suggestedRate || 0) * svc.quantity,
                        });
                      }}
                    >
                      <option value="">Custom service...</option>
                      {AGENCY_SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      label={idx === 0 ? 'Name' : undefined}
                      value={svc.name}
                      onChange={(e) => updateService(idx, { name: e.target.value })}
                      placeholder="Service name"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      label={idx === 0 ? 'Qty' : undefined}
                      type="number"
                      min={1}
                      value={svc.quantity}
                      onChange={(e) => {
                        const q = parseInt(e.target.value) || 1;
                        updateService(idx, { quantity: q, total: q * svc.unitPrice });
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label={idx === 0 ? 'Unit Price' : undefined}
                      type="number"
                      value={svc.unitPrice}
                      onChange={(e) => {
                        const p = parseFloat(e.target.value) || 0;
                        updateService(idx, { unitPrice: p, total: svc.quantity * p });
                      }}
                    />
                  </div>
                  <div className="col-span-1 text-right text-sm font-medium text-fm-neutral-900 pb-2">
                    {formatContractCurrency(svc.total, currency)}
                  </div>
                  <div className="col-span-1 pb-2">
                    <DashboardButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setServices((prev) => prev.filter((_, i) => i !== idx))}
                      disabled={services.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </DashboardButton>
                  </div>
                </div>
              ))}
              <DashboardButton
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setServices((prev) => [...prev, { ...EMPTY_SERVICE }])}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Service
              </DashboardButton>
              <div className="mt-3 text-right">
                <span className="text-sm text-fm-neutral-600 mr-2">Total:</span>
                <span className="text-lg font-bold text-fm-neutral-900">{formatContractCurrency(totalValue, currency)}</span>
              </div>
            </div>

            {/* Duration & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Select
                label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR">INR (₹)</option>
                <option value="GBP">GBP (£)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="SGD">SGD (S$)</option>
              </Select>
              <Input
                label="Payment Terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="e.g. Net 30"
              />
              <Select
                label="Billing Cycle"
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="milestone">Milestone</option>
                <option value="one-time">One-time</option>
              </Select>
            </div>

            {/* Terms */}
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Terms & Conditions
              </label>
              <textarea
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-fm-neutral-300 bg-fm-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-500"
                placeholder="Custom terms and conditions..."
              />
            </div>

            {/* Revision notes (only when editing an edit_requested contract) */}
            {editingId && (
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Admin Notes (internal)
                </label>
                <textarea
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-fm-neutral-300 bg-fm-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-500"
                  placeholder="Internal revision notes..."
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-fm-neutral-200">
              <DashboardButton variant="outline" onClick={resetForm}>
                Cancel
              </DashboardButton>
              <DashboardButton onClick={handleSave} disabled={saving || !title.trim()}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : editingId ? 'Update Contract' : 'Create Contract'}
              </DashboardButton>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header + Create button */}
      {!showForm && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-fm-neutral-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Contracts ({contracts.length})
          </h3>
          <DashboardButton onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </DashboardButton>
        </div>
      )}

      {/* Contracts List */}
      {contracts.length === 0 && !showForm ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No Contracts Yet"
          description="Create a contract for this client to get started."
          action={
            <DashboardButton onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Contract
            </DashboardButton>
          }
        />
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card key={contract.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-fm-neutral-900">
                        {contract.title}
                      </h4>
                      <StatusBadge status={contract.status} />
                      {contract.contractNumber && (
                        <span className="text-xs text-fm-neutral-500">
                          #{contract.contractNumber}
                        </span>
                      )}
                    </div>

                    {/* Services summary */}
                    <div className="text-sm text-fm-neutral-600 mb-2">
                      {contract.services.map((s) => s.name).join(', ')}
                    </div>

                    {/* Details row */}
                    <div className="flex items-center gap-4 text-sm text-fm-neutral-500 flex-wrap">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatContractCurrency(contract.totalValue, contract.currency)}
                      </span>
                      {contract.startDate && (
                        <span>
                          {new Date(contract.startDate).toLocaleDateString()} —{' '}
                          {contract.endDate
                            ? new Date(contract.endDate).toLocaleDateString()
                            : 'Ongoing'}
                        </span>
                      )}
                      {contract.billingCycle && (
                        <span className="capitalize">{contract.billingCycle}</span>
                      )}
                    </div>

                    {/* Client feedback callout */}
                    {contract.clientFeedback && contract.status === 'edit_requested' && (
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center text-orange-700 text-sm font-medium mb-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Client Feedback
                        </div>
                        <p className="text-sm text-orange-800">{contract.clientFeedback}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    {contract.status === 'draft' && (
                      <>
                        <DashboardButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(contract.id, 'sent')}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </DashboardButton>
                        <DashboardButton
                          variant="ghost"
                          size="sm"
                          onClick={() => populateForm(contract)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </DashboardButton>
                        <DashboardButton
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(contract.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </DashboardButton>
                      </>
                    )}
                    {contract.status === 'edit_requested' && (
                      <>
                        <DashboardButton
                          variant="outline"
                          size="sm"
                          onClick={() => populateForm(contract)}
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit & Re-send
                        </DashboardButton>
                      </>
                    )}
                    {contract.status === 'rejected' && (
                      <DashboardButton
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(contract.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </DashboardButton>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
