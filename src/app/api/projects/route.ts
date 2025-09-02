/**
 * Projects API Routes
 * Handles CRUD operations for project management
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import type { Project, ProjectInput, ProjectUpdate } from '@/lib/admin/project-types';
import { ProjectUtils } from '@/lib/admin/project-types';

const SHEET_NAME = 'Projects';

// GET /api/projects - Fetch all projects with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const assignedTo = searchParams.get('assignedTo');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';
    
    const sheetsService = new GoogleSheetsService();
    
    // Get all projects from Google Sheets
    let projectsData: any[][];
    try {
      projectsData = await sheetsService.readSheet(SHEET_NAME);
    } catch (error) {
      // Sheet doesn't exist yet, return empty data
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }
    
    // Skip header row and convert to objects
    if (projectsData.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }
    
    const headers = projectsData[0];
    let projects = projectsData.slice(1).map(row => {
      const project: any = {};
      headers.forEach((header: string, index: number) => {
        if (header && row[index] !== undefined) {
          project[header] = row[index];
        }
      });
      return project;
    });
    
    // Apply filters
    if (clientId) {
      projects = projects.filter((project: any) => project.clientId === clientId);
    }
    
    if (status) {
      const statusList = status.split(',');
      projects = projects.filter((project: any) => statusList.includes(project.status));
    }
    
    if (type) {
      const typeList = type.split(',');
      projects = projects.filter((project: any) => typeList.includes(project.type));
    }
    
    if (assignedTo) {
      projects = projects.filter((project: any) => {
        const assignedTalent = project.assignedTalent ? 
          JSON.parse(project.assignedTalent) : [];
        return assignedTalent.includes(assignedTo) || project.projectManager === assignedTo;
      });
    }
    
    // Sort projects
    projects.sort((a: any, b: any) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortDirection === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    
    // Transform data for response
    const transformedProjects = projects.map((project: any) => ({
      ...project,
      milestones: project.milestones ? JSON.parse(project.milestones) : [],
      deliverables: project.deliverables ? JSON.parse(project.deliverables) : [],
      assignedTalent: project.assignedTalent ? JSON.parse(project.assignedTalent) : [],
      contentRequirements: project.contentRequirements ? JSON.parse(project.contentRequirements) : {},
      tags: project.tags ? JSON.parse(project.tags) : [],
      invoiceIds: project.invoiceIds ? JSON.parse(project.invoiceIds) : []
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedProjects,
      total: transformedProjects.length
    });
    
  } catch (error) {
    console.error('Error fetching projects:', error);
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

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['clientId', 'name', 'type', 'startDate', 'endDate', 'projectManager', 'budget'];
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
    
    // Create project object
    const projectInput: ProjectInput = {
      clientId: body.clientId,
      discoveryId: body.discoveryId,
      name: body.name.trim(),
      description: body.description?.trim() || '',
      type: body.type,
      priority: body.priority || 'medium',
      startDate: body.startDate,
      endDate: body.endDate,
      estimatedHours: body.estimatedHours || 0,
      projectManager: body.projectManager,
      assignedTalent: body.assignedTalent || [],
      budget: parseFloat(body.budget),
      hourlyRate: parseFloat(body.hourlyRate) || 0,
      contentRequirements: body.contentRequirements || {
        postsPerWeek: 0,
        platforms: [],
        contentTypes: []
      },
      tags: body.tags || [],
      notes: body.notes?.trim() || ''
    };
    
    const newProject: Project = {
      id: ProjectUtils.generateProjectId(),
      ...projectInput,
      status: 'planning',
      milestones: [],
      deliverables: [],
      invoiceIds: [],
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const sheetsService = new GoogleSheetsService();
    
    // Transform project for Google Sheets (serialize arrays/objects)
    const projectForSheets = {
      ...newProject,
      milestones: JSON.stringify(newProject.milestones),
      deliverables: JSON.stringify(newProject.deliverables),
      assignedTalent: JSON.stringify(newProject.assignedTalent),
      contentRequirements: JSON.stringify(newProject.contentRequirements),
      tags: JSON.stringify(newProject.tags),
      invoiceIds: JSON.stringify(newProject.invoiceIds)
    };
    
    // Convert to array format for Google Sheets
    const projectValues = Object.values(projectForSheets);
    await sheetsService.appendToSheet(SHEET_NAME, [projectValues]);
    
    return NextResponse.json({
      success: true,
      data: newProject,
      message: 'Project created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/projects - Update project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    const sheetsService = new GoogleSheetsService();
    
    // Get existing project
    const projectsData = await sheetsService.readSheet(SHEET_NAME);
    if (projectsData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No projects found' },
        { status: 404 }
      );
    }
    
    const headers = projectsData[0];
    const projects = projectsData.slice(1).map(row => {
      const project: any = {};
      headers.forEach((header: string, index: number) => {
        if (header && row[index] !== undefined) {
          project[header] = row[index];
        }
      });
      return project;
    });
    const projectIndex = projects.findIndex((p: any) => p.id === body.id);
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    const existingProject = projects[projectIndex];
    
    // Create update object
    const updates: ProjectUpdate = {
      name: body.name,
      description: body.description,
      status: body.status,
      priority: body.priority,
      endDate: body.endDate,
      progress: body.progress,
      assignedTalent: body.assignedTalent,
      notes: body.notes,
      clientSatisfaction: body.clientSatisfaction
    };
    
    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key as keyof ProjectUpdate] === undefined) {
        delete updates[key as keyof ProjectUpdate];
      }
    });
    
    // Merge with existing project
    const updatedProject = {
      ...existingProject,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Handle array fields properly
    if (body.milestones) updatedProject.milestones = JSON.stringify(body.milestones);
    if (body.deliverables) updatedProject.deliverables = JSON.stringify(body.deliverables);
    if (body.assignedTalent) updatedProject.assignedTalent = JSON.stringify(body.assignedTalent);
    if (body.contentRequirements) updatedProject.contentRequirements = JSON.stringify(body.contentRequirements);
    if (body.tags) updatedProject.tags = JSON.stringify(body.tags);
    if (body.invoiceIds) updatedProject.invoiceIds = JSON.stringify(body.invoiceIds);
    
    // Update in Google Sheets
    projects[projectIndex] = updatedProject;
    
    // Convert back to array format for Google Sheets
    const updatedProjectsData = [headers, ...projects.map(project => headers.map((header: string) => project[header] || ''))];
    await sheetsService.writeSheet(SHEET_NAME, updatedProjectsData);
    
    // Transform response data
    const responseProject = {
      ...updatedProject,
      milestones: updatedProject.milestones ? JSON.parse(updatedProject.milestones) : [],
      deliverables: updatedProject.deliverables ? JSON.parse(updatedProject.deliverables) : [],
      assignedTalent: updatedProject.assignedTalent ? JSON.parse(updatedProject.assignedTalent) : [],
      contentRequirements: updatedProject.contentRequirements ? JSON.parse(updatedProject.contentRequirements) : {},
      tags: updatedProject.tags ? JSON.parse(updatedProject.tags) : [],
      invoiceIds: updatedProject.invoiceIds ? JSON.parse(updatedProject.invoiceIds) : []
    };
    
    return NextResponse.json({
      success: true,
      data: responseProject,
      message: 'Project updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/projects - Delete project  
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('id');
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    const sheetsService = new GoogleSheetsService();
    
    // Get all projects
    const projectsData = await sheetsService.readSheet(SHEET_NAME);
    if (projectsData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No projects found' },
        { status: 404 }
      );
    }
    
    const headers = projectsData[0];
    const projects = projectsData.slice(1).map(row => {
      const project: any = {};
      headers.forEach((header: string, index: number) => {
        if (header && row[index] !== undefined) {
          project[header] = row[index];
        }
      });
      return project;
    });
    
    const filteredProjects = projects.filter((p: any) => p.id !== projectId);
    
    if (projects.length === filteredProjects.length) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Update Google Sheets with filtered data
    const updatedData = [headers, ...filteredProjects.map(project => headers.map((header: string) => project[header] || ''))];
    await sheetsService.writeSheet(SHEET_NAME, updatedData);
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}