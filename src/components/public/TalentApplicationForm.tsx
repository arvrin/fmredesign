/**
 * Talent Application Form
 * Multi-step form for joining CreativeMinds network
 */

'use client';

import { useState } from 'react';
import { Button } from '@/design-system/components/primitives/Button';
import { 
  TalentApplication, 
  TalentCategory, 
  TALENT_CATEGORIES,
  EXPERIENCE_LEVELS,
  POPULAR_SKILLS,
  LANGUAGES,
  CURRENCIES
} from '@/lib/admin/talent-types';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Briefcase, 
  Briefcase as PortfolioIcon, 
  Globe,
  Clock,
  Settings,
  CheckCircle
} from 'lucide-react';

interface TalentApplicationFormProps {
  onSubmit: (application: TalentApplication) => Promise<void>;
  onCancel: () => void;
}

interface StepProps {
  formData: Partial<TalentApplication>;
  updateData: (updates: Partial<TalentApplication>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function TalentApplicationForm({ onSubmit, onCancel }: TalentApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<TalentApplication>>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: { city: '', state: '', country: 'India' },
      bio: '',
      languages: ['English']
    },
    professionalDetails: {
      category: 'creative_design',
      subcategories: [],
      experienceLevel: 'intermediate',
      yearsOfExperience: 0,
      skills: [],
      tools: [],
      certifications: [],
      education: [],
      workExperience: []
    },
    portfolio: [],
    socialMedia: {},
    availability: {
      currentStatus: 'available',
      hoursPerWeek: 40,
      preferredWorkingHours: {
        timezone: 'Asia/Kolkata',
        startTime: '09:00',
        endTime: '18:00'
      },
      unavailableDates: [],
      projectCommitment: 'both',
      remoteWork: true,
      travelWillingness: false
    },
    preferences: {
      projectTypes: [],
      industries: [],
      clientTypes: [],
      communicationStyle: 'mixed',
      paymentTerms: [],
      minimumProjectValue: 10000,
      currency: 'INR'
    }
  });

  const updateData = (updates: Partial<TalentApplication>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData as TalentApplication);
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User, component: PersonalInfoStep },
    { number: 2, title: 'Professional', icon: Briefcase, component: ProfessionalStep },
    { number: 3, title: 'Portfolio', icon: PortfolioIcon, component: PortfolioStep },
    { number: 4, title: 'Social Media', icon: Globe, component: SocialMediaStep },
    { number: 5, title: 'Availability', icon: Clock, component: AvailabilityStep },
    { number: 6, title: 'Preferences', icon: Settings, component: PreferencesStep }
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-fm-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-fm-neutral-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={onCancel}
              >
                Exit Application
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-fm-neutral-900">
                  Join CreativeMinds Network
                </h1>
                <p className="text-sm text-fm-neutral-600">
                  Step {currentStep} of 6: {steps[currentStep - 1].title}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-fm-neutral-600">
                Progress: {currentStep}/6 steps completed
              </span>
              <span className="text-sm font-medium text-fm-magenta-600">
                {Math.round((currentStep / 6) * 100)}%
              </span>
            </div>
            <div className="w-full bg-fm-neutral-200 rounded-full h-2">
              <div 
                className="bg-fm-magenta-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Step Navigation */}
        <div className="w-80 bg-white border-r border-fm-neutral-200 min-h-screen">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-fm-neutral-900 mb-4">Application Steps</h3>
            <div className="space-y-2">
              {steps.map((step) => {
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                
                return (
                  <div
                    key={step.number}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isCurrent 
                        ? 'bg-fm-magenta-50 border border-fm-magenta-200' 
                        : 'hover:bg-fm-neutral-50'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <step.icon className={`h-4 w-4 flex-shrink-0 ${
                        isCurrent ? 'text-fm-magenta-600' : 'text-fm-neutral-400'
                      }`} />
                    )}
                    <div>
                      <div className={`text-sm font-medium ${
                        isCurrent ? 'text-fm-magenta-900' : 'text-fm-neutral-900'
                      }`}>
                        {step.number}. {step.title}
                      </div>
                      {isCompleted && (
                        <div className="text-xs text-green-600">Completed</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <CurrentStepComponent
              formData={formData}
              updateData={updateData}
              onNext={handleNext}
              onPrev={handlePrev}
              isFirst={currentStep === 1}
              isLast={currentStep === 6}
            />
            
            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-fm-neutral-200">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                Previous
              </Button>
              
              {currentStep === 6 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  Next Step
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function PersonalInfoStep({ formData, updateData }: StepProps) {
  const personalInfo = formData.personalInfo!;

  const handleChange = (field: string, value: any) => {
    updateData({
      personalInfo: { ...personalInfo, [field]: value }
    });
  };

  const handleLocationChange = (field: string, value: string) => {
    updateData({
      personalInfo: {
        ...personalInfo,
        location: { ...personalInfo.location, [field]: value }
      }
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-fm-neutral-900 mb-2">Personal Information</h2>
        <p className="text-fm-neutral-600">Tell us about yourself</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={personalInfo.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="+91 98765 43210"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={personalInfo.location.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="Mumbai"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              State *
            </label>
            <input
              type="text"
              value={personalInfo.location.state}
              onChange={(e) => handleLocationChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="Maharashtra"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Country *
            </label>
            <select
              value={personalInfo.location.country}
              onChange={(e) => handleLocationChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            Professional Bio *
          </label>
          <textarea
            value={personalInfo.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            placeholder="Tell us about your experience, skills, and what makes you unique..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <label key={lang} className="flex items-center">
                <input
                  type="checkbox"
                  checked={personalInfo.languages.includes(lang)}
                  onChange={(e) => {
                    const languages = e.target.checked
                      ? [...personalInfo.languages, lang]
                      : personalInfo.languages.filter(l => l !== lang);
                    handleChange('languages', languages);
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{lang}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfessionalStep({ formData, updateData }: StepProps) {
  const professionalDetails = formData.professionalDetails!;

  const handleCategoryChange = (category: TalentCategory) => {
    updateData({
      professionalDetails: {
        ...professionalDetails,
        category,
        subcategories: []
      }
    });
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = professionalDetails.skills || [];
    const skillExists = currentSkills.find(s => s.name === skill);
    
    const updatedSkills = skillExists
      ? currentSkills.filter(s => s.name !== skill)
      : [...currentSkills, { 
          name: skill, 
          proficiency: 'intermediate', 
          yearsOfExperience: 1, 
          verified: false 
        }];
    
    updateData({
      professionalDetails: {
        ...professionalDetails,
        skills: updatedSkills
      }
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-fm-neutral-900 mb-2">Professional Details</h2>
        <p className="text-fm-neutral-600">Share your expertise and experience</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            Primary Category *
          </label>
          <select
            value={professionalDetails.category}
            onChange={(e) => handleCategoryChange(e.target.value as TalentCategory)}
            className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            required
          >
            {Object.entries(TALENT_CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>{category.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            Subcategories
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {TALENT_CATEGORIES[professionalDetails.category].subcategories.map((sub) => (
              <label key={sub} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={professionalDetails.subcategories.includes(sub)}
                  onChange={(e) => {
                    const subcategories = e.target.checked
                      ? [...professionalDetails.subcategories, sub]
                      : professionalDetails.subcategories.filter(s => s !== sub);
                    
                    updateData({
                      professionalDetails: {
                        ...professionalDetails,
                        subcategories
                      }
                    });
                  }}
                  className="mr-2"
                />
                {sub}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Experience Level *
            </label>
            <select
              value={professionalDetails.experienceLevel}
              onChange={(e) => updateData({
                professionalDetails: {
                  ...professionalDetails,
                  experienceLevel: e.target.value as any
                }
              })}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              required
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Years of Experience *
            </label>
            <input
              type="number"
              value={professionalDetails.yearsOfExperience}
              onChange={(e) => updateData({
                professionalDetails: {
                  ...professionalDetails,
                  yearsOfExperience: parseInt(e.target.value) || 0
                }
              })}
              min="0"
              max="50"
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            Core Skills *
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  professionalDetails.skills?.find(s => s.name === skill)
                    ? 'bg-fm-magenta-100 border-fm-magenta-300 text-fm-magenta-800'
                    : 'bg-fm-neutral-100 border-fm-neutral-300 text-fm-neutral-700 hover:bg-fm-neutral-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simplified versions of remaining steps to complete the form quickly
function PortfolioStep({ formData, updateData }: StepProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-fm-neutral-900 mb-2">Portfolio & Work</h2>
        <p className="text-fm-neutral-600">Showcase your best work</p>
      </div>
      <div className="text-center py-8 bg-fm-neutral-50 rounded-lg">
        <PortfolioIcon className="h-12 w-12 mx-auto mb-3 text-fm-neutral-400" />
        <p className="text-fm-neutral-600">Portfolio upload will be enabled after initial approval.</p>
        <p className="text-sm text-fm-neutral-500 mt-2">You can share portfolio links in the next steps.</p>
      </div>
    </div>
  );
}

function SocialMediaStep({ formData, updateData }: StepProps) {
  const socialMedia = formData.socialMedia || {};

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-fm-neutral-900 mb-2">Social Media Presence</h2>
        <p className="text-fm-neutral-600">Help us understand your online presence</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            Instagram Handle
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-fm-neutral-300 bg-fm-neutral-50 text-sm">@</span>
            <input
              type="text"
              value={socialMedia.instagram?.handle || ''}
              onChange={(e) => updateData({
                socialMedia: {
                  ...socialMedia,
                  instagram: {
                    handle: e.target.value,
                    followers: socialMedia.instagram?.followers || 0,
                    engagementRate: 0,
                    lastUpdated: '',
                    verified: false
                  }
                }
              })}
              className="flex-1 px-3 py-2 border border-fm-neutral-300 rounded-r-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="your_handle"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            Instagram Followers (approximate)
          </label>
          <input
            type="number"
            value={socialMedia.instagram?.followers || ''}
            onChange={(e) => updateData({
              socialMedia: {
                ...socialMedia,
                instagram: {
                  handle: socialMedia.instagram?.handle || '',
                  followers: parseInt(e.target.value) || 0,
                  engagementRate: 0,
                  lastUpdated: '',
                  verified: false
                }
              }
            })}
            className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            LinkedIn Profile URL
          </label>
          <input
            type="url"
            value={socialMedia.linkedin?.profileUrl || ''}
            onChange={(e) => updateData({
              socialMedia: {
                ...socialMedia,
                linkedin: {
                  profileUrl: e.target.value,
                  connections: 0,
                  lastUpdated: '',
                  verified: false
                }
              }
            })}
            className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </div>
    </div>
  );
}

function AvailabilityStep({ formData, updateData }: StepProps) {
  const availability = formData.availability!;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-fm-neutral-900 mb-2">Availability</h2>
        <p className="text-fm-neutral-600">Let us know when you're available</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            Current Status
          </label>
          <select
            value={availability.currentStatus}
            onChange={(e) => updateData({
              availability: {
                ...availability,
                currentStatus: e.target.value as any
              }
            })}
            className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
          >
            <option value="available">Available</option>
            <option value="partially_available">Partially Available</option>
            <option value="busy">Busy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            Hours per Week
          </label>
          <input
            type="number"
            value={availability.hoursPerWeek}
            onChange={(e) => updateData({
              availability: {
                ...availability,
                hoursPerWeek: parseInt(e.target.value) || 40
              }
            })}
            min="1"
            max="80"
            className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="remoteWork"
            checked={availability.remoteWork}
            onChange={(e) => updateData({
              availability: {
                ...availability,
                remoteWork: e.target.checked
              }
            })}
            className="mr-3"
          />
          <label htmlFor="remoteWork" className="text-sm font-medium text-fm-neutral-700">
            Available for remote work
          </label>
        </div>
      </div>
    </div>
  );
}

function PreferencesStep({ formData, updateData }: StepProps) {
  const preferences = formData.preferences!;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-fm-neutral-900 mb-2">Preferences</h2>
        <p className="text-fm-neutral-600">Tell us about your project preferences</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Minimum Project Value
            </label>
            <input
              type="number"
              value={preferences.minimumProjectValue}
              onChange={(e) => updateData({
                preferences: {
                  ...preferences,
                  minimumProjectValue: parseInt(e.target.value) || 0
                }
              })}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Currency
            </label>
            <select
              value={preferences.currency}
              onChange={(e) => updateData({
                preferences: {
                  ...preferences,
                  currency: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
            Communication Style
          </label>
          <select
            value={preferences.communicationStyle}
            onChange={(e) => updateData({
              preferences: {
                ...preferences,
                communicationStyle: e.target.value as any
              }
            })}
            className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
          >
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        {/* Ready to Submit */}
        <div className="bg-fm-magenta-50 border border-fm-magenta-200 rounded-xl p-6 mt-8">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-5 w-5 text-fm-magenta-600" />
            <h3 className="text-lg font-semibold text-fm-magenta-900">Ready to Submit!</h3>
          </div>
          <p className="text-fm-magenta-700 mb-4">
            You've completed all sections. Review your information and submit your application.
          </p>
          <div className="text-sm text-fm-magenta-600">
            <strong>What happens next:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Application review (24-48 hours)</li>
              <li>Portfolio verification call</li>
              <li>Welcome to CreativeMinds network</li>
              <li>Start receiving project opportunities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}