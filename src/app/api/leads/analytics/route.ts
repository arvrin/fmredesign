/**
 * Lead Analytics API Route
 * Provides lead analytics and dashboard statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { leadService } from '@/lib/admin/lead-service';

// GET /api/leads/analytics - Get comprehensive lead analytics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'full';
    
    switch (type) {
      case 'dashboard':
        // Get dashboard-specific stats
        const dashboardStats = await leadService.getDashboardStats();
        return NextResponse.json({
          success: true,
          data: dashboardStats
        });
        
      case 'full':
      default:
        // Get comprehensive analytics
        const analytics = await leadService.getLeadAnalytics();
        return NextResponse.json({
          success: true,
          data: analytics
        });
    }
    
  } catch (error) {
    console.error('Error fetching lead analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch lead analytics',
      },
      { status: 500 }
    );
  }
}