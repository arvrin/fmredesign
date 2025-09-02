/**
 * Professional Invoice Form - Redesigned
 * Modern, responsive invoice creation using FreakingMinds design system
 */

'use client';

import { useState, useEffect, useRef } from 'react';
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
  RefreshCw
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
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SimplePDFGenerator } from '@/lib/admin/pdf-simple';
import { AdminStorage } from '@/lib/admin/storage';
import { ClientService } from '@/lib/admin/client-service';
import { InvoiceNumbering } from '@/lib/admin/invoice-numbering';
import { AGENCY_SERVICES, AgencyService } from '@/lib/admin/types';

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

export function InvoiceFormNew() {
  const [invoice, setInvoice] = useState<Invoice>(() => {
    const invoiceDate = new Date();
    return {
      id: `inv-${Date.now()}`,
      invoiceNumber: InvoiceNumbering.getInvoiceNumberForDate(invoiceDate),
      date: invoiceDate.toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      client: {
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      lineItems: [{
        id: `item-${Date.now()}`,
        serviceId: '',
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }],
      subtotal: 0,
      taxRate: 18,
      taxAmount: 0,
      total: 0,
      notes: 'Thank you for choosing Freaking Minds for your digital marketing needs.',
      terms: 'Payment is due within 30 days of invoice date. Find details below -\n\nBank A/C: 50200046586390\nBank IFSC: HDFC0000062\nBranch - Arera Colony\n\nLate payments may incur additional charges.',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  const [clients, setClients] = useState<InvoiceClient[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfGenerator] = useState(() => new SimplePDFGenerator());

  // Load clients from multiple sources with proper fallbacks
  // Function to dump raw localStorage data
  const dumpClientData = () => {
    try {
      // Check all possible localStorage keys
      const keys = ['fm_admin_clients', 'fm_clients', 'fm_client_data'];
      keys.forEach(key => {
        const data = localStorage.getItem(key);
      });
      
      // Focus on HARSH client
      const rawData = localStorage.getItem('fm_admin_clients');
      if (rawData) {
        const parsedData = JSON.parse(rawData);
        const harshClient = parsedData.find((c: any) => 
          c.name && (c.name.includes('HARSH') || c.name.includes('harsh'))
        );
        
        if (harshClient) {
          
          if (harshClient.headquarters) {
          }
        } else {
        }
      }
    } catch (error) {
      console.error('Error in data dump:', error);
    }
  };

  const loadClients = async () => {
    // Clear localStorage cache to ensure fresh data
    localStorage.removeItem('fm_admin_clients');
    setClients([]); // Clear current clients
    
    try {
      // Use ClientService.getInvoiceClients() which handles both API and localStorage properly
      const invoiceClients = await ClientService.getInvoiceClients();
      
      // Filter for HARSH client specifically to debug
      const harshClient = invoiceClients?.find(c => 
        c.name && c.name.includes('HARSH')
      );
      
      if (harshClient) {
      } else {
      }

      setClients(invoiceClients || []);
    } catch (error) {
      console.error('InvoiceFormNew: Error loading clients:', error);
      // Fallback to localStorage only
      setClients(AdminStorage.getClients());
    }
  };
  
  useEffect(() => {
    loadClients();
  }, []);

  // Calculate totals whenever line items or tax rate changes
  useEffect(() => {
    const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * invoice.taxRate) / 100;
    const total = subtotal + taxAmount;

    setInvoice(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  }, [invoice.lineItems, invoice.taxRate]);

  const addLineItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item-${Date.now()}`,
      serviceId: '',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };

    setInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }));
  };

  const removeLineItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate amount
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const selectService = (itemId: string, serviceId: string) => {
    const service = AGENCY_SERVICES.find(s => s.id === serviceId);
    if (service) {
      setInvoice(prev => ({
        ...prev,
        lineItems: prev.lineItems.map(item => {
          if (item.id === itemId) {
            const updated = {
              ...item,
              serviceId: serviceId,
              description: service.description,
              rate: service.suggestedRate || 0
            };
            updated.amount = updated.quantity * updated.rate;
            return updated;
          }
          return item;
        })
      }));
    }
  };

  const selectClient = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);
    
    const clientData = {
      address: selectedClient?.address,
      city: selectedClient?.city,
      state: selectedClient?.state,
      zipCode: selectedClient?.zipCode,
      country: selectedClient?.country,
      gstNumber: selectedClient?.gstNumber
    };
    
    if (selectedClient) {
      setInvoice(prev => ({
        ...prev,
        client: selectedClient
      }));
    }
  };

  const handleSave = () => {
    try {
      // Generate invoice ID if not present
      if (!invoice.id) {
        invoice.id = `invoice-${Date.now()}`;
      }

      // Generate invoice number if not present
      if (!invoice.invoiceNumber || invoice.invoiceNumber.startsWith('INV-')) {
        invoice.invoiceNumber = InvoiceNumbering.getNextInvoiceNumber();
      }

      // Save to localStorage
      AdminStorage.saveInvoice(invoice);
      
      // Also save via API for Google Sheets sync
      saveToAPI(invoice);
      
      alert('Invoice saved successfully!');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice. Please try again.');
    }
  };

  const saveToAPI = async (invoiceData: any) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });
      
      if (response.ok) {
      }
    } catch (error) {
    }
  };

  const handlePreview = async () => {
    try {
      // Basic validation
      if (!invoice.client.name) {
        alert('Please select a client before generating preview.');
        return;
      }
      
      if (invoice.lineItems.length === 0 || !invoice.lineItems.some(item => item.description.trim())) {
        alert('Please add at least one line item with description.');
        return;
      }

      const pdfDataUri = await pdfGenerator.generateInvoice(invoice);
      
      // Try different approaches for opening PDF
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <body style="margin:0;padding:0;">
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
      await pdfGenerator.downloadPDF(invoice);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please check the console for details.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column - Invoice Form */}
        <div className="space-y-6">
          {/* Header Actions */}
          <Card variant="admin">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">Invoice #</label>
                      <input
                        type="text"
                        value={invoice.invoiceNumber}
                        onChange={(e) => {
                          const newNumber = e.target.value;
                          setInvoice(prev => ({ ...prev, invoiceNumber: newNumber }));
                          
                          // Update counter if valid format
                          if (InvoiceNumbering.isValidFormat(newNumber)) {
                            InvoiceNumbering.updateFromManualInvoice(newNumber);
                          }
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm font-semibold text-gray-900 w-32"
                        placeholder="FM164/2025"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Draft • Created {new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">Next auto: {InvoiceNumbering.previewNextInvoiceNumber()}</p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {invoice.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handlePreview}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="admin" size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card variant="admin">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-fm-magenta-600" />
                <CardTitle>Client Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Client Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Client
                  </label>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={dumpClientData}
                      className="text-fm-blue-600 hover:text-fm-blue-700 text-xs px-2 py-1 bg-blue-50 rounded"
                      type="button"
                    >
                      Debug
                    </button>
                    <button
                      onClick={() => {
                        loadClients();
                      }}
                      className="text-fm-green-600 hover:text-fm-green-700 text-xs px-2 py-1 bg-green-50 rounded"
                      type="button"
                    >
                      Reload
                    </button>
                    <button
                      onClick={loadClients}
                      className="text-fm-magenta-600 hover:text-fm-magenta-700 flex items-center text-sm"
                      type="button"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Refresh
                    </button>
                  </div>
                </div>
                <select
                  value={invoice.client.id}
                  onChange={(e) => selectClient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                >
                  <option value="">Choose a client... ({clients.length} available)</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Details Grid */}
              {invoice.client.name && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{invoice.client.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{invoice.client.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-900">{invoice.client.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">GST Number</p>
                    <p className="text-gray-900">
                      {invoice.client.gstNumber || (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-gray-900">
                      {invoice.client.address && (
                        <>
                          {invoice.client.address}
                          <br />
                        </>
                      )}
                      {invoice.client.city && invoice.client.state ? 
                        `${invoice.client.city}, ${invoice.client.state}` : 
                        (invoice.client.city || invoice.client.state)
                      }
                      {invoice.client.zipCode && ` ${invoice.client.zipCode}`}
                      {invoice.client.country && invoice.client.country !== 'India' && (
                        <>
                          <br />
                          {invoice.client.country}
                        </>
                      )}
                      {!invoice.client.address && !invoice.client.city && !invoice.client.state && (
                        <span className="text-gray-400 italic">No address information available</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card variant="admin">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-fm-magenta-600" />
                <CardTitle>Invoice Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoice.date}
                    onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card variant="admin">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-fm-magenta-600" />
                  <CardTitle>Services & Items</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={addLineItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {invoice.lineItems.map((item, index) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="space-y-4">
                    {/* Service Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Service (Optional)
                      </label>
                      <select
                        value={item.serviceId || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            selectService(item.id, e.target.value);
                          } else {
                            updateLineItem(item.id, 'serviceId', '');
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                      >
                        <option value="">Choose a service or enter custom details below...</option>
                        {AGENCY_SERVICES.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name} - ₹{service.suggestedRate?.toLocaleString('en-IN')} per {service.unit}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        placeholder="Describe the service or product..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500 resize-none"
                      />
                    </div>

                    {/* Quantity, Rate, Amount */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rate (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount (₹)
                        </label>
                        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 font-medium">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div>
                        {invoice.lineItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

          {/* Additional Details */}
          <Card variant="admin">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={invoice.notes}
                  onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500 resize-none"
                  placeholder="Any additional notes or information..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <textarea
                  rows={3}
                  value={invoice.terms}
                  onChange={(e) => setInvoice(prev => ({ ...prev, terms: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500 resize-none"
                  placeholder="Payment terms and conditions..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Invoice Summary & Preview */}
        <div className="space-y-6">
          {/* Invoice Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard
              title="Subtotal"
              value={`₹${invoice.subtotal.toLocaleString('en-IN')}`}
              subtitle="Before taxes"
              icon={<Calculator className="w-6 h-6" />}
              variant="admin"
            />
            <MetricCard
              title="Total Amount"
              value={`₹${invoice.total.toLocaleString('en-IN')}`}
              subtitle={`Inc. ₹${invoice.taxAmount.toLocaleString('en-IN')} tax (${invoice.taxRate}% GST)`}
              icon={<CreditCard className="w-6 h-6" />}
              variant="admin"
            />
          </div>

          {/* Tax Settings */}
          <Card variant="admin">
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={invoice.taxRate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tax Amount: ₹{invoice.taxAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Preview */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>This is how your invoice will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-sm">
                {/* Preview Header */}
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
                        <p className="text-xs text-gray-600">Creative Digital Agency</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h4 className="text-lg font-bold">INVOICE</h4>
                      <p className="text-gray-600">#{invoice.invoiceNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Preview Client Info */}
                {invoice.client.name && (
                  <div className="mb-4">
                    <p className="font-semibold text-gray-900">{invoice.client.name}</p>
                    <p className="text-gray-600">{invoice.client.email}</p>
                    <div className="text-gray-600">
                      {invoice.client.address && <p>{invoice.client.address}</p>}
                      <p>
                        {invoice.client.city && invoice.client.state ? 
                          `${invoice.client.city}, ${invoice.client.state}` : 
                          (invoice.client.city || invoice.client.state)
                        }
                        {invoice.client.zipCode && ` ${invoice.client.zipCode}`}
                      </p>
                      {invoice.client.country && invoice.client.country !== 'India' && (
                        <p>{invoice.client.country}</p>
                      )}
                      {invoice.client.gstNumber && (
                        <p><strong>GST:</strong> {invoice.client.gstNumber}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Preview Dates */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                  <div>
                    <p className="font-medium">Invoice Date:</p>
                    <p>{new Date(invoice.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Due Date:</p>
                    <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Preview Items */}
                <div className="border-t pt-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Rate</th>
                        <th className="text-right py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lineItems.map(item => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2">{item.description || 'Service description...'}</td>
                          <td className="text-right py-2">{item.quantity}</td>
                          <td className="text-right py-2">₹{item.rate.toLocaleString('en-IN')}</td>
                          <td className="text-right py-2 font-medium">₹{item.amount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Preview Totals */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST ({invoice.taxRate}%):</span>
                      <span>₹{invoice.taxAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-fm-magenta-600">₹{invoice.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}