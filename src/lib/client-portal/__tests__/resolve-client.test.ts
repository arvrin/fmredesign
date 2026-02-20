import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase
const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn((_table: string) => ({ select: mockSelect }));

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: (table: string) => mockFrom(table),
  },
}));

import { resolveClientId } from '../resolve-client';

describe('resolveClientId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock chain
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
  });

  it('resolves by slug first', async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: 'uuid-123', slug: 'acme' },
      error: null,
    });

    const result = await resolveClientId('acme');
    expect(result).toEqual({ id: 'uuid-123', slug: 'acme' });
    expect(mockFrom).toHaveBeenCalledWith('clients');
    expect(mockEq).toHaveBeenCalledWith('slug', 'acme');
  });

  it('falls back to ID when slug not found', async () => {
    // First call (slug lookup) returns null
    mockSingle
      .mockResolvedValueOnce({ data: null, error: null })
      // Second call (id lookup) returns data
      .mockResolvedValueOnce({
        data: { id: 'uuid-456', slug: 'beta-co' },
        error: null,
      });

    const result = await resolveClientId('uuid-456');
    expect(result).toEqual({ id: 'uuid-456', slug: 'beta-co' });
    // Should have been called twice (slug then id)
    expect(mockSingle).toHaveBeenCalledTimes(2);
  });

  it('returns null when neither slug nor ID match', async () => {
    mockSingle
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({ data: null, error: null });

    const result = await resolveClientId('nonexistent');
    expect(result).toBeNull();
  });

  it('returns null on database error for slug lookup and no ID match', async () => {
    mockSingle
      .mockResolvedValueOnce({ data: null, error: { message: 'DB error' } })
      .mockResolvedValueOnce({ data: null, error: null });

    const result = await resolveClientId('bad-slug');
    expect(result).toBeNull();
  });
});
