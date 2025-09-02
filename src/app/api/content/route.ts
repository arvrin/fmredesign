/**
 * Content Calendar API Routes
 * Handles CRUD operations for content management
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import type { ContentItem, ContentInput, ContentUpdate } from '@/lib/admin/project-types';
import { ProjectUtils } from '@/lib/admin/project-types';

const SHEET_NAME = 'Content_Calendar';

// GET /api/content - Fetch content with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const projectId = searchParams.get('projectId');
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const platform = searchParams.get('platform');
    const assignedTo = searchParams.get('assignedTo');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || 'scheduledDate';
    const sortDirection = searchParams.get('sortDirection') || 'asc';
    
    const sheetsService = new GoogleSheetsService();
    
    // Get all content from Google Sheets
    let contentData: any[][];
    try {
      contentData = await sheetsService.readSheet(SHEET_NAME);
    } catch (error) {
      // Sheet doesn't exist yet, return empty data
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }
    
    // Skip header row and convert to objects
    if (contentData.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }
    
    const headers = contentData[0];
    let contentItems = contentData.slice(1).map(row => {
      const content: any = {};
      headers.forEach((header: string, index: number) => {
        if (header && row[index] !== undefined) {
          content[header] = row[index];
        }
      });
      return content;
    });
    
    // Apply filters
    if (projectId) {
      contentItems = contentItems.filter((item: any) => item.projectId === projectId);
    }
    
    if (clientId) {
      contentItems = contentItems.filter((item: any) => item.clientId === clientId);
    }
    
    if (status) {
      const statusList = status.split(',');
      contentItems = contentItems.filter((item: any) => statusList.includes(item.status));
    }
    
    if (type) {
      const typeList = type.split(',');
      contentItems = contentItems.filter((item: any) => typeList.includes(item.type));
    }
    
    if (platform) {
      const platformList = platform.split(',');
      contentItems = contentItems.filter((item: any) => platformList.includes(item.platform));
    }
    
    if (assignedTo) {
      contentItems = contentItems.filter((item: any) => 
        item.assignedDesigner === assignedTo || 
        item.assignedWriter === assignedTo ||
        item.assignedTo === assignedTo
      );
    }
    
    // Date range filtering
    if (startDate && endDate) {
      contentItems = contentItems.filter((item: any) => {
        const itemDate = new Date(item.scheduledDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
    }
    
    // Sort content
    contentItems.sort((a: any, b: any) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      // Handle date sorting
      if (sortBy === 'scheduledDate' || sortBy === 'createdAt') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortDirection === 'desc' ? bDate.getTime() - aDate.getTime() : aDate.getTime() - bDate.getTime();
      }
      
      if (sortDirection === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    
    // Transform data for response
    const transformedContent = contentItems.map((item: any) => ({
      ...item,
      hashtags: item.hashtags ? JSON.parse(item.hashtags) : [],
      mentions: item.mentions ? JSON.parse(item.mentions) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
      files: item.files ? JSON.parse(item.files) : [],
      engagement: item.engagement ? JSON.parse(item.engagement) : null
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedContent,
      total: transformedContent.length
    });
    
  } catch (error) {
    console.error('Error fetching content:', error);
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

// POST /api/content - Create new content item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['projectId', 'title', 'type', 'platform', 'scheduledDate'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields', 
          missingFields 
        },
        { status: 400 }
      );
    }
    
    // Get client ID from project
    let clientId = body.clientId;
    if (!clientId && body.projectId) {
      try {
        const projectsService = new GoogleSheetsService();
        await projectsService.init();
        const projects = await projectsService.readData('Projects');
        const project = projects.find((p: any) => p.id === body.projectId);
        if (project) {
          clientId = project.clientId;
        }
      } catch (error) {
        console.error('Error fetching project for clientId:', error);
      }
    }
    
    // Create content object
    const contentInput: ContentInput = {
      projectId: body.projectId,
      title: body.title.trim(),
      description: body.description?.trim() || '',
      content: body.content?.trim() || '',
      type: body.type,
      platform: body.platform,
      scheduledDate: body.scheduledDate,
      assignedDesigner: body.assignedDesigner,
      assignedWriter: body.assignedWriter,
      hashtags: body.hashtags || [],
      mentions: body.mentions || [],
      tags: body.tags || []
    };
    
    const newContent: ContentItem = {
      id: ProjectUtils.generateContentId(),
      ...contentInput,
      clientId: clientId || '',
      status: 'draft',
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const sheetsService = new GoogleSheetsService();
    
    // Transform content for Google Sheets (serialize arrays/objects)
    const contentForSheets = {
      ...newContent,
      hashtags: JSON.stringify(newContent.hashtags),
      mentions: JSON.stringify(newContent.mentions),
      tags: JSON.stringify(newContent.tags),
      files: JSON.stringify(newContent.files)
    };
    
    // Convert to array format for Google Sheets
    const contentValues = Object.values(contentForSheets);
    await sheetsService.appendToSheet(SHEET_NAME, [contentValues]);
    
    return NextResponse.json({
      success: true,
      data: newContent,
      message: 'Content created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/content - Update content item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      );
    }
    
    const sheetsService = new GoogleSheetsService();
    
    // Get existing content
    const contentData = await sheetsService.readSheet(SHEET_NAME);
    if (contentData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No content found' },
        { status: 404 }
      );
    }
    
    const headers = contentData[0];
    const contentItems = contentData.slice(1).map(row => {
      const content: any = {};
      headers.forEach((header: string, index: number) => {
        if (header && row[index] !== undefined) {
          content[header] = row[index];
        }
      });
      return content;
    });
    const contentIndex = contentItems.findIndex((c: any) => c.id === body.id);
    
    if (contentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }
    
    const existingContent = contentItems[contentIndex];
    
    // Create update object
    const updates: ContentUpdate = {
      title: body.title,
      description: body.description,
      content: body.content,
      status: body.status,
      scheduledDate: body.scheduledDate,
      assignedDesigner: body.assignedDesigner,
      assignedWriter: body.assignedWriter,
      clientFeedback: body.clientFeedback,
      revisionNotes: body.revisionNotes,
      hashtags: body.hashtags,
      mentions: body.mentions
    };
    
    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key as keyof ContentUpdate] === undefined) {
        delete updates[key as keyof ContentUpdate];
      }
    });
    
    // Handle status changes
    if (body.status === 'approved' && !existingContent.approvedAt) {
      existingContent.approvedAt = new Date().toISOString();
    }
    
    if (body.status === 'published' && !existingContent.publishedDate) {
      existingContent.publishedDate = new Date().toISOString();
    }
    
    // Merge with existing content
    const updatedContent = {
      ...existingContent,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Handle array fields properly
    if (body.hashtags) updatedContent.hashtags = JSON.stringify(body.hashtags);
    if (body.mentions) updatedContent.mentions = JSON.stringify(body.mentions);
    if (body.tags) updatedContent.tags = JSON.stringify(body.tags);
    if (body.files) updatedContent.files = JSON.stringify(body.files);
    if (body.engagement) updatedContent.engagement = JSON.stringify(body.engagement);
    
    // Update in Google Sheets
    contentItems[contentIndex] = updatedContent;
    
    // Convert back to array format for Google Sheets
    const updatedContentData = [headers, ...contentItems.map(content => headers.map((header: string) => content[header] || ''))];
    await sheetsService.writeSheet(SHEET_NAME, updatedContentData);
    
    // Transform response data
    const responseContent = {
      ...updatedContent,
      hashtags: updatedContent.hashtags ? JSON.parse(updatedContent.hashtags) : [],
      mentions: updatedContent.mentions ? JSON.parse(updatedContent.mentions) : [],
      tags: updatedContent.tags ? JSON.parse(updatedContent.tags) : [],
      files: updatedContent.files ? JSON.parse(updatedContent.files) : [],
      engagement: updatedContent.engagement ? JSON.parse(updatedContent.engagement) : null
    };
    
    return NextResponse.json({
      success: true,
      data: responseContent,
      message: 'Content updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/content - Delete content item
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contentId = searchParams.get('id');
    
    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      );
    }
    
    const sheetsService = new GoogleSheetsService();
    
    // Get all content
    const contentData = await sheetsService.readSheet(SHEET_NAME);
    if (contentData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No content found' },
        { status: 404 }
      );
    }
    
    const headers = contentData[0];
    const contentItems = contentData.slice(1).map(row => {
      const content: any = {};
      headers.forEach((header: string, index: number) => {
        if (header && row[index] !== undefined) {
          content[header] = row[index];
        }
      });
      return content;
    });
    
    const filteredContent = contentItems.filter((c: any) => c.id !== contentId);
    
    if (contentItems.length === filteredContent.length) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }
    
    // Update Google Sheets with filtered data
    const updatedData = [headers, ...filteredContent.map(content => headers.map((header: string) => content[header] || ''))];
    await sheetsService.writeSheet(SHEET_NAME, updatedData);
    
    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}