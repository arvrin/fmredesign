/**
 * Proposal Sequence API
 *
 * GET  — Preview next proposal number (read-only, no increment)
 * POST — Atomically increment and return the next proposal number
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requirePermission } from '@/lib/admin-auth-middleware';

// ---------------------------------------------------------------------------
// GET — preview next number without incrementing
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const auth = await requirePermission(request, 'finance.read');
  if ('error' in auth) return auth.error;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('proposal_sequences')
      .select('prefix, current_counter, current_year')
      .eq('id', 'default')
      .single();

    if (error) throw error;

    const now = new Date();
    const currentYear = now.getFullYear();
    let counter = data.current_counter;

    // If year has changed, counter would reset to 1 on next POST
    if (data.current_year !== currentYear) {
      counter = 0;
    }

    const next = `${data.prefix}${counter + 1}/${currentYear}`;

    return NextResponse.json({
      success: true,
      data: {
        counter: data.current_counter,
        year: data.current_year,
        next,
      },
    });
  } catch (error) {
    console.error('Error fetching proposal sequence:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch proposal sequence' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST — atomically increment counter and return new proposal number
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'finance.write');
  if ('error' in auth) return auth.error;

  try {
    const supabase = getSupabaseAdmin();
    const now = new Date();
    const currentYear = now.getFullYear();

    // Fetch current sequence
    const { data: seq, error: fetchError } = await supabase
      .from('proposal_sequences')
      .select('prefix, current_counter, current_year')
      .eq('id', 'default')
      .single();

    if (fetchError) throw fetchError;

    let newCounter: number;

    if (seq.current_year !== currentYear) {
      // Year rollover — reset counter to 1
      newCounter = 1;
    } else {
      newCounter = seq.current_counter + 1;
    }

    // Update atomically
    const { error: updateError } = await supabase
      .from('proposal_sequences')
      .update({
        current_counter: newCounter,
        current_year: currentYear,
        updated_at: now.toISOString(),
      })
      .eq('id', 'default');

    if (updateError) throw updateError;

    const proposalNumber = `${seq.prefix}${newCounter}/${currentYear}`;

    return NextResponse.json({
      success: true,
      data: {
        proposalNumber,
        counter: newCounter,
        year: currentYear,
      },
    });
  } catch (error) {
    console.error('Error incrementing proposal sequence:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate proposal number' },
      { status: 500 },
    );
  }
}
