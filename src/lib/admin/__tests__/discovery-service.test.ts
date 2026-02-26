/**
 * DiscoveryService Tests
 * Tests analytics generation, complexity assessment, team sizing, and timeline.
 * Only tests pure computation methods — network calls are mocked/avoided.
 */

import { describe, it, expect, vi } from 'vitest';
import type { DiscoverySession } from '../discovery-types';

// Mock fetch and localStorage to prevent real network/storage calls
vi.stubGlobal('fetch', vi.fn());
vi.stubGlobal('localStorage', {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
});

import { DiscoveryService } from '../discovery-service';

/** Factory: create a minimal valid DiscoverySession for testing */
function createMockSession(overrides: Partial<DiscoverySession> = {}): DiscoverySession {
  return {
    id: 'test-session-1',
    clientId: 'client-1',
    status: 'in_progress',
    currentSection: 5,
    completedSections: [1, 2, 3, 4, 5],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T02:00:00Z',
    assignedTo: 'admin',
    companyFundamentals: {
      companyName: 'TestCorp',
      industry: 'Technology',
      companySize: 'medium',
      headquarters: 'Mumbai',
      businessModel: 'SaaS',
      uniqueSellingProposition: 'AI-powered analytics',
      keyStakeholders: [],
    },
    projectOverview: {
      projectName: 'Website Redesign',
      projectType: 'website',
      projectDescription: 'Redesign the corporate website',
      keyObjectives: ['Improve UX', 'Increase conversions'],
      timeline: {
        startDate: '2025-02-01',
        desiredLaunch: '2025-05-01',
        flexibility: 'flexible',
      },
      projectScope: ['Design', 'Development', 'Content'],
      successMetrics: ['50% faster load time'],
      constraints: [],
    },
    targetAudience: {
      primaryAudience: {
        demographics: { ageRange: '25-45', gender: 'all', income: 'medium-high', education: 'graduate', occupation: 'professionals' },
        platforms: ['LinkedIn', 'Twitter'],
        contentPreferences: ['articles', 'videos'],
      },
      customerPersonas: [],
      geographicTarget: ['India'],
      psychographics: [],
      behaviorPatterns: [],
      painPoints: [],
      customerJourney: [],
    },
    currentState: {
      socialMediaPresence: [],
      existingBranding: { hasLogo: true, hasBrandGuidelines: false, brandAssets: [], brandPerception: '' },
      currentMarketing: [],
      currentChallenges: ['Outdated website'],
      whatIsWorking: [],
      whatIsNotWorking: [],
    },
    goalsKPIs: {
      businessGoals: [{ goal: 'Increase revenue', metric: 'Revenue', targetValue: 10000000, timeframe: '12 months' }],
      marketingGoals: [{ objective: 'Lead generation', channel: 'Digital', metric: 'Leads per month', target: 100, timeframe: '6 months' }],
      kpis: [],
      successDefinition: 'Double conversion rate',
      timeframe: '6 months',
      priorityLevel: 'high',
    },
    competitionMarket: {
      directCompetitors: [],
      indirectCompetitors: [],
      marketPosition: 'challenger',
      differentiators: [],
      competitiveAdvantages: [],
      marketSize: '',
      marketTrends: [],
      threatAssessment: [],
      opportunities: [],
    },
    budgetResources: {
      totalBudget: { amount: 500000, currency: 'INR', flexibility: 'flexible' },
      budgetBreakdown: [],
      paymentTerms: 'Net 30',
      internalResources: [],
      roiExpectations: '3x ROI in 12 months',
      budgetApprovalProcess: '',
    },
    technicalRequirements: {
      platformPreferences: ['Next.js'],
      integrations: [{ system: 'CRM', purpose: 'Client management', priority: 'must_have', apiAvailable: true }],
      securityRequirements: [],
      performanceRequirements: [{ metric: 'Load Time', target: '<2s', priority: 'high' }],
      accessibilityRequirements: [],
      deviceSupport: ['desktop', 'mobile'],
      browserSupport: [],
      futureScalability: [],
    },
    contentCreative: {
      brandPersonality: ['Professional', 'Innovative'],
      toneOfVoice: { primary: 'professional', characteristics: [], avoidList: [], examples: [] },
      visualStyle: { colorPreferences: [], fontPreferences: [], imageStyle: [], designInspiration: ['Apple.com'] },
      contentStrategy: { contentTypes: ['blog', 'case-study'], postingFrequency: 'weekly', contentThemes: [], seasonalContent: false, userGeneratedContent: false, contentWorkflow: '' },
      existingAssets: [],
      contentGaps: [],
      creativePreferences: [],
    },
    nextSteps: {
      immediateActions: [],
      decisionMakers: [],
      approvalProcess: '',
      timeline: { phases: [], milestones: [], dependencies: [] },
      communication: { frequency: 'weekly', channels: ['email'], reportingFormat: '', meetingSchedule: '', pointOfContact: '' },
      riskFactors: [],
      successFactors: [],
      followUpDate: '',
    },
    ...overrides,
  };
}

describe('DiscoveryService.generateDiscoveryAnalytics', () => {
  it('calculates completion rate from completed sections', () => {
    const session = createMockSession({ completedSections: [1, 2, 3, 4, 5] });
    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(analytics.completionRate).toBe(50); // 5/10 * 100
  });

  it('calculates 100% for fully completed session', () => {
    const session = createMockSession({
      completedSections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    });
    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(analytics.completionRate).toBe(100);
  });

  it('calculates 0% for no completed sections', () => {
    const session = createMockSession({ completedSections: [] });
    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(analytics.completionRate).toBe(0);
  });

  it('returns the session ID', () => {
    const session = createMockSession({ id: 'discovery-42' });
    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(analytics.sessionId).toBe('discovery-42');
  });

  it('returns budget from session', () => {
    const session = createMockSession();
    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(analytics.estimatedBudget).toBe(500000);
  });

  it('identifies talent requirements for website project', () => {
    const session = createMockSession();
    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    const roles = analytics.talentRequirements.map((r) => r.role);
    expect(roles).toContain('Web Developer');
  });

  it('identifies UI/UX requirement when design inspiration exists', () => {
    const session = createMockSession();
    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    const roles = analytics.talentRequirements.map((r) => r.role);
    expect(roles).toContain('UI/UX Designer');
  });

  it('identifies content creator when content types exist', () => {
    const session = createMockSession();
    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    const roles = analytics.talentRequirements.map((r) => r.role);
    expect(roles).toContain('Content Creator');
  });

  it('recommends team size between 2 and 8', () => {
    const session = createMockSession();
    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(analytics.recommendedTeamSize).toBeGreaterThanOrEqual(2);
    expect(analytics.recommendedTeamSize).toBeLessThanOrEqual(8);
  });

  it('extracts required skills from technical requirements', () => {
    const session = createMockSession();
    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(analytics.skillsRequired).toContain('Next.js');
    expect(analytics.skillsRequired).toContain('CRM');
  });
});

describe('DiscoveryService complexity assessment', () => {
  it('returns low complexity for minimal project scope', () => {
    const session = createMockSession({
      projectOverview: {
        ...createMockSession().projectOverview,
        projectScope: [],
      },
      technicalRequirements: {
        platformPreferences: [],
        integrations: [],
        securityRequirements: [],
        performanceRequirements: [],
        accessibilityRequirements: [],
        deviceSupport: [],
        browserSupport: [],
        futureScalability: [],
      },
      contentCreative: {
        ...createMockSession().contentCreative,
        contentStrategy: {
          contentTypes: [],
          postingFrequency: '',
          contentThemes: [],
          seasonalContent: false,
          userGeneratedContent: false,
          contentWorkflow: '',
        },
      },
    });

    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(analytics.projectComplexity).toBe('low');
  });

  it('returns higher complexity for projects with many integrations', () => {
    const session = createMockSession({
      technicalRequirements: {
        platformPreferences: ['Next.js', 'React Native'],
        integrations: [
          { system: 'CRM', purpose: 'Client management', priority: 'must_have', apiAvailable: true },
          { system: 'ERP', purpose: 'Resource planning', priority: 'must_have', apiAvailable: true },
          { system: 'Payment Gateway', purpose: 'Payments', priority: 'must_have', apiAvailable: true },
          { system: 'Analytics', purpose: 'Tracking', priority: 'nice_to_have', apiAvailable: true },
        ],
        securityRequirements: [],
        performanceRequirements: [
          { metric: 'Load Time', target: '<1s', priority: 'high' },
          { metric: 'API Response', target: '<100ms', priority: 'high' },
          { metric: 'CDN', target: 'Global', priority: 'medium' },
        ],
        accessibilityRequirements: [],
        deviceSupport: [],
        browserSupport: [],
        futureScalability: [],
      },
      projectOverview: {
        ...createMockSession().projectOverview,
        projectScope: ['Design', 'Frontend', 'Backend', 'API', 'Testing', 'Deployment'],
      },
    });

    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(['high', 'very_high']).toContain(analytics.projectComplexity);
  });
});

describe('DiscoveryService timeline assessment', () => {
  it('flags tight timeline (< 30 days)', () => {
    const session = createMockSession({
      projectOverview: {
        ...createMockSession().projectOverview,
        timeline: {
          startDate: '2025-03-01',
          desiredLaunch: '2025-03-20',
          flexibility: 'fixed',
        },
      },
    });

    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(analytics.timelineAssessment).toContain('Very Tight');
  });

  it('flags reasonable timeline (60-120 days)', () => {
    const session = createMockSession({
      projectOverview: {
        ...createMockSession().projectOverview,
        timeline: {
          startDate: '2025-01-01',
          desiredLaunch: '2025-04-01',
          flexibility: 'flexible',
        },
      },
    });

    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(analytics.timelineAssessment).toContain('Reasonable');
  });

  it('flags comfortable timeline (> 120 days)', () => {
    const session = createMockSession({
      projectOverview: {
        ...createMockSession().projectOverview,
        timeline: {
          startDate: '2025-01-01',
          desiredLaunch: '2025-07-01',
          flexibility: 'flexible',
        },
      },
    });

    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    expect(analytics.timelineAssessment).toContain('Comfortable');
  });
});

describe('DiscoveryService.generateDiscoveryReport', () => {
  it('generates markdown report with session data', () => {
    const session = createMockSession();
    const report = DiscoveryService.generateDiscoveryReport(session);

    expect(report).toContain('# Discovery Report - TestCorp');
    expect(report).toContain('Website Redesign');
    expect(report).toContain('website');
    expect(report).toContain('Redesign the corporate website');
    expect(report).toContain('Improve UX');
    expect(report).toContain('Web Developer');
    expect(report).toContain('5,00,000');
  });

  it('includes talent requirements in the report', () => {
    const session = createMockSession();
    const report = DiscoveryService.generateDiscoveryReport(session);

    expect(report).toContain('Talent Requirements');
    expect(report).toContain('Recommended Team');
  });
});

describe('DiscoveryService talent analysis by project type', () => {
  it('recommends Mobile Developer for app projects', () => {
    const session = createMockSession({
      projectOverview: {
        ...createMockSession().projectOverview,
        projectType: 'app',
      },
    });

    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    const roles = analytics.talentRequirements.map((r) => r.role);
    expect(roles).toContain('Mobile Developer');
  });

  it('recommends Marketing Specialist for campaign projects', () => {
    const session = createMockSession({
      projectOverview: {
        ...createMockSession().projectOverview,
        projectType: 'marketing_campaign',
      },
    });

    const analytics = DiscoveryService.generateDiscoveryAnalytics(session);
    const roles = analytics.talentRequirements.map((r) => r.role);
    expect(roles).toContain('Digital Marketing Specialist');
  });
});
