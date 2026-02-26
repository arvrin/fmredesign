/**
 * In-app notification system.
 * Fire-and-forget helper to insert notifications into Supabase.
 * Never throws — errors are logged silently.
 */

import { getSupabaseAdmin } from '@/lib/supabase';

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

export function createNotification(opts: CreateOpts): void {
  // Fire-and-forget — don't await, don't throw
  Promise.resolve().then(async () => {
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from('notifications').insert({
        recipient_type: opts.recipientType,
        recipient_id: opts.recipientId || null,
        client_id: opts.clientId || null,
        type: opts.type,
        title: opts.title,
        message: opts.message || '',
        priority: opts.priority || 'normal',
        action_url: opts.actionUrl || null,
        metadata: opts.metadata || {},
      });
    } catch (err) {
      console.error('Failed to create notification:', err);
    }
  });
}

// ---------------------------------------------------------------------------
// Convenience helpers
// ---------------------------------------------------------------------------

/** Notify all admins (recipientType=admin, no specific recipientId) */
export function notifyAdmins(opts: Omit<CreateOpts, 'recipientType'>): void {
  createNotification({ ...opts, recipientType: 'admin' });
}

/** Notify a specific client */
export function notifyClient(
  clientId: string,
  opts: Omit<CreateOpts, 'recipientType' | 'clientId'>
): void {
  createNotification({ ...opts, recipientType: 'client', clientId });
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
