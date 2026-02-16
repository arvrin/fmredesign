'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ArrowRight,
  Mail,
  Phone,
  Globe,
  Building,
  X,
  BarChart3,
  Gift
} from 'lucide-react';
import { V2PageWrapper } from "@/components/layouts/V2PageWrapper";
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

      localStorage.removeItem('fm_lead_progress');
      setSubmitted(true);
      setCurrentStep(5);

      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'generate_lead', {
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
    <V2PageWrapper>
      {/* Hero Section */}
      <section className="relative z-10 v2-section pt-32 lg:pt-40 min-h-screen flex items-center">
        <div className="v2-container">
          <div className="max-w-4xl mx-auto" style={{ textAlign: 'center' }}>
            {/* Badge */}
            <div className="v2-badge v2-badge-glass mb-8">
              <Sparkles className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">Start Your Digital Transformation Journey</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold v2-text-primary mb-8 leading-tight">
              Let's Build Something{' '}
              <span className="v2-accent">Amazing</span> Together
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed" style={{ marginBottom: '48px' }}>
              Tell us about your project in just a few steps. Our team will get back to you within 24 hours
              with a customized proposal tailored to your needs.
            </p>

            {/* CTA Button */}
            <div className="mb-16">
              <button
                onClick={() => setShowModal(true)}
                className="v2-btn v2-btn-primary v2-btn-lg"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="v2-paper rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {[
                  { icon: Zap, label: "24hr Response" },
                  { icon: Target, label: "Custom Strategy" },
                  { icon: BarChart3, label: "Data-Driven" },
                  { icon: Gift, label: "Free Consultation" }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex flex-col items-center">
                      <Icon className="w-6 h-6 text-fm-magenta-600 mb-1.5" />
                      <div className="text-sm text-fm-neutral-600 font-medium">{item.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Brain Decoration */}
        <div className="absolute right-8 lg:right-24 top-1/3 hidden lg:block z-10">
          <img
            src="/3dasset/brain-learning.png"
            alt="Innovation"
            className="w-32 lg:w-44 h-auto animate-v2-hero-float drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
          />
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="pb-32" />

      {/* Modal Form Container */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative z-10 h-full flex items-center justify-center p-3 sm:p-4">
            <div className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 bg-fm-neutral-100 hover:bg-fm-neutral-200 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <X className="w-5 h-5 text-fm-neutral-600" />
              </button>

              {/* Form Content */}
              <div className="p-5 sm:p-8 md:p-12">
                {/* Progress Bar */}
                <div className="mb-8 sm:mb-12">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 font-semibold
                            ${currentStep >= step
                              ? 'bg-fm-magenta-700 border-fm-magenta-700 text-white shadow-lg'
                              : 'border-fm-neutral-300 text-fm-neutral-500 bg-white'}`}
                        >
                          {currentStep > step ? (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <span className="text-xs sm:text-sm">{step}</span>
                          )}
                        </div>
                        <span className={`text-[11px] sm:text-xs mt-1 sm:mt-2 font-medium ${
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
                  <div className="w-full bg-fm-neutral-200 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-gradient-to-r from-fm-magenta-700 to-fm-magenta-400 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Step Content */}
                <div className="min-h-[320px] sm:min-h-[500px]">
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
                          placeholder="Describe your project in detail. What are you looking to build or improve?"
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
                                  <span className="flex items-center text-fm-magenta-600 font-medium">
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
                          placeholder="What problem are you trying to solve?"
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
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      currentStep === 1
                        ? 'text-fm-neutral-400 cursor-not-allowed'
                        : 'text-fm-neutral-700 hover:bg-fm-neutral-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>

                  {currentStep < 4 ? (
                    <button
                      onClick={nextStep}
                      className="v2-btn v2-btn-magenta v2-btn-lg"
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={submitForm}
                      disabled={isSubmitting}
                      className="v2-btn v2-btn-magenta v2-btn-lg disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Request
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </V2PageWrapper>
  );
}

// Thank You Step Component
function ThankYouStep({ formData, onClose }: { formData: Partial<LeadInput>; onClose: () => void }) {
  return (
    <V2PageWrapper>
      <section className="relative z-10 min-h-screen flex items-center justify-center v2-section">
        <div className="v2-container">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16 text-center">
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
                {[
                  { step: 1, title: "Expert Review", desc: "Our team will carefully analyze your requirements and challenges" },
                  { step: 2, title: "Custom Proposal", desc: "We'll create a detailed proposal with timeline, strategy, and transparent pricing" },
                  { step: 3, title: "Discovery Call", desc: "Schedule a call to discuss your project in detail and answer any questions" },
                  { step: 4, title: "Project Kickoff", desc: "Start building your amazing project with our expert team!" }
                ].map((item) => (
                  <li key={item.step} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-fm-magenta-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-semibold text-sm">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-fm-neutral-900">{item.title}</h4>
                      <p className="text-fm-neutral-600">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-6">
              <Link
                href="/"
                className="v2-btn v2-btn-magenta"
              >
                Return to Homepage
                <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="text-sm text-fm-neutral-500">
                Questions? Email us at{' '}
                <a href="mailto:hello@freakingminds.in" className="text-fm-magenta-700 hover:underline font-medium">
                  hello@freakingminds.in
                </a>{' '}
                or call us at{' '}
                <a href="tel:+919833257659" className="text-fm-magenta-700 hover:underline font-medium">
                  +91 98332 57659
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </V2PageWrapper>
  );
}
