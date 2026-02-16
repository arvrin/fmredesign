/**
 * CreativeMinds Talent API
 * Handles talent applications and management via Google Sheets
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import { TalentApplication, TalentProfile, PricingInfo, PortfolioLinks } from '@/lib/admin/talent-types';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';

const SHEET_NAMES = {
  applications: 'CreativeMinds_Applications',
  talents: 'CreativeMinds_Talents',
};

// Helper: convert sheet rows (2D array) to objects using first row as headers
function sheetToObjects(data: any[][]): Record<string, any>[] {
  if (!data || data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj: Record<string, any> = {};
    headers.forEach((header: string, index: number) => {
      if (header && row[index] !== undefined) {
        obj[header] = row[index];
      }
    });
    return obj;
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const sheetsService = new GoogleSheetsService();

    if (type === 'applications') {
      let rawData: any[][];
      try {
        rawData = await sheetsService.readSheet(SHEET_NAMES.applications);
      } catch {
        return NextResponse.json({ success: true, data: [], total: 0 });
      }

      let applications = sheetToObjects(rawData);

      if (status) {
        applications = applications.filter((app) => app.status === status);
      }

      return NextResponse.json({
        success: true,
        data: applications.map(parseTalentApplication),
      });
    }

    if (type === 'talents') {
      let rawData: any[][];
      try {
        rawData = await sheetsService.readSheet(SHEET_NAMES.talents);
      } catch {
        return NextResponse.json({ success: true, data: [], total: 0 });
      }

      let talents = sheetToObjects(rawData);

      if (category) talents = talents.filter((t) => t.category === category);
      if (status) talents = talents.filter((t) => t.status === status);

      if (id) {
        const talent = talents.find((t) => t.id === id);
        return NextResponse.json({
          success: true,
          data: talent ? parseTalentProfile(talent) : null,
        });
      }

      return NextResponse.json({
        success: true,
        data: talents.map(parseTalentProfile),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching talent data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch talent data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    if (!rateLimit(clientIp, 5)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, application, applicationId } = body;

    // Validate email if submitting application
    if (action === 'submit_application' && application?.personalInfo?.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(application.personalInfo.email)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    const sheetsService = new GoogleSheetsService();

    if (action === 'submit_application') {
      const appId = `app-${Date.now()}`;
      const applicationData = {
        ...application,
        id: appId,
        applicationDate: new Date().toISOString(),
        status: 'submitted',
      };

      const flatData = flattenTalentApplication(applicationData);
      const headers = Object.keys(flatData);
      const values = Object.values(flatData).map((v) =>
        v === null || v === undefined ? '' : String(v)
      );

      // Ensure headers exist, then append data
      try {
        const existing = await sheetsService.readSheet(SHEET_NAMES.applications);
        if (!existing || existing.length === 0) {
          await sheetsService.writeSheet(SHEET_NAMES.applications, [headers]);
        }
      } catch {
        // Sheet may not exist yet — write headers first
        await sheetsService.writeSheet(SHEET_NAMES.applications, [headers]);
      }

      await sheetsService.appendToSheet(SHEET_NAMES.applications, [values]);

      return NextResponse.json({ success: true, data: applicationData });
    }

    if (action === 'approve_application') {
      // Read all applications
      const rawData = await sheetsService.readSheet(SHEET_NAMES.applications);
      const applications = sheetToObjects(rawData);
      const appIndex = applications.findIndex((app) => app.id === applicationId);

      if (appIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Application not found' },
          { status: 404 }
        );
      }

      // Update application status
      applications[appIndex].status = 'approved';
      applications[appIndex].reviewedAt = new Date().toISOString();
      applications[appIndex].reviewedBy = 'admin';

      // Rewrite all applications
      const headers = rawData[0];
      const updatedRows = applications.map((app) =>
        headers.map((h: string) => (app[h] !== undefined ? String(app[h]) : ''))
      );
      await sheetsService.writeSheet(SHEET_NAMES.applications, [
        headers,
        ...updatedRows,
      ]);

      // Create talent profile in talents sheet
      const talentId = `talent-${Date.now()}`;
      const talentProfile = {
        id: talentId,
        ...applications[appIndex],
        status: 'approved',
        overallRating: '0',
        totalReviews: '0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const talentHeaders = Object.keys(talentProfile);
      const talentValues = Object.values(talentProfile).map((v) =>
        v === null || v === undefined ? '' : String(v)
      );

      try {
        const existingTalents = await sheetsService.readSheet(SHEET_NAMES.talents);
        if (!existingTalents || existingTalents.length === 0) {
          await sheetsService.writeSheet(SHEET_NAMES.talents, [talentHeaders]);
        }
      } catch {
        await sheetsService.writeSheet(SHEET_NAMES.talents, [talentHeaders]);
      }

      await sheetsService.appendToSheet(SHEET_NAMES.talents, [talentValues]);

      return NextResponse.json({ success: true, data: talentProfile });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing talent request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, updates } = body;

    const sheetsService = new GoogleSheetsService();

    if (type === 'application') {
      const rawData = await sheetsService.readSheet(SHEET_NAMES.applications);
      const applications = sheetToObjects(rawData);
      const appIndex = applications.findIndex((app) => app.id === id);

      if (appIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Application not found' },
          { status: 404 }
        );
      }

      applications[appIndex] = { ...applications[appIndex], ...updates };

      const headers = rawData[0];
      const updatedRows = applications.map((app) =>
        headers.map((h: string) => (app[h] !== undefined ? String(app[h]) : ''))
      );
      await sheetsService.writeSheet(SHEET_NAMES.applications, [
        headers,
        ...updatedRows,
      ]);

      return NextResponse.json({
        success: true,
        data: parseTalentApplication(applications[appIndex]),
      });
    }

    if (type === 'talent') {
      const rawData = await sheetsService.readSheet(SHEET_NAMES.talents);
      const talents = sheetToObjects(rawData);
      const talentIndex = talents.findIndex((t) => t.id === id);

      if (talentIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Talent not found' },
          { status: 404 }
        );
      }

      talents[talentIndex] = {
        ...talents[talentIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const headers = rawData[0];
      const updatedRows = talents.map((t) =>
        headers.map((h: string) => (t[h] !== undefined ? String(t[h]) : ''))
      );
      await sheetsService.writeSheet(SHEET_NAMES.talents, [
        headers,
        ...updatedRows,
      ]);

      return NextResponse.json({
        success: true,
        data: parseTalentProfile(talents[talentIndex]),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating talent data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update talent data' },
      { status: 500 }
    );
  }
}

// Flatten a TalentApplication for Google Sheets storage
function flattenTalentApplication(
  application: TalentApplication
): Record<string, any> {
  const portfolioLinks = application.portfolioLinks || { websiteUrl: '', workSampleUrls: [] };
  const pricing = application.pricing || {
    hourlyRate: { min: 0, max: 0 },
    projectRate: { min: 0, max: 0 },
    retainerRate: { min: 0, max: 0 },
    openToNegotiation: false,
  };

  return {
    id: application.id,
    applicationDate: application.applicationDate,
    status: application.status,
    reviewNotes: application.reviewNotes || '',
    reviewedBy: application.reviewedBy || '',
    reviewedAt: application.reviewedAt || '',
    fullName: application.personalInfo.fullName,
    email: application.personalInfo.email,
    phone: application.personalInfo.phone,
    city: application.personalInfo.location.city,
    state: application.personalInfo.location.state,
    country: application.personalInfo.location.country,
    bio: application.personalInfo.bio,
    languages: application.personalInfo.languages.join(', '),
    category: application.professionalDetails.category,
    subcategories: application.professionalDetails.subcategories.join(', '),
    experienceLevel: application.professionalDetails.experienceLevel,
    yearsOfExperience: application.professionalDetails.yearsOfExperience,
    skills: JSON.stringify(application.professionalDetails.skills),
    tools: application.professionalDetails.tools.join(', '),
    portfolioWebsite: portfolioLinks.websiteUrl || '',
    workSampleUrl1: portfolioLinks.workSampleUrls?.[0] || '',
    workSampleUrl2: portfolioLinks.workSampleUrls?.[1] || '',
    workSampleUrl3: portfolioLinks.workSampleUrls?.[2] || '',
    currentStatus: application.availability.currentStatus,
    hoursPerWeek: application.availability.hoursPerWeek,
    remoteWork: application.availability.remoteWork,
    projectCommitment: application.availability.projectCommitment || 'both',
    instagramHandle: application.socialMedia.instagram?.handle || '',
    instagramFollowers: application.socialMedia.instagram?.followers || 0,
    youtubeChannel: application.socialMedia.youtube?.channel || '',
    youtubeSubscribers: application.socialMedia.youtube?.subscribers || 0,
    linkedinProfile: application.socialMedia.linkedin?.profileUrl || '',
    behanceProfile: application.socialMedia.behance?.profileUrl || '',
    dribbbleProfile: application.socialMedia.dribbble?.profileUrl || '',
    communicationStyle: application.preferences.communicationStyle || 'mixed',
    minimumProjectValue: application.preferences.minimumProjectValue,
    currency: application.preferences.currency,
    hourlyRateMin: pricing.hourlyRate.min,
    hourlyRateMax: pricing.hourlyRate.max,
    projectRateMin: pricing.projectRate.min,
    projectRateMax: pricing.projectRate.max,
    retainerRateMin: pricing.retainerRate.min,
    retainerRateMax: pricing.retainerRate.max,
    openToNegotiation: pricing.openToNegotiation,
  };
}

// Parse flat sheet data back to TalentApplication
function parseTalentApplication(data: any): TalentApplication {
  const workSampleUrls = [
    data.workSampleUrl1,
    data.workSampleUrl2,
    data.workSampleUrl3,
  ].filter((u) => u && u.trim());

  return {
    id: data.id,
    applicationDate: data.applicationDate,
    status: data.status,
    reviewNotes: data.reviewNotes,
    reviewedBy: data.reviewedBy,
    reviewedAt: data.reviewedAt,
    personalInfo: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      location: {
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
      },
      bio: data.bio || '',
      languages: data.languages ? data.languages.split(', ') : [],
    },
    professionalDetails: {
      category: data.category,
      subcategories: data.subcategories ? data.subcategories.split(', ') : [],
      experienceLevel: data.experienceLevel,
      yearsOfExperience: parseInt(data.yearsOfExperience) || 0,
      skills: data.skills ? JSON.parse(data.skills) : [],
      tools: data.tools ? data.tools.split(', ').filter(Boolean) : [],
      certifications: [],
      education: [],
      workExperience: [],
    },
    portfolio: [],
    portfolioLinks: {
      websiteUrl: data.portfolioWebsite || '',
      workSampleUrls,
    },
    socialMedia: {
      instagram: data.instagramHandle
        ? {
            handle: data.instagramHandle,
            followers: parseInt(data.instagramFollowers) || 0,
            engagementRate: 0,
            lastUpdated: '',
            verified: false,
          }
        : undefined,
      youtube: data.youtubeChannel
        ? {
            channel: data.youtubeChannel,
            subscribers: parseInt(data.youtubeSubscribers) || 0,
            totalViews: 0,
            averageViews: 0,
            lastUpdated: '',
            verified: false,
          }
        : undefined,
      linkedin: data.linkedinProfile
        ? {
            profileUrl: data.linkedinProfile,
            connections: 0,
            lastUpdated: '',
            verified: false,
          }
        : undefined,
      behance: data.behanceProfile
        ? {
            profileUrl: data.behanceProfile,
            followers: 0,
            projects: 0,
            views: 0,
            lastUpdated: '',
            verified: false,
          }
        : undefined,
      dribbble: data.dribbbleProfile
        ? {
            profileUrl: data.dribbbleProfile,
            followers: 0,
            likes: 0,
            shots: 0,
            lastUpdated: '',
            verified: false,
          }
        : undefined,
    },
    availability: {
      currentStatus: data.currentStatus || 'available',
      hoursPerWeek: parseInt(data.hoursPerWeek) || 40,
      preferredWorkingHours: {
        timezone: 'Asia/Kolkata',
        startTime: '09:00',
        endTime: '18:00',
      },
      unavailableDates: [],
      projectCommitment: data.projectCommitment || 'both',
      remoteWork: data.remoteWork === 'true' || data.remoteWork === true,
      travelWillingness: false,
    },
    preferences: {
      projectTypes: [],
      industries: [],
      clientTypes: [],
      communicationStyle: data.communicationStyle || 'mixed',
      paymentTerms: [],
      minimumProjectValue: parseInt(data.minimumProjectValue) || 0,
      currency: data.currency || 'INR',
    },
    pricing: {
      hourlyRate: {
        min: parseInt(data.hourlyRateMin) || 0,
        max: parseInt(data.hourlyRateMax) || 0,
      },
      projectRate: {
        min: parseInt(data.projectRateMin) || 0,
        max: parseInt(data.projectRateMax) || 0,
      },
      retainerRate: {
        min: parseInt(data.retainerRateMin) || 0,
        max: parseInt(data.retainerRateMax) || 0,
      },
      openToNegotiation:
        data.openToNegotiation === 'true' || data.openToNegotiation === true,
    },
  };
}

// Parse flat sheet data to TalentProfile
function parseTalentProfile(data: any): TalentProfile {
  const application = parseTalentApplication(data);
  return {
    ...application,
    status: data.status,
    ratings: {
      overallRating: parseFloat(data.overallRating) || 0,
      totalReviews: parseInt(data.totalReviews) || 0,
      qualityOfWork: parseFloat(data.qualityOfWork) || 0,
      communication: parseFloat(data.communication) || 0,
      timeliness: parseFloat(data.timeliness) || 0,
      professionalism: parseFloat(data.professionalism) || 0,
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
