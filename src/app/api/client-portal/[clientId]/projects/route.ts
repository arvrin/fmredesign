/**
 * Client Portal Projects API
 * Provides client-specific project information from Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireClientAuth } from '@/lib/client-session';

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

    const authError = await requireClientAuth(request, clientId);
    if (authError) return authError;

    let query = supabaseAdmin
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (status) {
      const statusList = status.split(',');
      query = query.in('status', statusList);
    }

    if (limit > 0) {
      query = query.limit(limit);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error('Supabase projects query error:', error);
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }

    const transformedProjects = (projects || []).map(transformProjectForClient);

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
      },
      { status: 500 }
    );
  }
}

/**
 * Transform Supabase project row for client view (removing internal details)
 */
function transformProjectForClient(data: any) {
  const milestones = Array.isArray(data.milestones) ? data.milestones : [];
  const deliverables = Array.isArray(data.deliverables) ? data.deliverables : [];

  return {
    id: data.id || '',
    name: data.name || 'Untitled Project',
    description: data.description || '',
    type: data.type || 'social_media',
    status: data.status || 'planning',
    priority: data.priority || 'medium',

    startDate: data.start_date || '',
    endDate: data.end_date || '',
    estimatedHours: data.estimated_hours || 0,

    progress: data.progress || 0,
    milestones: milestones.map((m: any) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      dueDate: m.dueDate,
      isCompleted: m.isCompleted,
      completedAt: m.completedAt
    })),

    deliverables: deliverables
      .filter((d: any) => !d.internal)
      .map((d: any) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        type: d.type,
        status: d.status,
        dueDate: d.dueDate,
        files: d.files || []
      })),

    budget: parseFloat(data.budget) || 0,
    spent: parseFloat(data.spent) || 0,

    contentRequirements: data.content_requirements || {
      postsPerWeek: 0,
      platforms: [],
      contentTypes: []
    },

    tags: Array.isArray(data.tags) ? data.tags : [],
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || ''
  };
}
