/**
 * Discovery System Types
 * Comprehensive client discovery and requirement analysis
 */

export interface DiscoverySession {
  id: string;
  clientId: string;
  leadId?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  currentSection: number;
  completedSections: number[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  assignedTo: string;
  
  // Discovery Data
  companyFundamentals: CompanyFundamentals;
  projectOverview: ProjectOverview;
  targetAudience: TargetAudience;
  currentState: CurrentState;
  goalsKPIs: GoalsKPIs;
  competitionMarket: CompetitionMarket;
  budgetResources: BudgetResources;
  technicalRequirements: TechnicalRequirements;
  contentCreative: ContentCreative;
  nextSteps: NextSteps;
}

export interface CompanyFundamentals {
  companyName: string;
  industry: string;
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  foundedYear?: string;
  headquarters: string;
  businessModel: string;
  missionStatement?: string;
  coreValues?: string[];
  uniqueSellingProposition: string;
  keyStakeholders: Stakeholder[];
}

export interface Stakeholder {
  name: string;
  role: string;
  decisionMakingPower: 'low' | 'medium' | 'high';
  contactInfo?: string;
}

export interface ProjectOverview {
  projectName: string;
  projectType: 'rebrand' | 'website' | 'app' | 'marketing_campaign' | 'ecommerce' | 'other';
  projectDescription: string;
  keyObjectives: string[];
  timeline: {
    startDate: string;
    desiredLaunch: string;
    flexibility: 'fixed' | 'flexible' | 'asap';
  };
  projectScope: string[];
  successMetrics: string[];
  constraints: string[];
}

export interface TargetAudience {
  primaryAudience: AudienceSegment;
  secondaryAudience?: AudienceSegment;
  customerPersonas: CustomerPersona[];
  geographicTarget: string[];
  psychographics: string[];
  behaviorPatterns: string[];
  painPoints: string[];
  customerJourney: string[];
}

export interface AudienceSegment {
  demographics: {
    ageRange: string;
    gender: string;
    income: string;
    education: string;
    occupation: string;
  };
  platforms: string[];
  contentPreferences: string[];
}

export interface CustomerPersona {
  name: string;
  description: string;
  goals: string[];
  frustrations: string[];
  preferredChannels: string[];
}

export interface CurrentState {
  currentWebsite?: string;
  socialMediaPresence: SocialPresence[];
  existingBranding: {
    hasLogo: boolean;
    hasBrandGuidelines: boolean;
    brandAssets: string[];
    brandPerception: string;
  };
  currentMarketing: MarketingChannel[];
  analyticsData?: AnalyticsOverview;
  currentChallenges: string[];
  whatIsWorking: string[];
  whatIsNotWorking: string[];
}

export interface SocialPresence {
  platform: string;
  handle: string;
  followers: number;
  engagement: number;
  contentType: string[];
  postingFrequency: string;
}

export interface MarketingChannel {
  channel: string;
  budget: number;
  performance: 'excellent' | 'good' | 'average' | 'poor';
  roi?: number;
}

export interface AnalyticsOverview {
  monthlyVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: string[];
  trafficSources: string[];
  conversionRate?: number;
}

export interface GoalsKPIs {
  businessGoals: BusinessGoal[];
  marketingGoals: MarketingGoal[];
  kpis: KPI[];
  successDefinition: string;
  timeframe: string;
  priorityLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface BusinessGoal {
  goal: string;
  metric: string;
  currentValue?: number;
  targetValue: number;
  timeframe: string;
}

export interface MarketingGoal {
  objective: string;
  channel: string;
  metric: string;
  target: number;
  timeframe: string;
}

export interface KPI {
  name: string;
  currentValue?: number;
  targetValue: number;
  measurement: string;
  frequency: string;
}

export interface CompetitionMarket {
  directCompetitors: Competitor[];
  indirectCompetitors: Competitor[];
  marketPosition: string;
  differentiators: string[];
  competitiveAdvantages: string[];
  marketSize: string;
  marketTrends: string[];
  threatAssessment: string[];
  opportunities: string[];
}

export interface Competitor {
  name: string;
  website: string;
  strengths: string[];
  weaknesses: string[];
  marketShare?: string;
  pricingStrategy?: string;
}

export interface BudgetResources {
  totalBudget: {
    amount: number;
    currency: string;
    flexibility: 'fixed' | 'flexible' | 'expandable';
  };
  budgetBreakdown: BudgetCategory[];
  paymentTerms: string;
  internalResources: InternalResource[];
  externalResources?: string[];
  roiExpectations: string;
  budgetApprovalProcess: string;
}

export interface BudgetCategory {
  category: string;
  allocation: number;
  priority: 'low' | 'medium' | 'high';
}

export interface InternalResource {
  role: string;
  availability: string;
  skillLevel: string;
  involvement: string;
}

export interface TechnicalRequirements {
  platformPreferences: string[];
  hostingRequirements?: HostingRequirements;
  integrations: Integration[];
  securityRequirements: string[];
  performanceRequirements: PerformanceRequirement[];
  accessibilityRequirements: string[];
  deviceSupport: string[];
  browserSupport: string[];
  futureScalability: string[];
}

export interface HostingRequirements {
  type: 'shared' | 'vps' | 'dedicated' | 'cloud';
  traffic: string;
  storage: string;
  bandwidth: string;
  backupRequirements: string;
}

export interface Integration {
  system: string;
  purpose: string;
  priority: 'must_have' | 'nice_to_have' | 'future';
  apiAvailable: boolean;
}

export interface PerformanceRequirement {
  metric: string;
  target: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ContentCreative {
  brandPersonality: string[];
  toneOfVoice: ToneOfVoice;
  visualStyle: VisualStyle;
  contentStrategy: ContentStrategy;
  existingAssets: Asset[];
  contentGaps: string[];
  creativePreferences: string[];
  brandGuidelines?: string;
}

export interface ToneOfVoice {
  primary: string;
  characteristics: string[];
  avoidList: string[];
  examples: string[];
}

export interface VisualStyle {
  colorPreferences: string[];
  fontPreferences: string[];
  imageStyle: string[];
  designInspiration: string[];
  brandMoodboard?: string;
}

export interface ContentStrategy {
  contentTypes: string[];
  postingFrequency: string;
  contentThemes: string[];
  seasonalContent: boolean;
  userGeneratedContent: boolean;
  contentWorkflow: string;
}

export interface Asset {
  type: string;
  description: string;
  location: string;
  quality: 'high' | 'medium' | 'low';
  usageRights: boolean;
}

export interface NextSteps {
  immediateActions: Action[];
  decisionMakers: string[];
  approvalProcess: string;
  timeline: ProjectTimeline;
  communication: CommunicationPlan;
  riskFactors: string[];
  successFactors: string[];
  followUpDate: string;
}

export interface Action {
  task: string;
  owner: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ProjectTimeline {
  phases: ProjectPhase[];
  milestones: Milestone[];
  dependencies: string[];
}

export interface ProjectPhase {
  name: string;
  duration: string;
  deliverables: string[];
  dependencies: string[];
}

export interface Milestone {
  name: string;
  date: string;
  deliverable: string;
  stakeholders: string[];
}

export interface CommunicationPlan {
  frequency: string;
  channels: string[];
  reportingFormat: string;
  meetingSchedule: string;
  pointOfContact: string;
}

// Discovery Templates
export type DiscoveryTemplate = 'ecommerce' | 'saas' | 'local_business' | 'enterprise' | 'startup' | 'custom';

export interface DiscoveryTemplateConfig {
  name: string;
  description: string;
  sections: number[];
  defaultValues: Partial<DiscoverySession>;
  requiredFields: string[];
  recommendedQuestions: TemplateQuestion[];
}

export interface TemplateQuestion {
  section: number;
  field: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number';
  options?: string[];
  placeholder?: string;
}

// Discovery Analytics
export interface DiscoveryAnalytics {
  sessionId: string;
  completionRate: number;
  timeSpent: number;
  talentRequirements: TalentRequirement[];
  projectComplexity: 'low' | 'medium' | 'high' | 'very_high';
  estimatedBudget: number;
  recommendedTeamSize: number;
  skillsRequired: string[];
  timelineAssessment: string;
}

export interface TalentRequirement {
  role: string;
  skillsRequired: string[];
  experienceLevel: 'junior' | 'mid' | 'senior' | 'expert';
  hoursRequired: number;
  priority: 'must_have' | 'nice_to_have';
}

// Utility types
export type DiscoveryStatus = 'draft' | 'in_progress' | 'completed' | 'archived';
export type DiscoverySection = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const DISCOVERY_SECTIONS = {
  1: 'Company Fundamentals',
  2: 'Project Overview', 
  3: 'Target Audience',
  4: 'Current State Analysis',
  5: 'Goals & KPIs',
  6: 'Competition & Market',
  7: 'Budget & Resources',
  8: 'Technical Requirements',
  9: 'Content & Creative',
  10: 'Next Steps'
} as const;

export const DISCOVERY_TEMPLATES: Record<DiscoveryTemplate, DiscoveryTemplateConfig> = {
  ecommerce: {
    name: 'E-commerce Business',
    description: 'Online retail, marketplace, or e-commerce platform',
    sections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    defaultValues: {},
    requiredFields: ['companyFundamentals.companyName', 'projectOverview.projectType'],
    recommendedQuestions: []
  },
  saas: {
    name: 'SaaS Platform',
    description: 'Software as a Service or technology platform',
    sections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    defaultValues: {},
    requiredFields: [],
    recommendedQuestions: []
  },
  local_business: {
    name: 'Local Business',
    description: 'Local service provider or brick-and-mortar business',
    sections: [1, 2, 3, 4, 5, 6, 7, 9, 10],
    defaultValues: {},
    requiredFields: [],
    recommendedQuestions: []
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Large corporation or enterprise-level project',
    sections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    defaultValues: {},
    requiredFields: [],
    recommendedQuestions: []
  },
  startup: {
    name: 'Startup',
    description: 'Early-stage startup or new venture',
    sections: [1, 2, 3, 5, 7, 9, 10],
    defaultValues: {},
    requiredFields: [],
    recommendedQuestions: []
  },
  custom: {
    name: 'Custom Discovery',
    description: 'Fully customizable discovery process',
    sections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    defaultValues: {},
    requiredFields: [],
    recommendedQuestions: []
  }
};