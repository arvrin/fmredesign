/**
 * Admin Dashboard Local Storage Utilities
 */

import { Invoice, InvoiceClient, DEFAULT_CLIENTS } from './types';

const INVOICES_KEY = 'fm_admin_invoices';
const CLIENTS_KEY = 'fm_admin_clients';

export class AdminStorage {
  /**
   * Save invoice
   */
  static saveInvoice(invoice: Invoice): void {
    if (typeof window === 'undefined') return;

    try {
      const invoices = this.getInvoices();
      const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
      
      const updatedInvoice = {
        ...invoice,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        invoices[existingIndex] = updatedInvoice;
      } else {
        invoices.push({
          ...updatedInvoice,
          createdAt: new Date().toISOString(),
        });
      }

      localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  }

  /**
   * Get all invoices
   */
  static getInvoices(): Invoice[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(INVOICES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading invoices:', error);
      return [];
    }
  }

  /**
   * Get invoice by ID
   */
  static getInvoice(id: string): Invoice | null {
    const invoices = this.getInvoices();
    return invoices.find(inv => inv.id === id) || null;
  }

  /**
   * Delete invoice
   */
  static deleteInvoice(id: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const invoices = this.getInvoices();
      const filteredInvoices = invoices.filter(inv => inv.id !== id);
      localStorage.setItem(INVOICES_KEY, JSON.stringify(filteredInvoices));
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return false;
    }
  }

  /**
   * Save client
   */
  static saveClient(client: InvoiceClient): void {
    if (typeof window === 'undefined') return;

    try {
      const clients = this.getClients();
      const existingIndex = clients.findIndex(c => c.id === client.id);

      if (existingIndex >= 0) {
        clients[existingIndex] = client;
      } else {
        clients.push(client);
      }

      localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
    } catch (error) {
      console.error('Error saving client:', error);
    }
  }

  /**
   * Get all clients
   */
  static getClients(): InvoiceClient[] {
    if (typeof window === 'undefined') return DEFAULT_CLIENTS;

    try {
      const data = localStorage.getItem(CLIENTS_KEY);
      const clients = data ? JSON.parse(data) : [];
      
      // If no clients exist, return default clients and save them
      if (clients.length === 0) {
        const defaultClients = [...DEFAULT_CLIENTS];
        localStorage.setItem(CLIENTS_KEY, JSON.stringify(defaultClients));
        return defaultClients;
      }
      
      return clients;
    } catch (error) {
      console.error('Error loading clients:', error);
      return DEFAULT_CLIENTS;
    }
  }

  /**
   * Get client by ID
   */
  static getClient(id: string): InvoiceClient | null {
    const clients = this.getClients();
    return clients.find(client => client.id === id) || null;
  }

  /**
   * Delete client
   */
  static deleteClient(id: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const clients = this.getClients();
      const filteredClients = clients.filter(client => client.id !== id);
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(filteredClients));
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  }

  /**
   * Clear all admin data
   */
  static clearAllData(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(INVOICES_KEY);
      localStorage.removeItem(CLIENTS_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  /**
   * Export all data
   */
  static exportData(): { invoices: Invoice[]; clients: InvoiceClient[] } {
    return {
      invoices: this.getInvoices(),
      clients: this.getClients(),
    };
  }

  /**
   * Import data
   */
  static importData(data: { invoices?: Invoice[]; clients?: InvoiceClient[] }): boolean {
    if (typeof window === 'undefined') return false;

    try {
      if (data.invoices) {
        localStorage.setItem(INVOICES_KEY, JSON.stringify(data.invoices));
      }
      if (data.clients) {
        localStorage.setItem(CLIENTS_KEY, JSON.stringify(data.clients));
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}