/**
 * API Key authentication system.
 * Generates and validates API keys (prefix: fmk_) using SHA-256 hashing.
 * Returns AuthenticatedUser-compatible objects so existing requirePermission() works.
 */

import { createHash, randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { PermissionService } from '@/lib/admin/permissions';
import type { AuthenticatedUser } from '@/lib/admin-auth-middleware';

const API_KEY_PREFIX = 'fmk_';

// ---------------------------------------------------------------------------
// Key generation
// ---------------------------------------------------------------------------

export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const raw = randomBytes(32).toString('base64url');
  const key = `${API_KEY_PREFIX}${raw}`;
  const hash = createHash('sha256').update(key).digest('hex');
  const prefix = key.slice(0, 12); // "fmk_" + 8 chars
  return { key, hash, prefix };
}

// ---------------------------------------------------------------------------
// Key validation
// ---------------------------------------------------------------------------

interface ApiKeyRecord {
  id: string;
  name: string;
  permissions: string[];
  rate_limit: number;
  is_active: boolean;
  expires_at: string | null;
  created_by: string;
}

export interface ValidatedApiKey {
  keyId: string;
  name: string;
  user: AuthenticatedUser;
  rateLimit: number;
}

/**
 * Validate an API key from the Authorization header.
 * Returns the validated key info or null if invalid.
 */
export async function validateApiKey(request: NextRequest): Promise<ValidatedApiKey | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;

  if (!token || !token.startsWith(API_KEY_PREFIX)) return null;

  const hash = createHash('sha256').update(token).digest('hex');

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, permissions, rate_limit, is_active, expires_at, created_by')
      .eq('key_hash', hash)
      .single();

    if (error || !data) return null;

    const record = data as ApiKeyRecord;

    if (!record.is_active) return null;
    if (record.expires_at && new Date(record.expires_at) < new Date()) return null;

    // Fire-and-forget: update last_used_at
    supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', record.id)
      .then(() => {});

    return {
      keyId: record.id,
      name: record.name,
      rateLimit: record.rate_limit,
      user: {
        id: `api-key:${record.id}`,
        name: `API Key: ${record.name}`,
        role: 'api_key',
        permissions: record.permissions,
      },
    };
  } catch {
    return null;
  }
}

/**
 * Check if an API key user has a specific permission.
 */
export function apiKeyHasPermission(apiKey: ValidatedApiKey, permission: string): boolean {
  return PermissionService.hasPermission(apiKey.user.permissions, permission);
}

/**
 * Middleware helper: validate API key and return 401/403 or the validated key.
 */
export async function requireApiKeyAuth(
  request: NextRequest,
  permission?: string
): Promise<{ error: NextResponse } | { apiKey: ValidatedApiKey }> {
  const apiKey = await validateApiKey(request);

  if (!apiKey) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Invalid or expired API key' },
        { status: 401 }
      ),
    };
  }

  if (permission && !apiKeyHasPermission(apiKey, permission)) {
    return {
      error: NextResponse.json(
        { success: false, error: `Insufficient permissions. Required: ${permission}` },
        { status: 403 }
      ),
    };
  }

  return { apiKey };
}
