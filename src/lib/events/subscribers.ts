/**
 * Event bus subscribers.
 * Automatically registered when this module is imported.
 * Maps platform events to notifications, emails, audit log, and outgoing webhooks.
 */

import { eventBus, EventType, EventPayload } from './emitter';
import { notifyAdmins, notifyClient } from '@/lib/notifications';
import type { NotificationType } from '@/lib/notifications';
import { logAuditEvent } from '@/lib/admin/audit-log';
import type { AuditAction } from '@/lib/admin/audit-log';

// ---------------------------------------------------------------------------
// Notification subscriber
// ---------------------------------------------------------------------------

const eventToNotificationType: Partial<Record<EventType, NotificationType>> = {
  'proposal.sent': 'proposal_sent',
  'proposal.approved': 'proposal_approved',
  'proposal.declined': 'proposal_declined',
  'invoice.sent': 'invoice_sent',
  'invoice.paid': 'general',
  'invoice.overdue': 'invoice_overdue',
  'content.published': 'content_published',
  'content.approved': 'content_approved',
  'content.revision_requested': 'content_revision_requested',
  'contract.sent': 'contract_sent',
  'contract.signed': 'contract_accepted',
  'contract.rejected': 'contract_rejected',
  'ticket.created': 'ticket_created',
  'ticket.resolved': 'ticket_status_updated',
  'document.shared': 'document_shared',
  'project.created': 'project_created',
  'project.status_changed': 'project_status_changed',
  'team.member_added': 'team_member_assigned',
};

function notificationSubscriber(eventType: EventType, payload: EventPayload): void {
  const notifType = eventToNotificationType[eventType];
  if (!notifType) return;

  const title = eventType.replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Notify admins for all events
  notifyAdmins({
    type: notifType,
    title,
    message: `${eventType} by ${payload.actor.name}`,
    metadata: { entityId: payload.entityId, eventType },
  });

  // Notify specific client if clientId is in the data
  const clientId = payload.data?.clientId as string | undefined;
  if (clientId) {
    notifyClient(clientId, {
      type: notifType,
      title,
      message: `${eventType} event`,
      metadata: { entityId: payload.entityId, eventType },
    });
  }
}

// ---------------------------------------------------------------------------
// Audit subscriber
// ---------------------------------------------------------------------------

const eventToAuditAction: Partial<Record<EventType, AuditAction>> = {
  'client.created': 'create',
  'client.updated': 'update',
  'project.created': 'create',
  'project.completed': 'update',
  'content.published': 'publish',
  'content.approved': 'approve',
  'contract.signed': 'approve',
  'contract.rejected': 'reject',
  'proposal.approved': 'approve',
  'proposal.declined': 'reject',
  'ticket.created': 'create',
  'lead.created': 'create',
};

function auditSubscriber(eventType: EventType, payload: EventPayload): void {
  const action = eventToAuditAction[eventType];
  if (!action) return;

  const resourceType = eventType.split('.')[0];

  logAuditEvent({
    user_id: payload.actor.id,
    user_name: payload.actor.name,
    action,
    resource_type: resourceType,
    resource_id: payload.entityId,
    details: { event: eventType, ...payload.data },
  });
}

// ---------------------------------------------------------------------------
// Webhook subscriber (delivers to outgoing webhooks — Phase 6)
// ---------------------------------------------------------------------------

async function webhookSubscriber(eventType: EventType, payload: EventPayload): Promise<void> {
  // Dynamically import to avoid circular dependency and allow Phase 6 to be added later
  try {
    const { deliverToSubscribers } = await import('@/lib/webhooks/deliver');
    await deliverToSubscribers(eventType, payload);
  } catch {
    // deliver.ts may not exist yet or import may fail — silently ignore
  }
}

// ---------------------------------------------------------------------------
// Register all subscribers
// ---------------------------------------------------------------------------

eventBus.onEvent('*', notificationSubscriber);
eventBus.onEvent('*', auditSubscriber);
eventBus.onEvent('*', (eventType, payload) => {
  webhookSubscriber(eventType, payload).catch(() => {});
});
