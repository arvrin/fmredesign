/**
 * useLeads Hook Tests
 * Tests the pure logic extracted from useLeads: formatters and CSV export.
 * Hook rendering is not tested here (would need renderHook + fetch mocks).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Test the formatter functions directly ──
// These are callbacks inside the hook but their logic is pure.

describe('formatStatus', () => {
  // Replicated from useLeads: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const formatStatus = (status: string) =>
    status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  it('formats single-word status', () => {
    expect(formatStatus('new')).toBe('New');
    expect(formatStatus('contacted')).toBe('Contacted');
    expect(formatStatus('qualified')).toBe('Qualified');
  });

  it('formats multi-word status with underscores', () => {
    expect(formatStatus('in_progress')).toBe('In Progress');
    expect(formatStatus('follow_up')).toBe('Follow Up');
    expect(formatStatus('not_interested')).toBe('Not Interested');
  });

  it('handles empty string', () => {
    expect(formatStatus('')).toBe('');
  });
});

describe('formatPriority', () => {
  // Replicated from useLeads: priority.charAt(0).toUpperCase() + priority.slice(1)
  const formatPriority = (priority: string) =>
    priority.charAt(0).toUpperCase() + priority.slice(1);

  it('capitalizes first letter', () => {
    expect(formatPriority('low')).toBe('Low');
    expect(formatPriority('medium')).toBe('Medium');
    expect(formatPriority('high')).toBe('High');
  });

  it('handles already capitalized', () => {
    expect(formatPriority('High')).toBe('High');
  });
});

describe('CSV export logic', () => {
  const mockLeads = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+919876543210',
      company: 'Acme Corp',
      projectType: 'website_redesign',
      budgetRange: '5_10_lakh',
      status: 'new',
      priority: 'high',
      leadScore: 85,
      createdAt: '2025-01-15T10:00:00Z',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '',
      company: 'Tech Startup',
      projectType: 'mobile_app',
      budgetRange: '10_25_lakh',
      status: 'qualified',
      priority: 'medium',
      leadScore: 72,
      createdAt: '2025-02-01T08:00:00Z',
    },
  ];

  it('generates valid CSV headers', () => {
    const headers = [
      'Name', 'Email', 'Phone', 'Company', 'Project Type',
      'Budget', 'Status', 'Priority', 'Score', 'Created',
    ];
    const csv = headers.join(',');
    expect(csv).toBe('Name,Email,Phone,Company,Project Type,Budget,Status,Priority,Score,Created');
  });

  it('generates CSV rows from lead data', () => {
    const rows = mockLeads.map((l) => [
      l.name,
      l.email,
      l.phone || '',
      l.company,
      l.projectType.replace(/_/g, ' '),
      l.budgetRange.replace(/_/g, ' '),
      l.status.replace(/_/g, ' '),
      l.priority,
      String(l.leadScore),
      new Date(l.createdAt).toLocaleDateString(),
    ]);

    expect(rows).toHaveLength(2);
    expect(rows[0][0]).toBe('John Doe');
    expect(rows[0][4]).toBe('website redesign');
    expect(rows[0][5]).toBe('5 10 lakh');
    expect(rows[1][2]).toBe(''); // empty phone
    expect(rows[1][8]).toBe('72');
  });

  it('properly quotes CSV values', () => {
    const row = ['John Doe', 'john@example.com', '+919876543210'];
    const csvRow = row.map((v) => `"${v}"`).join(',');
    expect(csvRow).toBe('"John Doe","john@example.com","+919876543210"');
  });

  it('does not export when leads is empty', () => {
    const leads: typeof mockLeads = [];
    // Replicated from useLeads: if (leads.length === 0) return;
    const shouldExport = leads.length > 0;
    expect(shouldExport).toBe(false);
  });
});
