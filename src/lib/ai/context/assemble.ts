/**
 * Client Context Assembly
 * Gathers all available client data into a structured context for LLM prompts.
 * Runs 5 parallel Supabase queries for maximum speed.
 */

import { getSupabaseAdmin } from '@/lib/supabase';
import type { ClientContext } from './types';

export async function assembleClientContext(clientId: string): Promise<ClientContext> {
  const supabase = getSupabaseAdmin();

  // Run all queries in parallel
  const [clientResult, discoveryResult, socialResult, contentResult, projectsResult] =
    await Promise.all([
      // 1. Client profile + new strategy fields
      supabase
        .from('clients')
        .select(
          'id, name, industry, website, company_size, tagline, brand_colors, brand_fonts, brand_guidelines_url, content_pillars, content_events, content_preferences, competitor_social_urls'
        )
        .eq('id', clientId)
        .single(),

      // 2. Latest discovery session (if any)
      supabase
        .from('discovery_sessions')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(1),

      // 3. Social accounts
      supabase
        .from('social_accounts')
        .select('platform, account_name, is_active')
        .eq('client_id', clientId)
        .eq('is_active', true),

      // 4. Recent content (last 30 items)
      supabase
        .from('content_calendar')
        .select(
          'title, platform, type, scheduled_date, engagement, hashtags'
        )
        .eq('client_id', clientId)
        .order('scheduled_date', { ascending: false })
        .limit(30),

      // 5. Active projects
      supabase
        .from('projects')
        .select('name, description, status')
        .eq('client_id', clientId)
        .in('status', ['active', 'planning']),
    ]);

  const client = clientResult.data;
  if (!client) {
    throw new Error(`Client not found: ${clientId}`);
  }

  // Build base context from client profile
  const context: ClientContext = {
    clientId: client.id,
    clientName: client.name,
    industry: client.industry || 'other',
    website: client.website || undefined,
    companySize: client.company_size || 'medium',
    tagline: client.tagline || undefined,
    brandColors: client.brand_colors || undefined,
    brandFonts: client.brand_fonts || undefined,
    brandGuidelinesUrl: client.brand_guidelines_url || undefined,
    contentPillars: client.content_pillars || undefined,
    contentEvents: client.content_events || undefined,
    contentPreferences: client.content_preferences || undefined,
  };

  // Extract discovery session data (sections 3, 4, 5, 6)
  const discovery = discoveryResult.data?.[0];
  if (discovery) {
    const sections = discovery.sections || discovery.data || {};

    // Section 3: Target Audience
    if (sections.targetAudience || sections.target_audience) {
      const ta = sections.targetAudience || sections.target_audience;
      context.targetAudience = {
        primaryAudience: {
          demographics: ta.primaryAudience?.demographics || ta.demographics || '',
          platforms: ta.primaryAudience?.platforms || ta.platforms || [],
          contentPreferences: ta.primaryAudience?.contentPreferences || ta.contentPreferences || [],
        },
        personas: ta.personas || [],
        painPoints: ta.painPoints || ta.pain_points || [],
      };
    }

    // Section 4: Brand Voice & Visual Style
    if (sections.brandVoice || sections.brand_voice || sections.currentState || sections.current_state) {
      const bv = sections.brandVoice || sections.brand_voice || sections.currentState || sections.current_state || {};
      context.brandVoice = {
        personality: bv.personality || bv.brandPersonality || [],
        toneOfVoice: {
          primary: bv.toneOfVoice?.primary || bv.tone || '',
          characteristics: bv.toneOfVoice?.characteristics || bv.toneCharacteristics || [],
          avoidList: bv.toneOfVoice?.avoidList || bv.avoidList || [],
        },
        visualStyle: {
          colorPreferences: bv.visualStyle?.colorPreferences || bv.colorPreferences || [],
          imageStyle: bv.visualStyle?.imageStyle || bv.imageStyle || [],
        },
      };
    }

    // Section 5: Goals & KPIs
    if (sections.goalsKpis || sections.goals_kpis || sections.goalsAndKPIs) {
      const gk = sections.goalsKpis || sections.goals_kpis || sections.goalsAndKPIs || {};
      context.goalsAndKPIs = {
        businessGoals: gk.businessGoals || gk.business_goals || [],
        marketingGoals: gk.marketingGoals || gk.marketing_goals || [],
        kpis: gk.kpis || [],
      };
    }

    // Section 6: Competitors
    if (sections.competition || sections.competitors) {
      const comp = sections.competition || sections.competitors;
      if (Array.isArray(comp)) {
        context.competitors = comp;
      } else if (comp?.competitors) {
        context.competitors = comp.competitors;
      }
    }
  }

  // Social accounts
  if (socialResult.data && socialResult.data.length > 0) {
    context.socialAccounts = socialResult.data.map((acc: Record<string, unknown>) => ({
      platform: acc.platform as string,
      handle: acc.account_name as string,
    }));
  }

  // Recent content
  if (contentResult.data && contentResult.data.length > 0) {
    context.recentContent = contentResult.data.map((item: Record<string, unknown>) => ({
      title: item.title as string,
      platform: item.platform as string,
      type: item.type as string,
      scheduledDate: item.scheduled_date as string,
      engagement: item.engagement as { likes: number; comments: number; shares: number } | undefined,
      hashtags: (item.hashtags as string[]) || [],
    }));
  }

  // Active projects
  if (projectsResult.data && projectsResult.data.length > 0) {
    context.activeProjects = projectsResult.data.map((p: Record<string, unknown>) => ({
      name: p.name as string,
      description: (p.description as string) || '',
      status: p.status as string,
    }));
  }

  return context;
}
