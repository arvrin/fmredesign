/**
 * One-time migration script: Google Sheets → Supabase
 * Run with:  npx tsx scripts/migrate-all-to-supabase.ts
 *
 * - Reads from Google Sheets via the existing service
 * - Upserts into Supabase
 * - Logs counts and verifies by reading back
 * - Does NOT delete Sheets data (rollback safety)
 */

import 'dotenv/config';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

// ─── Config ─────────────────────────────────────────────────

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function readSheet(sheets: any, sheetName: string): Promise<Record<string, any>[]> {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:BZ1000`,
    });
    const rows: any[][] = res.data.values || [];
    if (rows.length < 2) return [];
    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const obj: Record<string, any> = {};
      headers.forEach((h: string, i: number) => {
        obj[h] = row[i] ?? null;
      });
      return obj;
    });
  } catch (e: any) {
    console.warn(`  [SKIP] Could not read sheet "${sheetName}": ${e.message}`);
    return [];
  }
}

// ─── Leads Migration ────────────────────────────────────────

async function migrateLeads(sheets: any) {
  console.log('\n--- Migrating Leads ---');
  const rows = await readSheet(sheets, 'Leads');
  console.log(`  Sheets rows: ${rows.length}`);
  if (rows.length === 0) return;

  const records = rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone || null,
    company: r.company,
    website: r.website || null,
    job_title: r.jobTitle || null,
    company_size: r.companySize || null,
    industry: r.industry || null,
    project_type: r.projectType || null,
    project_description: r.projectDescription || '',
    budget_range: r.budgetRange || null,
    timeline: r.timeline || null,
    primary_challenge: r.primaryChallenge || '',
    additional_challenges: safeJsonParse(r.additionalChallenges, []),
    specific_requirements: r.specificRequirements || null,
    status: r.status || 'new',
    priority: r.priority || 'cool',
    source: r.source || 'website_form',
    lead_score: parseInt(r.leadScore) || 0,
    assigned_to: r.assignedTo || null,
    next_action: r.nextAction || null,
    follow_up_date: r.followUpDate || null,
    notes: r.notes || '',
    tags: safeJsonParse(r.tags, []),
    created_at: r.createdAt || new Date().toISOString(),
    updated_at: r.updatedAt || new Date().toISOString(),
  }));

  const { error } = await supabase.from('leads').upsert(records, { onConflict: 'id' });
  if (error) console.error('  ERROR:', error.message);
  else console.log(`  Upserted ${records.length} leads`);

  // Verify
  const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true });
  console.log(`  Supabase count: ${count}`);
}

// ─── Invoices Migration ─────────────────────────────────────

async function migrateInvoices(sheets: any) {
  console.log('\n--- Migrating Invoices ---');
  const rows = await readSheet(sheets, 'Invoices');
  console.log(`  Sheets rows: ${rows.length}`);
  if (rows.length === 0) return;

  const records = rows.map((r) => ({
    id: r.id,
    invoice_number: r.invoiceNumber,
    client_id: r.clientId,
    client_name: r.clientName,
    date: r.date,
    due_date: r.dueDate,
    subtotal: parseFloat(r.subtotal) || 0,
    tax: parseFloat(r.tax) || 0,
    total: parseFloat(r.total) || 0,
    status: r.status || 'draft',
    line_items: safeJsonParse(r.lineItems, []),
    notes: r.notes || '',
    created_at: r.createdAt || new Date().toISOString(),
  }));

  const { error } = await supabase.from('invoices').upsert(records, { onConflict: 'id' });
  if (error) console.error('  ERROR:', error.message);
  else console.log(`  Upserted ${records.length} invoices`);

  const { count } = await supabase.from('invoices').select('*', { count: 'exact', head: true });
  console.log(`  Supabase count: ${count}`);
}

// ─── Authorized Users Migration ─────────────────────────────

async function migrateAuthorizedUsers(sheets: any) {
  console.log('\n--- Migrating Authorized Users ---');
  const rows = await readSheet(sheets, 'Authorized_Users');
  console.log(`  Sheets rows: ${rows.length}`);
  if (rows.length === 0) return;

  const records = rows.map((r) => ({
    id: r.id,
    mobile_number: r.mobileNumber,
    name: r.name,
    email: r.email,
    role: r.role || 'viewer',
    permissions: r.permissions || '',
    status: r.status || 'active',
    created_by: r.createdBy || 'system',
    last_login: r.lastLogin || null,
    notes: r.notes || '',
    created_at: r.createdAt || new Date().toISOString(),
    updated_at: r.updatedAt || new Date().toISOString(),
  }));

  const { error } = await supabase.from('authorized_users').upsert(records, { onConflict: 'id' });
  if (error) console.error('  ERROR:', error.message);
  else console.log(`  Upserted ${records.length} authorized users`);

  const { count } = await supabase.from('authorized_users').select('*', { count: 'exact', head: true });
  console.log(`  Supabase count: ${count}`);
}

// ─── Helpers ────────────────────────────────────────────────

function safeJsonParse(val: any, fallback: any): any {
  if (!val || val === '') return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

// ─── Main ───────────────────────────────────────────────────

async function main() {
  console.log('=== Google Sheets → Supabase Migration ===');
  console.log(`Spreadsheet: ${SPREADSHEET_ID}`);
  console.log(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

  const sheets = await getSheets();

  await migrateLeads(sheets);
  await migrateInvoices(sheets);
  await migrateAuthorizedUsers(sheets);

  console.log('\n=== Migration Complete ===');
  console.log('Google Sheets data was NOT deleted (rollback safety).');
  console.log('Verify data in Supabase dashboard before proceeding.');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
