/**
 * Proposal Generator Types and Templates
 * Professional proposal system for FreakingMinds digital marketing agency
 */

export interface ProspectClient {
  name: string;
  email: string;
  phone?: string;
  company: string;
  website?: string;
  industry: string;
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  currentChallenges?: string[];
  goals?: string[];
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  category: 'seo' | 'social-media' | 'performance-marketing' | 'web-development' | 'design' | 'content' | 'consultation';
  
  // Pricing
  basePrice: number;
  billingType: 'monthly' | 'project' | 'hourly';
  duration?: number; // months for retainer, hours for project
  
  // Package Details
  deliverables: string[];
  timeline: string;
  revisions?: number;
  
  // Customization
  isCustomizable: boolean;
  variants?: PackageVariant[];
}

export interface PackageVariant {
  name: string;
  priceMultiplier: number;
  additionalDeliverables: string[];
  description: string;
}

export interface PricingModifier {
  clientSize: Record<string, number>;
  urgency: Record<string, number>;
  complexity: Record<string, number>;
  retainerDiscount: Record<string, number>;
}

export interface ProjectTimeline {
  kickoff: string;
  milestones: { name: string; deadline: string; deliverables: string[] }[];
  completion: string;
  ongoingSupport?: boolean;
}

export interface PricingStructure {
  packages: { packageId: string; variant?: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  discountReason?: string;
  total: number;
  paymentTerms: 'monthly' | 'quarterly' | '50-50' | 'milestone-based' | 'upfront';
  retainerDiscount?: number;
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  title: string;
  
  // Client Information
  client: {
    isExisting: boolean;
    clientId?: string;
    prospectInfo?: ProspectClient;
  };
  
  // Proposal Content
  servicePackages: ServicePackage[];
  customServices?: { name: string; description: string; price: number; timeline: string }[];
  timeline: ProjectTimeline;
  investment: PricingStructure;
  
  // Proposal Details
  proposalType: 'retainer' | 'project' | 'audit' | 'consultation' | 'hybrid';
  validUntil: string;
  status: 'draft' | 'sent' | 'viewed' | 'approved' | 'declined' | 'expired' | 'converted';
  
  // Content Sections
  executiveSummary?: string;
  problemStatement?: string;
  proposedSolution?: string;
  whyFreakingMinds?: string;
  nextSteps?: string;
  termsAndConditions?: string;
  
  // Tracking & Metadata
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  viewedAt?: string;
  approvedAt?: string;
  createdBy: string;
  
  // Presentation
  template: 'professional' | 'creative' | 'minimal' | 'detailed';
  brandColors?: { primary: string; secondary: string };
  includeCaseStudies?: boolean;
  includeTestimonials?: boolean;
}

// Service Package Templates
export const DIGITAL_MARKETING_PACKAGES: ServicePackage[] = [
  // SEO Services
  {
    id: 'seo-starter',
    name: 'SEO Foundation',
    description: 'Complete SEO setup and optimization for small businesses',
    category: 'seo',
    basePrice: 35000,
    billingType: 'monthly',
    duration: 6,
    deliverables: [
      'Technical SEO Audit & Fixes',
      'Keyword Research (50+ keywords)',
      'On-page optimization (10 pages)',
      'Google My Business optimization',
      'Monthly performance reports',
      'Basic link building (5 quality backlinks)'
    ],
    timeline: '2-3 weeks for initial setup, ongoing monthly optimization',
    isCustomizable: true,
    variants: [
      {
        name: 'Basic',
        priceMultiplier: 0.8,
        additionalDeliverables: [],
        description: 'Essential SEO for new websites'
      },
      {
        name: 'Advanced',
        priceMultiplier: 1.3,
        additionalDeliverables: [
          'Competitor analysis',
          'Local SEO optimization',
          'Content optimization (20 pages)',
          'Advanced link building (15 backlinks)'
        ],
        description: 'Comprehensive SEO for established businesses'
      }
    ]
  },
  
  {
    id: 'seo-growth',
    name: 'SEO Growth Engine',
    description: 'Aggressive SEO growth strategy for competitive markets',
    category: 'seo',
    basePrice: 65000,
    billingType: 'monthly',
    duration: 12,
    deliverables: [
      'Advanced technical SEO',
      'Content strategy & creation (4 articles/month)',
      'Aggressive link building (20+ backlinks)',
      'Local SEO domination',
      'Conversion rate optimization',
      'Bi-weekly strategy calls',
      'Advanced analytics setup'
    ],
    timeline: '1 month setup, aggressive growth from month 2',
    isCustomizable: true,
    variants: [
      {
        name: 'E-commerce Focus',
        priceMultiplier: 1.2,
        additionalDeliverables: [
          'Product page optimization',
          'Shopping feed optimization',
          'E-commerce SEO strategy'
        ],
        description: 'Specialized for online stores'
      }
    ]
  },

  // Social Media Management
  {
    id: 'social-starter',
    name: 'Social Media Essentials',
    description: 'Professional social media presence for growing brands',
    category: 'social-media',
    basePrice: 28000,
    billingType: 'monthly',
    duration: 6,
    deliverables: [
      'Content strategy development',
      'Daily posting (2 platforms)',
      'Graphic design (15 posts/month)',
      'Community management',
      'Monthly analytics report',
      'Hashtag research & strategy'
    ],
    timeline: 'Weekly content creation and daily management',
    isCustomizable: true,
    variants: [
      {
        name: 'Multi-Platform',
        priceMultiplier: 1.4,
        additionalDeliverables: [
          'Instagram + Facebook + LinkedIn',
          'Stories and Reels creation',
          'Influencer outreach'
        ],
        description: 'Presence across 3+ platforms'
      }
    ]
  },

  // Performance Marketing
  {
    id: 'ppc-starter',
    name: 'Google Ads Launch',
    description: 'Professional Google Ads setup and management',
    category: 'performance-marketing',
    basePrice: 45000,
    billingType: 'monthly',
    duration: 3,
    deliverables: [
      'Google Ads account setup',
      'Keyword research & selection',
      'Ad copy creation (5 variations)',
      'Landing page recommendations',
      'Bid management & optimization',
      'Weekly performance reports',
      'Conversion tracking setup'
    ],
    timeline: '1 week setup, ongoing optimization',
    isCustomizable: true,
    variants: [
      {
        name: 'Multi-Channel',
        priceMultiplier: 1.6,
        additionalDeliverables: [
          'Facebook & Instagram Ads',
          'YouTube advertising',
          'Retargeting campaigns',
          'Advanced audience targeting'
        ],
        description: 'Complete paid advertising ecosystem'
      }
    ]
  },

  // Web Development
  {
    id: 'website-professional',
    name: 'Professional Website',
    description: 'Custom-designed responsive website with CMS',
    category: 'web-development',
    basePrice: 150000,
    billingType: 'project',
    deliverables: [
      'Custom responsive design',
      'Content management system',
      'SEO optimization',
      '5 pages + blog setup',
      'Contact forms & integrations',
      '3 months support',
      'Training & documentation'
    ],
    timeline: '4-6 weeks development + 2 weeks revisions',
    revisions: 3,
    isCustomizable: true,
    variants: [
      {
        name: 'E-commerce',
        priceMultiplier: 1.8,
        additionalDeliverables: [
          'Online store functionality',
          'Payment gateway integration',
          'Product catalog management',
          'Order management system'
        ],
        description: 'Full e-commerce solution'
      },
      {
        name: 'Enterprise',
        priceMultiplier: 2.5,
        additionalDeliverables: [
          'Advanced functionality',
          'Third-party integrations',
          'Custom development',
          'Priority support'
        ],
        description: 'Enterprise-level website'
      }
    ]
  },

  // Complete Digital Presence
  {
    id: 'digital-domination',
    name: 'Digital Domination Package',
    description: 'Complete digital marketing solution for ambitious brands',
    category: 'seo',
    basePrice: 125000,
    billingType: 'monthly',
    duration: 12,
    deliverables: [
      'Comprehensive SEO strategy',
      'Social media management (3 platforms)',
      'Google Ads management',
      'Content marketing (8 pieces/month)',
      'Email marketing setup',
      'Analytics & reporting dashboard',
      'Monthly strategy sessions',
      'Brand reputation management'
    ],
    timeline: 'Full-service digital marketing management',
    isCustomizable: true,
    variants: [
      {
        name: 'Startup Package',
        priceMultiplier: 0.7,
        additionalDeliverables: [],
        description: 'Scaled version for startups'
      },
      {
        name: 'Enterprise Package',
        priceMultiplier: 1.5,
        additionalDeliverables: [
          'Dedicated account manager',
          'Custom reporting',
          'Advanced integrations',
          'Quarterly business reviews'
        ],
        description: 'Enterprise-level service'
      }
    ]
  }
];

// Pricing Modifiers
export const PRICING_MODIFIERS: PricingModifier = {
  clientSize: {
    'startup': 0.8,
    'small': 0.9,
    'medium': 1.0,
    'large': 1.2,
    'enterprise': 1.5
  },
  urgency: {
    'standard': 1.0,
    'priority': 1.2,
    'rush': 1.5
  },
  complexity: {
    'basic': 1.0,
    'standard': 1.2,
    'advanced': 1.5,
    'complex': 2.0
  },
  retainerDiscount: {
    '3-months': 0.05,
    '6-months': 0.10,
    '12-months': 0.15,
    '24-months': 0.20
  }
};

// Default Proposal Content
export const DEFAULT_PROPOSAL_CONTENT = {
  whyFreakingMinds: `**Why Choose Freaking Minds?**

• **Proven Track Record**: 3+ years delivering results for 50+ clients across industries
• **Data-Driven Approach**: Every decision backed by analytics and measurable outcomes  
• **Transparent Reporting**: Monthly detailed reports with actionable insights
• **Dedicated Team**: Assigned specialists for your account with direct communication
• **Local Expertise**: Deep understanding of Indian market dynamics and consumer behavior
• **ROI Focused**: Strategies designed to maximize your return on investment`,

  nextSteps: `**Next Steps to Get Started:**

1. **Proposal Approval**: Review and approve this proposal
2. **Contract & Payment**: Sign agreement and process initial payment  
3. **Kickoff Meeting**: Detailed project planning and timeline confirmation
4. **Access & Setup**: Provide necessary access to accounts and platforms
5. **Execution Begins**: Start implementing strategies within 48 hours

**Timeline**: We can begin work within 3-5 business days of proposal approval.`,

  termsAndConditions: `**Terms & Conditions:**

• All prices are in INR and exclude GST (18% additional)
• 50% advance payment required to commence work
• Remaining payment due within 30 days of invoice
• Client to provide necessary access and materials within agreed timelines  
• Additional revisions beyond scope will be charged separately
• Either party may terminate with 30 days written notice
• All deliverables remain property of client upon full payment
• Freaking Minds retains right to showcase work in portfolio`
};