# Freaking Minds Design System v1.0
*The Complete Design Language for Freaking Minds Digital Marketing Agency*

---

## Table of Contents
1. [Brand Foundation](#brand-foundation)
2. [Design Tokens](#design-tokens)
3. [Typography System](#typography-system)
4. [Layout & Grid](#layout--grid)
5. [Component Library](#component-library)
6. [Interaction Design](#interaction-design)
7. [Iconography](#iconography)
8. [Imagery Guidelines](#imagery-guidelines)
9. [Accessibility Standards](#accessibility-standards)
10. [Implementation Guidelines](#implementation-guidelines)

---

## Brand Foundation

### Brand Essence
- **Mission**: Transform businesses through data-driven creative marketing solutions
- **Vision**: Be the most trusted creative partner for ambitious brands
- **Values**: Innovation, Authenticity, Results, Collaboration

### Brand Personality
- **Creative Innovators**: Bold, original thinking
- **Strategic Partners**: Data-driven, results-focused  
- **Trusted Advisors**: Professional, reliable, transparent
- **Cultural Catalysts**: Understanding diverse markets and audiences

### Voice & Tone
- **Voice**: Confident, knowledgeable, approachable
- **Tone Variations**:
  - **Consultative**: Professional, advisory (for case studies)
  - **Inspiring**: Energetic, forward-thinking (for hero sections)
  - **Educational**: Clear, informative (for blog content)
  - **Conversational**: Friendly, human (for about/team content)

---

## Design Tokens

### Color System

#### Primary Palette (Based on Existing Brand)
```css
/* Brand Colors */
--fm-magenta-900: #8f184c;     /* Primary brand color - existing */
--fm-magenta-800: #a1215a;     /* Darker variation */
--fm-magenta-700: #b32968;     /* Base brand */
--fm-magenta-600: #c53276;     /* Lighter variation */
--fm-magenta-500: #d73a84;     /* Accent variation */
--fm-magenta-400: #e94392;     /* Light accent */
--fm-magenta-300: #fb4ca0;     /* Lightest brand */

/* Supporting Colors */
--fm-purple-900: #4a0e2b;      /* Deep contrast */
--fm-purple-800: #5c1338;      /* Dark supporting */
--fm-purple-700: #6e1845;      /* Medium supporting */

/* Accent Colors */
--fm-orange-600: #ff6b35;      /* CTA accent */
--fm-orange-500: #ff7849;      /* Hover state */
--fm-orange-400: #ff855d;      /* Light accent */

/* Neutral Palette */
--fm-neutral-900: #1a1a1a;     /* Primary text */
--fm-neutral-800: #2d2d2d;     /* Secondary text */
--fm-neutral-700: #404040;     /* Tertiary text */
--fm-neutral-600: #666666;     /* Muted text */
--fm-neutral-500: #808080;     /* Placeholder text */
--fm-neutral-400: #cccccc;     /* Border color */
--fm-neutral-300: #e6e6e6;     /* Light border */
--fm-neutral-200: #f2f2f2;     /* Background alt */
--fm-neutral-100: #f8f9fa;     /* Background */
--fm-neutral-50: #ffffff;      /* Pure white */

/* Semantic Colors */
--fm-success: #16a34a;         /* Success states */
--fm-warning: #f59e0b;         /* Warning states */
--fm-error: #ef4444;           /* Error states */
--fm-info: #3b82f6;            /* Info states */
```

#### Color Usage Guidelines
- **Primary Actions**: Use magenta-700 (#b32968) for main CTAs
- **Secondary Actions**: Use neutral-700 with magenta-700 border
- **Accent Elements**: Use orange-600 (#ff6b35) sparingly for highlights
- **Text Hierarchy**: neutral-900 (primary), neutral-700 (secondary), neutral-600 (tertiary)
- **Backgrounds**: neutral-50 (main), neutral-100 (alternate sections)

### Spacing System
```css
/* Base unit: 4px */
--fm-space-1: 4px;    /* 0.25rem */
--fm-space-2: 8px;    /* 0.5rem */
--fm-space-3: 12px;   /* 0.75rem */
--fm-space-4: 16px;   /* 1rem */
--fm-space-6: 24px;   /* 1.5rem */
--fm-space-8: 32px;   /* 2rem */
--fm-space-12: 48px;  /* 3rem */
--fm-space-16: 64px;  /* 4rem */
--fm-space-20: 80px;  /* 5rem */
--fm-space-24: 96px;  /* 6rem */
--fm-space-32: 128px; /* 8rem */
```

### Border Radius
```css
--fm-radius-sm: 6px;      /* Small elements */
--fm-radius-md: 12px;     /* Standard elements */
--fm-radius-lg: 16px;     /* Cards, panels */
--fm-radius-xl: 24px;     /* Hero elements */
--fm-radius-full: 9999px; /* Pills, avatars */
```

### Shadows
```css
--fm-shadow-sm: 0 1px 2px 0 rgba(143, 24, 76, 0.05);
--fm-shadow-md: 0 4px 6px -1px rgba(143, 24, 76, 0.1), 0 2px 4px -1px rgba(143, 24, 76, 0.06);
--fm-shadow-lg: 0 10px 15px -3px rgba(143, 24, 76, 0.1), 0 4px 6px -2px rgba(143, 24, 76, 0.05);
--fm-shadow-xl: 0 20px 25px -5px rgba(143, 24, 76, 0.1), 0 10px 10px -5px rgba(143, 24, 76, 0.04);
```

---

## Typography System

### Font Stack
```css
/* Primary Font - Modern Sans-serif */
--fm-font-primary: 'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Display Font - For headlines */
--fm-font-display: 'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace - For code/technical content */
--fm-font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
```

### Type Scale
```css
/* Display Sizes */
--fm-text-display-xl: 4rem;    /* 64px - Hero headlines */
--fm-text-display-lg: 3.5rem;  /* 56px - Section headlines */
--fm-text-display-md: 3rem;    /* 48px - Page headlines */

/* Heading Sizes */
--fm-text-h1: 2.5rem;          /* 40px */
--fm-text-h2: 2rem;            /* 32px */
--fm-text-h3: 1.5rem;          /* 24px */
--fm-text-h4: 1.25rem;         /* 20px */
--fm-text-h5: 1.125rem;        /* 18px */
--fm-text-h6: 1rem;            /* 16px */

/* Body Sizes */
--fm-text-lg: 1.125rem;        /* 18px - Large body */
--fm-text-base: 1rem;          /* 16px - Base body */
--fm-text-sm: 0.875rem;        /* 14px - Small text */
--fm-text-xs: 0.75rem;         /* 12px - Captions */

/* Line Heights */
--fm-leading-tight: 1.25;
--fm-leading-snug: 1.375;
--fm-leading-normal: 1.5;
--fm-leading-relaxed: 1.625;
--fm-leading-loose: 2;
```

### Typography Usage
- **Display Text**: Inter Variable, weight 700-800, tight line height
- **Headlines**: Inter Variable, weight 600-700, snug line height
- **Body Text**: Inter Variable, weight 400-500, normal line height
- **Captions**: Inter Variable, weight 400, relaxed line height

---

## Layout & Grid

### Container System
```css
--fm-container-xs: 480px;
--fm-container-sm: 640px;
--fm-container-md: 768px;
--fm-container-lg: 1024px;
--fm-container-xl: 1280px;
--fm-container-2xl: 1536px;
```

### Grid System
- **Desktop (1200px+)**: 12-column grid, 24px gutters, 80px margins
- **Tablet (768px-1199px)**: 8-column grid, 20px gutters, 40px margins
- **Mobile (320px-767px)**: 4-column grid, 16px gutters, 20px margins

### Breakpoints
```css
--fm-bp-sm: 640px;    /* Small tablets */
--fm-bp-md: 768px;    /* Tablets */
--fm-bp-lg: 1024px;   /* Small laptops */
--fm-bp-xl: 1280px;   /* Desktops */
--fm-bp-2xl: 1536px;  /* Large desktops */
```

---

## Component Library

### 1. Navigation Components

#### Header/Navigation
```scss
.fm-header {
  background: var(--fm-neutral-50);
  border-bottom: 1px solid var(--fm-neutral-300);
  position: sticky;
  top: 0;
  z-index: 50;
  
  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--fm-space-4) var(--fm-space-6);
  }
  
  &__logo {
    height: 40px;
    width: auto;
  }
  
  &__nav {
    display: flex;
    gap: var(--fm-space-8);
    
    @media (max-width: var(--fm-bp-md)) {
      display: none;
    }
  }
  
  &__link {
    color: var(--fm-neutral-700);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--fm-magenta-700);
    }
    
    &--active {
      color: var(--fm-magenta-700);
    }
  }
}
```

### 2. Button System

#### Primary Button
```scss
.fm-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--fm-space-3) var(--fm-space-6);
  border-radius: var(--fm-radius-md);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  
  &--primary {
    background: var(--fm-magenta-700);
    color: var(--fm-neutral-50);
    
    &:hover {
      background: var(--fm-magenta-800);
      transform: translateY(-1px);
      box-shadow: var(--fm-shadow-md);
    }
  }
  
  &--secondary {
    background: transparent;
    color: var(--fm-magenta-700);
    border: 2px solid var(--fm-magenta-700);
    
    &:hover {
      background: var(--fm-magenta-700);
      color: var(--fm-neutral-50);
    }
  }
  
  &--accent {
    background: var(--fm-orange-600);
    color: var(--fm-neutral-50);
    
    &:hover {
      background: var(--fm-orange-500);
    }
  }
  
  &--large {
    padding: var(--fm-space-4) var(--fm-space-8);
    font-size: var(--fm-text-lg);
  }
  
  &--small {
    padding: var(--fm-space-2) var(--fm-space-4);
    font-size: var(--fm-text-sm);
  }
}
```

### 3. Card Components

#### Service Card
```scss
.fm-service-card {
  background: var(--fm-neutral-50);
  border-radius: var(--fm-radius-lg);
  padding: var(--fm-space-8);
  box-shadow: var(--fm-shadow-sm);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--fm-shadow-lg);
  }
  
  &__icon {
    width: 48px;
    height: 48px;
    color: var(--fm-magenta-700);
    margin-bottom: var(--fm-space-4);
  }
  
  &__title {
    font-size: var(--fm-text-h4);
    font-weight: 600;
    color: var(--fm-neutral-900);
    margin-bottom: var(--fm-space-3);
  }
  
  &__description {
    color: var(--fm-neutral-700);
    line-height: var(--fm-leading-relaxed);
    margin-bottom: var(--fm-space-6);
  }
  
  &__link {
    color: var(--fm-magenta-700);
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
```

#### Case Study Card
```scss
.fm-case-study-card {
  background: var(--fm-neutral-50);
  border-radius: var(--fm-radius-lg);
  overflow: hidden;
  box-shadow: var(--fm-shadow-sm);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--fm-shadow-md);
  }
  
  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  &__content {
    padding: var(--fm-space-6);
  }
  
  &__client {
    font-size: var(--fm-text-sm);
    color: var(--fm-magenta-700);
    font-weight: 600;
    margin-bottom: var(--fm-space-2);
  }
  
  &__title {
    font-size: var(--fm-text-h5);
    font-weight: 600;
    color: var(--fm-neutral-900);
    margin-bottom: var(--fm-space-3);
  }
  
  &__result {
    color: var(--fm-neutral-700);
    margin-bottom: var(--fm-space-4);
  }
  
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fm-space-2);
  }
  
  &__tag {
    background: var(--fm-neutral-200);
    color: var(--fm-neutral-700);
    padding: var(--fm-space-1) var(--fm-space-3);
    border-radius: var(--fm-radius-sm);
    font-size: var(--fm-text-xs);
  }
}
```

### 4. Form Components

#### Input Field
```scss
.fm-input {
  width: 100%;
  padding: var(--fm-space-3) var(--fm-space-4);
  border: 2px solid var(--fm-neutral-300);
  border-radius: var(--fm-radius-md);
  font-size: var(--fm-text-base);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--fm-magenta-700);
    box-shadow: 0 0 0 3px rgba(179, 41, 104, 0.1);
  }
  
  &--error {
    border-color: var(--fm-error);
  }
  
  &--success {
    border-color: var(--fm-success);
  }
}

.fm-textarea {
  @extend .fm-input;
  min-height: 120px;
  resize: vertical;
}

.fm-select {
  @extend .fm-input;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23666666" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  appearance: none;
}
```

---

## Interaction Design

### Animation Principles
- **Duration**: 150ms for micro-interactions, 300ms for transitions, 500ms for complex animations
- **Easing**: ease-out for entrances, ease-in for exits, ease-in-out for loops
- **Performance**: Use transform and opacity properties, avoid animating layout properties

### Motion Tokens
```css
--fm-duration-fast: 150ms;
--fm-duration-normal: 300ms;
--fm-duration-slow: 500ms;

--fm-ease-in: cubic-bezier(0.4, 0, 1, 1);
--fm-ease-out: cubic-bezier(0, 0, 0.2, 1);
--fm-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover States
- **Buttons**: Slight elevation (2px up) + shadow increase
- **Cards**: Elevation (4px up) + shadow increase  
- **Links**: Color change to brand primary
- **Images**: Subtle scale (1.05x) with overflow hidden

### Loading States
- **Skeleton screens** for content areas
- **Pulse animations** for loading elements
- **Progress indicators** for form submissions

---

## Iconography

### Icon System
- **Style**: Outline/stroke icons for consistency
- **Weight**: 2px stroke weight
- **Size**: 16px, 24px, 32px, 48px standard sizes
- **Library**: Lucide React or Heroicons
- **Color**: Inherit text color or use semantic colors

### Icon Usage Guidelines
- **Navigation**: 16px icons next to text
- **Services**: 32px icons for service cards
- **Features**: 24px icons for feature lists
- **Decorative**: 48px+ icons for hero sections

---

## Imagery Guidelines

### Photography Style
- **Style**: Clean, professional, authentic (avoid stock photos)
- **Color Treatment**: Slight magenta tint overlay (10% opacity)
- **Composition**: Clean backgrounds, good lighting
- **People**: Diverse representation, genuine expressions

### Image Specifications
```css
/* Aspect Ratios */
--fm-aspect-square: 1:1;       /* Profile images */
--fm-aspect-landscape: 16:9;   /* Hero images */
--fm-aspect-portrait: 4:5;     /* Team photos */
--fm-aspect-wide: 21:9;        /* Banner images */

/* Sizes */
--fm-image-thumb: 64px;        /* Thumbnails */
--fm-image-avatar: 128px;      /* User avatars */
--fm-image-card: 320px;        /* Card images */
--fm-image-hero: 1200px;       /* Hero images */
```

### Image Optimization
- **Format**: WebP with JPEG fallback
- **Compression**: 85% quality for photographs, 95% for graphics
- **Responsive**: Multiple sizes using srcset
- **Loading**: Lazy loading below the fold

---

## Accessibility Standards

### Color Contrast
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Non-text Elements**: Minimum 3:1 contrast ratio

### Focus Management
- **Visible Focus**: 2px solid magenta-700 outline
- **Focus Trap**: Modal dialogs and dropdowns
- **Skip Links**: "Skip to main content" for keyboard users

### Screen Reader Support
- **Semantic HTML**: Use proper heading hierarchy
- **ARIA Labels**: For interactive elements
- **Alt Text**: Descriptive text for images
- **Live Regions**: For dynamic content updates

---

## Implementation Guidelines

### CSS Architecture
```scss
// 1. Reset/Normalize
@import 'reset';

// 2. Design Tokens
@import 'tokens';

// 3. Base Styles
@import 'base/typography';
@import 'base/layout';

// 4. Components
@import 'components/buttons';
@import 'components/cards';
@import 'components/forms';

// 5. Utilities
@import 'utilities/spacing';
@import 'utilities/colors';
```

### Component Development
1. **Start with tokens** - Use design tokens for all values
2. **Mobile-first** - Design for smallest screen first
3. **Accessibility** - Include ARIA labels and keyboard support
4. **Documentation** - Document props and usage examples
5. **Testing** - Include visual regression tests

### Quality Checklist
- [ ] Uses design tokens consistently
- [ ] Responsive across all breakpoints
- [ ] Accessible (WCAG 2.1 AA compliant)
- [ ] Performant (no layout shifts)
- [ ] Documented with examples
- [ ] Tested across browsers
- [ ] Optimized images and assets

---

## Design System Governance

### Version Control
- **Semantic Versioning**: Major.Minor.Patch
- **Release Notes**: Document all changes
- **Migration Guides**: For breaking changes

### Usage Guidelines
- **Do**: Use tokens, follow patterns, maintain consistency
- **Don't**: Create one-off styles, break accessibility, ignore mobile

### Support & Maintenance
- **Updates**: Monthly design system reviews
- **Issues**: Track component bugs and requests
- **Training**: Onboard new team members
- **Audits**: Quarterly accessibility and performance reviews

---

*This design system is a living document that evolves with Freaking Minds' brand and product needs. For questions or contributions, contact the design system team.*

**Version**: 1.0  
**Last Updated**: 2024  
**Next Review**: Quarterly