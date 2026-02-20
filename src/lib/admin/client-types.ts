/**
 * Comprehensive Client Management System Types
 * Professional agency client management for Freaking Minds
 */

// Core Client Types
export type ClientStatus = 'active' | 'inactive' | 'paused' | 'churned';
export type ClientHealth = 'excellent' | 'good' | 'warning' | 'critical';
export type Industry = 'technology' | 'healthcare' | 'finance' | 'ecommerce' | 'education' | 'real_estate' | 'hospitality' | 'manufacturing' | 'retail' | 'automotive' | 'food_beverage' | 'consulting' | 'non_profit' | 'other';
export type ContractType = 'retainer' | 'project' | 'performance' | 'hybrid';
export type BillingCycle = 'monthly' | 'quarterly' | 'annually' | 'one_time';

// Enhanced Client Profile
export interface ClientProfile {
  id: string;
  name: string;
  logo?: string;
  industry: Industry;
  website?: string;
  description?: string;
  
  // Contact Information
  primaryContact: ContactPerson;
  additionalContacts: ContactPerson[];
  
  // Business Details
  companySize: 'startup' | 'small' | 'medium' | 'enterprise';
  founded?: string;
  headquarters: Address;
  gstNumber?: string;
  
  // Account Management
  accountManager: string; // User ID
  status: ClientStatus;
  health: ClientHealth;
  
  // Contract & Billing
  contractDetails: ContractDetails;
  
  // Metadata
  onboardedAt: string;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: ClientNote[];
}

export interface ContactPerson {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  isPrimary: boolean;
  linkedInUrl?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ContractDetails {
  type: ContractType;
  startDate: string | null;
  endDate?: string;
  value: number;
  currency: string;
  billingCycle: BillingCycle;
  retainerAmount?: number;
  services: string[]; // Service IDs
  terms?: string;
  isActive: boolean;
}

export interface ClientNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isInternal: boolean;
  tags: string[];
}

// Campaign & Project Management
export type CampaignStatus = 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
export type CampaignType = 'social_media' | 'paid_ads' | 'seo' | 'content_marketing' | 'email' | 'web_development' | 'branding' | 'consulting';
export type DeliverableStatus = 'not_started' | 'in_progress' | 'review' | 'revisions' | 'approved' | 'delivered';

export interface Campaign {
  id: string;
  clientId: string;
  name: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  
  // Timeline & Budget
  startDate: string;
  endDate: string;
  budget: number;
  spentAmount: number;
  
  // Objectives & KPIs
  objectives: string[];
  kpis: CampaignKPI[];
  
  // Team & Resources
  assignedTeam: string[]; // User IDs
  deliverables: Deliverable[];
  
  // Progress Tracking
  progress: number; // 0-100
  milestones: Milestone[];
  
  createdAt: string;
  updatedAt: string;
}

export interface CampaignKPI {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface Deliverable {
  id: string;
  campaignId: string;
  name: string;
  description: string;
  type: 'creative' | 'content' | 'report' | 'strategy' | 'development' | 'other';
  status: DeliverableStatus;
  assignedTo: string; // User ID
  dueDate: string;
  files: DeliverableFile[];
  feedback?: DeliverableFeedback[];
  approvals: DeliverableApproval[];
  createdAt: string;
  updatedAt: string;
}

export interface DeliverableFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
}

export interface DeliverableFeedback {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isResolved: boolean;
}

export interface DeliverableApproval {
  id: string;
  approverName: string;
  approverEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedAt?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string;
}

// Analytics & Performance
export interface ClientAnalytics {
  clientId: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  
  // Social Media Metrics
  socialMedia: {
    followers: MetricData;
    engagement: MetricData;
    reach: MetricData;
    impressions: MetricData;
  };
  
  // Paid Advertising
  paidAds: {
    impressions: MetricData;
    clicks: MetricData;
    ctr: MetricData;
    conversions: MetricData;
    roas: MetricData;
    spend: MetricData;
  };
  
  // Website Performance
  website: {
    traffic: MetricData;
    leads: MetricData;
    conversions: MetricData;
    bounceRate: MetricData;
    sessionDuration: MetricData;
  };
  
  // Custom Metrics
  customMetrics: CustomMetric[];
  
  generatedAt: string;
}

export interface MetricData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

export interface CustomMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  description: string;
}

// Communication & Messages
export interface ClientMessage {
  id: string;
  clientId: string;
  threadId?: string;
  
  // Message Details
  from: MessageParticipant;
  to: MessageParticipant[];
  subject?: string;
  content: string;
  
  // Attachments & Links
  attachments: MessageAttachment[];
  
  // Status & Metadata
  isRead: boolean;
  isInternal: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  createdAt: string;
  readAt?: string;
}

export interface MessageParticipant {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'team_member' | 'admin';
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// Meeting & Call Management
export interface ClientMeeting {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  
  // Schedule
  startTime: string;
  endTime: string;
  timezone: string;
  
  // Participants
  participants: MeetingParticipant[];
  
  // Meeting Details
  type: 'kickoff' | 'review' | 'strategy' | 'status_update' | 'feedback' | 'other';
  location?: string;
  meetingLink?: string;
  
  // Notes & Follow-ups
  agenda: string[];
  notes?: string;
  actionItems: ActionItem[];
  recording?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface MeetingParticipant {
  id: string;
  name: string;
  email: string;
  role: string;
  attended: boolean;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string;
}

// Growth & Opportunities
export interface GrowthOpportunity {
  id: string;
  clientId: string;
  title: string;
  description: string;
  
  // Opportunity Details
  type: 'upsell' | 'cross_sell' | 'renewal' | 'expansion' | 'new_service';
  potentialValue: number;
  probability: number; // 0-100
  
  // Service Related
  suggestedServices: string[];
  rationale: string;
  
  // Timeline & Status
  identifiedAt: string;
  estimatedCloseDate: string;
  status: 'identified' | 'proposed' | 'negotiating' | 'won' | 'lost';
  
  assignedTo: string; // User ID
  notes: string[];
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  category: 'trend' | 'competitor' | 'industry' | 'technology' | 'regulation';
  relevantIndustries: Industry[];
  impact: 'high' | 'medium' | 'low';
  source: string;
  publishedAt: string;
}

// User & Permission Management
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department: string;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export type UserRole = 'admin' | 'account_manager' | 'creative' | 'developer' | 'analyst' | 'content_writer' | 'designer';

export interface Permission {
  resource: 'clients' | 'campaigns' | 'analytics' | 'billing' | 'team' | 'settings';
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

// Notification System
export interface Notification {
  id: string;
  userId: string;
  clientId?: string;
  
  type: 'approval_needed' | 'payment_due' | 'deliverable_ready' | 'meeting_reminder' | 'task_assigned' | 'milestone_reached';
  title: string;
  message: string;
  
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
  
  actionUrl?: string;
  actionText?: string;
  
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

// Default Data & Constants
export const INDUSTRIES: Record<Industry, string> = {
  technology: 'Technology',
  healthcare: 'Healthcare',
  finance: 'Finance & Banking',
  ecommerce: 'E-commerce',
  education: 'Education',
  real_estate: 'Real Estate',
  hospitality: 'Hospitality & Travel',
  manufacturing: 'Manufacturing',
  retail: 'Retail',
  automotive: 'Automotive',
  food_beverage: 'Food & Beverage',
  consulting: 'Consulting',
  non_profit: 'Non-Profit',
  other: 'Other'
};

export const CAMPAIGN_TYPES: Record<CampaignType, string> = {
  social_media: 'Social Media Marketing',
  paid_ads: 'Paid Advertising',
  seo: 'Search Engine Optimization',
  content_marketing: 'Content Marketing',
  email: 'Email Marketing',
  web_development: 'Web Development',
  branding: 'Brand Strategy',
  consulting: 'Consulting Services'
};

// Utility Functions
export class ClientUtils {
  static getHealthColor(health: ClientHealth): string {
    const colors = {
      excellent: '#10B981', // Green
      good: '#3B82F6',      // Blue
      warning: '#F59E0B',   // Yellow
      critical: '#EF4444'   // Red
    };
    return colors[health];
  }

  static calculateClientValue(client: ClientProfile): number {
    return client.contractDetails.value;
  }

  static getContractTimeRemaining(contract: ContractDetails): number {
    if (!contract.endDate) return -1;
    const endDate = new Date(contract.endDate);
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Days remaining
  }

  static formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }
}