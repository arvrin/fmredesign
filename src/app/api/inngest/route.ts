/**
 * Inngest API Route Handler
 * Single endpoint for Inngest to discover and invoke functions.
 * Supports: GET (introspection), POST (invoke), PUT (register)
 */

import { serve } from 'inngest/next';
import { inngest, allFunctions } from '@/lib/inngest';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: allFunctions,
});
