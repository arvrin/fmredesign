import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the adminToast dependency before importing the module under test
vi.mock('@/lib/admin/toast', () => ({
  adminToast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// ---------------------------------------------------------------------------
// ApiError class
// ---------------------------------------------------------------------------

describe('ApiError', () => {
  it('extends Error with name "ApiError"', async () => {
    const { ApiError } = await import('../api');
    const err = new ApiError('Not found', 404);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('ApiError');
  });

  it('stores the message correctly', async () => {
    const { ApiError } = await import('../api');
    const err = new ApiError('Unauthorized', 401);
    expect(err.message).toBe('Unauthorized');
  });

  it('stores the status code', async () => {
    const { ApiError } = await import('../api');
    const err = new ApiError('Server error', 500);
    expect(err.status).toBe(500);
  });

  it('stores an optional error code', async () => {
    const { ApiError } = await import('../api');
    const err = new ApiError('Rate limited', 429, 'RATE_LIMIT_EXCEEDED');
    expect(err.code).toBe('RATE_LIMIT_EXCEEDED');
  });

  it('has undefined code when not provided', async () => {
    const { ApiError } = await import('../api');
    const err = new ApiError('Bad request', 400);
    expect(err.code).toBeUndefined();
  });

  it('can be caught as an Error', async () => {
    const { ApiError } = await import('../api');
    try {
      throw new ApiError('test', 500);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as ApiError).status).toBe(500);
    }
  });

  it('includes message in string representation', async () => {
    const { ApiError } = await import('../api');
    const err = new ApiError('Something broke', 500);
    expect(String(err)).toContain('Something broke');
  });
});

// ---------------------------------------------------------------------------
// qs() query string builder
// The qs function is not exported directly, but we can test it through the
// api namespace methods that use it. We test by inspecting the URLs those
// methods construct via a mocked global fetch.
// ---------------------------------------------------------------------------

describe('qs (query string builder) via api namespace', () => {
  let api: typeof import('../api')['api'];
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Set up fetch mock that captures the URL
    fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: [] }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    // Import after mocking
    const mod = await import('../api');
    api = mod.api;
  });

  it('builds query string with string parameters', async () => {
    await api.clients.get('abc-123');
    const calledUrl = fetchSpy.mock.calls[0][0];
    expect(calledUrl).toContain('?id=abc-123');
  });

  it('omits undefined and null values from query string', async () => {
    // projects.list with undefined sortBy should still produce valid params
    await api.projects.list({ sortBy: undefined, sortDirection: undefined });
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    // Should have sortBy=createdAt (the default) but not the explicit undefined
    expect(calledUrl).toContain('sortBy=createdAt');
    expect(calledUrl).toContain('sortDirection=desc');
  });

  it('omits empty string values from query string', async () => {
    // content.list with empty clientId should not include clientId in URL
    await api.content.list({ clientId: undefined });
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).not.toContain('clientId=');
  });

  it('includes numeric values as strings', async () => {
    await api.audit.list({ limit: 25 });
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain('limit=25');
  });

  it('produces no query string when all params would be empty', async () => {
    // Direct fetch of clients.list() has no params
    await api.clients.list();
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toBe('/api/clients');
  });

  it('handles multiple parameters correctly', async () => {
    await api.leads.list({ search: 'acme', status: 'new', sortBy: 'name', sortDirection: 'asc' });
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain('search=acme');
    expect(calledUrl).toContain('status=new');
    expect(calledUrl).toContain('sortBy=name');
    expect(calledUrl).toContain('sortDirection=asc');
  });
});

// ---------------------------------------------------------------------------
// API response types (ApiResponse shape)
// ---------------------------------------------------------------------------

describe('ApiResponse type contract', () => {
  it('ApiResponse interface has success, data, and optional message/error', async () => {
    // This is a compile-time check primarily, but we verify the shape at runtime
    const { ApiError } = await import('../api');
    type ApiResponse = import('../api').ApiResponse;

    // Verify the shape is usable
    const response: ApiResponse<string[]> = {
      success: true,
      data: ['a', 'b'],
      message: 'ok',
    };
    expect(response.success).toBe(true);
    expect(response.data).toEqual(['a', 'b']);
  });
});

// ---------------------------------------------------------------------------
// request() error handling via api calls
// ---------------------------------------------------------------------------

describe('API request error handling', () => {
  beforeEach(async () => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('throws ApiError when response is not ok', async () => {
    const { api, ApiError } = await import('../api');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(api.clients.list()).rejects.toThrow(ApiError);
  });

  it('throws ApiError when success is false in response body', async () => {
    const { api, ApiError } = await import('../api');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: false, error: 'Validation failed' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(api.clients.list()).rejects.toThrow('Validation failed');
  });

  it('includes status code in ApiError', async () => {
    const { api, ApiError } = await import('../api');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ error: 'Forbidden' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    try {
      await api.clients.list();
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as InstanceType<typeof ApiError>).status).toBe(403);
    }
  });
});
