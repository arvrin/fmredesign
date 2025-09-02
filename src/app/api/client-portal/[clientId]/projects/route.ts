/**
 * Client Portal Projects API
 * Provides client-specific project information
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import type { Project } from '@/lib/admin/project-types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const sheetsService = new GoogleSheetsService();
    
    // Get projects data from Google Sheets
    let projectsData: any[][];
    try {
      projectsData = await sheetsService.readSheet('Projects');
    } catch (error) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }

    if (projectsData.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }

    // Convert to objects
    const headers = projectsData[0];
    const allProjects = projectsData.slice(1).map(row => {
      const project: any = {};
      headers.forEach((header: string, index: number) => {
        if (header && row[index] !== undefined) {
          project[header] = row[index];
        }
      });
      return project;
    });

    // Filter projects for this client
    let clientProjects = allProjects.filter((project: any) => project.clientId === clientId);

    // Apply status filter if specified
    if (status) {
      const statusList = status.split(',');
      clientProjects = clientProjects.filter((project: any) => statusList.includes(project.status));
    }

    // Sort by most recent first
    clientProjects.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || a.startDate);
      const dateB = new Date(b.createdAt || b.startDate);
      return dateB.getTime() - dateA.getTime();
    });

    // Limit results
    if (limit > 0) {
      clientProjects = clientProjects.slice(0, limit);
    }

    // Transform projects for client view
    const transformedProjects = clientProjects.map(transformProjectForClient);

    return NextResponse.json({
      success: true,
      data: transformedProjects,
      total: transformedProjects.length
    });

  } catch (error) {
    console.error('Error fetching client projects:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Transform project data for client view (removing internal details)
 */
function transformProjectForClient(data: any) {
  return {
    id: data.id || '',
    name: data.name || 'Untitled Project',
    description: data.description || '',
    type: data.type || 'social_media',
    status: data.status || 'planning',
    priority: data.priority || 'medium',
    
    // Timeline
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    estimatedHours: parseInt(data.estimatedHours) || 0,
    
    // Progress and milestones (client-safe info)
    progress: parseInt(data.progress) || 0,
    milestones: data.milestones ? JSON.parse(data.milestones).map((m: any) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      dueDate: m.dueDate,
      isCompleted: m.isCompleted,
      completedAt: m.completedAt
    })) : [],
    
    // Deliverables (client-visible only)
    deliverables: data.deliverables ? JSON.parse(data.deliverables).filter((d: any) => !d.internal).map((d: any) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      type: d.type,
      status: d.status,
      dueDate: d.dueDate,
      files: d.files || []
    })) : [],
    
    // Budget (limited info)
    budget: parseFloat(data.budget) || 0,
    
    // Content requirements
    contentRequirements: data.contentRequirements ? JSON.parse(data.contentRequirements) : {
      postsPerWeek: 0,
      platforms: [],
      contentTypes: []
    },
    
    // Client satisfaction
    clientSatisfaction: parseFloat(data.clientSatisfaction) || undefined,
    
    // Tags and basic metadata
    tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || ''
  };
}