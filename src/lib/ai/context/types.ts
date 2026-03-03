/**
 * Client Context Types for AI Content Generation
 * Rich context assembled from multiple Supabase tables
 */

export interface ClientContext {
  // Core identity
  clientId: string;
  clientName: string;
  industry: string;
  description?: string;
  website?: string;
  companySize: string;
  tagline?: string;

  // Brand identity
  brandColors?: string[];
  brandFonts?: string[];
  brandGuidelinesUrl?: string;

  // From discovery session
  targetAudience?: {
    primaryAudience: { demographics: string; platforms: string[]; contentPreferences: string[] };
    personas: Array<{ name: string; description: string }>;
    painPoints: string[];
  };
  brandVoice?: {
    personality: string[];
    toneOfVoice: { primary: string; characteristics: string[]; avoidList: string[] };
    visualStyle: { colorPreferences: string[]; imageStyle: string[] };
  };
  goalsAndKPIs?: {
    businessGoals: string[];
    marketingGoals: string[];
    kpis: Array<{ metric: string; target: string }>;
  };
  competitors?: Array<{ name: string; website?: string; differentiators: string[] }>;

  // Content strategy data
  contentPillars?: ContentPillar[];
  contentEvents?: ContentEvent[];
  contentPreferences?: ContentPreferences;

  // Social presence
  socialAccounts?: Array<{
    platform: string;
    handle: string;
    followers?: number;
    postingFrequency?: string;
  }>;

  // Content history — last 30 items for pattern learning
  recentContent?: Array<{
    title: string;
    platform: string;
    type: string;
    scheduledDate: string;
    engagement?: { likes: number; comments: number; shares: number };
    hashtags: string[];
  }>;

  // Active projects
  activeProjects?: Array<{ name: string; description: string; status: string }>;
}

export interface ContentPillar {
  name: string;
  description: string;
  percentage: number;
  hashtags?: string[];
}

export interface ContentEvent {
  name: string;
  date: string;
  type: 'holiday' | 'product_launch' | 'campaign' | 'industry_event' | 'custom';
  notes?: string;
}

export interface ContentPreferences {
  defaultPlatforms: string[];
  postsPerWeek: number;
  preferredContentTypes: string[];
  hashtagStrategy: 'minimal' | 'moderate' | 'aggressive';
  includeEmojis: boolean;
  captionLength: 'short' | 'medium' | 'long';
  ctaStyle?: string;
}
