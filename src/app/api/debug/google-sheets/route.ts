/**
 * Debug endpoint to check Google Sheets initialization status
 * This helps identify issues with the Vercel deployment
 */

import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      envVarsPresent: {
        GOOGLE_PROJECT_ID: !!process.env.GOOGLE_PROJECT_ID,
        GOOGLE_PRIVATE_KEY_ID: !!process.env.GOOGLE_PRIVATE_KEY_ID,
        GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
        GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
        GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
        NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID: !!process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID,
      },
      envVarLengths: {
        privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL?.substring(0, 20) + '...',
        projectId: process.env.GOOGLE_PROJECT_ID,
        spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID,
      }
    };

    // Try to fetch clients
    try {
      const clients = await googleSheetsService.getClients();
      diagnostics.clientsFetch = {
        success: true,
        clientCount: clients.length,
        clientNames: clients.slice(0, 5).map(c => c.name),
      };
    } catch (error) {
      diagnostics.clientsFetch = {
        success: false,
        error: (error as Error).message,
        stack: (error as Error).stack?.split('\n').slice(0, 3),
      };
    }

    return NextResponse.json({
      success: true,
      diagnostics
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      stack: (error as Error).stack
    }, { status: 500 });
  }
}
