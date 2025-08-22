/**
 * FAQ Item Component - Design System
 * Expandable FAQ items with clean styling
 */

'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { patterns } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export interface FAQSectionProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  title?: string;
  description?: string;
  theme?: 'light' | 'dark';
  allowMultipleOpen?: boolean;
  className?: string;
}

export function FAQItem({
  question,
  answer,
  defaultOpen = false,
  theme = 'light',
  className,
}: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const containerClasses = cn(
    patterns.card.base,
    'p-6 transition-all duration-200',
    theme === 'light'
      ? 'bg-white border-fm-neutral-200 hover:border-fm-magenta-300'
      : 'bg-fm-neutral-800 border-fm-neutral-700 hover:border-fm-magenta-500',
    className
  );

  const questionClasses = cn(
    'text-lg font-semibold cursor-pointer select-none',
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white'
  );

  const answerClasses = cn(
    'leading-relaxed',
    theme === 'light' ? patterns.typography.body.primary : patterns.typography.body.white
  );

  return (
    <div className={containerClasses}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={isOpen}
      >
        <h3 className={questionClasses}>
          {question}
        </h3>
        <ChevronDown className={cn(
          'w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-4',
          isOpen ? 'transform rotate-180' : '',
          theme === 'light' ? 'text-fm-neutral-600' : 'text-fm-neutral-400'
        )} />
      </button>
      
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-fm-neutral-200">
          <p className={answerClasses}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  description = "Quick answers to common questions about our services and process.",
  theme = 'light',
  allowMultipleOpen = true,
  className,
}: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const handleToggle = (index: number) => {
    if (allowMultipleOpen) {
      setOpenItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems(prev => 
        prev.includes(index) ? [] : [index]
      );
    }
  };

  const titleClasses = cn(
    'text-3xl font-bold text-center mb-6',
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white'
  );

  const descriptionClasses = cn(
    'text-lg text-center max-w-2xl mx-auto mb-16',
    theme === 'light' ? 'text-fm-neutral-600' : 'text-fm-neutral-300'
  );

  return (
    <div className={className}>
      <div className="text-center mb-16">
        <h2 className={titleClasses}>
          {title}
        </h2>
        <p className={descriptionClasses}>
          {description}
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={cn(
              patterns.card.base,
              'p-6 transition-all duration-200',
              theme === 'light'
                ? 'bg-white border-fm-neutral-200 hover:border-fm-magenta-300'
                : 'bg-fm-neutral-800 border-fm-neutral-700 hover:border-fm-magenta-500'
            )}
          >
            <button
              onClick={() => handleToggle(index)}
              className="flex items-center justify-between w-full text-left"
              aria-expanded={openItems.includes(index)}
            >
              <h3 className={cn(
                'text-lg font-semibold cursor-pointer select-none',
                theme === 'light' ? 'text-fm-neutral-900' : 'text-white'
              )}>
                {faq.question}
              </h3>
              <ChevronDown className={cn(
                'w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-4',
                openItems.includes(index) ? 'transform rotate-180' : '',
                theme === 'light' ? 'text-fm-neutral-600' : 'text-fm-neutral-400'
              )} />
            </button>
            
            {openItems.includes(index) && (
              <div className="mt-3 pt-3 border-t border-fm-neutral-200">
                <p className={cn(
                  'leading-relaxed',
                  theme === 'light' ? patterns.typography.body.primary : patterns.typography.body.white
                )}>
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQItem;