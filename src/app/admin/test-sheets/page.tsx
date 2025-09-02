/**
 * Google Sheets Integration Test Page
 * Test the Google Sheets integration functionality
 */

'use client';

import { useState } from 'react';
import { DashboardButton as Button } from '@/design-system';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function TestSheetsPage() {
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'error' | 'testing'>>({
    initialize: 'pending',
    clientCreate: 'pending',
    clientRead: 'pending',
    invoiceCreate: 'pending',
    invoiceRead: 'pending'
  });
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const updateTestResult = (test: string, result: 'success' | 'error' | 'testing') => {
    setTestResults(prev => ({ ...prev, [test]: result }));
  };

  const testInitializeSheets = async () => {
    updateTestResult('initialize', 'testing');
    addLog('Testing Google Sheets initialization...');
    
    try {
      const response = await fetch('/api/sheets/initialize', {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        updateTestResult('initialize', 'success');
        addLog('✅ Google Sheets initialized successfully');
      } else {
        updateTestResult('initialize', 'error');
        addLog(`❌ Failed to initialize: ${result.error}`);
      }
    } catch (error) {
      updateTestResult('initialize', 'error');
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const testCreateClient = async () => {
    updateTestResult('clientCreate', 'testing');
    addLog('Testing client creation...');
    
    try {
      const testClient = {
        name: 'Test Client ' + Date.now(),
        email: 'test@example.com',
        phone: '+91 9876543210',
        company: 'Test Company',
        industry: 'Technology'
      };

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testClient),
      });
      
      const result = await response.json();
      
      if (result.success) {
        updateTestResult('clientCreate', 'success');
        addLog(`✅ Client created successfully: ${result.data.name}`);
      } else {
        updateTestResult('clientCreate', 'error');
        addLog(`❌ Failed to create client: ${result.error}`);
      }
    } catch (error) {
      updateTestResult('clientCreate', 'error');
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const testReadClients = async () => {
    updateTestResult('clientRead', 'testing');
    addLog('Testing client reading...');
    
    try {
      const response = await fetch('/api/clients');
      const result = await response.json();
      
      if (result.success) {
        updateTestResult('clientRead', 'success');
        addLog(`✅ Clients read successfully: ${result.data.length} clients found`);
      } else {
        updateTestResult('clientRead', 'error');
        addLog(`❌ Failed to read clients: ${result.error}`);
      }
    } catch (error) {
      updateTestResult('clientRead', 'error');
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const testCreateInvoice = async () => {
    updateTestResult('invoiceCreate', 'testing');
    addLog('Testing invoice creation...');
    
    try {
      const testInvoice = {
        clientId: 'test-client-001',
        clientName: 'Test Client',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subtotal: 10000,
        tax: 1800,
        total: 11800,
        status: 'draft',
        lineItems: [
          {
            description: 'Test Service',
            quantity: 1,
            rate: 10000,
            amount: 10000
          }
        ],
        notes: 'Test invoice created by automated test'
      };

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testInvoice),
      });
      
      const result = await response.json();
      
      if (result.success) {
        updateTestResult('invoiceCreate', 'success');
        addLog(`✅ Invoice created successfully: ${result.data.invoiceNumber}`);
      } else {
        updateTestResult('invoiceCreate', 'error');
        addLog(`❌ Failed to create invoice: ${result.error}`);
      }
    } catch (error) {
      updateTestResult('invoiceCreate', 'error');
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const testReadInvoices = async () => {
    updateTestResult('invoiceRead', 'testing');
    addLog('Testing invoice reading...');
    
    try {
      const response = await fetch('/api/invoices');
      const result = await response.json();
      
      if (result.success) {
        updateTestResult('invoiceRead', 'success');
        addLog(`✅ Invoices read successfully: ${result.data.length} invoices found`);
      } else {
        updateTestResult('invoiceRead', 'error');
        addLog(`❌ Failed to read invoices: ${result.error}`);
      }
    } catch (error) {
      updateTestResult('invoiceRead', 'error');
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const runAllTests = async () => {
    addLog('🚀 Starting complete test suite...');
    
    await testInitializeSheets();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    await testCreateClient();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testReadClients();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testCreateInvoice();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testReadInvoices();
    
    addLog('🎉 Test suite completed!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'testing': return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setTestResults({
      initialize: 'pending',
      clientCreate: 'pending',
      clientRead: 'pending',
      invoiceCreate: 'pending',
      invoiceRead: 'pending'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-fm-neutral-900">Google Sheets Integration Tests</h1>
            <p className="text-fm-neutral-600 mt-1">
              Test the Google Sheets database integration functionality
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="admin-outline" onClick={clearLogs}>
              Clear Logs
            </Button>
            <Button variant="admin" onClick={runAllTests}>
              Run All Tests
            </Button>
          </div>
        </div>

        {/* Individual Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button 
            variant="admin-outline" 
            onClick={testInitializeSheets}
            disabled={testResults.initialize === 'testing'}
            className="flex items-center justify-center space-x-2"
          >
            {getStatusIcon(testResults.initialize)}
            <span>Initialize Sheets</span>
          </Button>
          
          <Button 
            variant="admin-outline" 
            onClick={testCreateClient}
            disabled={testResults.clientCreate === 'testing'}
            className="flex items-center justify-center space-x-2"
          >
            {getStatusIcon(testResults.clientCreate)}
            <span>Create Client</span>
          </Button>
          
          <Button 
            variant="admin-outline" 
            onClick={testReadClients}
            disabled={testResults.clientRead === 'testing'}
            className="flex items-center justify-center space-x-2"
          >
            {getStatusIcon(testResults.clientRead)}
            <span>Read Clients</span>
          </Button>
          
          <Button 
            variant="admin-outline" 
            onClick={testCreateInvoice}
            disabled={testResults.invoiceCreate === 'testing'}
            className="flex items-center justify-center space-x-2"
          >
            {getStatusIcon(testResults.invoiceCreate)}
            <span>Create Invoice</span>
          </Button>
          
          <Button 
            variant="admin-outline" 
            onClick={testReadInvoices}
            disabled={testResults.invoiceRead === 'testing'}
            className="flex items-center justify-center space-x-2"
          >
            {getStatusIcon(testResults.invoiceRead)}
            <span>Read Invoices</span>
          </Button>
        </div>

        {/* Test Results Summary */}
        <div className="bg-fm-neutral-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-fm-neutral-900 mb-3">Test Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(testResults).map(([test, status]) => (
              <div key={test} className="flex items-center justify-between">
                <span className="text-sm text-fm-neutral-700 capitalize">
                  {test.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <span className="text-sm capitalize">{status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-fm-neutral-900 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-3">Test Logs</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-fm-neutral-400 text-sm">No logs yet. Run tests to see output.</p>
            ) : (
              logs.map((log, index) => (
                <p key={index} className="text-sm text-fm-neutral-300 font-mono">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Setup Instructions</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>1. Create a Google Spreadsheet and copy its ID</p>
          <p>2. Set up Google Cloud project with Sheets API enabled</p>
          <p>3. Create service account and download credentials</p>
          <p>4. Share spreadsheet with service account email</p>
          <p>5. Configure environment variables in .env.local</p>
          <p className="pt-2 font-medium">
            📖 See GOOGLE_SHEETS_SETUP.md for detailed instructions
          </p>
        </div>
      </div>
    </div>
  );
}