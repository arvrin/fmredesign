'use client';

export default function TestInvoicePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Invoice Generator</h1>
      <p>This is a simple test page to check if the basic functionality works.</p>
      
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Client Selection Test</h2>
        <select className="w-full px-3 py-2 border rounded">
          <option value="">Choose a client...</option>
          <option value="client-001">Sample Client 1</option>
          <option value="client-002">Sample Client 2</option>
        </select>
      </div>
      
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Invoice Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Invoice Number</label>
            <input 
              type="text" 
              defaultValue="FM-2024-001"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input 
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}