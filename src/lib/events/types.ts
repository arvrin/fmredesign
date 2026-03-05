/**
 * Platform event type definitions.
 * Separated from emitter.ts so these constants can be imported in client components
 * without pulling in server-only dependencies (Inngest, EventEmitter).
 */

export interface EventPayload {
  entityId: string;
  actor: { id: string; name: string };
  timestamp: string;
  data?: Record<string, unknown>;
}

export const ALL_EVENT_TYPES = [
  'proposal.sent',
  'proposal.approved',
  'proposal.declined',
  'invoice.sent',
  'invoice.paid',
  'invoice.overdue',
  'content.published',
  'content.approved',
  'content.revision_requested',
  'contract.sent',
  'contract.signed',
  'contract.rejected',
  'client.created',
  'client.updated',
  'project.created',
  'project.completed',
  'project.status_changed',
  'document.shared',
  'ticket.created',
  'ticket.resolved',
  'team.member_added',
  'lead.created',
  'lead.converted',
  'lead.status_changed',
] as const;

export type EventType = (typeof ALL_EVENT_TYPES)[number];
