/**
 * Get Started - Brand-Aligned Lead Capture Form
 * Enhanced Modal Experience with Non-Scrollable Container
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Target, 
  Users, 
  DollarSign,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Play,
  Mail,
  Phone,
  Globe,
  Building,
  X
} from 'lucide-react';
import { LinkButton } from '@/design-system';
import type { LeadInput, ProjectType, BudgetRange, Timeline, CompanySize, Industry } from '@/lib/admin/lead-types';
import { INDUSTRIES } from '@/lib/admin/lead-types';

const PROJECT_TYPES: { value: ProjectType; label: string; description: string; icon: string }[] = [
  { value: 'website_design', label: 'Website Design', description: 'Custom website or redesign', icon: '🌐' },
  { value: 'ecommerce', label: 'E-commerce Store', description: 'Online store with payments', icon: '🛒' },
  { value: 'web_app', label: 'Web Application', description: 'Custom web-based software', icon: '💻' },
  { value: 'mobile_app', label: 'Mobile App', description: 'iOS/Android application', icon: '📱' },
  { value: 'branding', label: 'Branding & Identity', description: 'Logo, brand guidelines', icon: '🎨' },
  { value: 'digital_marketing', label: 'Digital Marketing', description: 'SEO, PPC, social media', icon: '📈' },
  { value: 'full_service', label: 'Full Service', description: 'Complete digital transformation', icon: '🚀' },
  { value: 'consultation', label: 'Consultation', description: 'Strategy and guidance', icon: '💡' }
];

const BUDGET_RANGES: { value: BudgetRange; label: string; popular?: boolean }[] = [
  { value: 'under_10k', label: 'Under ₹10,000' },
  { value: '10k_25k', label: '₹10,000 - ₹25,000' },
  { value: '25k_50k', label: '₹25,000 - ₹50,000', popular: true },
  { value: '50k_100k', label: '₹50,000 - ₹1,00,000', popular: true },
  { value: '100k_250k', label: '₹1,00,000 - ₹2,50,000' },
  { value: 'over_250k', label: 'Over ₹2,50,000' },
  { value: 'not_disclosed', label: 'Prefer not to disclose' }
];

const TIMELINES: { value: Timeline; label: string; urgent?: boolean }[] = [
  { value: 'asap', label: 'ASAP (within 1 week)', urgent: true },
  { value: '1_month', label: 'Within 1 month', urgent: true },
  { value: '2_3_months', label: '2-3 months' },
  { value: '3_6_months', label: '3-6 months' },
  { value: '6_months_plus', label: '6+ months' },
  { value: 'flexible', label: 'Timeline is flexible' }
];

const COMPANY_SIZES: { value: CompanySize; label: string; icon: string }[] = [
  { value: 'startup', label: 'Startup (1-10 employees)', icon: '🚀' },
  { value: 'small_business', label: 'Small Business (11-50)', icon: '🏢' },
  { value: 'medium_business', label: 'Medium Business (51-200)', icon: '🏬' },
  { value: 'enterprise', label: 'Enterprise (200+)', icon: '🏭' },
  { value: 'agency', label: 'Agency/Consultant', icon: '🎯' },
  { value: 'nonprofit', label: 'Non-profit', icon: '❤️' },
  { value: 'individual', label: 'Individual/Freelancer', icon: '👤' }
];

export default function GetStartedPage() {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<LeadInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fm_lead_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFormData(data.formData || {});
        setCurrentStep(data.currentStep || 1);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('fm_lead_progress', JSON.stringify({
        formData,
        currentStep,
        timestamp: Date.now()
      }));
    }
  }, [formData, currentStep]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const updateFormData = (updates: Partial<LeadInput>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(updates).forEach(key => {
        delete newErrors[key];
      });
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name?.trim()) newErrors.name = 'Name is required';
        if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Valid email is required';
        }
        if (!formData.company?.trim()) newErrors.company = 'Company is required';
        break;
      
      case 2:
        if (!formData.projectType) newErrors.projectType = 'Please select a project type';
        if (!formData.projectDescription?.trim() || formData.projectDescription.length < 10) {
          newErrors.projectDescription = 'Please provide at least 10 characters';
        }
        break;
      
      case 3:
        if (!formData.budgetRange) newErrors.budgetRange = 'Please select a budget range';
        if (!formData.timeline) newErrors.timeline = 'Please select a timeline';
        break;
      
      case 4:
        if (!formData.primaryChallenge?.trim() || formData.primaryChallenge.length < 5) {
          newErrors.primaryChallenge = 'Please describe your main challenge (at least 5 characters)';
        }
        if (!formData.companySize) newErrors.companySize = 'Please select company size';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(5, prev + 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const submitForm = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'website_form'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Clear saved progress
      localStorage.removeItem('fm_lead_progress');
      
      setSubmitted(true);
      setCurrentStep(5);
      
      // Track conversion
      if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
          event_category: 'form',
          event_label: formData.projectType,
          value: 1
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <ThankYouStep formData={formData} onClose={() => setShowModal(false)} />;
  }

  return (
    <>
      {/* Hero Landing Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-fm-neutral-50 to-fm-neutral-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-70 overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(600px circle at 50% 50%, 
                rgba(179,41,104,0.3) 0%, 
                rgba(179,41,104,0.2) 25%,
                rgba(110,24,69,0.1) 50%,
                transparent 70%)`
            }}
          />
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(800px circle at 50% 50%, 
                rgba(255,133,93,0.15) 0%,
                rgba(255,107,53,0.08) 40%,
                transparent 70%)`
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[linear-gradient(45deg,transparent_48%,rgba(179,41,104,0.05)_49%,rgba(179,41,104,0.05)_51%,transparent_52%)] bg-[length:30px_30px]" />
        </div>

        {/* Floating Icons */}
        <div className="absolute top-20 left-20 opacity-20 animate-pulse">
          <Sparkles className="w-8 h-8 text-fm-magenta-700" />
        </div>
        <div className="absolute top-32 right-32 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>
          <TrendingUp className="w-8 h-8 text-fm-magenta-700" />
        </div>
        <div className="absolute bottom-32 left-32 opacity-20 animate-pulse" style={{ animationDelay: '2s' }}>
          <Target className="w-8 h-8 text-fm-magenta-700" />
        </div>

        <div className="relative z-10 fm-container">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-fm-magenta-50 border border-fm-magenta-200 rounded-full text-fm-magenta-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Your Digital Transformation Journey
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fm-neutral-900 mb-8" style={{ lineHeight: '1.1' }}>
              Let's Build Something{' '}
              <span className="text-fm-magenta-700 relative inline-block">
                Amazing
                <svg
                  className="absolute -bottom-2 left-0 w-full h-4 text-fm-magenta-700"
                  viewBox="0 0 200 12"
                  fill="currentColor"
                >
                  <path d="M2 8c40-6 80-6 120 0s80 6 120 0" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
              {' '}Together
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-fm-neutral-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Tell us about your project in just a few steps. Our team will get back to you within 24 hours 
              with a customized proposal tailored to your needs.
            </p>

            {/* CTA Button */}
            <div className="mb-16">
              <LinkButton 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
                variant="primary" 
                size="lg" 
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="group text-lg px-8 py-4"
              >
                Get Started Now
              </LinkButton>
            </div>

            {/* Trust Indicators */}
            <div className="bg-fm-magenta-50/80 backdrop-blur-sm border border-fm-magenta-200/60 rounded-xl shadow-fm-lg p-6 md:p-8 max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">24 hrs</div>
                  <div className="text-sm text-fm-neutral-700 font-medium">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">250+</div>
                  <div className="text-sm text-fm-neutral-700 font-medium">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">95%</div>
                  <div className="text-sm text-fm-neutral-700 font-medium">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">FREE</div>
                  <div className="text-sm text-fm-neutral-700 font-medium">Initial Consultation</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-fm-magenta-700 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-fm-magenta-700 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Modal Form Container */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal */}
          <div className="relative z-10 h-full flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 z-20 w-10 h-10 bg-fm-neutral-100 hover:bg-fm-neutral-200 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <X className="w-5 h-5 text-fm-neutral-600" />
              </button>

              {/* Form Content */}
              <div className="p-8 md:p-12">
                {/* Progress Bar */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex flex-col items-center">
                        <div 
                          className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 font-semibold
                            ${currentStep >= step 
                              ? 'bg-fm-magenta-700 border-fm-magenta-700 text-white shadow-lg' 
                              : 'border-fm-neutral-300 text-fm-neutral-500 bg-white'}`}
                        >
                          {currentStep > step ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="text-sm">{step}</span>
                          )}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${
                          currentStep >= step ? 'text-fm-magenta-700' : 'text-fm-neutral-500'
                        }`}>
                          {step === 1 && 'Contact'}
                          {step === 2 && 'Project'}
                          {step === 3 && 'Budget'}
                          {step === 4 && 'Details'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="w-full bg-fm-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-fm-magenta-700 to-fm-magenta-400 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Step Content */}
                <div className="min-h-[500px]">
                  {/* Step 1: Contact Information */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Users className="w-8 h-8 text-fm-magenta-700" />
                        </div>
                        <h2 className="text-3xl font-bold text-fm-neutral-900 mb-3">
                          Let's get to know you
                        </h2>
                        <p className="text-lg text-fm-neutral-600">
                          Share your contact details so we can connect
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-fm-neutral-800 mb-3">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => updateFormData({ name: e.target.value })}
                            className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-fm-magenta-100 focus:border-fm-magenta-700 transition-all duration-300 outline-none
                              ${errors.name ? 'border-red-500' : 'border-fm-neutral-200'}`}
                            placeholder="Enter your full name"
                          />
                          {errors.name && <p className="text-red-500 text-sm mt-2 font-medium">{errors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-fm-neutral-800 mb-3">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-fm-neutral-400" />
                            <input
                              type="email"
                              value={formData.email || ''}
                              onChange={(e) => updateFormData({ email: e.target.value })}
                              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-fm-magenta-100 focus:border-fm-magenta-700 transition-all duration-300 outline-none
                                ${errors.email ? 'border-red-500' : 'border-fm-neutral-200'}`}
                              placeholder="your@email.com"
                            />
                          </div>
                          {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-fm-neutral-800 mb-3">
                            Company Name *
                          </label>
                          <div className="relative">
                            <Building className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-fm-neutral-400" />
                            <input
                              type="text"
                              value={formData.company || ''}
                              onChange={(e) => updateFormData({ company: e.target.value })}
                              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-fm-magenta-100 focus:border-fm-magenta-700 transition-all duration-300 outline-none
                                ${errors.company ? 'border-red-500' : 'border-fm-neutral-200'}`}
                              placeholder="Your company name"
                            />
                          </div>
                          {errors.company && <p className="text-red-500 text-sm mt-2 font-medium">{errors.company}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-fm-neutral-800 mb-3">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-fm-neutral-400" />
                            <input
                              type="tel"
                              value={formData.phone || ''}
                              onChange={(e) => updateFormData({ phone: e.target.value })}
                              className="w-full pl-12 pr-4 py-4 border-2 border-fm-neutral-200 rounded-xl focus:ring-4 focus:ring-fm-magenta-100 focus:border-fm-magenta-700 transition-all duration-300 outline-none"
                              placeholder="+91 XXXXX XXXXX"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-fm-neutral-800 mb-3">
                          Website (Optional)
                        </label>
                        <div className="relative">
                          <Globe className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-fm-neutral-400" />
                          <input
                            type="url"
                            value={formData.website || ''}
                            onChange={(e) => updateFormData({ website: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 border-2 border-fm-neutral-200 rounded-xl focus:ring-4 focus:ring-fm-magenta-100 focus:border-fm-magenta-700 transition-all duration-300 outline-none"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Project Details */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Target className="w-8 h-8 text-fm-magenta-700" />
                        </div>
                        <h2 className="text-3xl font-bold text-fm-neutral-900 mb-3">
                          What do you need?
                        </h2>
                        <p className="text-lg text-fm-neutral-600">
                          Tell us about your project requirements
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-fm-neutral-800 mb-6">
                          Project Type *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {PROJECT_TYPES.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => updateFormData({ projectType: type.value })}
                              className={`p-6 border-2 rounded-xl text-left hover:bg-fm-magenta-50 hover:border-fm-magenta-300 transition-all duration-300 group
                                ${formData.projectType === type.value 
                                  ? 'border-fm-magenta-700 bg-fm-magenta-50 shadow-lg' 
                                  : 'border-fm-neutral-200'}`}
                            >
                              <div className="flex items-start space-x-4">
                                <span className="text-2xl">{type.icon}</span>
                                <div>
                                  <div className="font-semibold text-fm-neutral-900 mb-1">{type.label}</div>
                                  <div className="text-sm text-fm-neutral-600">{type.description}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                        {errors.projectType && <p className="text-red-500 text-sm mt-3 font-medium">{errors.projectType}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-fm-neutral-800 mb-3">
                          Project Description *
                        </label>
                        <textarea
                          value={formData.projectDescription || ''}
                          onChange={(e) => updateFormData({ projectDescription: e.target.value })}
                          rows={5}
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-fm-magenta-100 focus:border-fm-magenta-700 transition-all duration-300 resize-none outline-none
                            ${errors.projectDescription ? 'border-red-500' : 'border-fm-neutral-200'}`}
                          placeholder="Describe your project in detail. What are you looking to build or improve? What specific features or outcomes do you need?"
                        />
                        <div className="flex justify-between text-sm mt-2">
                          <span className={errors.projectDescription ? 'text-red-500 font-medium' : 'text-fm-neutral-500'}>
                            {errors.projectDescription || 'Minimum 10 characters'}
                          </span>
                          <span className="text-fm-neutral-500">{formData.projectDescription?.length || 0} characters</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-fm-neutral-800 mb-3">
                          Industry (Optional)
                        </label>
                        <select
                          value={formData.industry || ''}
                          onChange={(e) => updateFormData({ industry: e.target.value as Industry })}
                          className="w-full px-4 py-4 border-2 border-fm-neutral-200 rounded-xl focus:ring-4 focus:ring-fm-magenta-100 focus:border-fm-magenta-700 transition-all duration-300 outline-none"
                        >
                          <option value="">Select your industry</option>
                          {INDUSTRIES.map((industry) => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Budget & Timeline */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <DollarSign className="w-8 h-8 text-fm-magenta-700" />
                        </div>
                        <h2 className="text-3xl font-bold text-fm-neutral-900 mb-3">
                          Budget & Timeline
                        </h2>
                        <p className="text-lg text-fm-neutral-600">
                          Help us create the perfect proposal for you
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-fm-neutral-800 mb-6">
                          Budget Range *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {BUDGET_RANGES.map((budget) => (
                            <button
                              key={budget.value}
                              type="button"
                              onClick={() => updateFormData({ budgetRange: budget.value })}
                              className={`p-6 border-2 rounded-xl text-left hover:bg-fm-magenta-50 hover:border-fm-magenta-300 transition-all duration-300 relative
                                ${formData.budgetRange === budget.value 
                                  ? 'border-fm-magenta-700 bg-fm-magenta-50 shadow-lg' 
                                  : 'border-fm-neutral-200'}`}
                            >
                              <div className="font-semibold text-fm-neutral-900">{budget.label}</div>
                              {budget.popular && (
                                <span className="absolute top-3 right-3 bg-fm-magenta-700 text-white text-xs px-3 py-1 rounded-full font-medium">
                                  Popular
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                        {errors.budgetRange && <p className="text-red-500 text-sm mt-3 font-medium">{errors.budgetRange}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-fm-neutral-800 mb-6">
                          Timeline *
                        </label>
                        <div className="space-y-3">
                          {TIMELINES.map((timeline) => (
                            <button
                              key={timeline.value}
                              type="button"
                              onClick={() => updateFormData({ timeline: timeline.value })}
                              className={`w-full p-6 border-2 rounded-xl text-left hover:bg-fm-magenta-50 hover:border-fm-magenta-300 transition-all duration-300
                                ${formData.timeline === timeline.value 
                                  ? 'border-fm-magenta-700 bg-fm-magenta-50 shadow-lg' 
                                  : 'border-fm-neutral-200'}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-fm-neutral-900">{timeline.label}</span>
                                {timeline.urgent && (
                                  <span className="flex items-center text-fm-orange-600 font-medium">
                                    <Zap className="w-4 h-4 mr-1" />
                                    Urgent
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        {errors.timeline && <p className="text-red-500 text-sm mt-3 font-medium">{errors.timeline}</p>}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Challenges & Company Info */}
                  {currentStep === 4 && (
                    <div className="space-y-8">
                      <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <AlertCircle className="w-8 h-8 text-fm-magenta-700" />
                        </div>
                        <h2 className="text-3xl font-bold text-fm-neutral-900 mb-3">
                          Tell us your challenges
                        </h2>
                        <p className="text-lg text-fm-neutral-600">
                          Understanding your pain points helps us deliver better solutions
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-fm-neutral-800 mb-3">
                          What's your biggest challenge right now? *
                        </label>
                        <textarea
                          value={formData.primaryChallenge || ''}
                          onChange={(e) => updateFormData({ primaryChallenge: e.target.value })}
                          rows={4}
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-fm-magenta-100 focus:border-fm-magenta-700 transition-all duration-300 resize-none outline-none
                            ${errors.primaryChallenge ? 'border-red-500' : 'border-fm-neutral-200'}`}
                          placeholder="What problem are you trying to solve? What's not working with your current situation? Be specific about your pain points..."
                        />
                        {errors.primaryChallenge && <p className="text-red-500 text-sm mt-2 font-medium">{errors.primaryChallenge}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-fm-neutral-800 mb-3">
                          Any specific requirements? (Optional)
                        </label>
                        <textarea
                          value={formData.specificRequirements || ''}
                          onChange={(e) => updateFormData({ specificRequirements: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-4 border-2 border-fm-neutral-200 rounded-xl focus:ring-4 focus:ring-fm-magenta-100 focus:border-fm-magenta-700 transition-all duration-300 resize-none outline-none"
                          placeholder="Any specific features, integrations, or technical requirements?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-fm-neutral-800 mb-6">
                          Company Size *
                        </label>
                        <div className="space-y-3">
                          {COMPANY_SIZES.map((size) => (
                            <button
                              key={size.value}
                              type="button"
                              onClick={() => updateFormData({ companySize: size.value })}
                              className={`w-full p-6 border-2 rounded-xl text-left hover:bg-fm-magenta-50 hover:border-fm-magenta-300 transition-all duration-300
                                ${formData.companySize === size.value 
                                  ? 'border-fm-magenta-700 bg-fm-magenta-50 shadow-lg' 
                                  : 'border-fm-neutral-200'}`}
                            >
                              <div className="flex items-center space-x-4">
                                <span className="text-xl">{size.icon}</span>
                                <span className="font-semibold text-fm-neutral-900">{size.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                        {errors.companySize && <p className="text-red-500 text-sm mt-3 font-medium">{errors.companySize}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-fm-neutral-800 mb-3">
                          Your Role at the Company (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.jobTitle || ''}
                          onChange={(e) => updateFormData({ jobTitle: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-fm-neutral-200 rounded-xl focus:ring-4 focus:ring-fm-magenta-100 focus:border-fm-magenta-700 transition-all duration-300 outline-none"
                          placeholder="e.g., CEO, Marketing Manager, Founder"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-fm-neutral-200">
                  <LinkButton
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      prevStep();
                    }}
                    variant="ghost"
                    disabled={currentStep === 1}
                    icon={<ChevronLeft className="w-5 h-5" />}
                    iconPosition="left"
                    className="px-8 py-4 text-lg"
                  >
                    Back
                  </LinkButton>

                  {currentStep < 4 ? (
                    <LinkButton
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        nextStep();
                      }}
                      variant="primary"
                      icon={<ChevronRight className="w-5 h-5" />}
                      iconPosition="right"
                      className="px-8 py-4 text-lg bg-gradient-to-r from-fm-magenta-700 to-fm-magenta-600 hover:from-fm-magenta-800 hover:to-fm-magenta-700 shadow-lg hover:shadow-xl"
                    >
                      Continue
                    </LinkButton>
                  ) : (
                    <LinkButton
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        submitForm();
                      }}
                      variant="primary"
                      disabled={isSubmitting}
                      icon={isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      ) : (
                        <ArrowRight className="w-5 h-5" />
                      )}
                      iconPosition="right"
                      className="px-8 py-4 text-lg bg-gradient-to-r from-fm-magenta-700 to-fm-magenta-600 hover:from-fm-magenta-800 hover:to-fm-magenta-700 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </LinkButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Thank You Step Component
function ThankYouStep({ formData, onClose }: { formData: Partial<LeadInput>; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 bg-fm-neutral-100 hover:bg-fm-neutral-200 rounded-full flex items-center justify-center transition-all duration-200"
          >
            <X className="w-5 h-5 text-fm-neutral-600" />
          </button>

          <div className="p-12 md:p-16 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-fm-neutral-900 mb-6">
              Thank You, {formData.name}!
            </h1>
            
            <p className="text-xl text-fm-neutral-600 mb-10 leading-relaxed">
              We've received your project details and our expert team will get back to you within 
              <span className="font-semibold text-fm-magenta-700"> 24 hours </span>
              with a customized proposal.
            </p>
            
            {/* What's Next Section */}
            <div className="bg-fm-magenta-50 rounded-2xl p-8 mb-10 text-left">
              <h3 className="font-bold text-fm-neutral-900 mb-6 text-xl text-center">What happens next?</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-fm-magenta-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-fm-neutral-900">Expert Review</h4>
                    <p className="text-fm-neutral-600">Our team will carefully analyze your requirements and challenges</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-fm-magenta-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-fm-neutral-900">Custom Proposal</h4>
                    <p className="text-fm-neutral-600">We'll create a detailed proposal with timeline, strategy, and transparent pricing</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-fm-magenta-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-fm-neutral-900">Discovery Call</h4>
                    <p className="text-fm-neutral-600">Schedule a call to discuss your project in detail and answer any questions</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-fm-magenta-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-fm-neutral-900">Project Kickoff</h4>
                    <p className="text-fm-neutral-600">Start building your amazing project with our expert team!</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* CTA Buttons */}
            <div className="space-y-6">
              <LinkButton
                href="/"
                variant="primary"
                className="w-full md:w-auto px-8 py-4 text-lg bg-gradient-to-r from-fm-magenta-700 to-fm-magenta-600 hover:from-fm-magenta-800 hover:to-fm-magenta-700 shadow-lg hover:shadow-xl"
              >
                Return to Homepage
              </LinkButton>
              
              <p className="text-sm text-fm-neutral-500">
                Questions? Email us at{' '}
                <a href="mailto:hello@freakingminds.in" className="text-fm-magenta-700 hover:underline font-medium">
                  hello@freakingminds.in
                </a>{' '}
                or call us at{' '}
                <a href="tel:+919876543210" className="text-fm-magenta-700 hover:underline font-medium">
                  +91 98765 43210
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}