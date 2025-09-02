/**
 * Client Portal Content API
 * Provides client-specific content calendar information
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import type { ContentItem } from '@/lib/admin/project-types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const sheetsService = new GoogleSheetsService();
    
    // Get content data from Google Sheets
    let contentData: any[][];
    try {
      contentData = await sheetsService.readSheet('Content_Calendar');
    } catch (error) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }

    if (contentData.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }

    // Convert to objects
    const headers = contentData[0];
    const allContent = contentData.slice(1).map(row => {
      const content: any = {};
      headers.forEach((header: string, index: number) => {
        if (header && row[index] !== undefined) {
          content[header] = row[index];
        }
      });
      return content;
    });

    // Filter content for this client
    let clientContent = allContent.filter((content: any) => content.clientId === clientId);

    // Apply filters
    if (status) {
      const statusList = status.split(',');
      clientContent = clientContent.filter((content: any) => statusList.includes(content.status));
    }

    if (platform) {
      const platformList = platform.split(',');
      clientContent = clientContent.filter((content: any) => platformList.includes(content.platform));
    }

    if (type) {
      const typeList = type.split(',');
      clientContent = clientContent.filter((content: any) => typeList.includes(content.type));
    }

    // Date range filtering
    if (startDate && endDate) {
      clientContent = clientContent.filter((content: any) => {
        const contentDate = new Date(content.scheduledDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return contentDate >= start && contentDate <= end;
      });
    } else if (startDate) {
      clientContent = clientContent.filter((content: any) => {
        const contentDate = new Date(content.scheduledDate);
        const start = new Date(startDate);
        return contentDate >= start;
      });
    } else if (endDate) {
      clientContent = clientContent.filter((content: any) => {
        const contentDate = new Date(content.scheduledDate);
        const end = new Date(endDate);
        return contentDate <= end;
      });
    }

    // Sort by scheduled date (most recent first)
    clientContent.sort((a: any, b: any) => {
      const dateA = new Date(a.scheduledDate);
      const dateB = new Date(b.scheduledDate);
      return dateB.getTime() - dateA.getTime();
    });

    // Limit results
    if (limit > 0) {
      clientContent = clientContent.slice(0, limit);
    }

    // Transform content for client view
    const transformedContent = clientContent.map(transformContentForClient);

    return NextResponse.json({
      success: true,
      data: transformedContent,
      total: transformedContent.length
    });

  } catch (error) {
    console.error('Error fetching client content:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Transform content data for client view (removing internal details)
 */
function transformContentForClient(data: any): any {
  return {
    id: data.id || '',
    projectId: data.projectId || '',
    
    // Content Details
    title: data.title || 'Untitled Content',
    description: data.description || '',
    content: data.content || '', // Full content text for client review
    type: data.type || 'post',
    platform: data.platform || 'instagram',
    
    // Scheduling
    scheduledDate: data.scheduledDate || '',
    publishedDate: data.publishedDate || undefined,
    status: data.status || 'draft',
    
    // Assets (client-visible)
    imageUrl: data.imageUrl || undefined,
    videoUrl: data.videoUrl || undefined,
    files: data.files ? JSON.parse(data.files) : [],
    
    // Client interaction
    clientFeedback: data.clientFeedback || undefined,
    revisionNotes: data.revisionNotes || undefined,
    approvedAt: data.approvedAt || undefined,
    
    // Performance metrics (if published)
    engagement: data.engagement ? JSON.parse(data.engagement) : undefined,
    
    // Metadata (client-safe)
    hashtags: data.hashtags ? JSON.parse(data.hashtags) : [],
    mentions: data.mentions ? JSON.parse(data.mentions) : [],
    tags: data.tags ? JSON.parse(data.tags) : [],
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || ''
  };
}