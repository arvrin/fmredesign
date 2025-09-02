/**
 * Invoice Numbering Service
 * Handles FM164/2025 style invoice numbers
 */

const INVOICE_COUNTER_KEY = 'fm_invoice_counter';
const INVOICE_YEAR_KEY = 'fm_invoice_year';

export class InvoiceNumbering {
  /**
   * Get the next invoice number in FM164/2025 format
   */
  static getNextInvoiceNumber(): string {
    const currentYear = new Date().getFullYear();
    
    // Get stored values
    const storedYear = parseInt(localStorage.getItem(INVOICE_YEAR_KEY) || '0');
    let counter = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '163'); // Start from 163 so next is 164
    
    // Reset counter if year changed
    if (storedYear !== currentYear) {
      counter = 163; // Will be incremented to 164
      localStorage.setItem(INVOICE_YEAR_KEY, currentYear.toString());
    }
    
    // Increment counter
    counter += 1;
    
    // Save new counter value
    localStorage.setItem(INVOICE_COUNTER_KEY, counter.toString());
    
    // Return formatted invoice number
    return `FM${counter}/${currentYear}`;
  }
  
  /**
   * Get current counter value (for display purposes)
   */
  static getCurrentCounter(): { counter: number; year: number } {
    const currentYear = new Date().getFullYear();
    const storedYear = parseInt(localStorage.getItem(INVOICE_YEAR_KEY) || currentYear.toString());
    const counter = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '163');
    
    return { counter, year: storedYear };
  }
  
  /**
   * Reset counter to a specific number (admin function)
   */
  static resetCounter(newCounter: number, year?: number): void {
    const targetYear = year || new Date().getFullYear();
    localStorage.setItem(INVOICE_COUNTER_KEY, (newCounter - 1).toString()); // Subtract 1 because getNext increments
    localStorage.setItem(INVOICE_YEAR_KEY, targetYear.toString());
  }
  
  /**
   * Update counter based on a manually entered invoice number
   */
  static updateFromManualInvoice(invoiceNumber: string): void {
    // Parse FM164/2025 format
    const match = invoiceNumber.match(/^FM(\d+)\/(\d{4})$/);
    if (match) {
      const counter = parseInt(match[1]);
      const year = parseInt(match[2]);
      
      // Update stored values to ensure next auto-generated number is higher
      const currentStoredCounter = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '0');
      const currentStoredYear = parseInt(localStorage.getItem(INVOICE_YEAR_KEY) || new Date().getFullYear().toString());
      
      // Only update if this manual number is higher than current counter for the same year
      if (year === currentStoredYear && counter > currentStoredCounter) {
        localStorage.setItem(INVOICE_COUNTER_KEY, counter.toString());
      } else if (year > currentStoredYear) {
        // If it's a future year, update both year and counter
        localStorage.setItem(INVOICE_COUNTER_KEY, counter.toString());
        localStorage.setItem(INVOICE_YEAR_KEY, year.toString());
      }
    }
  }
  
  /**
   * Validate invoice number format
   */
  static isValidFormat(invoiceNumber: string): boolean {
    return /^FM\d+\/\d{4}$/.test(invoiceNumber);
  }
  
  /**
   * Generate invoice number based on date
   */
  static getInvoiceNumberForDate(date: Date): string {
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    const storedYear = parseInt(localStorage.getItem(INVOICE_YEAR_KEY) || currentYear.toString());
    let counter = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '163');
    
    // If generating for a different year, use appropriate counter
    if (year !== storedYear) {
      if (year > storedYear) {
        // Future year - start from 164
        counter = 164;
      } else {
        // Past year - don't auto-increment stored counter
        return `FM164/${year}`;
      }
    } else {
      // Same year as stored - increment normally
      counter += 1;
      localStorage.setItem(INVOICE_COUNTER_KEY, counter.toString());
    }
    
    return `FM${counter}/${year}`;
  }
  
  /**
   * Preview what the next invoice number will be without incrementing
   */
  static previewNextInvoiceNumber(): string {
    const currentYear = new Date().getFullYear();
    const storedYear = parseInt(localStorage.getItem(INVOICE_YEAR_KEY) || '0');
    let counter = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '163');
    
    // If year changed, counter would reset
    if (storedYear !== currentYear) {
      counter = 163;
    }
    
    // Show what next number would be
    return `FM${counter + 1}/${currentYear}`;
  }
}