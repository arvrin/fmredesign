import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();
    const today = new Date().toISOString().split('T')[0];

    const [
      clientsRes,
      invoicesRes,
      overdueContentRes,
      overdueProjectsRes,
      pendingTalentRes,
      reviewContentRes,
      todayContentRes,
      activeProjectsRes,
      recentInvoicesRes,
    ] = await Promise.all([
      // Total clients
      supabase.from('clients').select('id', { count: 'exact', head: true }),
      // Revenue: paid invoices
      supabase.from('invoices').select('total, status'),
      // Overdue content: scheduled before today, not published/cancelled
      supabase
        .from('content_calendar')
        .select('id, title, status, platform, type, scheduled_date, client_id')
        .lt('scheduled_date', today)
        .not('status', 'in', '("published","cancelled")')
        .order('scheduled_date', { ascending: true })
        .limit(10),
      // Overdue projects: end_date past, still active
      supabase
        .from('projects')
        .select('id, name, status, end_date, progress, client_id')
        .lt('end_date', today)
        .eq('status', 'active')
        .order('end_date', { ascending: true })
        .limit(10),
      // Pending talent applications
      supabase
        .from('talent_applications')
        .select('id, name, email, category, status, created_at')
        .eq('status', 'submitted')
        .order('created_at', { ascending: false })
        .limit(10),
      // Content needing review
      supabase
        .from('content_calendar')
        .select('id, title, status, platform, type, scheduled_date, client_id')
        .eq('status', 'review')
        .order('scheduled_date', { ascending: true })
        .limit(10),
      // Today's content
      supabase
        .from('content_calendar')
        .select('id, title, status, platform, type, scheduled_date, client_id')
        .gte('scheduled_date', today)
        .lt('scheduled_date', today + 'T23:59:59')
        .order('scheduled_date', { ascending: true })
        .limit(20),
      // Active projects (sorted by lowest progress first)
      supabase
        .from('projects')
        .select('id, name, status, progress, end_date, client_id, type')
        .eq('status', 'active')
        .order('progress', { ascending: true })
        .limit(8),
      // Recent invoices
      supabase
        .from('invoices')
        .select('id, invoice_number, client_id, total, status, due_date, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    // Calculate stats
    const totalClients = clientsRes.count ?? 0;
    const invoices = invoicesRes.data ?? [];
    const totalRevenue = invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + (Number(i.total) || 0), 0);
    const activeProjectCount = activeProjectsRes.data?.length ?? 0;
    const scheduledContent = todayContentRes.data?.length ?? 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalClients,
          totalRevenue,
          activeProjects: activeProjectCount,
          scheduledContent,
        },
        overdue: {
          content: (overdueContentRes.data ?? []).map((c) => ({
            id: c.id,
            title: c.title,
            status: c.status,
            platform: c.platform,
            type: c.type,
            scheduledDate: c.scheduled_date,
            clientId: c.client_id,
          })),
          projects: (overdueProjectsRes.data ?? []).map((p) => ({
            id: p.id,
            name: p.name,
            status: p.status,
            endDate: p.end_date,
            progress: p.progress,
            clientId: p.client_id,
          })),
        },
        pendingApprovals: {
          talentApplications: (pendingTalentRes.data ?? []).map((t) => ({
            id: t.id,
            name: t.name,
            email: t.email,
            category: t.category,
            status: t.status,
            createdAt: t.created_at,
          })),
          contentReview: (reviewContentRes.data ?? []).map((c) => ({
            id: c.id,
            title: c.title,
            status: c.status,
            platform: c.platform,
            type: c.type,
            scheduledDate: c.scheduled_date,
            clientId: c.client_id,
          })),
        },
        todayContent: (todayContentRes.data ?? []).map((c) => ({
          id: c.id,
          title: c.title,
          status: c.status,
          platform: c.platform,
          type: c.type,
          scheduledDate: c.scheduled_date,
          clientId: c.client_id,
        })),
        activeProjects: (activeProjectsRes.data ?? []).map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          progress: p.progress,
          endDate: p.end_date,
          clientId: p.client_id,
          type: p.type,
        })),
        recentInvoices: (recentInvoicesRes.data ?? []).map((i) => ({
          id: i.id,
          invoiceNumber: i.invoice_number,
          clientId: i.client_id,
          total: i.total,
          status: i.status,
          dueDate: i.due_date,
          createdAt: i.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching today data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch today data' },
      { status: 500 }
    );
  }
}
