/**
 * In-app notification system.
 * Sends notification events to Inngest for durable processing.
 * Never throws — errors are logged silently.
 */

// Inngest is imported dynamically to avoid bundling Node.js modules in client code

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificationType =
  | 'contract_sent'
  | 'contract_accepted'
  | 'contract_rejected'
  | 'contract_edit_requested'
  | 'project_created'
  | 'project_status_changed'
  | 'content_created'
  | 'content_approved'
  | 'content_revision_requested'
  | 'content_review_ready'
  | 'content_published'
  | 'invoice_created'
  | 'invoice_sent'
  | 'invoice_overdue'
  | 'ticket_created'
  | 'ticket_status_updated'
  | 'ticket_reply'
  | 'document_shared'
  | 'proposal_sent'
  | 'proposal_approved'
  | 'proposal_declined'
  | 'proposal_edit_requested'
  | 'team_member_assigned'
  | 'general';

export interface NotificationRecord {
  id: string;
  recipientType: 'admin' | 'client';
  recipientId: string | null;
  clientId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
  actionUrl: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  readAt: string | null;
}

// ---------------------------------------------------------------------------
// Create notification — fire-and-forget
// ---------------------------------------------------------------------------

interface CreateOpts {
  /** Who sees this notification */
  recipientType: 'admin' | 'client';
  /** Specific user ID (for admin) or null (broadcast to all admins) */
  recipientId?: string;
  /** Client ID — required for client notifications, optional for admin */
  clientId?: string;
  type: NotificationType;
  title: string;
  message?: string;
  priority?: 'low' | 'normal' | 'high';
  /** Link to navigate when clicked */
  actionUrl?: string;
  /** Extra data */
  metadata?: Record<string, unknown>;
}

export async function createNotification(opts: CreateOpts): Promise<void> {
  try {
    // Dynamic import to avoid bundling Inngest in client-side code
    const { inngest } = await import('@/lib/inngest/client');
    await inngest.send({
      name: 'notification/send',
      data: {
        recipientType: opts.recipientType,
        recipientId: opts.recipientId,
        clientId: opts.clientId,
        type: opts.type,
        title: opts.title,
        message: opts.message,
        priority: opts.priority,
        actionUrl: opts.actionUrl,
        metadata: opts.metadata,
      },
    });
  } catch (err) {
    console.error('Failed to send notification event:', err);
  }
}

// ---------------------------------------------------------------------------
// Convenience helpers
// ---------------------------------------------------------------------------

/** Notify all admins (recipientType=admin, no specific recipientId) */
export function notifyAdmins(opts: Omit<CreateOpts, 'recipientType'>): Promise<void> {
  return createNotification({ ...opts, recipientType: 'admin' });
}

/** Notify a specific client */
export function notifyClient(
  clientId: string,
  opts: Omit<CreateOpts, 'recipientType' | 'clientId'>
): Promise<void> {
  return createNotification({ ...opts, recipientType: 'client', clientId });
}

// ---------------------------------------------------------------------------
// Transform DB row → API response
// ---------------------------------------------------------------------------

export function transformNotification(row: Record<string, unknown>): NotificationRecord {
  return {
    id: row.id as string,
    recipientType: row.recipient_type as 'admin' | 'client',
    recipientId: row.recipient_id as string | null,
    clientId: row.client_id as string | null,
    type: row.type as NotificationType,
    title: row.title as string,
    message: row.message as string,
    isRead: row.is_read as boolean,
    priority: row.priority as 'low' | 'normal' | 'high',
    actionUrl: row.action_url as string | null,
    metadata: (row.metadata as Record<string, unknown>) || {},
    createdAt: row.created_at as string,
    readAt: row.read_at as string | null,
  };
}
