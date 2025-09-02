/**
 * Project Management Types
 * Professional project and content management system
 */

export type ProjectStatus = 'planning' | 'active' | 'review' | 'completed' | 'paused' | 'cancelled';
export type ProjectType = 'social_media' | 'web_development' | 'branding' | 'seo' | 'paid_ads' | 'content_marketing' | 'full_service';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string;
  assignedTo?: string;
}

export interface ProjectDeliverable {
  id: string;
  title: string;
  description: string;
  type: 'design' | 'content' | 'website' | 'campaign' | 'report' | 'other';
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  assignedTo?: string;
  dueDate: string;
  files: string[];
}

export interface Project {
  id: string;
  clientId: string;
  discoveryId?: string;
  
  // Basic Info
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  
  // Timeline
  startDate: string;
  endDate: string;
  estimatedHours: number;
  actualHours?: number;
  
  // Team
  projectManager: string;
  assignedTalent: string[];
  
  // Project Structure
  milestones: ProjectMilestone[];
  deliverables: ProjectDeliverable[];
  
  // Business
  budget: number;
  hourlyRate: number;
  invoiceIds: string[];
  
  // Content Planning
  contentRequirements: {
    postsPerWeek: number;
    platforms: string[];
    contentTypes: string[];
    brandGuidelines?: string;
  };
  
  // Tracking
  progress: number; // 0-100
  clientSatisfaction?: number; // 1-5
  
  // Metadata
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  clientId: string;
  discoveryId?: string;
  name: string;
  description: string;
  type: ProjectType;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  estimatedHours: number;
  projectManager: string;
  assignedTalent: string[];
  budget: number;
  hourlyRate: number;
  contentRequirements: Project['contentRequirements'];
  tags: string[];
  notes: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  endDate?: string;
  progress?: number;
  assignedTalent?: string[];
  notes?: string;
  clientSatisfaction?: number;
}

// Content Calendar Types
export type ContentStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'revision_needed';
export type ContentType = 'post' | 'story' | 'reel' | 'carousel' | 'video' | 'article' | 'ad' | 'email';
export type Platform = 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'tiktok' | 'website' | 'email';

export interface ContentItem {
  id: string;
  projectId: string;
  clientId: string;
  
  // Content Details
  title: string;
  description: string;
  content: string;
  type: ContentType;
  platform: Platform;
  
  // Scheduling
  scheduledDate: string;
  publishedDate?: string;
  status: ContentStatus;
  
  // Creation & Approval
  assignedDesigner?: string;
  assignedWriter?: string;
  assignedTo?: string;
  
  // Assets
  imageUrl?: string;
  videoUrl?: string;
  files: string[];
  
  // Client Interaction
  clientFeedback?: string;
  revisionNotes?: string;
  approvedAt?: string;
  
  // Performance (post-publication)
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    impressions: number;
  };
  
  // Metadata
  hashtags: string[];
  mentions: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentInput {
  projectId: string;
  title: string;
  description: string;
  content: string;
  type: ContentType;
  platform: Platform;
  scheduledDate: string;
  assignedDesigner?: string;
  assignedWriter?: string;
  hashtags: string[];
  mentions: string[];
  tags: string[];
}

export interface ContentUpdate {
  title?: string;
  description?: string;
  content?: string;
  status?: ContentStatus;
  scheduledDate?: string;
  assignedDesigner?: string;
  assignedWriter?: string;
  clientFeedback?: string;
  revisionNotes?: string;
  hashtags?: string[];
  mentions?: string[];
}

// Utility functions
export class ProjectUtils {
  static generateProjectId(): string {
    return `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  static generateContentId(): string {
    return `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  static calculateProjectProgress(milestones: ProjectMilestone[]): number {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.isCompleted).length;
    return Math.round((completed / milestones.length) * 100);
  }
  
  static getProjectStatusColor(status: ProjectStatus): string {
    const colors = {
      planning: 'blue',
      active: 'green',
      review: 'yellow',
      completed: 'emerald',
      paused: 'orange',
      cancelled: 'red'
    };
    return colors[status];
  }
  
  static getContentStatusColor(status: ContentStatus): string {
    const colors = {
      draft: 'gray',
      review: 'blue',
      approved: 'green',
      scheduled: 'purple',
      published: 'emerald',
      revision_needed: 'red'
    };
    return colors[status];
  }
  
  static formatBudget(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }
  
  static isProjectOverdue(endDate: string): boolean {
    return new Date(endDate) < new Date();
  }
  
  static getDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

// Project Templates for different types
export const PROJECT_TEMPLATES: Record<ProjectType, Partial<Project>> = {
  social_media: {
    type: 'social_media',
    estimatedHours: 40,
    contentRequirements: {
      postsPerWeek: 5,
      platforms: ['instagram', 'facebook'],
      contentTypes: ['post', 'story', 'reel']
    }
  },
  web_development: {
    type: 'web_development',
    estimatedHours: 120,
    contentRequirements: {
      postsPerWeek: 0,
      platforms: ['website'],
      contentTypes: ['article']
    }
  },
  branding: {
    type: 'branding',
    estimatedHours: 60,
    contentRequirements: {
      postsPerWeek: 2,
      platforms: ['instagram', 'linkedin'],
      contentTypes: ['post', 'carousel']
    }
  },
  seo: {
    type: 'seo',
    estimatedHours: 30,
    contentRequirements: {
      postsPerWeek: 1,
      platforms: ['website'],
      contentTypes: ['article']
    }
  },
  paid_ads: {
    type: 'paid_ads',
    estimatedHours: 25,
    contentRequirements: {
      postsPerWeek: 3,
      platforms: ['facebook', 'instagram'],
      contentTypes: ['ad', 'carousel']
    }
  },
  content_marketing: {
    type: 'content_marketing',
    estimatedHours: 35,
    contentRequirements: {
      postsPerWeek: 7,
      platforms: ['instagram', 'linkedin', 'website'],
      contentTypes: ['post', 'article', 'video']
    }
  },
  full_service: {
    type: 'full_service',
    estimatedHours: 200,
    contentRequirements: {
      postsPerWeek: 10,
      platforms: ['instagram', 'facebook', 'linkedin', 'website'],
      contentTypes: ['post', 'story', 'reel', 'article', 'video']
    }
  }
};

// PROJECT_TEMPLATES is already exported above
// ProjectUtils class is exported where it's defined