/**
 * Typed event bus for the FreakingMinds platform.
 * Routes events through Inngest for durable, cross-deploy processing.
 * The EventEmitter is kept for backward compatibility but Inngest handles fan-out.
 *
 * NOTE: Type definitions are in ./types.ts so they can be imported in client
 * components without pulling in server-only dependencies.
 */

import { EventEmitter } from 'events';
import type { EventType, EventPayload } from './types';

// Re-export types so existing imports from emitter.ts continue to work
export { ALL_EVENT_TYPES } from './types';
export type { EventType, EventPayload } from './types';

// ---------------------------------------------------------------------------
// Singleton event bus (kept for backward compatibility)
// ---------------------------------------------------------------------------

class AppEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
  }

  emitEvent(type: EventType, payload: EventPayload): void {
    this.emit(type, type, payload);
    this.emit('*', type, payload);
  }

  onEvent(type: EventType | '*', handler: (eventType: EventType, payload: EventPayload) => void): void {
    this.on(type, handler);
  }
}

export const eventBus = new AppEventBus();

/**
 * Convenience function for emitting events from API routes.
 * Routes through Inngest for durable fan-out (notifications, audit, webhooks).
 * Falls back to local EventEmitter if Inngest is unreachable.
 */
export async function emitEvent(type: EventType, payload: EventPayload): Promise<void> {
  try {
    // Dynamic import to avoid bundling Inngest in client-side code
    const { inngest } = await import('@/lib/inngest/client');
    await inngest.send({
      name: 'platform/event',
      data: {
        eventType: type,
        entityId: payload.entityId,
        actor: payload.actor,
        timestamp: payload.timestamp,
        data: payload.data,
      },
    });
  } catch (err) {
    console.error(`Inngest event failed (${type}), falling back to local emitter:`, err);
    try {
      eventBus.emitEvent(type, payload);
    } catch (localErr) {
      console.error(`Event bus fallback error (${type}):`, localErr);
    }
  }
}
