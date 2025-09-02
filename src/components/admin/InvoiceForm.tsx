/**
 * Invoice Form Component
 * Professional invoice creation form matching Numbers template style
 */

'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Save, Eye, ChevronDown } from 'lucide-react';
import { LinkButton } from '@/design-system';
import { Invoice, InvoiceLineItem, InvoiceClient, InvoiceUtils, AGENCY_SERVICES, AgencyService, SERVICE_CATEGORIES } from '@/lib/admin/types';
import { AdminStorage } from '@/lib/admin/storage';
import { InvoicePDF } from '@/lib/admin/pdf';
import { ClientService } from '@/lib/admin/client-service';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSave?: (invoice: Invoice) => void;
  onCancel?: () => void;
}

export function InvoiceForm({ invoice, onSave, onCancel }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Invoice>(() => {
    if (invoice) return invoice;
    
    return {
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber: InvoiceUtils.generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
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
      lineItems: [InvoiceUtils.createEmptyLineItem()],
      subtotal: 0,
      taxRate: 18, // Default GST rate in India
      taxAmount: 0,
      total: 0,
      notes: 'Thank you for choosing Freaking Minds for your digital marketing needs. We look forward to continuing our partnership.',
      terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges. Payment can be made via bank transfer, UPI, or cheque.',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [clients, setClients] = useState<InvoiceClient[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const invoiceClients = await ClientService.getInvoiceClients();
        setClients(invoiceClients);
      } catch (error) {
        console.error('InvoiceForm: Error loading clients:', error);
        // Fallback to localStorage clients
        const localClients = AdminStorage.getClients();
        setClients(localClients);
      }
    };
    
    loadClients();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [formData.lineItems, formData.taxRate]);

  const calculateTotals = () => {
    const totals = InvoiceUtils.calculateTotals(formData.lineItems, formData.taxRate);
    setFormData(prev => ({
      ...prev,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      total: totals.total,
    }));
  };

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);
    
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        client: selectedClient,
      }));
    } else {
      console.warn('InvoiceForm: Client not found for ID:', clientId);
    }
  };

  const handleLineItemChange = (index: number, field: keyof InvoiceLineItem, value: string | number) => {
    const updatedItems = [...formData.lineItems];
    const item = { ...updatedItems[index] };
    
    // Handle different field types properly
    if (field === 'quantity' || field === 'rate') {
      // For number fields, ensure we have a valid number
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      (item as any)[field] = isNaN(numValue) ? 0 : numValue;
    } else {
      // For string fields like description
      (item as any)[field] = value;
    }
    
    // Recalculate amount when quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      item.amount = InvoiceUtils.calculateLineItemAmount(item.quantity, item.rate);
    }
    
    updatedItems[index] = item;
    setFormData(prev => ({
      ...prev,
      lineItems: updatedItems,
    }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, InvoiceUtils.createEmptyLineItem()],
    }));
  };

  const removeLineItem = (index: number) => {
    if (formData.lineItems.length > 1) {
      const updatedItems = formData.lineItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        lineItems: updatedItems,
      }));
    }
  };

  const handleServiceSelect = (index: number, serviceId: string) => {
    if (serviceId === '') {
      // Clear selection
      handleLineItemChange(index, 'description', '');
      return;
    }

    const selectedService = AGENCY_SERVICES.find(s => s.id === serviceId);
    if (selectedService) {
      // Update description
      handleLineItemChange(index, 'description', selectedService.description);
      
      // Set suggested rate if available
      if (selectedService.suggestedRate) {
        handleLineItemChange(index, 'rate', selectedService.suggestedRate);
      }
      
      // Set default quantity to 1 if it's 0
      if (formData.lineItems[index].quantity === 0) {
        handleLineItemChange(index, 'quantity', 1);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.client.name) {
      newErrors.client = 'Client is required';
    }

    if (formData.lineItems.length === 0) {
      newErrors.lineItems = 'At least one line item is required';
    }

    formData.lineItems.forEach((item, index) => {
      if (!item.description) {
        newErrors[`lineItem${index}Description`] = 'Description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`lineItem${index}Quantity`] = 'Quantity must be greater than 0';
      }
      if (item.rate <= 0) {
        newErrors[`lineItem${index}Rate`] = 'Rate must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    
    try {
      const updatedInvoice = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      // Save to Google Sheets via API
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedInvoice,
          clientId: updatedInvoice.client.id,
          clientName: updatedInvoice.client.name,
          lineItems: updatedInvoice.lineItems,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Also save locally as backup
        AdminStorage.saveInvoice(updatedInvoice);
        
        if (onSave) {
          onSave(updatedInvoice);
        }
        
        alert('Invoice saved successfully to Google Sheets!');
      } else {
        throw new Error(result.error || 'Failed to save invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving to Google Sheets. Saving locally as fallback.');
      
      // Fallback to local storage
      try {
        AdminStorage.saveInvoice({
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        
        if (onSave) {
          onSave(formData);
        }
      } catch (localError) {
        console.error('Local save also failed:', localError);
        alert('Failed to save invoice. Please try again.');
      }
    }
    
    setIsSaving(false);
  };

  const handleDownloadPDF = () => {
    if (!validateForm()) return;
    
    const pdfGenerator = new InvoicePDF();
    pdfGenerator.downloadPDF(formData);
  };

  const handlePreviewPDF = () => {
    if (!validateForm()) return;
    
    try {
      const pdfGenerator = new InvoicePDF();
      const dataUri = pdfGenerator.generateInvoice(formData);
      
      if (!dataUri) {
        alert('Error generating PDF preview');
        return;
      }
      
      // Open PDF in new tab
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Invoice Preview - ${formData.invoiceNumber}</title>
              <style>
                body { margin: 0; padding: 0; }
                iframe { width: 100%; height: 100vh; border: none; }
              </style>
            </head>
            <body>
              <iframe src="${dataUri}"></iframe>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        alert('Please allow popups to preview the invoice');
      }
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      alert('Error generating PDF preview. Check the console for details.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Quick Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm font-medium text-fm-neutral-600">Invoice:</span>
              <span className="text-sm font-bold text-fm-magenta-700 ml-1">{formData.invoiceNumber}</span>
            </div>
            <div className="text-sm text-fm-neutral-500">
              {formData.client.name || 'No client selected'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LinkButton
              variant="ghost"
              size="sm"
              icon={<Eye className="h-4 w-4" />}
              iconPosition="left"
              onClick={handlePreviewPDF}
            >
              Preview
            </LinkButton>
            <LinkButton
              variant="outline"
              size="sm"
              icon={<Download className="h-4 w-4" />}
              iconPosition="left"
              onClick={handleDownloadPDF}
            >
              Download
            </LinkButton>
            <LinkButton
              variant="primary"
              size="sm"
              icon={<Save className="h-4 w-4" />}
              iconPosition="left"
              onClick={handleSave}
              className={isSaving ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </LinkButton>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-fm-neutral-900 mb-6">Invoice Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Invoice Number */}
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Invoice Number
            </label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            />
          </div>

          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Client *
            </label>
            <select
              value={formData.client.id}
              onChange={(e) => handleClientChange(e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.client && (
              <p className="mt-1 text-sm text-red-600">{errors.client}</p>
            )}
          </div>

          {/* Invoice Date */}
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Invoice Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-fm-neutral-900">Line Items</h2>
          <LinkButton
            size="sm"
            variant="outline"
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
            onClick={addLineItem}
          >
            Add Item
          </LinkButton>
        </div>

        <div className="space-y-6">
          {formData.lineItems.map((item, index) => (
            <div key={item.id} className="bg-fm-neutral-50 p-4 rounded-lg border border-fm-neutral-200">
              {/* Service Selection Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Select Service (Optional)
                </label>
                <div className="relative">
                  <select
                    onChange={(e) => handleServiceSelect(index, e.target.value)}
                    className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent appearance-none bg-white pr-8"
                  >
                    <option value="">Choose from common services...</option>
                    {Object.entries(SERVICE_CATEGORIES).map(([key, label]) => (
                      <optgroup key={key} label={label}>
                        {AGENCY_SERVICES.filter(service => service.category === key).map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name} {service.suggestedRate ? `(₹${service.suggestedRate.toLocaleString('en-IN')}/${service.unit})` : ''}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-fm-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Mobile-first responsive layout */}
              <div className="space-y-4">
                {/* Description - Full Width */}
                <div>
                  <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Digital Marketing Campaign, Website Development, Social Media Management"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent resize-none"
                  />
                  {errors[`lineItem${index}Description`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`lineItem${index}Description`]}</p>
                  )}
                </div>

                {/* Quantity, Rate, Amount - Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      placeholder="1"
                      min="0"
                      step="0.01"
                      value={item.quantity || ''}
                      onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
                    />
                    {errors[`lineItem${index}Quantity`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`lineItem${index}Quantity`]}</p>
                    )}
                  </div>

                  {/* Rate */}
                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Rate (₹) *
                    </label>
                    <input
                      type="number"
                      placeholder="10000"
                      min="0"
                      step="0.01"
                      value={item.rate || ''}
                      onChange={(e) => handleLineItemChange(index, 'rate', e.target.value)}
                      className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
                    />
                    {errors[`lineItem${index}Rate`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`lineItem${index}Rate`]}</p>
                    )}
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                      Amount
                    </label>
                    <div className="px-3 py-2 bg-white border border-fm-neutral-200 rounded-lg text-right font-semibold text-fm-magenta-700 text-lg">
                      {InvoiceUtils.formatCurrency(item.amount)}
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                {formData.lineItems.length > 1 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-fm-neutral-500 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Item
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-fm-neutral-900 mb-6">Totals</h2>
        
        <div className="max-w-md ml-auto space-y-4">
          {/* Tax Rate */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-fm-neutral-700">
              Tax Rate (%)
            </label>
            <div className="w-24">
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.taxRate}
                onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent text-right"
              />
            </div>
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-fm-neutral-700">Subtotal</span>
            <span className="font-medium text-fm-neutral-900">
              {InvoiceUtils.formatCurrency(formData.subtotal)}
            </span>
          </div>

          {/* Tax Amount */}
          {formData.taxRate > 0 && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-fm-neutral-700">
                Tax ({formData.taxRate}%)
              </span>
              <span className="font-medium text-fm-neutral-900">
                {InvoiceUtils.formatCurrency(formData.taxAmount)}
              </span>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-fm-neutral-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-fm-neutral-900">Total</span>
              <span className="text-xl font-bold text-fm-magenta-700">
                {InvoiceUtils.formatCurrency(formData.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-fm-neutral-900 mb-6">Additional Information</h2>
        
        <div className="space-y-6">
          {/* Terms */}
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Terms & Conditions
            </label>
            <textarea
              rows={3}
              value={formData.terms}
              onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
              placeholder="Payment terms, conditions, etc."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
              placeholder="Additional notes for the client"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
        {onCancel && (
          <LinkButton variant="ghost" onClick={onCancel}>
            Cancel
          </LinkButton>
        )}
        <LinkButton
          variant="outline"
          icon={<Download className="h-4 w-4" />}
          iconPosition="left"
          onClick={handleDownloadPDF}
        >
          Download PDF
        </LinkButton>
        <LinkButton
          variant="primary"
          icon={<Save className="h-4 w-4" />}
          iconPosition="left"
          onClick={handleSave}
          className={isSaving ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {isSaving ? 'Saving Invoice...' : 'Save Invoice'}
        </LinkButton>
      </div>
    </div>
  );
}