/**
 * Lead Management Service
 * Handles all lead-related operations with Google Sheets integration
 */

import { googleSheetsService } from '../google-sheets';
import type {
  LeadProfile,
  LeadInput,
  LeadUpdate,
  LeadFilters,
  LeadSortOptions,
  LeadAnalytics,
  LeadDashboardStats,
  LeadStatus,
  LeadPriority,
  LeadSource,
  ProjectType,
  BudgetRange,
  Timeline,
  CompanySize,
  Industry
} from './lead-types';

import {
  LEAD_SCORE_WEIGHTS,
  PRIORITY_THRESHOLDS,
  BUDGET_VALUES,
  TIMELINE_DAYS
} from './lead-types';

class LeadService {
  private readonly SHEET_NAME = 'Leads';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  /**
   * Create new lead from form submission
   */
  async createLead(input: LeadInput): Promise<LeadProfile> {
    try {
      // Validate input
      const validationErrors = this.validateLeadInput(input);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Generate lead profile
      const lead: LeadProfile = {
        id: this.generateLeadId(),
        ...input,
        status: 'new',
        priority: 'cool', // Will be updated after scoring
        source: input.source || 'website_form',
        leadScore: 0, // Will be calculated
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        notes: ''
      };

      // Calculate lead score and priority
      lead.leadScore = this.calculateLeadScore(lead);
      lead.priority = this.determineLeadPriority(lead.leadScore);

      // Add to Google Sheets
      await this.saveLeadToSheets(lead);

      // Clear cache
      this.clearCache();

      // Trigger notifications
      await this.sendLeadNotification(lead);

      return lead;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw new Error('Failed to create lead');
    }
  }

  /**
   * Get all leads with filtering and sorting
   */
  async getLeads(filters?: LeadFilters, sort?: LeadSortOptions): Promise<LeadProfile[]> {
    try {
      const cacheKey = `leads_${JSON.stringify(filters)}_${JSON.stringify(sort)}`;
      
      // Check cache
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Fetch from Google Sheets
      const rawData = await googleSheetsService.readSheet(this.SHEET_NAME);
      if (!rawData || rawData.length === 0) {
        return [];
      }

      // Convert to LeadProfile objects
      const leads = this.parseLeadsFromSheets(rawData);

      // Apply filters
      let filteredLeads = filters ? this.applyFilters(leads, filters) : leads;

      // Apply sorting
      if (sort) {
        filteredLeads = this.sortLeads(filteredLeads, sort);
      }

      // Cache results
      this.setCache(cacheKey, filteredLeads);

      return filteredLeads;
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  }

  /**
   * Get lead by ID
   */
  async getLeadById(id: string): Promise<LeadProfile | null> {
    try {
      const leads = await this.getLeads();
      return leads.find(lead => lead.id === id) || null;
    } catch (error) {
      console.error('Error fetching lead by ID:', error);
      return null;
    }
  }

  /**
   * Update lead
   */
  async updateLead(id: string, update: LeadUpdate): Promise<LeadProfile | null> {
    try {
      const lead = await this.getLeadById(id);
      if (!lead) {
        throw new Error('Lead not found');
      }

      // Track if status changed to discovery_completed for auto-project creation
      const statusChangedToDiscoveryCompleted = 
        update.status === 'discovery_completed' && lead.status !== 'discovery_completed';

      // Apply updates
      const updatedLead: LeadProfile = {
        ...lead,
        ...update,
        updatedAt: new Date()
      };

      // Recalculate score if relevant fields changed
      if (this.shouldRecalculateScore(update)) {
        updatedLead.leadScore = this.calculateLeadScore(updatedLead);
        updatedLead.priority = this.determineLeadPriority(updatedLead.leadScore);
      }

      // Auto-create project when discovery is completed
      if (statusChangedToDiscoveryCompleted) {
        try {
          const discoveryId = await this.createDiscoveryRecord(updatedLead);
          const projectId = await this.autoCreateProject(updatedLead, discoveryId);
        } catch (projectError) {
          console.error('Error creating auto-project:', projectError);
          // Continue with lead update even if project creation fails
        }
      }

      // Update in Google Sheets
      await this.updateLeadInSheets(updatedLead);

      // Clear cache
      this.clearCache();

      return updatedLead;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw new Error('Failed to update lead');
    }
  }

  /**
   * Convert lead to client
   */
  async convertLeadToClient(leadId: string): Promise<string> {
    try {
      const lead = await this.getLeadById(leadId);
      if (!lead) {
        throw new Error('Lead not found');
      }

      // Create client from lead data
      const clientData = {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        website: lead.website,
        industry: lead.industry,
        companySize: lead.companySize,
        projectType: lead.projectType,
        projectDescription: lead.projectDescription,
        budgetRange: lead.budgetRange,
        source: 'converted_lead',
        leadId: lead.id,
        status: 'onboarding'
      };

      // Import client service temporarily to avoid circular dependency
      const { ClientService } = await import('./client-service');
      const client = await ClientService.createClient(clientData as any);

      // Update lead status
      await this.updateLead(leadId, {
        status: 'won',
        convertedToClientAt: new Date(),
        clientId: client.id
      });

      return client.id;
    } catch (error) {
      console.error('Error converting lead to client:', error);
      throw new Error('Failed to convert lead to client');
    }
  }

  /**
   * Get lead analytics
   */
  async getLeadAnalytics(): Promise<LeadAnalytics> {
    try {
      const leads = await this.getLeads();
      
      const totalLeads = leads.length;
      const newLeads = leads.filter(lead => lead.status === 'new').length;
      const qualifiedLeads = leads.filter(lead => 
        ['qualified', 'discovery_scheduled', 'discovery_completed', 'proposal_sent', 'negotiating'].includes(lead.status)
      ).length;
      const convertedLeads = leads.filter(lead => lead.status === 'won').length;
      
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
      const averageLeadScore = totalLeads > 0 ? 
        leads.reduce((sum, lead) => sum + lead.leadScore, 0) / totalLeads : 0;

      // Group by source
      const leadsBySource = leads.reduce((acc, lead) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
      }, {} as Record<LeadSource, number>);

      // Group by status
      const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {} as Record<LeadStatus, number>);

      // Group by priority
      const leadsByPriority = leads.reduce((acc, lead) => {
        acc[lead.priority] = (acc[lead.priority] || 0) + 1;
        return acc;
      }, {} as Record<LeadPriority, number>);

      // Calculate average time to conversion
      const convertedWithTime = leads.filter(lead => 
        lead.convertedToClientAt && lead.createdAt
      );
      const averageTimeToConversion = convertedWithTime.length > 0 ?
        convertedWithTime.reduce((sum, lead) => {
          const timeDiff = lead.convertedToClientAt!.getTime() - lead.createdAt.getTime();
          return sum + (timeDiff / (1000 * 60 * 60 * 24)); // days
        }, 0) / convertedWithTime.length : 0;

      // Monthly trends (last 6 months)
      const monthlyTrends = this.calculateMonthlyTrends(leads);

      return {
        totalLeads,
        newLeads,
        qualifiedLeads,
        convertedLeads,
        conversionRate,
        averageLeadScore,
        leadsBySource,
        leadsByStatus,
        leadsByPriority,
        averageTimeToConversion,
        monthlyTrends
      };
    } catch (error) {
      console.error('Error getting lead analytics:', error);
      throw new Error('Failed to get lead analytics');
    }
  }

  /**
   * Get dashboard stats
   */
  async getDashboardStats(): Promise<LeadDashboardStats> {
    try {
      const leads = await this.getLeads();
      const analytics = await this.getLeadAnalytics();

      // Recent leads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentLeads = leads.filter(lead => 
        lead.createdAt >= sevenDaysAgo
      ).length;

      // Hot leads
      const hotLeads = leads.filter(lead => lead.priority === 'hot').length;

      // Top sources
      const topSources = Object.entries(analytics.leadsBySource)
        .map(([source, count]) => ({
          source: source as LeadSource,
          count,
          percentage: (count / analytics.totalLeads) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Recent activity (mock data - would come from audit log in real implementation)
      const recentActivity = leads
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 10)
        .map(lead => ({
          leadId: lead.id,
          action: `Lead ${lead.status}`,
          timestamp: lead.updatedAt,
          user: lead.assignedTo || 'System'
        }));

      // Average lead value (based on budget midpoint)
      const averageLeadValue = leads.reduce((sum, lead) => {
        const budgetRange = BUDGET_VALUES[lead.budgetRange] || BUDGET_VALUES['not_disclosed'];
        const midpoint = (budgetRange.min + budgetRange.max) / 2;
        return sum + midpoint;
      }, 0) / (leads.length || 1);

      return {
        totalLeads: analytics.totalLeads,
        hotLeads,
        recentLeads,
        conversionRate: analytics.conversionRate,
        averageLeadValue,
        topSources,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw new Error('Failed to get dashboard stats');
    }
  }

  /**
   * Calculate lead score based on multiple factors
   */
  private calculateLeadScore(lead: LeadProfile): number {
    let score = 0;

    // Budget Score (40% weight)
    const budgetRange = BUDGET_VALUES[lead.budgetRange] || BUDGET_VALUES['not_disclosed'];
    const budgetScore = this.getBudgetScore(budgetRange);
    score += budgetScore * LEAD_SCORE_WEIGHTS.BUDGET;

    // Timeline Score (20% weight)
    const timelineScore = this.getTimelineScore(lead.timeline);
    score += timelineScore * LEAD_SCORE_WEIGHTS.TIMELINE;

    // Company Size Score (20% weight)
    const companySizeScore = this.getCompanySizeScore(lead.companySize);
    score += companySizeScore * LEAD_SCORE_WEIGHTS.COMPANY_SIZE;

    // Industry Fit Score (10% weight)
    const industryScore = this.getIndustryFitScore(lead.industry);
    score += industryScore * LEAD_SCORE_WEIGHTS.INDUSTRY_FIT;

    // Urgency Score (10% weight)
    const urgencyScore = this.getUrgencyScore(lead.timeline, lead.primaryChallenge);
    score += urgencyScore * LEAD_SCORE_WEIGHTS.URGENCY;

    return Math.round(Math.min(100, Math.max(0, score)));
  }

  /**
   * Determine lead priority based on score
   */
  private determineLeadPriority(score: number): LeadPriority {
    if (score >= PRIORITY_THRESHOLDS.HOT) return 'hot';
    if (score >= PRIORITY_THRESHOLDS.WARM) return 'warm';
    if (score >= PRIORITY_THRESHOLDS.COOL) return 'cool';
    return 'cold';
  }

  /**
   * Helper scoring functions
   */
  private getBudgetScore(budgetRange: { min: number; max: number }): number {
    const midpoint = (budgetRange.min + budgetRange.max) / 2;
    if (midpoint >= 100000) return 100;
    if (midpoint >= 50000) return 80;
    if (midpoint >= 25000) return 60;
    if (midpoint >= 10000) return 40;
    return 20;
  }

  private getTimelineScore(timeline: Timeline): number {
    const days = TIMELINE_DAYS[timeline];
    if (days <= 30) return 100;
    if (days <= 90) return 80;
    if (days <= 180) return 60;
    if (days <= 365) return 40;
    return 20;
  }

  private getCompanySizeScore(companySize: CompanySize): number {
    const scores: Record<CompanySize, number> = {
      'enterprise': 100,
      'medium_business': 80,
      'small_business': 60,
      'agency': 70,
      'startup': 50,
      'nonprofit': 40,
      'individual': 30
    };
    return scores[companySize] || 50;
  }

  private getIndustryFitScore(industry?: string): number {
    // Industries we specialize in get higher scores
    const highFitIndustries = ['Technology', 'E-commerce', 'Healthcare', 'Finance'];
    if (industry && highFitIndustries.includes(industry)) return 100;
    return 70; // Default score for other industries
  }

  private getUrgencyScore(timeline: Timeline, challenge: string): number {
    let score = 50;
    
    // Timeline urgency
    if (timeline === 'asap') score += 30;
    else if (timeline === '1_month') score += 20;
    
    // Challenge urgency keywords
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'crisis', 'critical', 'deadline'];
    const hasUrgentKeyword = urgentKeywords.some(keyword => 
      challenge.toLowerCase().includes(keyword)
    );
    
    if (hasUrgentKeyword) score += 20;
    
    return Math.min(100, score);
  }

  /**
   * Validation and utility functions
   */
  private validateLeadInput(input: LeadInput): string[] {
    const errors: string[] = [];

    if (!input.name || input.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (!input.email || !/\S+@\S+\.\S+/.test(input.email)) {
      errors.push('Valid email is required');
    }

    if (!input.company || input.company.trim().length < 2) {
      errors.push('Company name is required');
    }

    if (!input.projectDescription || input.projectDescription.trim().length < 10) {
      errors.push('Project description must be at least 10 characters');
    }

    if (!input.primaryChallenge || input.primaryChallenge.trim().length < 5) {
      errors.push('Primary challenge must be at least 5 characters');
    }

    return errors;
  }

  private generateLeadId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `lead_${timestamp}_${random}`;
  }

  /**
   * Google Sheets integration methods
   */
  private async saveLeadToSheets(lead: LeadProfile): Promise<void> {
    try {
      await googleSheetsService.appendToSheet(this.SHEET_NAME, [this.leadToSheetRow(lead)]);
    } catch (error) {
      console.error('Error saving lead to sheets:', error);
      throw error;
    }
  }

  private async updateLeadInSheets(lead: LeadProfile): Promise<void> {
    // In a real implementation, we'd find the row and update it
    // For now, we'll implement a simplified version
    console.warn('Lead update in sheets not fully implemented');
  }

  private leadToSheetRow(lead: LeadProfile): any[] {
    return [
      lead.id,
      lead.createdAt.toISOString(),
      lead.name,
      lead.email,
      lead.phone || '',
      lead.company,
      lead.website || '',
      lead.jobTitle || '',
      lead.companySize,
      lead.industry || '',
      lead.projectType,
      lead.projectDescription,
      lead.budgetRange,
      lead.timeline,
      lead.primaryChallenge,
      JSON.stringify(lead.additionalChallenges || []),
      lead.specificRequirements || '',
      lead.status,
      lead.priority,
      lead.source,
      lead.leadScore,
      lead.assignedTo || '',
      lead.nextAction || '',
      lead.followUpDate?.toISOString() || '',
      lead.notes || '',
      JSON.stringify(lead.tags || []),
      lead.updatedAt.toISOString()
    ];
  }

  private parseLeadsFromSheets(rawData: any[][]): LeadProfile[] {
    // Skip header row
    return rawData.slice(1).map(row => this.sheetRowToLead(row)).filter(Boolean);
  }

  private sheetRowToLead(row: any[]): LeadProfile | null {
    try {
      return {
        id: row[0],
        createdAt: new Date(row[1]),
        name: row[2],
        email: row[3],
        phone: row[4] || undefined,
        company: row[5],
        website: row[6] || undefined,
        jobTitle: row[7] || undefined,
        companySize: row[8] as CompanySize,
        industry: row[9] || undefined,
        projectType: row[10] as ProjectType,
        projectDescription: row[11],
        budgetRange: row[12] as BudgetRange,
        timeline: row[13] as Timeline,
        primaryChallenge: row[14],
        additionalChallenges: row[15] ? JSON.parse(row[15]) : [],
        specificRequirements: row[16] || undefined,
        status: row[17] as LeadStatus,
        priority: row[18] as LeadPriority,
        source: row[19] as LeadSource,
        leadScore: parseInt(row[20]) || 0,
        assignedTo: row[21] || undefined,
        nextAction: row[22] || undefined,
        followUpDate: row[23] ? new Date(row[23]) : undefined,
        notes: row[24] || '',
        tags: row[25] ? JSON.parse(row[25]) : [],
        updatedAt: new Date(row[26])
      };
    } catch (error) {
      console.error('Error parsing lead from sheet row:', error);
      return null;
    }
  }

  /**
   * Caching utilities
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private clearCache(): void {
    this.cache.clear();
  }

  /**
   * Filtering and sorting utilities
   */
  private applyFilters(leads: LeadProfile[], filters: LeadFilters): LeadProfile[] {
    return leads.filter(lead => {
      if (filters.status && !filters.status.includes(lead.status)) return false;
      if (filters.priority && !filters.priority.includes(lead.priority)) return false;
      if (filters.source && !filters.source.includes(lead.source)) return false;
      if (filters.projectType && !filters.projectType.includes(lead.projectType)) return false;
      if (filters.budgetRange && !filters.budgetRange.includes(lead.budgetRange)) return false;
      if (filters.companySize && !filters.companySize.includes(lead.companySize)) return false;
      if (filters.assignedTo && !filters.assignedTo.includes(lead.assignedTo || '')) return false;
      
      if (filters.dateRange) {
        if (lead.createdAt < filters.dateRange.start || lead.createdAt > filters.dateRange.end) {
          return false;
        }
      }
      
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some(tag => lead.tags?.includes(tag))) return false;
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchFields = [
          lead.name, lead.email, lead.company, lead.projectDescription, 
          lead.primaryChallenge, lead.notes
        ];
        if (!searchFields.some(field => field?.toLowerCase().includes(query))) {
          return false;
        }
      }
      
      return true;
    });
  }

  private sortLeads(leads: LeadProfile[], sort: LeadSortOptions): LeadProfile[] {
    return [...leads].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private shouldRecalculateScore(update: LeadUpdate): boolean {
    const scoreFields: (keyof LeadUpdate)[] = ['status'];
    return Object.keys(update).some(key => scoreFields.includes(key as keyof LeadUpdate));
  }

  private calculateMonthlyTrends(leads: LeadProfile[]) {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthLeads = leads.filter(lead => 
        lead.createdAt >= month && lead.createdAt < nextMonth
      );
      
      const conversions = monthLeads.filter(lead => lead.status === 'won').length;
      
      months.push({
        month: month.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        leads: monthLeads.length,
        conversions
      });
    }
    
    return months;
  }

  /**
   * Create discovery record for completed discovery
   */
  private async createDiscoveryRecord(lead: LeadProfile): Promise<string> {
    try {
      const discoveryId = `discovery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // In a real implementation, this would create a proper discovery record
      // For now, we'll just return the generated ID
      
      return discoveryId;
    } catch (error) {
      console.error('Error creating discovery record:', error);
      throw error;
    }
  }

  /**
   * Auto-create project from completed discovery
   */
  private async autoCreateProject(lead: LeadProfile, discoveryId: string): Promise<string> {
    try {
      // First, convert lead to client if not already converted
      let clientId = lead.clientId;
      if (!clientId) {
        clientId = await this.convertLeadToClient(lead.id);
      }

      // Determine project type mapping
      const projectTypeMapping: Record<string, any> = {
        social_media_marketing: 'social_media',
        web_development: 'web_development',
        branding: 'branding',
        seo_optimization: 'seo',
        paid_advertising: 'paid_ads',
        content_marketing: 'content_marketing',
        full_service: 'full_service'
      };

      // Calculate project timeline
      const timelineMapping: Record<string, number> = {
        asap: 30,
        '1_month': 30,
        '3_months': 90,
        '6_months': 180,
        '1_year': 365,
        '1_plus_years': 365
      };

      const projectDuration = timelineMapping[lead.timeline] || 90;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + projectDuration);

      // Estimate budget from budget range
      const budgetMapping: Record<string, number> = {
        'under_10k': 8000,
        '10k_25k': 17500,
        '25k_50k': 37500,
        '50k_100k': 75000,
        'over_100k': 150000
      };

      const estimatedBudget = budgetMapping[lead.budgetRange] || 25000;

      // Create project data
      const projectData = {
        clientId: clientId,
        discoveryId: discoveryId,
        name: `${lead.company} - ${lead.projectType.replace('_', ' ')}`,
        description: lead.projectDescription,
        type: projectTypeMapping[lead.projectType] || 'full_service',
        priority: lead.priority === 'hot' ? 'high' : lead.priority === 'warm' ? 'medium' : 'low',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        estimatedHours: Math.round(estimatedBudget / 100), // Rough estimate at $100/hour
        projectManager: 'Auto-assigned', // Default project manager
        assignedTalent: [], // Empty initially
        budget: estimatedBudget,
        hourlyRate: 100, // Default hourly rate
        contentRequirements: this.generateContentRequirements(lead.projectType),
        tags: ['auto-created', 'from-discovery', lead.projectType],
        notes: `Auto-created from discovery completion for lead ${lead.name} (${lead.email}). Primary challenge: ${lead.primaryChallenge}`
      };

      // Create project directly via Google Sheets to avoid server-side fetch issues
      const { GoogleSheetsService } = await import('../google-sheets');
      const { ProjectUtils } = await import('./project-types');
      
      const sheetsService = new GoogleSheetsService();
      
      // Create project object
      const newProject = {
        id: ProjectUtils.generateProjectId(),
        ...projectData,
        status: 'planning',
        milestones: [],
        deliverables: [],
        invoiceIds: [],
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

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
      await sheetsService.appendToSheet('Projects', [projectValues]);

      return newProject.id;
    } catch (error) {
      console.error('Error auto-creating project:', error);
      throw error;
    }
  }

  /**
   * Generate content requirements based on project type
   */
  private generateContentRequirements(projectType: string) {
    const requirements: Record<string, any> = {
      social_media_marketing: {
        postsPerWeek: 5,
        platforms: ['instagram', 'facebook'],
        contentTypes: ['post', 'story', 'reel']
      },
      web_development: {
        postsPerWeek: 0,
        platforms: ['website'],
        contentTypes: ['article']
      },
      branding: {
        postsPerWeek: 2,
        platforms: ['instagram', 'linkedin'],
        contentTypes: ['post', 'carousel']
      },
      seo_optimization: {
        postsPerWeek: 1,
        platforms: ['website'],
        contentTypes: ['article']
      },
      paid_advertising: {
        postsPerWeek: 3,
        platforms: ['facebook', 'instagram'],
        contentTypes: ['ad', 'carousel']
      },
      content_marketing: {
        postsPerWeek: 7,
        platforms: ['instagram', 'linkedin', 'website'],
        contentTypes: ['post', 'article', 'video']
      },
      full_service: {
        postsPerWeek: 10,
        platforms: ['instagram', 'facebook', 'linkedin', 'website'],
        contentTypes: ['post', 'story', 'reel', 'article', 'video']
      }
    };

    return requirements[projectType] || requirements.full_service;
  }

  /**
   * Notification helper (placeholder for future implementation)
   */
  private async sendLeadNotification(lead: LeadProfile): Promise<void> {
    // In a real implementation, this would send notifications via email/Slack
  }
}

export const leadService = new LeadService();