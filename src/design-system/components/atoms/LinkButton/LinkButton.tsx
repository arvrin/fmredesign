/**
 * LinkButton Component - Design System
 * A button that can work as a link or trigger actions
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Button, ButtonProps } from '../../primitives/Button';

export interface LinkButtonProps extends ButtonProps {
  href?: string;
  onClick?: () => void;
  newTab?: boolean;
}

export function LinkButton({ 
  href, 
  onClick, 
  newTab = false,
  children,
  ...buttonProps 
}: LinkButtonProps) {
  // If href is provided, wrap button in Link
  if (href) {
    // External link
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return (
        <a 
          href={href}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          onClick={onClick}
        >
          <Button {...buttonProps}>
            {children}
          </Button>
        </a>
      );
    }
    
    // Internal link
    return (
      <Link 
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        <Button {...buttonProps}>
          {children}
        </Button>
      </Link>
    );
  }
  
  // Regular button with onClick
  return (
    <Button onClick={onClick} {...buttonProps}>
      {children}
    </Button>
  );
}

export default LinkButton;