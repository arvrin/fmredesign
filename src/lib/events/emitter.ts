/**
 * Typed event bus for the FreakingMinds platform.
 * Allows decoupled event-driven communication between modules.
 * Subscribers are registered on import and fire asynchronously.
 */

import { EventEmitter } from 'events';

// ---------------------------------------------------------------------------
// Event type definitions
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Singleton event bus
// ---------------------------------------------------------------------------

class AppEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
  }

  /**
   * Emit a typed platform event.
   * All subscribers receive the event asynchronously (fire-and-forget).
   */
  emitEvent(type: EventType, payload: EventPayload): void {
    // Emit both specific event and wildcard '*' for catch-all subscribers
    this.emit(type, type, payload);
    this.emit('*', type, payload);
  }

  /**
   * Subscribe to a specific event type.
   */
  onEvent(type: EventType | '*', handler: (eventType: EventType, payload: EventPayload) => void): void {
    this.on(type, handler);
  }
}

// Singleton instance
export const eventBus = new AppEventBus();

/**
 * Convenience function for emitting events from API routes.
 * Fire-and-forget — never throws.
 */
export function emitEvent(type: EventType, payload: EventPayload): void {
  try {
    eventBus.emitEvent(type, payload);
  } catch (err) {
    console.error(`Event bus error (${type}):`, err);
  }
}
