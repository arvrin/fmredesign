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

// Mock fetch to simulate API failures (tests localStorage fallback)
vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('No API in tests'))));

import { InvoiceNumbering } from '../invoice-numbering';

describe('InvoiceNumbering', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    Object.keys(localStorageData).forEach(key => delete localStorageData[key]);
    vi.clearAllMocks();
    // Re-mock fetch for each test
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('No API in tests'))));
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

  describe('getNextInvoiceNumber (localStorage fallback)', () => {
    it('generates FM1/{year} on first call with empty localStorage', async () => {
      const currentYear = new Date().getFullYear();
      const result = await InvoiceNumbering.getNextInvoiceNumber();
      expect(result).toBe(`FM1/${currentYear}`);
    });

    it('increments counter on subsequent calls', async () => {
      const currentYear = new Date().getFullYear();
      const first = await InvoiceNumbering.getNextInvoiceNumber();
      const second = await InvoiceNumbering.getNextInvoiceNumber();
      expect(first).toBe(`FM1/${currentYear}`);
      expect(second).toBe(`FM2/${currentYear}`);
    });

    it('continues from stored counter', async () => {
      const currentYear = new Date().getFullYear();
      localStorageData['fm_invoice_counter'] = '163';
      localStorageData['fm_invoice_year'] = currentYear.toString();

      const result = await InvoiceNumbering.getNextInvoiceNumber();
      expect(result).toBe(`FM164/${currentYear}`);
    });
  });

  describe('previewNextInvoiceNumber (localStorage fallback)', () => {
    it('shows next number without incrementing', async () => {
      const currentYear = new Date().getFullYear();
      localStorageData['fm_invoice_counter'] = '163';
      localStorageData['fm_invoice_year'] = currentYear.toString();

      const preview = await InvoiceNumbering.previewNextInvoiceNumber();
      expect(preview).toBe(`FM164/${currentYear}`);

      // Call again — should still be the same (not incremented)
      const preview2 = await InvoiceNumbering.previewNextInvoiceNumber();
      expect(preview2).toBe(`FM164/${currentYear}`);
    });
  });

  describe('getNextInvoiceNumber (API success)', () => {
    it('uses API response when available', async () => {
      vi.stubGlobal('fetch', vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              invoiceNumber: 'FM200/2026',
              counter: 200,
              year: 2026,
            },
          }),
        }),
      ));

      const result = await InvoiceNumbering.getNextInvoiceNumber();
      expect(result).toBe('FM200/2026');

      // Check localStorage was synced
      expect(localStorageData['fm_invoice_counter']).toBe('200');
      expect(localStorageData['fm_invoice_year']).toBe('2026');
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
