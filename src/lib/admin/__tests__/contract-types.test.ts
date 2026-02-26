import { describe, it, expect } from 'vitest';
import { formatContractCurrency, transformContract } from '../contract-types';
import type { Contract } from '../contract-types';

describe('formatContractCurrency', () => {
  it('formats INR amounts with Indian locale', () => {
    const result = formatContractCurrency(150000, 'INR');
    expect(result).toContain('₹');
    expect(result).toContain('1,50,000');
  });

  it('formats USD amounts', () => {
    const result = formatContractCurrency(1000, 'USD');
    expect(result).toContain('$');
    expect(result).toContain('1,000');
  });

  it('formats GBP amounts', () => {
    const result = formatContractCurrency(500, 'GBP');
    expect(result).toContain('£');
  });

  it('formats EUR amounts', () => {
    const result = formatContractCurrency(2500, 'EUR');
    expect(result).toContain('€');
  });

  it('handles zero', () => {
    const result = formatContractCurrency(0, 'INR');
    expect(result).toContain('₹');
    expect(result).toContain('0');
  });

  it('falls back to en-US for unknown currency', () => {
    // Unknown currency still formats — just with USD locale
    const result = formatContractCurrency(1000, 'XYZ');
    expect(result).toBeDefined();
  });

  it('omits unnecessary decimal places', () => {
    const result = formatContractCurrency(1000, 'USD');
    // maximumFractionDigits is 2, minimumFractionDigits is 0
    // So $1,000 (no decimals) or $1,000.50 (up to 2)
    expect(result).not.toMatch(/\.00$/);
  });
});

describe('transformContract', () => {
  const mockRow: Record<string, unknown> = {
    id: 'contract-123',
    client_id: 'client-456',
    title: 'Web Development Contract',
    contract_number: 'FM-CON-001',
    status: 'sent',
    services: [
      { name: 'Web Design', quantity: 1, unitPrice: 50000, total: 50000 },
    ],
    total_value: 50000,
    currency: 'INR',
    start_date: '2025-01-01',
    end_date: '2025-06-30',
    payment_terms: 'Net 30',
    billing_cycle: 'monthly',
    terms_and_conditions: 'Standard terms',
    client_feedback: null,
    revision_notes: null,
    sent_at: '2025-01-02',
    accepted_at: null,
    rejected_at: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z',
  };

  it('transforms snake_case DB row to camelCase Contract', () => {
    const contract = transformContract(mockRow);

    expect(contract.id).toBe('contract-123');
    expect(contract.clientId).toBe('client-456');
    expect(contract.title).toBe('Web Development Contract');
    expect(contract.contractNumber).toBe('FM-CON-001');
    expect(contract.status).toBe('sent');
    expect(contract.totalValue).toBe(50000);
    expect(contract.currency).toBe('INR');
    expect(contract.startDate).toBe('2025-01-01');
    expect(contract.endDate).toBe('2025-06-30');
    expect(contract.paymentTerms).toBe('Net 30');
    expect(contract.billingCycle).toBe('monthly');
    expect(contract.termsAndConditions).toBe('Standard terms');
    expect(contract.sentAt).toBe('2025-01-02');
    expect(contract.createdAt).toBe('2025-01-01T00:00:00Z');
    expect(contract.updatedAt).toBe('2025-01-02T00:00:00Z');
  });

  it('handles null optional fields as undefined', () => {
    const contract = transformContract(mockRow);

    expect(contract.clientFeedback).toBeUndefined();
    expect(contract.revisionNotes).toBeUndefined();
    expect(contract.acceptedAt).toBeUndefined();
    expect(contract.rejectedAt).toBeUndefined();
  });

  it('transforms services array correctly', () => {
    const contract = transformContract(mockRow);

    expect(contract.services).toHaveLength(1);
    expect(contract.services[0].name).toBe('Web Design');
    expect(contract.services[0].total).toBe(50000);
  });

  it('defaults services to empty array when not an array', () => {
    const rowWithoutServices = { ...mockRow, services: null };
    const contract = transformContract(rowWithoutServices);
    expect(contract.services).toEqual([]);
  });

  it('defaults currency to INR when missing', () => {
    const rowWithoutCurrency = { ...mockRow, currency: null };
    const contract = transformContract(rowWithoutCurrency);
    expect(contract.currency).toBe('INR');
  });

  it('defaults totalValue to 0 for non-numeric values', () => {
    const rowWithBadValue = { ...mockRow, total_value: 'not a number' };
    const contract = transformContract(rowWithBadValue);
    expect(contract.totalValue).toBe(0);
  });
});
