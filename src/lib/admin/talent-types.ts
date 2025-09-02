/**
 * CreativeMinds Talent Pool Types
 * Comprehensive talent management system
 */

export interface TalentProfile {
  id: string;
  personalInfo: PersonalInfo;
  professionalDetails: ProfessionalDetails;
  portfolio: PortfolioItem[];
  socialMedia: SocialMediaMetrics;
  availability: AvailabilityInfo;
  preferences: TalentPreferences;
  status: TalentStatus;
  ratings: TalentRatings;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  profilePicture?: string;
  bio: string;
  languages: string[];
  dateOfBirth?: string;
}

export interface ProfessionalDetails {
  category: TalentCategory;
  subcategories: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert' | 'specialist';
  yearsOfExperience: number;
  skills: Skill[];
  tools: string[];
  certifications: Certification[];
  education: EducationInfo[];
  workExperience: WorkExperience[];
}

export interface Skill {
  name: string;
  proficiency: 'basic' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  verified: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expiryDate?: string;
  credentialId?: string;
  verified: boolean;
}

export interface EducationInfo {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  graduationYear: number;
  grade?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: {
    startDate: string;
    endDate?: string;
    current: boolean;
  };
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  mediaUrls: string[];
  projectUrl?: string;
  clientType: 'personal' | 'freelance' | 'agency' | 'corporate';
  completionDate: string;
  featured: boolean;
}

export interface SocialMediaMetrics {
  instagram?: {
    handle: string;
    followers: number;
    engagementRate: number;
    lastUpdated: string;
    verified: boolean;
  };
  youtube?: {
    channel: string;
    subscribers: number;
    totalViews: number;
    averageViews: number;
    lastUpdated: string;
    verified: boolean;
  };
  linkedin?: {
    profileUrl: string;
    connections: number;
    lastUpdated: string;
    verified: boolean;
  };
  behance?: {
    profileUrl: string;
    followers: number;
    projects: number;
    views: number;
    lastUpdated: string;
    verified: boolean;
  };
  dribbble?: {
    profileUrl: string;
    followers: number;
    likes: number;
    shots: number;
    lastUpdated: string;
    verified: boolean;
  };
}

export interface AvailabilityInfo {
  currentStatus: 'available' | 'busy' | 'partially_available' | 'unavailable';
  hoursPerWeek: number;
  preferredWorkingHours: {
    timezone: string;
    startTime: string;
    endTime: string;
  };
  unavailableDates: string[];
  projectCommitment: 'short_term' | 'long_term' | 'both';
  remoteWork: boolean;
  travelWillingness: boolean;
}

export interface TalentPreferences {
  projectTypes: string[];
  industries: string[];
  clientTypes: string[];
  communicationStyle: 'formal' | 'casual' | 'mixed';
  paymentTerms: string[];
  minimumProjectValue: number;
  currency: string;
}

export interface TalentRatings {
  overallRating: number;
  totalReviews: number;
  qualityOfWork: number;
  communication: number;
  timeliness: number;
  professionalism: number;
  lastRatingDate?: string;
}

export type TalentStatus = 'pending' | 'approved' | 'rejected' | 'inactive' | 'suspended';

export type TalentCategory = 
  | 'creative_design'
  | 'development' 
  | 'digital_marketing'
  | 'content_creation'
  | 'influencer_social'
  | 'project_management'
  | 'business_consulting'
  | 'video_production'
  | 'photography'
  | 'copywriting';

export interface TalentApplication {
  id: string;
  personalInfo: PersonalInfo;
  professionalDetails: ProfessionalDetails;
  portfolio: PortfolioItem[];
  socialMedia: SocialMediaMetrics;
  availability: AvailabilityInfo;
  preferences: TalentPreferences;
  applicationDate: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface TalentProject {
  id: string;
  talentId: string;
  clientId: string;
  projectName: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  budget: number;
  currency: string;
  deliverables: string[];
  milestones: ProjectMilestone[];
  feedback?: ProjectFeedback;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  deliverables: string[];
  paymentPercentage: number;
}

export interface ProjectFeedback {
  clientRating: number;
  clientComments: string;
  talentRating?: number;
  talentComments?: string;
  qualityOfWork: number;
  communication: number;
  timeliness: number;
  professionalism: number;
  wouldRecommend: boolean;
  dateSubmitted: string;
}

export interface TalentSearchFilters {
  category?: TalentCategory;
  subcategories?: string[];
  experienceLevel?: string[];
  skills?: string[];
  location?: string;
  availability?: string;
  rating?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  socialMediaFollowers?: {
    platform: string;
    min: number;
  };
  languages?: string[];
  remoteWork?: boolean;
  verified?: boolean;
}

export interface TalentMatchResult {
  talent: TalentProfile;
  matchScore: number;
  matchReasons: string[];
  availability: boolean;
  estimatedCost: number;
  recommendationLevel: 'high' | 'medium' | 'low';
}

// Predefined Categories and Subcategories
export const TALENT_CATEGORIES: Record<TalentCategory, { label: string; subcategories: string[] }> = {
  creative_design: {
    label: 'Creative Design',
    subcategories: [
      'UI/UX Design',
      'Graphic Design',
      'Brand Identity',
      'Logo Design',
      'Web Design',
      'Print Design',
      'Illustration',
      'Motion Graphics',
      '3D Design',
      'Product Design'
    ]
  },
  development: {
    label: 'Development',
    subcategories: [
      'Frontend Development',
      'Backend Development',
      'Full Stack Development',
      'Mobile App Development',
      'WordPress Development',
      'E-commerce Development',
      'API Development',
      'DevOps',
      'Quality Assurance',
      'Database Design'
    ]
  },
  digital_marketing: {
    label: 'Digital Marketing',
    subcategories: [
      'Social Media Marketing',
      'SEO',
      'SEM/PPC',
      'Email Marketing',
      'Content Marketing',
      'Influencer Marketing',
      'Marketing Automation',
      'Analytics & Reporting',
      'Conversion Optimization',
      'Brand Strategy'
    ]
  },
  content_creation: {
    label: 'Content Creation',
    subcategories: [
      'Blog Writing',
      'Technical Writing',
      'Creative Writing',
      'Social Media Content',
      'Video Scripts',
      'Email Copy',
      'Website Copy',
      'Product Descriptions',
      'Press Releases',
      'Content Strategy'
    ]
  },
  influencer_social: {
    label: 'Influencer & Social',
    subcategories: [
      'Instagram Influencer',
      'YouTube Creator',
      'TikTok Creator',
      'LinkedIn Influencer',
      'Twitter Influencer',
      'Facebook Creator',
      'Podcast Host',
      'Live Streaming',
      'Community Management',
      'Social Media Strategy'
    ]
  },
  project_management: {
    label: 'Project Management',
    subcategories: [
      'Digital Project Management',
      'Agile/Scrum Master',
      'Product Management',
      'Program Management',
      'Campaign Management',
      'Event Management',
      'Change Management',
      'Business Analysis',
      'Quality Assurance',
      'Team Coordination'
    ]
  },
  business_consulting: {
    label: 'Business Consulting',
    subcategories: [
      'Strategy Consulting',
      'Marketing Consulting',
      'Operations Consulting',
      'Financial Consulting',
      'HR Consulting',
      'Technology Consulting',
      'Sales Consulting',
      'Market Research',
      'Business Development',
      'Process Optimization'
    ]
  },
  video_production: {
    label: 'Video Production',
    subcategories: [
      'Video Editing',
      'Motion Graphics',
      'Animation',
      'Cinematography',
      'Video Production',
      'Post-Production',
      'Color Grading',
      'Audio Production',
      'Live Streaming',
      'Documentary Production'
    ]
  },
  photography: {
    label: 'Photography',
    subcategories: [
      'Product Photography',
      'Portrait Photography',
      'Event Photography',
      'Food Photography',
      'Fashion Photography',
      'Real Estate Photography',
      'Stock Photography',
      'Photo Editing',
      'Drone Photography',
      'Commercial Photography'
    ]
  },
  copywriting: {
    label: 'Copywriting',
    subcategories: [
      'Sales Copy',
      'Ad Copy',
      'Email Copy',
      'Website Copy',
      'Social Media Copy',
      'Product Descriptions',
      'Landing Pages',
      'Direct Response',
      'Brand Messaging',
      'Script Writing'
    ]
  }
};

export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-2 years)', color: 'bg-blue-100 text-blue-800' },
  { value: 'intermediate', label: 'Intermediate (2-5 years)', color: 'bg-green-100 text-green-800' },
  { value: 'expert', label: 'Expert (5+ years)', color: 'bg-purple-100 text-purple-800' },
  { value: 'specialist', label: 'Specialist (10+ years)', color: 'bg-gold-100 text-gold-800' }
];

export const PROFICIENCY_LEVELS = [
  { value: 'basic', label: 'Basic', color: 'bg-gray-100 text-gray-800' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
  { value: 'advanced', label: 'Advanced', color: 'bg-green-100 text-green-800' },
  { value: 'expert', label: 'Expert', color: 'bg-purple-100 text-purple-800' }
];

export const POPULAR_SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'PHP', 'WordPress',
  'Figma', 'Adobe Creative Suite', 'Sketch', 'Canva',
  'Google Analytics', 'Facebook Ads', 'Google Ads', 'SEO',
  'Content Writing', 'Social Media Marketing', 'Email Marketing',
  'Photography', 'Video Editing', 'Graphic Design',
  'Project Management', 'Agile', 'Scrum'
];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' }
];

export const LANGUAGES = [
  'English', 'Hindi', 'Marathi', 'Gujarati', 'Bengali', 'Tamil',
  'Telugu', 'Kannada', 'Malayalam', 'Punjabi', 'Spanish', 'French',
  'German', 'Mandarin', 'Arabic', 'Japanese', 'Portuguese'
];

export const TIMEZONES = [
  'Asia/Kolkata',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Australia/Sydney'
];