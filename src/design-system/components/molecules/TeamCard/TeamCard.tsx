/**
 * Team Card Component - Design System
 * Professional team member card with expertise display
 */

import React from 'react';
import { patterns } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface TeamCardProps {
  name: string;
  role: string;
  experience: string;
  expertise: string;
  description: string;
  avatar?: string;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SizeClasses = {
  sm: {
    card: 'p-6',
    avatar: 'w-20 h-20 mb-4',
    name: 'text-lg font-bold mb-2',
    role: 'text-sm font-semibold mb-2',
    experience: 'text-xs mb-3',
    expertise: 'text-xs mb-4',
    description: 'text-sm',
  },
  md: {
    card: 'p-8',
    avatar: 'w-24 h-24 mb-6',
    name: 'text-xl font-bold mb-3',
    role: 'text-base font-semibold mb-3',
    experience: 'text-sm mb-4',
    expertise: 'text-sm mb-6',
    description: 'text-base',
  },
  lg: {
    card: 'p-10',
    avatar: 'w-32 h-32 mb-8',
    name: 'text-2xl font-bold mb-4',
    role: 'text-lg font-semibold mb-4',
    experience: 'text-base mb-6',
    expertise: 'text-base mb-8',
    description: 'text-lg',
  },
} as const;

export function TeamCard({
  name,
  role,
  experience,
  expertise,
  description,
  avatar,
  theme = 'light',
  size = 'md',
  className,
}: TeamCardProps) {
  const sizeConfig = SizeClasses[size];
  
  const cardClasses = cn(
    patterns.card.base,
    sizeConfig.card,
    patterns.card.hover,
    patterns.animation.hover.scale,
    'text-center',
    className
  );

  const avatarClasses = cn(
    'rounded-full mx-auto object-cover',
    'bg-gradient-to-br from-fm-magenta-100 to-fm-magenta-50',
    'border-4 border-white shadow-lg',
    sizeConfig.avatar
  );

  const nameClasses = cn(
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white',
    sizeConfig.name
  );

  const roleClasses = cn(
    'text-fm-magenta-700',
    sizeConfig.role
  );

  const experienceClasses = cn(
    'inline-flex items-center px-3 py-1 rounded-full',
    'bg-fm-neutral-100 text-fm-neutral-600 font-medium',
    sizeConfig.experience
  );

  const expertiseClasses = cn(
    theme === 'light' ? 'text-fm-neutral-500' : 'text-fm-neutral-300',
    'font-medium',
    sizeConfig.expertise
  );

  const descriptionClasses = cn(
    'leading-relaxed',
    theme === 'light' ? patterns.typography.body.primary : patterns.typography.body.white,
    sizeConfig.description
  );

  return (
    <div className={cardClasses}>
      {/* Avatar */}
      <div className={avatarClasses}>
        {avatar ? (
          <img src={avatar} alt={`${name} - Team Member Photo`} className="w-full h-full rounded-full object-cover" />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-700 flex items-center justify-center text-white font-bold text-xl">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>
      
      {/* Name */}
      <h3 className={nameClasses}>
        {name}
      </h3>
      
      {/* Role */}
      <p className={roleClasses}>
        {role}
      </p>
      
      {/* Experience Badge */}
      <div className="mb-4">
        <span className={experienceClasses}>
          {experience}
        </span>
      </div>
      
      {/* Expertise */}
      <p className={expertiseClasses}>
        {expertise}
      </p>
      
      {/* Description */}
      <p className={descriptionClasses}>
        {description}
      </p>
    </div>
  );
}

export default TeamCard;