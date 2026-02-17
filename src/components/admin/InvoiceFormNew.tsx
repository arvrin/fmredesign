/**
 * Invoice Creator — V2 Design Language
 *
 * 60/40 layout: form (left) + sticky live preview (right).
 * The live preview mirrors the PDF output so users see exactly
 * what the downloaded invoice will look like.
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
  Copy,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import {
  DashboardCard as Card,
  CardContent,
  CardHeader,
  CardTitle,
  DashboardButton as Button,
  MetricCard,
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { adminToast } from '@/lib/admin/toast';
import { SimplePDFGenerator } from '@/lib/admin/pdf-simple';
import { AdminStorage } from '@/lib/admin/storage';
import { ClientService } from '@/lib/admin/client-service';
import { InvoiceNumbering } from '@/lib/admin/invoice-numbering';
import { AGENCY_SERVICES, SERVICE_CATEGORIES } from '@/lib/admin/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InvoiceLineItem {
  id: string;
  serviceId?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  gstNumber?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  client: InvoiceClient;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Step completion helper
// ---------------------------------------------------------------------------

type StepId = 'client' | 'items' | 'review';

function getStepState(invoice: Invoice): Record<StepId, boolean> {
  return {
    client: !!invoice.client.name,
    items:
      invoice.lineItems.length > 0 &&
      invoice.lineItems.some(i => i.description.trim() !== '' && i.amount > 0),
    review: !!invoice.client.name && invoice.lineItems.some(i => i.amount > 0),
  };
}

const STEPS: { id: StepId; label: string }[] = [
  { id: 'client', label: 'Client' },
  { id: 'items', label: 'Items' },
  { id: 'review', label: 'Review' },
];

// ---------------------------------------------------------------------------
// Service categories for grouped dropdown
// ---------------------------------------------------------------------------

const grouped = AGENCY_SERVICES.reduce<Record<string, typeof AGENCY_SERVICES>>(
  (acc, svc) => {
    const cat = SERVICE_CATEGORIES[svc.category] || svc.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  },
  {},
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function InvoiceFormNew() {
  const [invoice, setInvoice] = useState<Invoice>(() => {
    const invoiceDate = new Date();
    return {
      id: `inv-${Date.now()}`,
      invoiceNumber: InvoiceNumbering.getInvoiceNumberForDate(invoiceDate),
      date: invoiceDate.toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      client: {
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      },
      lineItems: [
        {
          id: `item-${Date.now()}`,
          serviceId: '',
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ],
      subtotal: 0,
      taxRate: 18,
      taxAmount: 0,
      total: 0,
      notes:
        'Thank you for choosing Freaking Minds for your digital marketing needs.',
      terms:
        'Payment is due within 30 days of invoice date. Find details below -\n\nBank A/C: 50200046586390\nBank IFSC: HDFC0000062\nBranch - Arera Colony\n\nLate payments may incur additional charges.',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [clients, setClients] = useState<InvoiceClient[]>([]);
  const [pdfGenerator] = useState(() => new SimplePDFGenerator());
  const steps = getStepState(invoice);

  // ---- Load clients ----
  const loadClients = async () => {
    localStorage.removeItem('fm_admin_clients');
    setClients([]);
    try {
      const invoiceClients = await ClientService.getInvoiceClients();
      setClients(invoiceClients || []);
    } catch {
      setClients(AdminStorage.getClients() as InvoiceClient[]);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  // ---- Recalculate totals ----
  useEffect(() => {
    const subtotal = invoice.lineItems.reduce((s, i) => s + i.amount, 0);
    const taxAmount = (subtotal * invoice.taxRate) / 100;
    setInvoice(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
    }));
  }, [invoice.lineItems, invoice.taxRate]);

  // ---- Line item helpers ----
  const addLineItem = () =>
    setInvoice(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          id: `item-${Date.now()}`,
          serviceId: '',
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ],
    }));

  const duplicateLastItem = () => {
    const last = invoice.lineItems[invoice.lineItems.length - 1];
    if (!last) return addLineItem();
    setInvoice(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { ...last, id: `item-${Date.now()}` },
      ],
    }));
  };

  const removeLineItem = (id: string) =>
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(i => i.id !== id),
    }));

  const updateLineItem = (
    id: string,
    field: keyof InvoiceLineItem,
    value: string | number,
  ) =>
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate')
          updated.amount = updated.quantity * updated.rate;
        return updated;
      }),
    }));

  const selectService = (itemId: string, serviceId: string) => {
    const service = AGENCY_SERVICES.find(s => s.id === serviceId);
    if (!service) return;
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id !== itemId) return item;
        const rate = service.suggestedRate || 0;
        return {
          ...item,
          serviceId,
          description: service.description,
          rate,
          amount: item.quantity * rate,
        };
      }),
    }));
  };

  const selectClient = (clientId: string) => {
    const c = clients.find(cl => cl.id === clientId);
    if (c) setInvoice(prev => ({ ...prev, client: c }));
  };

  // ---- Save / Preview / Download ----
  const handleSave = () => {
    try {
      if (!invoice.id) invoice.id = `invoice-${Date.now()}`;
      if (!invoice.invoiceNumber || invoice.invoiceNumber.startsWith('INV-'))
        invoice.invoiceNumber = InvoiceNumbering.getNextInvoiceNumber();
      AdminStorage.saveInvoice(invoice);
      saveToAPI(invoice);
      adminToast.success('Invoice saved successfully!');
    } catch {
      adminToast.error('Error saving invoice. Please try again.');
    }
  };

  const saveToAPI = async (data: Invoice) => {
    try {
      await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // silent
    }
  };

  const handlePreview = async () => {
    if (!invoice.client.name) {
      adminToast.error('Please select a client before generating preview.');
      return;
    }
    if (!invoice.lineItems.some(i => i.description.trim())) {
      adminToast.error('Add at least one line item with a description.');
      return;
    }
    try {
      const uri = await pdfGenerator.generateInvoice(invoice);
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(
          `<html><body style="margin:0"><embed src="${uri}" width="100%" height="100%" type="application/pdf"></body></html>`,
        );
      } else {
        window.open(uri, '_blank');
      }
    } catch (err) {
      adminToast.error(
        `PDF preview error: ${err instanceof Error ? err.message : 'Unknown'}`,
      );
    }
  };

  const handleDownload = async () => {
    try {
      await pdfGenerator.downloadPDF(invoice);
    } catch {
      adminToast.error('Error downloading PDF.');
    }
  };

  // ---- Format helpers ----
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  // ---- Shared input class ----
  const inputCls =
    'w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500 bg-white text-fm-neutral-900';

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* ---- Step indicator ---- */}
      <div className="flex items-center gap-3 mb-6">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center gap-2">
            {idx > 0 && (
              <div className="w-8 h-px bg-fm-neutral-300" />
            )}
            <div className="flex items-center gap-1.5">
              {steps[step.id] ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Circle className="w-4 h-4 text-fm-neutral-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  steps[step.id]
                    ? 'text-fm-neutral-900'
                    : 'text-fm-neutral-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Main grid: 60/40 ---- */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* ===== LEFT COLUMN (3/5 = 60%) ===== */}
        <div className="xl:col-span-3 space-y-6">
          {/* Header actions card */}
          <Card variant="admin">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-fm-neutral-700">
                        Invoice #
                      </label>
                      <input
                        type="text"
                        value={invoice.invoiceNumber}
                        onChange={e => {
                          const v = e.target.value;
                          setInvoice(p => ({ ...p, invoiceNumber: v }));
                          if (InvoiceNumbering.isValidFormat(v))
                            InvoiceNumbering.updateFromManualInvoice(v);
                        }}
                        className="px-2 py-1 border border-fm-neutral-300 rounded text-sm font-semibold text-fm-neutral-900 w-32"
                        placeholder="FM164/2025"
                      />
                    </div>
                    <p className="text-sm text-fm-neutral-600">
                      Draft &middot; Created{' '}
                      {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-xs text-fm-neutral-500">
                      Next auto: {InvoiceNumbering.previewNextInvoiceNumber()}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    {invoice.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handlePreview}>
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="admin" size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client information */}
          <Card variant="admin">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-fm-magenta-600" />
                </div>
                <CardTitle>Client Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-fm-neutral-700">
                    Select Client
                  </label>
                  <button
                    onClick={loadClients}
                    className="text-fm-magenta-600 hover:text-fm-magenta-700 flex items-center text-sm"
                    type="button"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Refresh
                  </button>
                </div>
                <select
                  value={invoice.client.id}
                  onChange={e => selectClient(e.target.value)}
                  className={inputCls}
                >
                  <option value="">
                    Choose a client... ({clients.length} available)
                  </option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.email}
                    </option>
                  ))}
                </select>
              </div>

              {invoice.client.name && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-fm-neutral-200">
                  <InfoField label="Name" value={invoice.client.name} />
                  <InfoField label="Email" value={invoice.client.email} />
                  <InfoField label="Phone" value={invoice.client.phone} />
                  <InfoField
                    label="GST Number"
                    value={invoice.client.gstNumber}
                    fallback="Not provided"
                  />
                  <div className="md:col-span-2">
                    <InfoField
                      label="Address"
                      value={formatAddress(invoice.client)}
                      fallback="No address information"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice dates */}
          <Card variant="admin">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-fm-magenta-600" />
                </div>
                <CardTitle>Invoice Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoice.date}
                    onChange={e =>
                      setInvoice(p => ({ ...p, date: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={e =>
                      setInvoice(p => ({ ...p, dueDate: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line items */}
          <Card variant="admin">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-fm-magenta-600" />
                  </div>
                  <CardTitle>Services &amp; Items</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={duplicateLastItem}
                    title="Duplicate last item"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button variant="ghost" size="sm" onClick={addLineItem}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {invoice.lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg bg-white border-l-[3px] border-l-fm-magenta-500 border border-fm-neutral-200 shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Service selector with grouped options */}
                    <div>
                      <label className="block text-xs font-medium text-fm-neutral-600 mb-1">
                        Service Template (optional)
                      </label>
                      <select
                        value={item.serviceId || ''}
                        onChange={e => {
                          if (e.target.value)
                            selectService(item.id, e.target.value);
                          else updateLineItem(item.id, 'serviceId', '');
                        }}
                        className={inputCls}
                      >
                        <option value="">Custom entry...</option>
                        {Object.entries(grouped).map(([cat, services]) => (
                          <optgroup key={cat} label={cat}>
                            {services.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name} — ₹
                                {s.suggestedRate?.toLocaleString('en-IN')}/{s.unit}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-medium text-fm-neutral-600 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={e =>
                          updateLineItem(item.id, 'description', e.target.value)
                        }
                        placeholder="Describe the service or product..."
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    {/* Qty / Rate / Amount / Delete */}
                    <div className="grid grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-xs font-medium text-fm-neutral-600 mb-1">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e =>
                            updateLineItem(
                              item.id,
                              'quantity',
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-fm-neutral-600 mb-1">
                          Rate (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={e =>
                            updateLineItem(
                              item.id,
                              'rate',
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-fm-neutral-600 mb-1">
                          Amount
                        </label>
                        <div className="px-3 py-2 bg-fm-magenta-50 border border-fm-magenta-200 rounded-lg text-fm-neutral-900 font-semibold text-sm">
                          {fmt(item.amount)}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        {invoice.lineItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Additional info */}
          <Card variant="admin">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={invoice.notes}
                  onChange={e =>
                    setInvoice(p => ({ ...p, notes: e.target.value }))
                  }
                  className={`${inputCls} resize-none`}
                  placeholder="Any additional notes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Payment Terms
                </label>
                <textarea
                  rows={3}
                  value={invoice.terms}
                  onChange={e =>
                    setInvoice(p => ({ ...p, terms: e.target.value }))
                  }
                  className={`${inputCls} resize-none`}
                  placeholder="Payment terms and conditions..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== RIGHT COLUMN (2/5 = 40%) — Sticky ===== */}
        <div className="xl:col-span-2 space-y-6">
          {/* Summary metrics */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Subtotal"
              value={fmt(invoice.subtotal)}
              subtitle="Before taxes"
              icon={<Calculator className="w-6 h-6" />}
              variant="admin"
            />
            <MetricCard
              title="Total Amount"
              value={fmt(invoice.total)}
              subtitle={`Inc. ${fmt(invoice.taxAmount)} tax (${invoice.taxRate}% GST)`}
              icon={<CreditCard className="w-6 h-6" />}
              variant="admin"
            />
          </div>

          {/* Tax setting */}
          <Card variant="admin">
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={invoice.taxRate}
                onChange={e =>
                  setInvoice(p => ({
                    ...p,
                    taxRate: parseFloat(e.target.value) || 0,
                  }))
                }
                className={inputCls}
              />
              <p className="text-xs text-fm-neutral-500 mt-1">
                Tax Amount: {fmt(invoice.taxAmount)}
              </p>
            </CardContent>
          </Card>

          {/* ---- LIVE PREVIEW (mirrors PDF layout) ---- */}
          <div className="xl:sticky xl:top-4">
            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Live Preview</CardTitle>
                <p className="text-xs text-fm-neutral-500">
                  Matches the downloaded PDF
                </p>
              </CardHeader>
              <CardContent className="p-3">
                <InvoicePreview invoice={invoice} fmt={fmt} fmtDate={fmtDate} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ---- Sticky bottom action bar (mobile-friendly) ---- */}
      <div className="fixed bottom-0 left-0 right-0 xl:hidden bg-white border-t border-fm-neutral-200 p-3 flex items-center justify-between gap-2 shadow-lg"
        style={{ zIndex: 40 }}
      >
        <div className="text-sm font-semibold text-fm-neutral-900">
          Total: <span className="text-fm-magenta-600">{fmt(invoice.total)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="admin" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Sub-components
// ===========================================================================

/** Small label/value pair for client details */
function InfoField({
  label,
  value,
  fallback,
}: {
  label: string;
  value?: string;
  fallback?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-fm-neutral-500 mb-0.5">{label}</p>
      <p className="text-sm text-fm-neutral-900">
        {value || (
          <span className="text-fm-neutral-400 italic">{fallback || '—'}</span>
        )}
      </p>
    </div>
  );
}

/** Format client address into a single string */
function formatAddress(client: InvoiceClient): string {
  const parts: string[] = [];
  if (client.address) parts.push(client.address);
  const cityState = [client.city, client.state].filter(Boolean).join(', ');
  if (cityState) parts.push(cityState);
  if (client.zipCode) parts[parts.length - 1] += ` ${client.zipCode}`;
  if (client.country && client.country !== 'India') parts.push(client.country);
  return parts.join(', ');
}

// ===========================================================================
// Live Preview — mirrors the PDF design
// ===========================================================================

function InvoicePreview({
  invoice,
  fmt,
  fmtDate,
}: {
  invoice: Invoice;
  fmt: (n: number) => string;
  fmtDate: (d: string) => string;
}) {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden text-[10px] leading-snug shadow-inner border border-fm-neutral-200"
      style={{ aspectRatio: '210 / 297', maxHeight: 540, overflowY: 'auto' }}
    >
      {/* ---- Header: purple band + magenta accent ---- */}
      <div className="h-3" style={{ background: '#4a1942' }} />
      <div className="h-0.5" style={{ background: '#c9325d' }} />

      {/* Company info */}
      <div className="px-4 pt-3 pb-2 flex justify-between items-start">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="FM"
            className="h-8 w-auto object-contain rounded"
          />
          <div>
            <p className="font-bold text-[13px] text-fm-neutral-900 leading-none">
              FREAKING MINDS
            </p>
            <p
              className="text-[6px] tracking-[0.2em] mt-0.5"
              style={{ color: '#c9325d' }}
            >
              CREATIVE MARKETING AGENCY
            </p>
          </div>
        </div>
        <div className="text-right text-[7px] text-fm-neutral-500 space-y-0.5">
          <p>freakingmindsdigital@gmail.com</p>
          <p>+91 98332 57659</p>
          <p>www.freakingminds.in</p>
        </div>
      </div>

      {/* ---- Invoice meta line ---- */}
      <div className="mx-4 border-t" style={{ borderColor: '#c9325d' }} />
      <div className="px-4 py-1.5 flex justify-between items-baseline">
        <p className="font-bold text-[14px] text-fm-neutral-900">INVOICE</p>
        <p className="font-bold text-[11px]" style={{ color: '#c9325d' }}>
          #{invoice.invoiceNumber}
        </p>
      </div>
      <div className="mx-4 border-t border-fm-neutral-200" />

      {/* ---- Client + Dates ---- */}
      <div className="px-4 pt-2 pb-1 flex justify-between">
        <div>
          <p
            className="text-[7px] font-bold tracking-[0.15em] mb-1"
            style={{ color: '#c9325d' }}
          >
            BILL TO
          </p>
          {invoice.client.name ? (
            <>
              <p className="font-bold text-[10px] text-fm-neutral-900">
                {invoice.client.name}
              </p>
              {invoice.client.email && (
                <p className="text-fm-neutral-500">{invoice.client.email}</p>
              )}
              {invoice.client.phone && (
                <p className="text-fm-neutral-500">{invoice.client.phone}</p>
              )}
              {invoice.client.gstNumber && (
                <p className="text-fm-neutral-700 font-medium">
                  GST: {invoice.client.gstNumber}
                </p>
              )}
            </>
          ) : (
            <p className="text-fm-neutral-400 italic">No client selected</p>
          )}
        </div>
        <div className="text-right">
          <p
            className="text-[7px] font-bold tracking-[0.12em]"
            style={{ color: '#c9325d' }}
          >
            INVOICE DATE
          </p>
          <p className="font-medium text-fm-neutral-900 mb-1">
            {fmtDate(invoice.date)}
          </p>
          <p
            className="text-[7px] font-bold tracking-[0.12em]"
            style={{ color: '#c9325d' }}
          >
            DUE DATE
          </p>
          <p className="font-medium text-fm-neutral-900">
            {fmtDate(invoice.dueDate)}
          </p>
        </div>
      </div>

      {/* ---- Items table ---- */}
      <div className="px-4 pt-2">
        <table className="w-full">
          <thead>
            <tr
              className="text-white text-[8px]"
              style={{ background: '#4a1942' }}
            >
              <th className="text-left py-1 px-1.5 font-semibold">
                Description
              </th>
              <th className="text-center py-1 px-1 font-semibold w-8">Qty</th>
              <th className="text-right py-1 px-1 font-semibold w-14">Rate</th>
              <th className="text-right py-1 px-1.5 font-semibold w-16">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, i) => (
              <tr
                key={item.id}
                className="border-b border-fm-neutral-100"
                style={{
                  background: i % 2 === 1 ? '#fcf5f8' : 'white',
                  borderLeft: '2px solid #c9325d',
                }}
              >
                <td className="py-1 px-1.5">
                  {item.description || (
                    <span className="text-fm-neutral-400 italic">
                      Description...
                    </span>
                  )}
                </td>
                <td className="text-center py-1 px-1">{item.quantity}</td>
                <td className="text-right py-1 px-1">{fmt(item.rate)}</td>
                <td className="text-right py-1 px-1.5 font-semibold">
                  {fmt(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- Totals ---- */}
      <div className="px-4 pt-2">
        <div className="flex justify-end text-[9px] mb-0.5">
          <span className="text-fm-neutral-500 mr-4">Subtotal</span>
          <span className="font-medium text-fm-neutral-900 w-16 text-right">
            {fmt(invoice.subtotal)}
          </span>
        </div>
        <div className="flex justify-end text-[9px] mb-1">
          <span className="text-fm-neutral-500 mr-4">
            GST ({invoice.taxRate}%)
          </span>
          <span className="font-medium text-fm-neutral-900 w-16 text-right">
            {fmt(invoice.taxAmount)}
          </span>
        </div>

        {/* Magenta total ribbon */}
        <div
          className="flex justify-between items-center px-2 py-1.5 rounded-sm text-white"
          style={{ background: '#c9325d' }}
        >
          <span className="font-bold text-[11px]">TOTAL</span>
          <span className="font-bold text-[11px]">{fmt(invoice.total)}</span>
        </div>
      </div>

      {/* ---- Footer ---- */}
      <div className="px-4 pt-2 pb-1">
        <div className="border-t border-fm-neutral-200 pt-1">
          <p className="text-[7px] text-fm-neutral-500">
            GST: 23BQNPM3447F1ZT &middot; MSME: UDYAM-MP-10-0032670
          </p>
          <p className="text-[8px] italic text-fm-neutral-600 mt-0.5">
            Thank you for your business!
          </p>
        </div>
      </div>

      {/* Bottom bars: magenta + purple (mirror header) */}
      <div className="mt-auto">
        <div className="h-0.5" style={{ background: '#c9325d' }} />
        <div className="h-2" style={{ background: '#4a1942' }} />
      </div>
    </div>
  );
}
