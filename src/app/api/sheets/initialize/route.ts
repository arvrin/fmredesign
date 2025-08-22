/**
 * Google Sheets Initialization API Route
 * Sets up the initial spreadsheet structure with headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const success = await googleSheetsService.initializeSpreadsheet();
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Google Sheets initialized successfully with proper headers' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to initialize Google Sheets' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize Google Sheets', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Google Sheets initialization endpoint',
    instructions: 'Send a POST request to initialize the spreadsheet structure',
    requiredEnvironmentVariables: [
      'NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID',
      'GOOGLE_PROJECT_ID',
      'GOOGLE_PRIVATE_KEY_ID',
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_CLIENT_ID'
    ]
  });
}