import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase before import
const mockInsert = vi.fn(() => Promise.resolve({ data: null, error: null }));
vi.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  })),
}));

import { transformNotification, createNotification, notifyAdmins, notifyClient } from '../notifications';
import type { NotificationRecord } from '../notifications';

describe('transformNotification', () => {
  const mockRow: Record<string, unknown> = {
    id: 'notif-123',
    recipient_type: 'admin',
    recipient_id: 'user-456',
    client_id: 'client-789',
    type: 'project_created',
    title: 'New Project',
    message: 'A new project was created',
    is_read: false,
    priority: 'high',
    action_url: '/admin/projects/123',
    metadata: { projectName: 'Website Redesign' },
    created_at: '2025-01-15T10:00:00Z',
    read_at: null,
  };

  it('transforms DB row to NotificationRecord', () => {
    const result = transformNotification(mockRow);

    expect(result.id).toBe('notif-123');
    expect(result.recipientType).toBe('admin');
    expect(result.recipientId).toBe('user-456');
    expect(result.clientId).toBe('client-789');
    expect(result.type).toBe('project_created');
    expect(result.title).toBe('New Project');
    expect(result.message).toBe('A new project was created');
    expect(result.isRead).toBe(false);
    expect(result.priority).toBe('high');
    expect(result.actionUrl).toBe('/admin/projects/123');
    expect(result.metadata).toEqual({ projectName: 'Website Redesign' });
    expect(result.createdAt).toBe('2025-01-15T10:00:00Z');
    expect(result.readAt).toBeNull();
  });

  it('handles null optional fields', () => {
    const minimalRow: Record<string, unknown> = {
      id: 'notif-1',
      recipient_type: 'client',
      recipient_id: null,
      client_id: null,
      type: 'general',
      title: 'Test',
      message: '',
      is_read: true,
      priority: 'low',
      action_url: null,
      metadata: null,
      created_at: '2025-01-01T00:00:00Z',
      read_at: '2025-01-01T01:00:00Z',
    };

    const result = transformNotification(minimalRow);
    expect(result.recipientId).toBeNull();
    expect(result.clientId).toBeNull();
    expect(result.actionUrl).toBeNull();
    expect(result.metadata).toEqual({});
    expect(result.readAt).toBe('2025-01-01T01:00:00Z');
  });
});

describe('createNotification', () => {
  beforeEach(() => {
    mockInsert.mockClear();
  });

  it('inserts notification into Supabase', async () => {
    createNotification({
      recipientType: 'admin',
      type: 'project_created',
      title: 'New Project',
      message: 'A new project was created',
      priority: 'high',
      actionUrl: '/admin/projects/123',
    });

    // Fire-and-forget — give microtask a chance to run
    await new Promise((r) => setTimeout(r, 50));

    expect(mockInsert).toHaveBeenCalledWith({
      recipient_type: 'admin',
      recipient_id: null,
      client_id: null,
      type: 'project_created',
      title: 'New Project',
      message: 'A new project was created',
      priority: 'high',
      action_url: '/admin/projects/123',
      metadata: {},
    });
  });

  it('uses defaults for optional fields', async () => {
    createNotification({
      recipientType: 'client',
      type: 'general',
      title: 'Hello',
    });

    await new Promise((r) => setTimeout(r, 50));

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '',
        priority: 'normal',
        action_url: null,
        metadata: {},
      })
    );
  });

  it('does not throw on Supabase error', async () => {
    mockInsert.mockRejectedValueOnce(new Error('DB error'));

    // Should not throw
    expect(() => {
      createNotification({
        recipientType: 'admin',
        type: 'general',
        title: 'Test',
      });
    }).not.toThrow();

    await new Promise((r) => setTimeout(r, 50));
  });
});

describe('notifyAdmins', () => {
  beforeEach(() => {
    mockInsert.mockClear();
  });

  it('calls createNotification with recipientType=admin', async () => {
    notifyAdmins({
      type: 'invoice_created',
      title: 'Invoice Ready',
    });

    await new Promise((r) => setTimeout(r, 50));

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient_type: 'admin',
      })
    );
  });
});

describe('notifyClient', () => {
  beforeEach(() => {
    mockInsert.mockClear();
  });

  it('calls createNotification with recipientType=client and clientId', async () => {
    notifyClient('client-789', {
      type: 'contract_sent',
      title: 'Contract Ready',
    });

    await new Promise((r) => setTimeout(r, 50));

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient_type: 'client',
        client_id: 'client-789',
      })
    );
  });
});
