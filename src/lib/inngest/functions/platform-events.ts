/**
 * Inngest Function: Platform Event Fan-out
 * Replaces the EventEmitter + 3 wildcard subscribers with durable steps.
 * Handles: notifications, audit logging, and webhook delivery.
 */

import { inngest } from '../client';
import type { NotificationType } from '@/lib/notifications';
import type { AuditAction } from '@/lib/admin/audit-log';
import type { EventType as PlatformEventType } from '@/lib/events/types';

const eventToNotificationType: Partial<Record<PlatformEventType, NotificationType>> = {
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
  'lead.created': 'general',
  'lead.converted': 'general',
  'lead.status_changed': 'general',
};

const eventToAuditAction: Partial<Record<PlatformEventType, AuditAction>> = {
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
  'lead.converted': 'update',
  'lead.status_changed': 'update',
};

export const platformEventFanoutFn = inngest.createFunction(
  { id: 'platform-event-fanout', retries: 2 },
  { event: 'platform/event' },
  async ({ event, step }) => {
    const { eventType, entityId, actor, timestamp, data } = event.data;

    // Step 1: Send notifications
    const notifType = eventToNotificationType[eventType];
    if (notifType) {
      await step.run('send-notifications', async () => {
        const title = eventType.replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

        // Send via Inngest event (notification function will pick it up)
        await inngest.send({
          name: 'notification/send',
          data: {
            recipientType: 'admin',
            type: notifType,
            title,
            message: `${eventType} by ${actor.name}`,
            metadata: { entityId, eventType },
          },
        });

        // Also notify specific client if clientId is in the data
        const clientId = data?.clientId as string | undefined;
        if (clientId) {
          await inngest.send({
            name: 'notification/send',
            data: {
              recipientType: 'client',
              clientId,
              type: notifType,
              title,
              message: `${eventType} event`,
              metadata: { entityId, eventType },
            },
          });
        }
      });
    }

    // Step 2: Log audit event
    const action = eventToAuditAction[eventType];
    if (action) {
      await step.run('log-audit', async () => {
        const resourceType = eventType.split('.')[0];
        await inngest.send({
          name: 'audit/log',
          data: {
            user_id: actor.id,
            user_name: actor.name,
            action,
            resource_type: resourceType,
            resource_id: entityId,
            details: { event: eventType, ...data },
          },
        });
      });
    }

    // Step 3: Trigger webhook delivery
    await step.run('trigger-webhooks', async () => {
      await inngest.send({
        name: 'webhook/deliver',
        data: {
          eventType,
          payload: { entityId, actor, timestamp, data },
        },
      });
    });

    return { success: true, eventType };
  }
);
