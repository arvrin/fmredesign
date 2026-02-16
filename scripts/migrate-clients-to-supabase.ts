/**
 * One-time migration script: Google Sheets → Supabase (clients table only)
 *
 * Usage:
 *   npx tsx scripts/migrate-clients-to-supabase.ts
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   GOOGLE_SHEETS_PRIVATE_KEY
 *   GOOGLE_SHEETS_CLIENT_EMAIL
 *   GOOGLE_SHEETS_SPREADSHEET_ID
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load env vars from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('Starting client migration from Google Sheets to Supabase...\n');

  // Dynamically import the Google Sheets service (it reads env vars at module level)
  const { googleSheetsService } = await import('../src/lib/google-sheets');

  let clients: any[];
  try {
    clients = await googleSheetsService.getClients();
    console.log(`Found ${clients.length} clients in Google Sheets.\n`);
  } catch (err) {
    console.error('Failed to read clients from Google Sheets:', err);
    process.exit(1);
  }

  let success = 0;
  let failed = 0;

  for (const client of clients) {
    const row = {
      id: client.id,
      name: client.name || client.companyName || '',
      email: client.email || client.primaryContactEmail || '',
      phone: client.phone || client.primaryContactPhone || null,
      industry: client.industry || 'other',
      website: client.website || null,
      address: client.street || client.address || null,
      city: client.city || null,
      state: client.state || null,
      zip_code: client.zipCode || null,
      country: client.country || 'India',
      gst_number: client.gstNumber || null,
      status: client.status || 'active',
      health: client.health || 'good',
      account_manager: client.accountManager || null,
      contract_type: client.contractType || null,
      contract_value: parseFloat(client.contractValue || client.totalValue || '0') || 0,
      contract_start_date: client.contractStartDate || client.createdAt || null,
      contract_end_date: client.contractEndDate || null,
      billing_cycle: client.billingCycle || 'monthly',
      total_value: parseFloat(client.totalValue || client.contractValue || '0') || 0,
      portal_password: null, // Admin sets this manually
      created_at: client.createdAt || new Date().toISOString(),
      updated_at: client.updatedAt || new Date().toISOString(),
    };

    const { error } = await supabase.from('clients').upsert([row], { onConflict: 'id' });

    if (error) {
      console.error(`  FAILED: ${row.name} (${row.id}) — ${error.message}`);
      failed++;
    } else {
      console.log(`  OK: ${row.name} (${row.id})`);
      success++;
    }
  }

  console.log(`\nMigration complete: ${success} succeeded, ${failed} failed out of ${clients.length} total.`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
