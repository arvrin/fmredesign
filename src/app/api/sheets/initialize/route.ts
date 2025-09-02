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
        message: 'Google Sheets initialized successfully with GST and address fields',
        details: {
          updated: 'Added gstNumber field and enhanced client structure',
          clientFields: [
            'id', 'name', 'email', 'phone', 'address', 'city', 'state', 
            'zipCode', 'country', 'gstNumber', 'industry', 'companySize', 'website',
            'status', 'health', 'accountManager', 'contractType', 'contractValue',
            'contractStartDate', 'contractEndDate', 'billingCycle', 'services',
            'createdAt', 'updatedAt', 'totalValue', 'tags', 'notes'
          ]
        }
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to initialize Google Sheets',
          message: 'Please check your Google Sheets API credentials and permissions'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initialize Google Sheets', 
        details: error instanceof Error ? error.message : String(error),
        troubleshooting: [
          'Verify GOOGLE_SPREADSHEET_ID is set',
          'Check Google service account credentials',
          'Ensure spreadsheet is shared with service account email',
          'Verify API permissions are granted'
        ]
      },
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