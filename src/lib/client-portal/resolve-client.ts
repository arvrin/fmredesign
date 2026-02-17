/**
 * Shared helper to resolve a client slug or ID to the real client record.
 * Used by all /api/client-portal/[clientId]/* routes.
 */

import { supabaseAdmin } from '@/lib/supabase';

export async function resolveClientId(
  slugOrId: string
): Promise<{ id: string; slug: string } | null> {
  // Try slug first
  const { data: bySlug } = await supabaseAdmin
    .from('clients')
    .select('id, slug')
    .eq('slug', slugOrId)
    .single();

  if (bySlug) return { id: bySlug.id, slug: bySlug.slug };

  // Fall back to id
  const { data: byId } = await supabaseAdmin
    .from('clients')
    .select('id, slug')
    .eq('id', slugOrId)
    .single();

  if (byId) return { id: byId.id, slug: byId.slug };

  return null;
}
