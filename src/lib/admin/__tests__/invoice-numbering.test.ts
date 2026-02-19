import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage for jsdom environment
const localStorageData: Record<string, string> = {};
const mockLocalStorage = {
  getItem: vi.fn((key: string) => localStorageData[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageData[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageData[key];
  }),
  clear: vi.fn(() => {
    Object.keys(localStorageData).forEach(key => delete localStorageData[key]);
  }),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

import { InvoiceNumbering } from '../invoice-numbering';

describe('InvoiceNumbering', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    Object.keys(localStorageData).forEach(key => delete localStorageData[key]);
    vi.clearAllMocks();
  });

  describe('isValidFormat', () => {
    it('accepts valid FM164/2025 format', () => {
      expect(InvoiceNumbering.isValidFormat('FM164/2025')).toBe(true);
      expect(InvoiceNumbering.isValidFormat('FM1/2024')).toBe(true);
      expect(InvoiceNumbering.isValidFormat('FM9999/2026')).toBe(true);
    });

    it('rejects invalid formats', () => {
      expect(InvoiceNumbering.isValidFormat('INV-001')).toBe(false);
      expect(InvoiceNumbering.isValidFormat('FM/2025')).toBe(false);
      expect(InvoiceNumbering.isValidFormat('FM164/25')).toBe(false);
      expect(InvoiceNumbering.isValidFormat('fm164/2025')).toBe(false);
      expect(InvoiceNumbering.isValidFormat('')).toBe(false);
    });
  });

  describe('getNextInvoiceNumber', () => {
    it('generates FM164/{year} on first call', () => {
      const currentYear = new Date().getFullYear();
      const result = InvoiceNumbering.getNextInvoiceNumber();
      expect(result).toBe(`FM164/${currentYear}`);
    });

    it('increments counter on subsequent calls', () => {
      const currentYear = new Date().getFullYear();
      const first = InvoiceNumbering.getNextInvoiceNumber();
      const second = InvoiceNumbering.getNextInvoiceNumber();
      expect(first).toBe(`FM164/${currentYear}`);
      expect(second).toBe(`FM165/${currentYear}`);
    });
  });

  describe('getCurrentCounter', () => {
    it('returns default counter on fresh state', () => {
      const result = InvoiceNumbering.getCurrentCounter();
      expect(result.counter).toBe(163);
    });

    it('reflects state after getNextInvoiceNumber', () => {
      InvoiceNumbering.getNextInvoiceNumber(); // increments to 164
      const result = InvoiceNumbering.getCurrentCounter();
      expect(result.counter).toBe(164);
    });
  });

  describe('resetCounter', () => {
    it('resets counter to specified value', () => {
      InvoiceNumbering.resetCounter(200);
      // resetCounter stores newCounter - 1, so next is 200
      const next = InvoiceNumbering.getNextInvoiceNumber();
      const currentYear = new Date().getFullYear();
      expect(next).toBe(`FM200/${currentYear}`);
    });

    it('resets counter to specified value and year', () => {
      InvoiceNumbering.resetCounter(300, 2027);
      const counter = InvoiceNumbering.getCurrentCounter();
      expect(counter.counter).toBe(299); // stored as 299, next will be 300
      expect(counter.year).toBe(2027);
    });
  });

  describe('previewNextInvoiceNumber', () => {
    it('shows next number without incrementing', () => {
      const preview = InvoiceNumbering.previewNextInvoiceNumber();
      const currentYear = new Date().getFullYear();
      expect(preview).toBe(`FM164/${currentYear}`);

      // Call again — should still be the same (not incremented)
      const preview2 = InvoiceNumbering.previewNextInvoiceNumber();
      expect(preview2).toBe(`FM164/${currentYear}`);
    });
  });

  describe('updateFromManualInvoice', () => {
    it('updates counter for valid invoice number', () => {
      const currentYear = new Date().getFullYear();
      localStorageData['fm_invoice_year'] = currentYear.toString();
      localStorageData['fm_invoice_counter'] = '163';

      InvoiceNumbering.updateFromManualInvoice(`FM200/${currentYear}`);
      expect(localStorageData['fm_invoice_counter']).toBe('200');
    });

    it('does not update counter if manual number is lower', () => {
      const currentYear = new Date().getFullYear();
      localStorageData['fm_invoice_year'] = currentYear.toString();
      localStorageData['fm_invoice_counter'] = '200';

      InvoiceNumbering.updateFromManualInvoice(`FM150/${currentYear}`);
      expect(localStorageData['fm_invoice_counter']).toBe('200');
    });

    it('ignores invalid format', () => {
      localStorageData['fm_invoice_counter'] = '163';
      InvoiceNumbering.updateFromManualInvoice('INVALID');
      expect(localStorageData['fm_invoice_counter']).toBe('163');
    });
  });
});
