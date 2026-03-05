import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Inngest client (notifications now route through Inngest)
const mockSend = vi.fn(() => Promise.resolve());
vi.mock('@/lib/inngest/client', () => ({
  inngest: { send: mockSend },
}));

import { transformNotification, createNotification, notifyAdmins, notifyClient } from '../notifications';

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
    mockSend.mockClear();
  });

  it('sends notification event to Inngest', async () => {
    await createNotification({
      recipientType: 'admin',
      type: 'project_created',
      title: 'New Project',
      message: 'A new project was created',
      priority: 'high',
      actionUrl: '/admin/projects/123',
    });

    expect(mockSend).toHaveBeenCalledWith({
      name: 'notification/send',
      data: expect.objectContaining({
        recipientType: 'admin',
        type: 'project_created',
        title: 'New Project',
        message: 'A new project was created',
        priority: 'high',
        actionUrl: '/admin/projects/123',
      }),
    });
  });

  it('uses defaults for optional fields', async () => {
    await createNotification({
      recipientType: 'client',
      type: 'general',
      title: 'Hello',
    });

    expect(mockSend).toHaveBeenCalledWith({
      name: 'notification/send',
      data: expect.objectContaining({
        recipientType: 'client',
        type: 'general',
        title: 'Hello',
      }),
    });
  });

  it('does not throw on Inngest error', async () => {
    mockSend.mockRejectedValueOnce(new Error('Inngest error'));

    await expect(
      createNotification({
        recipientType: 'admin',
        type: 'general',
        title: 'Test',
      })
    ).resolves.toBeUndefined();
  });
});

describe('notifyAdmins', () => {
  beforeEach(() => {
    mockSend.mockClear();
  });

  it('sends with recipientType=admin', async () => {
    await notifyAdmins({
      type: 'invoice_created',
      title: 'Invoice Ready',
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'notification/send',
        data: expect.objectContaining({
          recipientType: 'admin',
        }),
      })
    );
  });
});

describe('notifyClient', () => {
  beforeEach(() => {
    mockSend.mockClear();
  });

  it('sends with recipientType=client and clientId', async () => {
    await notifyClient('client-789', {
      type: 'contract_sent',
      title: 'Contract Ready',
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'notification/send',
        data: expect.objectContaining({
          recipientType: 'client',
          clientId: 'client-789',
        }),
      })
    );
  });
});
