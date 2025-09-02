/**
 * CreativeMinds Talent API
 * Handles talent applications and management
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import { TalentApplication, TalentProfile } from '@/lib/admin/talent-types';

const SHEET_NAMES = {
  applications: 'CreativeMinds_Applications',
  talents: 'CreativeMinds_Talents',
  portfolio: 'CreativeMinds_Portfolio',
  social: 'CreativeMinds_Social',
  projects: 'CreativeMinds_Projects'
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const sheetsService = new GoogleSheetsService();

    if (type === 'applications') {
      let applicationsData: any[][];
      try {
        applicationsData = await sheetsService.readSheet(SHEET_NAMES.applications);
      } catch (error) {
        // Sheet doesn't exist yet, return empty data
        return NextResponse.json({
          success: true,
          data: [],
          total: 0
        });
      }
      
      // Skip header row and convert to objects
      if (applicationsData.length === 0) {
        return NextResponse.json({
          success: true,
          data: [],
          total: 0
        });
      }
      
      const headers = applicationsData[0];
      let applications = applicationsData.slice(1).map(row => {
        const app: any = {};
        headers.forEach((header: string, index: number) => {
          if (header && row[index] !== undefined) {
            app[header] = row[index];
          }
        });
        return app;
      });
      let filtered = applications;
      
      if (status) {
        filtered = filtered.filter((app: any) => app.status === status);
      }
      
      return NextResponse.json({ 
        success: true, 
        data: filtered.map(parseTalentApplication) 
      });
    }

    if (type === 'talents') {
      let talentsData: any[][];
      try {
        talentsData = await sheetsService.readSheet(SHEET_NAMES.talents);
      } catch (error) {
        // Sheet doesn't exist yet, return empty data
        return NextResponse.json({
          success: true,
          data: [],
          total: 0
        });
      }
      
      // Skip header row and convert to objects
      if (talentsData.length === 0) {
        return NextResponse.json({
          success: true,
          data: [],
          total: 0
        });
      }
      
      const headers = talentsData[0];
      const talents = talentsData.slice(1).map(row => {
        const talent: any = {};
        headers.forEach((header: string, index: number) => {
          if (header && row[index] !== undefined) {
            talent[header] = row[index];
          }
        });
        return talent;
      });
      let filtered = talents;
      
      if (category) {
        filtered = filtered.filter((talent: any) => talent.category === category);
      }
      
      if (status) {
        filtered = filtered.filter((talent: any) => talent.status === status);
      }
      
      if (id) {
        const talent = filtered.find((t: any) => t.id === id);
        return NextResponse.json({ 
          success: true, 
          data: talent ? parseTalentProfile(talent) : null 
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        data: filtered.map(parseTalentProfile) 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid request type' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error fetching talent data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch talent data' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, application, applicationId, updates } = body;

    const sheetsService = new GoogleSheetsService();
    await sheetsService.init();

    if (action === 'submit_application') {
      // Submit new talent application
      const applicationId = `app-${Date.now()}`;
      const applicationData = {
        ...application,
        id: applicationId,
        applicationDate: new Date().toISOString(),
        status: 'submitted'
      };

      const flatData = flattenTalentApplication(applicationData);
      await sheetsService.appendData(SHEET_NAMES.applications, [flatData]);
      
      return NextResponse.json({ 
        success: true, 
        data: applicationData 
      });
    }

    if (action === 'approve_application') {
      // Move application to talents pool
      const applications = await sheetsService.readData(SHEET_NAMES.applications);
      const application = applications.find((app: any) => app.id === applicationId);
      
      if (!application) {
        return NextResponse.json({ 
          success: false, 
          error: 'Application not found' 
        }, { status: 404 });
      }

      // Create talent profile
      const talentId = `talent-${Date.now()}`;
      const talentProfile: Partial<TalentProfile> = {
        id: talentId,
        ...parseTalentApplication(application),
        status: 'approved',
        ratings: {
          overallRating: 0,
          totalReviews: 0,
          qualityOfWork: 0,
          communication: 0,
          timeliness: 0,
          professionalism: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to talents sheet
      const talentData = flattenTalentProfile(talentProfile as TalentProfile);
      await sheetsService.appendData(SHEET_NAMES.talents, [talentData]);

      // Update application status
      const appIndex = applications.findIndex((app: any) => app.id === applicationId);
      if (appIndex !== -1) {
        const updatedApp = {
          ...applications[appIndex],
          status: 'approved',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'admin'
        };
        await sheetsService.updateRow(SHEET_NAMES.applications, appIndex + 2, updatedApp);
      }

      return NextResponse.json({ 
        success: true, 
        data: talentProfile 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error processing talent request:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process request' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, updates } = body;

    const sheetsService = new GoogleSheetsService();
    await sheetsService.init();

    if (type === 'application') {
      const applications = await sheetsService.readData(SHEET_NAMES.applications);
      const appIndex = applications.findIndex((app: any) => app.id === id);
      
      if (appIndex === -1) {
        return NextResponse.json({ 
          success: false, 
          error: 'Application not found' 
        }, { status: 404 });
      }

      const updatedApp = { ...applications[appIndex], ...updates };
      await sheetsService.updateRow(SHEET_NAMES.applications, appIndex + 2, updatedApp);

      return NextResponse.json({ 
        success: true, 
        data: parseTalentApplication(updatedApp) 
      });
    }

    if (type === 'talent') {
      const talents = await sheetsService.readData(SHEET_NAMES.talents);
      const talentIndex = talents.findIndex((talent: any) => talent.id === id);
      
      if (talentIndex === -1) {
        return NextResponse.json({ 
          success: false, 
          error: 'Talent not found' 
        }, { status: 404 });
      }

      const updatedTalent = { 
        ...talents[talentIndex], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      await sheetsService.updateRow(SHEET_NAMES.talents, talentIndex + 2, updatedTalent);

      return NextResponse.json({ 
        success: true, 
        data: parseTalentProfile(updatedTalent) 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid type' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error updating talent data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update talent data' 
    }, { status: 500 });
  }
}

/**
 * Flatten talent application for Google Sheets
 */
function flattenTalentApplication(application: TalentApplication): Record<string, any> {
  return {
    id: application.id,
    applicationDate: application.applicationDate,
    status: application.status,
    reviewNotes: application.reviewNotes || '',
    reviewedBy: application.reviewedBy || '',
    reviewedAt: application.reviewedAt || '',
    
    // Personal Info
    fullName: application.personalInfo.fullName,
    email: application.personalInfo.email,
    phone: application.personalInfo.phone,
    city: application.personalInfo.location.city,
    state: application.personalInfo.location.state,
    country: application.personalInfo.location.country,
    bio: application.personalInfo.bio,
    languages: application.personalInfo.languages.join(', '),
    
    // Professional Details
    category: application.professionalDetails.category,
    subcategories: application.professionalDetails.subcategories.join(', '),
    experienceLevel: application.professionalDetails.experienceLevel,
    yearsOfExperience: application.professionalDetails.yearsOfExperience,
    skills: JSON.stringify(application.professionalDetails.skills),
    tools: application.professionalDetails.tools.join(', '),
    
    // Availability
    currentStatus: application.availability.currentStatus,
    hoursPerWeek: application.availability.hoursPerWeek,
    remoteWork: application.availability.remoteWork,
    
    // Social Media (simplified)
    instagramHandle: application.socialMedia.instagram?.handle || '',
    instagramFollowers: application.socialMedia.instagram?.followers || 0,
    youtubeChannel: application.socialMedia.youtube?.channel || '',
    youtubeSubscribers: application.socialMedia.youtube?.subscribers || 0,
    linkedinProfile: application.socialMedia.linkedin?.profileUrl || '',
    
    // Portfolio count
    portfolioCount: application.portfolio.length,
    
    // Preferences
    minimumProjectValue: application.preferences.minimumProjectValue,
    currency: application.preferences.currency
  };
}

/**
 * Flatten talent profile for Google Sheets
 */
function flattenTalentProfile(talent: TalentProfile): Record<string, any> {
  return {
    id: talent.id,
    status: talent.status,
    createdAt: talent.createdAt,
    updatedAt: talent.updatedAt,
    
    // Personal Info
    fullName: talent.personalInfo.fullName,
    email: talent.personalInfo.email,
    phone: talent.personalInfo.phone,
    city: talent.personalInfo.location.city,
    state: talent.personalInfo.location.state,
    country: talent.personalInfo.location.country,
    bio: talent.personalInfo.bio,
    languages: talent.personalInfo.languages.join(', '),
    
    // Professional Details
    category: talent.professionalDetails.category,
    subcategories: talent.professionalDetails.subcategories.join(', '),
    experienceLevel: talent.professionalDetails.experienceLevel,
    yearsOfExperience: talent.professionalDetails.yearsOfExperience,
    skills: JSON.stringify(talent.professionalDetails.skills),
    tools: talent.professionalDetails.tools.join(', '),
    
    // Availability
    currentStatus: talent.availability.currentStatus,
    hoursPerWeek: talent.availability.hoursPerWeek,
    remoteWork: talent.availability.remoteWork,
    
    // Ratings
    overallRating: talent.ratings.overallRating,
    totalReviews: talent.ratings.totalReviews,
    qualityOfWork: talent.ratings.qualityOfWork,
    communication: talent.ratings.communication,
    timeliness: talent.ratings.timeliness,
    professionalism: talent.ratings.professionalism,
    
    // Social Media
    instagramHandle: talent.socialMedia.instagram?.handle || '',
    instagramFollowers: talent.socialMedia.instagram?.followers || 0,
    youtubeChannel: talent.socialMedia.youtube?.channel || '',
    youtubeSubscribers: talent.socialMedia.youtube?.subscribers || 0,
    linkedinProfile: talent.socialMedia.linkedin?.profileUrl || '',
    
    // Preferences
    minimumProjectValue: talent.preferences.minimumProjectValue,
    currency: talent.preferences.currency
  };
}

/**
 * Parse Google Sheets data back to TalentApplication
 */
function parseTalentApplication(data: any): TalentApplication {
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
        country: data.country || ''
      },
      bio: data.bio || '',
      languages: data.languages ? data.languages.split(', ') : []
    },
    
    professionalDetails: {
      category: data.category,
      subcategories: data.subcategories ? data.subcategories.split(', ') : [],
      experienceLevel: data.experienceLevel,
      yearsOfExperience: parseInt(data.yearsOfExperience) || 0,
      skills: data.skills ? JSON.parse(data.skills) : [],
      tools: data.tools ? data.tools.split(', ') : [],
      certifications: [],
      education: [],
      workExperience: []
    },
    
    portfolio: [],
    
    socialMedia: {
      instagram: data.instagramHandle ? {
        handle: data.instagramHandle,
        followers: parseInt(data.instagramFollowers) || 0,
        engagementRate: 0,
        lastUpdated: '',
        verified: false
      } : undefined,
      youtube: data.youtubeChannel ? {
        channel: data.youtubeChannel,
        subscribers: parseInt(data.youtubeSubscribers) || 0,
        totalViews: 0,
        averageViews: 0,
        lastUpdated: '',
        verified: false
      } : undefined,
      linkedin: data.linkedinProfile ? {
        profileUrl: data.linkedinProfile,
        connections: 0,
        lastUpdated: '',
        verified: false
      } : undefined
    },
    
    availability: {
      currentStatus: data.currentStatus || 'available',
      hoursPerWeek: parseInt(data.hoursPerWeek) || 40,
      preferredWorkingHours: {
        timezone: 'Asia/Kolkata',
        startTime: '09:00',
        endTime: '18:00'
      },
      unavailableDates: [],
      projectCommitment: 'both',
      remoteWork: data.remoteWork === 'true' || data.remoteWork === true,
      travelWillingness: false
    },
    
    preferences: {
      projectTypes: [],
      industries: [],
      clientTypes: [],
      communicationStyle: 'mixed',
      paymentTerms: [],
      minimumProjectValue: parseInt(data.minimumProjectValue) || 0,
      currency: data.currency || 'INR'
    }
  };
}

/**
 * Parse Google Sheets data back to TalentProfile
 */
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
      professionalism: parseFloat(data.professionalism) || 0
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}