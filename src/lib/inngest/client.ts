/**
 * Inngest Client Singleton
 * Typed client for sending events to Inngest durable job queue.
 */

import { EventSchemas, Inngest } from 'inngest';
import type { InngestEvents } from './events';

export const inngest = new Inngest({
  id: 'freakingminds',
  schemas: new EventSchemas().fromRecord<InngestEvents>(),
});
