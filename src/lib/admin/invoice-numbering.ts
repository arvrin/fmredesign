/**
 * Invoice Numbering Service
 * API-backed persistent numbering with localStorage fallback.
 *
 * Format: FM164/2025
 */

const INVOICE_COUNTER_KEY = 'fm_invoice_counter';
const INVOICE_YEAR_KEY = 'fm_invoice_year';

export class InvoiceNumbering {
  /**
   * Get the next invoice number by calling the API (increments the counter).
   * Falls back to localStorage if the API call fails.
   */
  static async getNextInvoiceNumber(): Promise<string> {
    try {
      const res = await fetch('/api/admin/invoice-sequence', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data?.invoiceNumber) {
        // Sync localStorage as backup
        this.syncLocalStorage(json.data.counter, json.data.year);
        return json.data.invoiceNumber;
      }
      throw new Error('Invalid API response');
    } catch {
      // Fallback to localStorage
      return this.getNextFromLocalStorage();
    }
  }

  /**
   * Preview the next invoice number without incrementing.
   * Falls back to localStorage if the API call fails.
   */
  static async previewNextInvoiceNumber(): Promise<string> {
    try {
      const res = await fetch('/api/admin/invoice-sequence');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data?.next) {
        return json.data.next;
      }
      throw new Error('Invalid API response');
    } catch {
      return this.previewFromLocalStorage();
    }
  }

  /**
   * Validate invoice number format: FM{digits}/{4-digit year}
   */
  static isValidFormat(invoiceNumber: string): boolean {
    return /^FM\d+\/\d{4}$/.test(invoiceNumber);
  }

  /**
   * Update local counter based on a manually entered invoice number.
   * Keeps localStorage in sync so fallback stays current.
   */
  static updateFromManualInvoice(invoiceNumber: string): void {
    const match = invoiceNumber.match(/^FM(\d+)\/(\d{4})$/);
    if (!match) return;

    const counter = parseInt(match[1]);
    const year = parseInt(match[2]);

    if (typeof window === 'undefined') return;

    const currentStoredCounter = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '0');
    const currentStoredYear = parseInt(
      localStorage.getItem(INVOICE_YEAR_KEY) || new Date().getFullYear().toString(),
    );

    if (year === currentStoredYear && counter > currentStoredCounter) {
      localStorage.setItem(INVOICE_COUNTER_KEY, counter.toString());
    } else if (year > currentStoredYear) {
      localStorage.setItem(INVOICE_COUNTER_KEY, counter.toString());
      localStorage.setItem(INVOICE_YEAR_KEY, year.toString());
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private static syncLocalStorage(counter: number, year: number): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(INVOICE_COUNTER_KEY, counter.toString());
    localStorage.setItem(INVOICE_YEAR_KEY, year.toString());
  }

  private static getNextFromLocalStorage(): string {
    if (typeof window === 'undefined') return 'FM164/2026';

    const currentYear = new Date().getFullYear();
    const storedYear = parseInt(localStorage.getItem(INVOICE_YEAR_KEY) || '0');
    let counter = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '163');

    if (storedYear !== currentYear) {
      counter = 0;
      localStorage.setItem(INVOICE_YEAR_KEY, currentYear.toString());
    }

    counter += 1;
    localStorage.setItem(INVOICE_COUNTER_KEY, counter.toString());

    return `FM${counter}/${currentYear}`;
  }

  private static previewFromLocalStorage(): string {
    if (typeof window === 'undefined') return 'FM164/2026';

    const currentYear = new Date().getFullYear();
    const storedYear = parseInt(localStorage.getItem(INVOICE_YEAR_KEY) || '0');
    let counter = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '163');

    if (storedYear !== currentYear) {
      counter = 0;
    }

    return `FM${counter + 1}/${currentYear}`;
  }
}
