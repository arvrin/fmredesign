/**
 * Discovery API Endpoints
 * Handles CRUD operations for discovery sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import { DiscoverySession } from '@/lib/admin/discovery-types';

const SHEET_NAME = 'Discovery_Sessions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const clientId = searchParams.get('clientId');

    const sheetsService = new GoogleSheetsService();
    await sheetsService.init();

    // Get specific session
    if (sessionId) {
      const sessions = await sheetsService.readData(SHEET_NAME);
      const session = sessions.find((s: any) => s.id === sessionId);
      
      if (session) {
        return NextResponse.json({ 
          success: true, 
          data: parseDiscoverySession(session) 
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'Discovery session not found' 
        }, { status: 404 });
      }
    }

    // Get sessions for specific client
    if (clientId) {
      const sessions = await sheetsService.readData(SHEET_NAME);
      const clientSessions = sessions
        .filter((s: any) => s.clientId === clientId)
        .map(parseDiscoverySession);
      
      return NextResponse.json({ 
        success: true, 
        data: clientSessions 
      });
    }

    // Get all sessions
    const sessions = await sheetsService.readData(SHEET_NAME);
    return NextResponse.json({ 
      success: true, 
      data: sessions.map(parseDiscoverySession) 
    });

  } catch (error) {
    console.error('Error fetching discovery sessions:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch discovery sessions' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, session, sessionId, updates } = body;

    const sheetsService = new GoogleSheetsService();
    await sheetsService.init();

    if (action === 'create') {
      // Create new discovery session
      const sessionData = flattenDiscoverySession(session);
      await sheetsService.appendData(SHEET_NAME, [sessionData]);
      
      return NextResponse.json({ 
        success: true, 
        data: session 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error creating discovery session:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create discovery session' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, updates } = body;

    if (action === 'update') {
      const sheetsService = new GoogleSheetsService();
      await sheetsService.init();

      // Find the session row
      const sessions = await sheetsService.readData(SHEET_NAME);
      const sessionIndex = sessions.findIndex((s: any) => s.id === sessionId);
      
      if (sessionIndex === -1) {
        return NextResponse.json({ 
          success: false, 
          error: 'Discovery session not found' 
        }, { status: 404 });
      }

      // Update the session
      const updatedSession = { ...sessions[sessionIndex], ...flattenDiscoverySession(updates) };
      await sheetsService.updateRow(SHEET_NAME, sessionIndex + 2, updatedSession); // +2 for header and 0-index

      return NextResponse.json({ 
        success: true, 
        data: parseDiscoverySession(updatedSession) 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error updating discovery session:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update discovery session' 
    }, { status: 500 });
  }
}

/**
 * Flatten complex discovery session object for Google Sheets storage
 */
function flattenDiscoverySession(session: Partial<DiscoverySession>): Record<string, any> {
  return {
    id: session.id,
    clientId: session.clientId,
    leadId: session.leadId || '',
    status: session.status,
    currentSection: session.currentSection,
    completedSections: session.completedSections ? JSON.stringify(session.completedSections) : '[]',
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    completedAt: session.completedAt || '',
    assignedTo: session.assignedTo,
    
    // Company Fundamentals
    companyName: session.companyFundamentals?.companyName || '',
    industry: session.companyFundamentals?.industry || '',
    companySize: session.companyFundamentals?.companySize || '',
    foundedYear: session.companyFundamentals?.foundedYear || '',
    headquarters: session.companyFundamentals?.headquarters || '',
    businessModel: session.companyFundamentals?.businessModel || '',
    missionStatement: session.companyFundamentals?.missionStatement || '',
    uniqueSellingProposition: session.companyFundamentals?.uniqueSellingProposition || '',
    keyStakeholders: session.companyFundamentals?.keyStakeholders ? JSON.stringify(session.companyFundamentals.keyStakeholders) : '[]',
    
    // Project Overview
    projectName: session.projectOverview?.projectName || '',
    projectType: session.projectOverview?.projectType || '',
    projectDescription: session.projectOverview?.projectDescription || '',
    keyObjectives: session.projectOverview?.keyObjectives ? JSON.stringify(session.projectOverview.keyObjectives) : '[]',
    startDate: session.projectOverview?.timeline?.startDate || '',
    desiredLaunch: session.projectOverview?.timeline?.desiredLaunch || '',
    flexibility: session.projectOverview?.timeline?.flexibility || '',
    projectScope: session.projectOverview?.projectScope ? JSON.stringify(session.projectOverview.projectScope) : '[]',
    successMetrics: session.projectOverview?.successMetrics ? JSON.stringify(session.projectOverview.successMetrics) : '[]',
    constraints: session.projectOverview?.constraints ? JSON.stringify(session.projectOverview.constraints) : '[]',
    
    // Target Audience (simplified for flat structure)
    primaryAgeRange: session.targetAudience?.primaryAudience?.demographics?.ageRange || '',
    primaryGender: session.targetAudience?.primaryAudience?.demographics?.gender || '',
    primaryIncome: session.targetAudience?.primaryAudience?.demographics?.income || '',
    primaryEducation: session.targetAudience?.primaryAudience?.demographics?.education || '',
    primaryOccupation: session.targetAudience?.primaryAudience?.demographics?.occupation || '',
    platforms: session.targetAudience?.primaryAudience?.platforms ? JSON.stringify(session.targetAudience.primaryAudience.platforms) : '[]',
    contentPreferences: session.targetAudience?.primaryAudience?.contentPreferences ? JSON.stringify(session.targetAudience.primaryAudience.contentPreferences) : '[]',
    customerPersonas: session.targetAudience?.customerPersonas ? JSON.stringify(session.targetAudience.customerPersonas) : '[]',
    geographicTarget: session.targetAudience?.geographicTarget ? JSON.stringify(session.targetAudience.geographicTarget) : '[]',
    painPoints: session.targetAudience?.painPoints ? JSON.stringify(session.targetAudience.painPoints) : '[]',
    
    // Budget & Resources
    totalBudgetAmount: session.budgetResources?.totalBudget?.amount || 0,
    totalBudgetCurrency: session.budgetResources?.totalBudget?.currency || 'INR',
    budgetFlexibility: session.budgetResources?.totalBudget?.flexibility || '',
    budgetBreakdown: session.budgetResources?.budgetBreakdown ? JSON.stringify(session.budgetResources.budgetBreakdown) : '[]',
    paymentTerms: session.budgetResources?.paymentTerms || '',
    roiExpectations: session.budgetResources?.roiExpectations || '',
    
    // Technical Requirements
    platformPreferences: session.technicalRequirements?.platformPreferences ? JSON.stringify(session.technicalRequirements.platformPreferences) : '[]',
    integrations: session.technicalRequirements?.integrations ? JSON.stringify(session.technicalRequirements.integrations) : '[]',
    securityRequirements: session.technicalRequirements?.securityRequirements ? JSON.stringify(session.technicalRequirements.securityRequirements) : '[]',
    performanceRequirements: session.technicalRequirements?.performanceRequirements ? JSON.stringify(session.technicalRequirements.performanceRequirements) : '[]',
    deviceSupport: session.technicalRequirements?.deviceSupport ? JSON.stringify(session.technicalRequirements.deviceSupport) : '[]',
    
    // Content & Creative
    brandPersonality: session.contentCreative?.brandPersonality ? JSON.stringify(session.contentCreative.brandPersonality) : '[]',
    toneOfVoicePrimary: session.contentCreative?.toneOfVoice?.primary || '',
    colorPreferences: session.contentCreative?.visualStyle?.colorPreferences ? JSON.stringify(session.contentCreative.visualStyle.colorPreferences) : '[]',
    contentTypes: session.contentCreative?.contentStrategy?.contentTypes ? JSON.stringify(session.contentCreative.contentStrategy.contentTypes) : '[]',
    
    // Next Steps
    immediateActions: session.nextSteps?.immediateActions ? JSON.stringify(session.nextSteps.immediateActions) : '[]',
    decisionMakers: session.nextSteps?.decisionMakers ? JSON.stringify(session.nextSteps.decisionMakers) : '[]',
    approvalProcess: session.nextSteps?.approvalProcess || '',
    followUpDate: session.nextSteps?.followUpDate || ''
  };
}

/**
 * Parse flat Google Sheets data back to DiscoverySession object
 */
function parseDiscoverySession(data: any): DiscoverySession {
  return {
    id: data.id,
    clientId: data.clientId,
    leadId: data.leadId,
    status: data.status,
    currentSection: parseInt(data.currentSection) || 1,
    completedSections: data.completedSections ? JSON.parse(data.completedSections) : [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    completedAt: data.completedAt,
    assignedTo: data.assignedTo,
    
    companyFundamentals: {
      companyName: data.companyName || '',
      industry: data.industry || '',
      companySize: data.companySize || 'medium',
      foundedYear: data.foundedYear,
      headquarters: data.headquarters || '',
      businessModel: data.businessModel || '',
      missionStatement: data.missionStatement,
      coreValues: [],
      uniqueSellingProposition: data.uniqueSellingProposition || '',
      keyStakeholders: data.keyStakeholders ? JSON.parse(data.keyStakeholders) : []
    },
    
    projectOverview: {
      projectName: data.projectName || '',
      projectType: data.projectType || 'website',
      projectDescription: data.projectDescription || '',
      keyObjectives: data.keyObjectives ? JSON.parse(data.keyObjectives) : [],
      timeline: {
        startDate: data.startDate || '',
        desiredLaunch: data.desiredLaunch || '',
        flexibility: data.flexibility || 'flexible'
      },
      projectScope: data.projectScope ? JSON.parse(data.projectScope) : [],
      successMetrics: data.successMetrics ? JSON.parse(data.successMetrics) : [],
      constraints: data.constraints ? JSON.parse(data.constraints) : []
    },
    
    targetAudience: {
      primaryAudience: {
        demographics: {
          ageRange: data.primaryAgeRange || '',
          gender: data.primaryGender || '',
          income: data.primaryIncome || '',
          education: data.primaryEducation || '',
          occupation: data.primaryOccupation || ''
        },
        platforms: data.platforms ? JSON.parse(data.platforms) : [],
        contentPreferences: data.contentPreferences ? JSON.parse(data.contentPreferences) : []
      },
      customerPersonas: data.customerPersonas ? JSON.parse(data.customerPersonas) : [],
      geographicTarget: data.geographicTarget ? JSON.parse(data.geographicTarget) : [],
      psychographics: [],
      behaviorPatterns: [],
      painPoints: data.painPoints ? JSON.parse(data.painPoints) : [],
      customerJourney: []
    },
    
    currentState: {
      socialMediaPresence: [],
      existingBranding: {
        hasLogo: false,
        hasBrandGuidelines: false,
        brandAssets: [],
        brandPerception: ''
      },
      currentMarketing: [],
      currentChallenges: [],
      whatIsWorking: [],
      whatIsNotWorking: []
    },
    
    goalsKPIs: {
      businessGoals: [],
      marketingGoals: [],
      kpis: [],
      successDefinition: '',
      timeframe: '',
      priorityLevel: 'medium'
    },
    
    competitionMarket: {
      directCompetitors: [],
      indirectCompetitors: [],
      marketPosition: '',
      differentiators: [],
      competitiveAdvantages: [],
      marketSize: '',
      marketTrends: [],
      threatAssessment: [],
      opportunities: []
    },
    
    budgetResources: {
      totalBudget: {
        amount: parseFloat(data.totalBudgetAmount) || 0,
        currency: data.totalBudgetCurrency || 'INR',
        flexibility: data.budgetFlexibility || 'flexible'
      },
      budgetBreakdown: data.budgetBreakdown ? JSON.parse(data.budgetBreakdown) : [],
      paymentTerms: data.paymentTerms || '',
      internalResources: [],
      roiExpectations: data.roiExpectations || '',
      budgetApprovalProcess: ''
    },
    
    technicalRequirements: {
      platformPreferences: data.platformPreferences ? JSON.parse(data.platformPreferences) : [],
      integrations: data.integrations ? JSON.parse(data.integrations) : [],
      securityRequirements: data.securityRequirements ? JSON.parse(data.securityRequirements) : [],
      performanceRequirements: data.performanceRequirements ? JSON.parse(data.performanceRequirements) : [],
      accessibilityRequirements: [],
      deviceSupport: data.deviceSupport ? JSON.parse(data.deviceSupport) : [],
      browserSupport: [],
      futureScalability: []
    },
    
    contentCreative: {
      brandPersonality: data.brandPersonality ? JSON.parse(data.brandPersonality) : [],
      toneOfVoice: {
        primary: data.toneOfVoicePrimary || '',
        characteristics: [],
        avoidList: [],
        examples: []
      },
      visualStyle: {
        colorPreferences: data.colorPreferences ? JSON.parse(data.colorPreferences) : [],
        fontPreferences: [],
        imageStyle: [],
        designInspiration: []
      },
      contentStrategy: {
        contentTypes: data.contentTypes ? JSON.parse(data.contentTypes) : [],
        postingFrequency: '',
        contentThemes: [],
        seasonalContent: false,
        userGeneratedContent: false,
        contentWorkflow: ''
      },
      existingAssets: [],
      contentGaps: [],
      creativePreferences: []
    },
    
    nextSteps: {
      immediateActions: data.immediateActions ? JSON.parse(data.immediateActions) : [],
      decisionMakers: data.decisionMakers ? JSON.parse(data.decisionMakers) : [],
      approvalProcess: data.approvalProcess || '',
      timeline: {
        phases: [],
        milestones: [],
        dependencies: []
      },
      communication: {
        frequency: '',
        channels: [],
        reportingFormat: '',
        meetingSchedule: '',
        pointOfContact: ''
      },
      riskFactors: [],
      successFactors: [],
      followUpDate: data.followUpDate || ''
    }
  };
}