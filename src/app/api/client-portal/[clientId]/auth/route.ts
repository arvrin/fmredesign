/**
 * Client Portal Authentication API
 * Handles client access token generation and validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import crypto from 'crypto';

// Simple token storage (in production, use a database)
const clientTokens = new Map<string, { clientId: string; expires: number; email: string }>();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const body = await request.json();
    const { email, requestAccess } = body;

    if (!clientId || !email) {
      return NextResponse.json(
        { success: false, error: 'Client ID and email are required' },
        { status: 400 }
      );
    }

    const sheetsService = new GoogleSheetsService();
    
    // Verify client exists and email matches
    let clientsData: any[][];
    try {
      clientsData = await sheetsService.readSheet('Clients');
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    if (clientsData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Find client and verify email
    const headers = clientsData[0];
    const clients = clientsData.slice(1).map(row => {
      const client: any = {};
      headers.forEach((header: string, index: number) => {
        if (header && row[index] !== undefined) {
          client[header] = row[index];
        }
      });
      return client;
    });

    const client = clients.find((c: any) => c.id === clientId);
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Check if email matches any authorized emails for this client
    const authorizedEmails = [
      client.primaryContactEmail,
      client.email,
      ...(client.additionalEmails ? client.additionalEmails.split(',').map((e: string) => e.trim()) : [])
    ].filter(Boolean);

    if (!authorizedEmails.some((authorizedEmail: string) => 
      authorizedEmail.toLowerCase() === email.toLowerCase()
    )) {
      return NextResponse.json(
        { success: false, error: 'Email not authorized for this client' },
        { status: 403 }
      );
    }

    if (requestAccess) {
      // Generate secure access token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

      // Store token
      clientTokens.set(token, { clientId, expires, email });

      // In a real application, you would send this token via email
      // For now, we'll return it directly
      return NextResponse.json({
        success: true,
        data: {
          token,
          clientId,
          expires: new Date(expires).toISOString(),
          portalUrl: `/client/${clientId}?token=${token}`
        },
        message: 'Access token generated successfully'
      });
    }

    // If just checking access, return success
    return NextResponse.json({
      success: true,
      data: {
        clientId,
        clientName: client.name || client.companyName,
        authorizedEmail: email
      }
    });

  } catch (error) {
    console.error('Error handling client authentication:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const { searchParams } = request.nextUrl;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Access token is required' },
        { status: 401 }
      );
    }

    const tokenData = clientTokens.get(token);
    if (!tokenData) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (tokenData.expires < Date.now()) {
      clientTokens.delete(token);
      return NextResponse.json(
        { success: false, error: 'Token has expired' },
        { status: 401 }
      );
    }

    if (tokenData.clientId !== clientId) {
      return NextResponse.json(
        { success: false, error: 'Token not valid for this client' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        clientId: tokenData.clientId,
        email: tokenData.email,
        expires: new Date(tokenData.expires).toISOString()
      }
    });

  } catch (error) {
    console.error('Error validating client token:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Token validation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}