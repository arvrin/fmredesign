/**
 * Client Portal Reports API
 * Derives report data from real projects + content_calendar data.
 * No separate reports table needed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { resolveClientId } from '@/lib/client-portal/resolve-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const client = await resolveClientId(clientId);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Fetch projects
    const { data: projects } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('client_id', client.id);

    // Fetch content calendar
    const { data: content } = await supabaseAdmin
      .from('content_calendar')
      .select('*')
      .eq('client_id', client.id)
      .order('scheduled_date', { ascending: false });

    const allProjects = projects || [];
    const allContent = content || [];

    // --- Summary Metrics ---
    const activeProjects = allProjects.filter(
      (p) => p.status === 'active' || p.status === 'review'
    ).length;
    const completedProjects = allProjects.filter(
      (p) => p.status === 'completed'
    ).length;
    const totalBudget = allProjects.reduce(
      (s, p) => s + (parseFloat(p.budget) || 0),
      0
    );
    const totalSpent = allProjects.reduce(
      (s, p) => s + (parseFloat(p.spent) || 0),
      0
    );
    const avgProgress =
      allProjects.length > 0
        ? Math.round(
            allProjects.reduce((s, p) => s + (p.progress || 0), 0) /
              allProjects.length
          )
        : 0;

    // --- Content Metrics ---
    const publishedContent = allContent.filter(
      (c) => c.status === 'published'
    );
    const totalViews = publishedContent.reduce((s, c) => {
      const eng = typeof c.engagement === 'object' ? c.engagement : {};
      return s + (eng?.views || 0);
    }, 0);
    const totalEngagement = publishedContent.reduce((s, c) => {
      const eng = typeof c.engagement === 'object' ? c.engagement : {};
      return s + (eng?.engagement || 0);
    }, 0);
    const avgEngagement =
      publishedContent.length > 0
        ? totalEngagement / publishedContent.length
        : 0;

    // --- Month-over-month content published counts ---
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

    const publishedThisMonth = publishedContent.filter(
      (c) => c.published_date && c.published_date.startsWith(thisMonth)
    ).length;
    const publishedLastMonth = publishedContent.filter(
      (c) => c.published_date && c.published_date.startsWith(lastMonth)
    ).length;

    const contentDelta =
      publishedLastMonth > 0
        ? Math.round(
            ((publishedThisMonth - publishedLastMonth) / publishedLastMonth) *
              100
          )
        : publishedThisMonth > 0
          ? 100
          : 0;

    // --- Monthly performance data (last 6 months) ---
    const monthlyPerformance = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = d.toLocaleString('en-US', { month: 'short' });

      const monthContent = allContent.filter(
        (c) =>
          c.scheduled_date && c.scheduled_date.startsWith(monthKey)
      );
      const monthPublished = monthContent.filter(
        (c) => c.status === 'published'
      );

      const views = monthPublished.reduce((s, c) => {
        const eng = typeof c.engagement === 'object' ? c.engagement : {};
        return s + (eng?.views || 0);
      }, 0);
      const engagement = monthPublished.reduce((s, c) => {
        const eng = typeof c.engagement === 'object' ? c.engagement : {};
        return s + (eng?.engagement || 0);
      }, 0);

      monthlyPerformance.push({
        month: monthLabel,
        published: monthPublished.length,
        total: monthContent.length,
        views,
        engagement:
          monthPublished.length > 0
            ? Math.round((engagement / monthPublished.length) * 10) / 10
            : 0,
      });
    }

    // --- Derived insights ---
    const insights = [];
    if (avgProgress >= 60) {
      insights.push({
        type: 'positive',
        title: 'Strong Project Progress',
        description: `Average project completion is at ${avgProgress}%, ahead of schedule.`,
      });
    }
    if (avgEngagement > 3) {
      insights.push({
        type: 'positive',
        title: 'Good Engagement Rates',
        description: `Average content engagement rate is ${avgEngagement.toFixed(1)}%, above industry average.`,
      });
    }
    if (totalBudget > 0 && totalSpent / totalBudget > 0.9) {
      insights.push({
        type: 'warning',
        title: 'Budget Nearly Exhausted',
        description: `${Math.round((totalSpent / totalBudget) * 100)}% of total budget has been used across all projects.`,
      });
    }
    if (publishedContent.length > 0 && totalViews > 0) {
      insights.push({
        type: 'positive',
        title: 'Content Reach',
        description: `Published content has accumulated ${totalViews.toLocaleString()} total views.`,
      });
    }
    if (insights.length === 0) {
      insights.push({
        type: 'neutral',
        title: 'Data Building',
        description:
          'As more content is published and projects progress, insights will appear here.',
      });
    }

    // --- Build report objects ---
    const reports = [];
    if (allProjects.length > 0) {
      reports.push({
        id: 'projects-summary',
        title: 'Projects Summary Report',
        period: thisMonth,
        type: 'monthly',
        generatedDate: now.toISOString().split('T')[0],
        metrics: [
          {
            name: 'Active Projects',
            value: activeProjects,
            change: 0,
            trend: 'neutral' as const,
          },
          {
            name: 'Completed',
            value: completedProjects,
            change: 0,
            trend: 'neutral' as const,
          },
          {
            name: 'Avg Progress',
            value: `${avgProgress}%`,
            change: 0,
            trend: avgProgress > 50 ? ('up' as const) : ('neutral' as const),
          },
          {
            name: 'Total Budget',
            value: totalBudget,
            change: 0,
            trend: 'neutral' as const,
          },
        ],
      });
    }
    if (publishedContent.length > 0) {
      reports.push({
        id: 'content-summary',
        title: 'Content Performance Report',
        period: thisMonth,
        type: 'monthly',
        generatedDate: now.toISOString().split('T')[0],
        metrics: [
          {
            name: 'Published Content',
            value: publishedContent.length,
            change: contentDelta,
            trend:
              contentDelta > 0
                ? ('up' as const)
                : contentDelta < 0
                  ? ('down' as const)
                  : ('neutral' as const),
          },
          {
            name: 'Total Views',
            value: totalViews,
            change: 0,
            trend: 'neutral' as const,
          },
          {
            name: 'Avg Engagement',
            value: `${avgEngagement.toFixed(1)}%`,
            change: 0,
            trend: avgEngagement > 3 ? ('up' as const) : ('neutral' as const),
          },
          {
            name: 'Content This Month',
            value: publishedThisMonth,
            change: contentDelta,
            trend:
              contentDelta > 0
                ? ('up' as const)
                : contentDelta < 0
                  ? ('down' as const)
                  : ('neutral' as const),
          },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          activeProjects,
          completedProjects,
          totalBudget,
          totalSpent,
          avgProgress,
          publishedContent: publishedContent.length,
          totalViews,
          avgEngagement: Math.round(avgEngagement * 10) / 10,
          contentDelta,
          publishedThisMonth,
          publishedLastMonth,
        },
        monthlyPerformance,
        reports,
        insights,
      },
    });
  } catch (error) {
    console.error('Error fetching reports data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
