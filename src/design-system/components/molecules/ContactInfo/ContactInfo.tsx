/**
 * Contact Info Component - Design System
 * Business contact information with quick action buttons
 */

import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { patterns } from '../../../patterns';
import { Button } from '../../primitives/Button';
import { cn } from '@/lib/utils';

export interface ContactInfoItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  details: string[];
}

export interface ContactInfoProps {
  contactInfo: ContactInfoItem[];
  quickActions?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  title?: string;
  description?: string;
  theme?: 'light' | 'dark';
  showQuickActions?: boolean;
  className?: string;
}

export function ContactInfo({
  contactInfo,
  quickActions = {
    phone: "+91 99999 99999",
    email: "freakingmindsdigital@gmail.com",
    whatsapp: "+91 99999 99999"
  },
  title = "Get in Touch",
  description = "Prefer to speak directly? Our team is available through multiple channels to provide you with the support you need.",
  theme = 'light',
  showQuickActions = true,
  className,
}: ContactInfoProps) {
  const titleClasses = cn(
    'text-3xl font-bold mb-6',
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white'
  );

  const descriptionClasses = cn(
    'mb-8',
    theme === 'light' ? patterns.typography.body.primary : patterns.typography.body.white
  );

  const iconContainerClasses = cn(
    'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
    theme === 'light' 
      ? 'bg-fm-magenta-100' 
      : 'bg-fm-magenta-600/20'
  );

  const itemTitleClasses = cn(
    'text-lg font-semibold mb-2',
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white'
  );

  const itemDetailClasses = cn(
    'mb-1',
    theme === 'light' ? 'text-fm-neutral-600' : 'text-fm-neutral-300'
  );

  const sectionTitleClasses = cn(
    'text-xl font-semibold mb-4',
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white'
  );

  return (
    <div className={className}>
      <h2 className={titleClasses}>
        {title}
      </h2>
      <p className={descriptionClasses}>
        {description}
      </p>

      <div className="space-y-6">
        {contactInfo.map((info, index) => (
          <div key={index} className="flex gap-4">
            <div className={iconContainerClasses}>
              <info.icon className="w-6 h-6 text-fm-magenta-700" />
            </div>
            <div>
              <h3 className={itemTitleClasses}>
                {info.title}
              </h3>
              {info.details.map((detail, detailIndex) => (
                <p key={detailIndex} className={itemDetailClasses}>
                  {detail}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showQuickActions && (
        <div className="mt-12 space-y-4">
          <h3 className={sectionTitleClasses}>
            Quick Actions
          </h3>
          
          {quickActions.phone && (
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start"
              theme={theme}
            >
              <Phone className="w-5 h-5 mr-3" />
              Call Now: {quickActions.phone}
            </Button>
          )}
          
          {quickActions.email && (
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start"
              theme={theme}
            >
              <Mail className="w-5 h-5 mr-3" />
              Email: {quickActions.email}
            </Button>
          )}
          
          {quickActions.whatsapp && (
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start"
              theme={theme}
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              WhatsApp Chat
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ContactInfo;