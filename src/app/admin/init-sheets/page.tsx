/**
 * Simple Google Sheets Initializer
 * One-click solution to update Google Sheets with GST and address fields
 */

'use client';

import { useState } from 'react';
import { DashboardButton as Button } from '@/design-system';
import { RefreshCw, CheckCircle, XCircle, Database } from 'lucide-react';

export default function InitSheetsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const initializeSheets = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/sheets/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        success: false,
        error: 'Network error occurred',
        details: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fm-neutral-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Database className="w-12 h-12 text-fm-magenta-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-fm-neutral-900 mb-2">
              Initialize Google Sheets
            </h1>
            <p className="text-fm-neutral-600">
              Update your Google Sheets with GST and complete address fields for invoice integration
            </p>
          </div>

          {/* Current vs New Headers */}
          <div className="mb-8 space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-red-600 mb-2">❌ Current Headers (Missing GST):</h3>
              <code className="text-xs text-gray-600">
                id, name, email, phone, company, industry, status, createdAt, totalValue, health
              </code>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-green-600 mb-2">✅ New Headers (With GST & Address):</h3>
              <code className="text-xs text-gray-600 leading-relaxed">
                id, name, email, phone, address, city, state, zipCode, country, 
                <span className="font-bold text-blue-600">gstNumber</span>, industry, companySize, website,
                status, health, accountManager, contractType, contractValue, 
                contractStartDate, contractEndDate, billingCycle, services,
                createdAt, updatedAt, totalValue, tags, notes
              </code>
            </div>
          </div>

          {/* Initialize Button */}
          <div className="text-center mb-6">
            <Button
              onClick={initializeSheets}
              disabled={isLoading}
              variant="admin"
              size="lg"
              className="px-8 py-3"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                  Updating Sheets...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5 mr-3" />
                  Update Google Sheets
                </>
              )}
            </Button>
          </div>

          {/* Result Display */}
          {result && (
            <div className={`border rounded-lg p-4 ${
              result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-start space-x-3">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Success! 🎉' : 'Error Occurred'}
                  </h4>
                  
                  <p className={`text-sm mt-1 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message || result.error}
                  </p>

                  {result.success && result.details?.clientFields && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-green-800 mb-2">
                        ✅ Your Google Sheets now includes {result.details.clientFields.length} columns:
                      </p>
                      <div className="bg-white rounded border p-3">
                        <code className="text-xs text-gray-700">
                          {result.details.clientFields.join(', ')}
                        </code>
                      </div>
                      <div className="mt-3 text-sm text-green-700">
                        <p><strong>Next steps:</strong></p>
                        <ol className="list-decimal list-inside space-y-1 text-xs mt-1">
                          <li>Check your Google Sheets - headers should be updated</li>
                          <li>Go to Admin → Clients → Add new client</li>
                          <li>Fill in client details including GST number</li>
                          <li>Generate an invoice to test the integration</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {result.details?.troubleshooting && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-red-800 mb-2">Troubleshooting:</p>
                      <ul className="text-xs text-red-700 space-y-1">
                        {result.details.troubleshooting.map((item: string, index: number) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">What this does:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Adds <strong>gstNumber</strong> field for tax compliance</li>
              <li>• Separates address into individual fields (address, city, state, zip, country)</li>
              <li>• Adds contract and billing information fields</li>
              <li>• Preserves existing client data</li>
              <li>• Enables complete client-to-invoice data mapping</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}