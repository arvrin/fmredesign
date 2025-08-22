/**
 * Google Sheets Integration Service
 * Handles all Google Sheets operations for invoices and client data
 */

import { google } from 'googleapis';

// Google Sheets configuration
const SHEETS_CONFIG = {
  SPREADSHEET_ID: process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID || '',
  SHEETS: {
    CLIENTS: 'Clients',
    INVOICES: 'Invoices', 
    CAMPAIGNS: 'Campaigns',
    COMMUNICATIONS: 'Communications',
    OPPORTUNITIES: 'Opportunities'
  }
};

// Google Sheets service account credentials
const GOOGLE_CREDENTIALS = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
};

interface SheetRow {
  [key: string]: string | number | boolean | null;
}

class GoogleSheetsService {
  private sheets: any;
  private isInitialized = false;

  constructor() {
    this.initializeSheets();
  }

  private async initializeSheets() {
    try {
      // For development, we'll use a simplified approach
      // In production, you would use proper service account authentication
      if (typeof window !== 'undefined') {
        // Client-side: Use public readonly access for now
        this.sheets = null;
        this.isInitialized = false;
        return;
      }

      // Server-side: Use service account
      const auth = new google.auth.GoogleAuth({
        credentials: GOOGLE_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Sheets:', error);
      this.isInitialized = false;
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initializeSheets();
    }
    
    if (!this.isInitialized || !this.sheets) {
      throw new Error('Google Sheets service not initialized. Please check your credentials.');
    }
  }

  // Generic method to read data from a sheet
  async readSheet(sheetName: string, range?: string): Promise<any[][]> {
    await this.ensureInitialized();
    
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SHEETS_CONFIG.SPREADSHEET_ID,
        range: range || `${sheetName}!A:Z`,
      });
      
      return response.data.values || [];
    } catch (error) {
      console.error(`Error reading sheet ${sheetName}:`, error);
      return [];
    }
  }

  // Generic method to write data to a sheet
  async writeSheet(sheetName: string, values: any[][], range?: string): Promise<boolean> {
    await this.ensureInitialized();
    
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SHEETS_CONFIG.SPREADSHEET_ID,
        range: range || `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
      
      return true;
    } catch (error) {
      console.error(`Error writing to sheet ${sheetName}:`, error);
      return false;
    }
  }

  // Append data to a sheet
  async appendToSheet(sheetName: string, values: any[][]): Promise<boolean> {
    await this.ensureInitialized();
    
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SHEETS_CONFIG.SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values,
        },
      });
      
      return true;
    } catch (error) {
      console.error(`Error appending to sheet ${sheetName}:`, error);
      return false;
    }
  }

  // Convert array data to objects using first row as headers
  private arrayToObjects(data: any[][]): SheetRow[] {
    if (data.length === 0) return [];
    
    const headers = data[0];
    return data.slice(1).map(row => {
      const obj: SheetRow = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || null;
      });
      return obj;
    });
  }

  // Convert objects to array data with headers
  private objectsToArray(objects: SheetRow[]): any[][] {
    if (objects.length === 0) return [];
    
    const headers = Object.keys(objects[0]);
    const rows = objects.map(obj => headers.map(header => obj[header]));
    return [headers, ...rows];
  }

  // Client-specific methods
  async getClients(): Promise<SheetRow[]> {
    try {
      const data = await this.readSheet(SHEETS_CONFIG.SHEETS.CLIENTS);
      return this.arrayToObjects(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      return this.getMockClients(); // Fallback to mock data
    }
  }

  async addClient(client: SheetRow): Promise<boolean> {
    try {
      const clientData = [
        client.id,
        client.name,
        client.email,
        client.phone,
        client.company,
        client.industry,
        client.status,
        client.createdAt,
        client.totalValue,
        client.health
      ];
      
      return await this.appendToSheet(SHEETS_CONFIG.SHEETS.CLIENTS, [clientData]);
    } catch (error) {
      console.error('Error adding client:', error);
      return false;
    }
  }

  async updateClient(clientId: string, updates: Partial<SheetRow>): Promise<boolean> {
    try {
      const clients = await this.getClients();
      const clientIndex = clients.findIndex(c => c.id === clientId);
      
      if (clientIndex === -1) return false;
      
      // Update the client data
      clients[clientIndex] = { ...clients[clientIndex], ...updates };
      
      // Convert back to array format and update the sheet
      const arrayData = this.objectsToArray(clients);
      return await this.writeSheet(SHEETS_CONFIG.SHEETS.CLIENTS, arrayData);
    } catch (error) {
      console.error('Error updating client:', error);
      return false;
    }
  }

  // Invoice-specific methods
  async getInvoices(): Promise<SheetRow[]> {
    try {
      const data = await this.readSheet(SHEETS_CONFIG.SHEETS.INVOICES);
      return this.arrayToObjects(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return this.getMockInvoices(); // Fallback to mock data
    }
  }

  async addInvoice(invoice: SheetRow): Promise<boolean> {
    try {
      const invoiceData = [
        invoice.id,
        invoice.invoiceNumber,
        invoice.clientId,
        invoice.clientName,
        invoice.date,
        invoice.dueDate,
        invoice.subtotal,
        invoice.tax,
        invoice.total,
        invoice.status,
        invoice.createdAt,
        JSON.stringify(invoice.lineItems), // Store as JSON string
        invoice.notes
      ];
      
      return await this.appendToSheet(SHEETS_CONFIG.SHEETS.INVOICES, [invoiceData]);
    } catch (error) {
      console.error('Error adding invoice:', error);
      return false;
    }
  }

  async updateInvoiceStatus(invoiceId: string, status: string): Promise<boolean> {
    try {
      const invoices = await this.getInvoices();
      const invoiceIndex = invoices.findIndex(i => i.id === invoiceId);
      
      if (invoiceIndex === -1) return false;
      
      invoices[invoiceIndex].status = status;
      invoices[invoiceIndex].updatedAt = new Date().toISOString();
      
      const arrayData = this.objectsToArray(invoices);
      return await this.writeSheet(SHEETS_CONFIG.SHEETS.INVOICES, arrayData);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      return false;
    }
  }

  // Campaign methods
  async getCampaigns(clientId?: string): Promise<SheetRow[]> {
    try {
      const data = await this.readSheet(SHEETS_CONFIG.SHEETS.CAMPAIGNS);
      const campaigns = this.arrayToObjects(data);
      
      if (clientId) {
        return campaigns.filter(c => c.clientId === clientId);
      }
      
      return campaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  async addCampaign(campaign: SheetRow): Promise<boolean> {
    try {
      const campaignData = [
        campaign.id,
        campaign.clientId,
        campaign.name,
        campaign.type,
        campaign.status,
        campaign.budget,
        campaign.spent,
        campaign.startDate,
        campaign.endDate,
        campaign.description,
        campaign.createdAt
      ];
      
      return await this.appendToSheet(SHEETS_CONFIG.SHEETS.CAMPAIGNS, [campaignData]);
    } catch (error) {
      console.error('Error adding campaign:', error);
      return false;
    }
  }

  // Initialize spreadsheet with headers (call this once to set up the sheets)
  async initializeSpreadsheet(): Promise<boolean> {
    try {
      // Client headers
      const clientHeaders = [
        'id', 'name', 'email', 'phone', 'company', 'industry', 
        'status', 'createdAt', 'totalValue', 'health'
      ];
      
      // Invoice headers
      const invoiceHeaders = [
        'id', 'invoiceNumber', 'clientId', 'clientName', 'date', 'dueDate',
        'subtotal', 'tax', 'total', 'status', 'createdAt', 'lineItems', 'notes'
      ];
      
      // Campaign headers
      const campaignHeaders = [
        'id', 'clientId', 'name', 'type', 'status', 'budget', 'spent',
        'startDate', 'endDate', 'description', 'createdAt'
      ];

      // Write headers to sheets
      await this.writeSheet(SHEETS_CONFIG.SHEETS.CLIENTS, [clientHeaders]);
      await this.writeSheet(SHEETS_CONFIG.SHEETS.INVOICES, [invoiceHeaders]);
      await this.writeSheet(SHEETS_CONFIG.SHEETS.CAMPAIGNS, [campaignHeaders]);
      
      return true;
    } catch (error) {
      console.error('Error initializing spreadsheet:', error);
      return false;
    }
  }

  // Mock data fallbacks for development
  private getMockClients(): SheetRow[] {
    return [
      {
        id: 'client-001',
        name: 'TechStart Inc',
        email: 'contact@techstart.com',
        phone: '+91 98765 43210',
        company: 'TechStart Inc',
        industry: 'Technology',
        status: 'active',
        createdAt: '2024-01-15T00:00:00Z',
        totalValue: 150000,
        health: 'excellent'
      },
      {
        id: 'client-002',
        name: 'GreenLeaf Ventures',
        email: 'info@greenleaf.com',
        phone: '+91 87654 32109',
        company: 'GreenLeaf Ventures',
        industry: 'Sustainability',
        status: 'active',
        createdAt: '2024-02-20T00:00:00Z',
        totalValue: 95000,
        health: 'good'
      }
    ];
  }

  private getMockInvoices(): SheetRow[] {
    return [
      {
        id: 'inv-001',
        invoiceNumber: 'FM-2024-001',
        clientId: 'client-001',
        clientName: 'TechStart Inc',
        date: '2024-08-01',
        dueDate: '2024-08-31',
        subtotal: 45000,
        tax: 8100,
        total: 53100,
        status: 'paid',
        createdAt: '2024-08-01T00:00:00Z',
        lineItems: '[]',
        notes: 'Q3 Digital Marketing Services'
      }
    ];
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();

// Export types
export type { SheetRow };
export { SHEETS_CONFIG };