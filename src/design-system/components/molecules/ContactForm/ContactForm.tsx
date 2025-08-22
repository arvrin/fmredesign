/**
 * Contact Form Component - Design System
 * Advanced form with validation, state management, and submission handling
 */

'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { patterns } from '../../../patterns';
import { Button } from '../../atoms/Button/Button';
import { cn } from '@/lib/utils';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  subscribe: boolean;
}

export interface ContactFormProps {
  services?: string[];
  budgetRanges?: string[];
  onSubmit?: (data: ContactFormData) => Promise<void>;
  title?: string;
  description?: string;
  successTitle?: string;
  successMessage?: string;
  submitText?: string;
  submittingText?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

const defaultServices = [
  "SEO & Digital Marketing",
  "Social Media Marketing",
  "PPC Advertising",
  "Website Design & Development",
  "Branding & Creative Design",
  "Content Marketing",
  "E-commerce Solutions",
  "Other"
];

const defaultBudgetRanges = [
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹3,00,000",
  "₹3,00,000 - ₹5,00,000",
  "₹5,00,000+"
];

export function ContactForm({
  services = defaultServices,
  budgetRanges = defaultBudgetRanges,
  onSubmit,
  title = "Let's Discuss Your Project",
  description = "Fill out the form below and we'll get back to you within 24 hours with a custom proposal tailored to your needs.",
  successTitle = "Thank You for Your Message!",
  successMessage = "We've received your inquiry and will get back to you within 24 hours. Our team is excited to discuss your project!",
  submitText = "Send Message",
  submittingText = "Sending Message...",
  theme = 'light',
  className,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: '',
    subscribe: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      setSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      budget: '',
      message: '',
      subscribe: false
    });
  };

  const titleClasses = cn(
    'text-3xl font-bold mb-6',
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white'
  );

  const descriptionClasses = cn(
    'mb-8',
    theme === 'light' ? patterns.typography.body.primary : patterns.typography.body.white
  );

  const inputClasses = "w-full px-4 py-3 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700 transition-colors";
  const labelClasses = cn(
    'block font-medium mb-2',
    theme === 'light' ? 'text-fm-neutral-700' : 'text-fm-neutral-200'
  );

  if (submitted) {
    return (
      <div className={cn('bg-fm-magenta-50 border border-fm-magenta-200 rounded-lg p-8 text-center', className)}>
        <CheckCircle className="w-16 h-16 text-fm-magenta-700 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-fm-neutral-900 mb-4">
          {successTitle}
        </h3>
        <p className="text-fm-neutral-600 mb-6">
          {successMessage}
        </p>
        <Button variant="primary" onClick={resetForm}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className={titleClasses}>
        {title}
      </h2>
      <p className={descriptionClasses}>
        {description}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className={labelClasses}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={inputClasses}
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className={labelClasses}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={inputClasses}
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className={labelClasses}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="+91 99999 99999"
            />
          </div>
          
          <div>
            <label htmlFor="company" className={labelClasses}>
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="Your company name"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="service" className={labelClasses}>
              Service Interested In
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              className={inputClasses}
            >
              <option value="">Select a service</option>
              {services.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="budget" className={labelClasses}>
              Project Budget
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className={inputClasses}
            >
              <option value="">Select budget range</option>
              {budgetRanges.map((range, index) => (
                <option key={index} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className={labelClasses}>
            Project Details *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={6}
            className={cn(inputClasses, "resize-vertical")}
            placeholder="Tell us about your project goals, timeline, and any specific requirements..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="subscribe"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleInputChange}
            className="w-5 h-5 text-fm-magenta-700 border-fm-neutral-300 rounded focus:ring-fm-magenta-700"
          />
          <label htmlFor="subscribe" className={cn(
            theme === 'light' ? 'text-fm-neutral-700' : 'text-fm-neutral-200'
          )}>
            Subscribe to our newsletter for digital marketing tips and updates
          </label>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full"
          disabled={isSubmitting}
          icon={<ArrowRight className="w-5 h-5" />}
          iconPosition="right"
          animation="scale"
        >
          {isSubmitting ? submittingText : submitText}
        </Button>
      </form>
    </div>
  );
}

export default ContactForm;