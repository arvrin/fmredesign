# CLAUDE.md - FreakingMinds Website

Project-specific instructions for Claude Code when working on this codebase.

## Project Overview

FreakingMinds is a digital marketing agency website built with Next.js 15 and Tailwind CSS v4. The site features a V2 design system with a dark magenta/purple theme, 3D brain mascot decorations, and glass-morphism effects.

## Tech Stack

- **Framework**: Next.js 15.5.0 (App Router)
- **React**: 19.1.0
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Animations**: GSAP 3.14.2
- **Smooth Scroll**: Lenis 1.3.17
- **Icons**: Lucide React
- **Backend**: Google Sheets API (for data storage)

## Critical: Text Centering Fix

**IMPORTANT**: Tailwind's `text-center` class has issues at larger screen widths due to CSS Cascade Layers in Tailwind v4.

### The Problem
- `text-center` class works at smaller viewports but fails at fullscreen/larger widths
- Computed styles show `center` but visual output is `left-aligned`
- Root cause: CSS Cascade Layer conflicts in Tailwind v4

### The Solution
**Always use inline styles for text-align on V2 pages:**

```tsx
// BAD - Don't do this
<div className="text-center mb-16">
  <h2 className="v2-text-primary text-center mb-8">Title</h2>
  <p className="v2-text-secondary text-center max-w-2xl mx-auto">Description</p>
</div>

// GOOD - Do this instead
<div className="max-w-3xl mx-auto" style={{ textAlign: 'center', marginBottom: '64px' }}>
  <h2 className="v2-text-primary mb-8 leading-tight">Title</h2>
  <p className="v2-text-secondary leading-relaxed">Description</p>
</div>
```

### Key Pattern
1. Put `textAlign: 'center'` as inline style on parent container
2. Remove redundant `text-center` classes from children
3. Use inline style for `marginBottom` on section headers
4. Child elements inherit text-align from parent

## V2 Design System

### Color Variables
```css
/* Brand Colors */
--color-fm-magenta-600: #c9325d  /* Primary brand color */
--color-fm-magenta-700: #a82548
--color-fm-magenta-800: #8c213d
--color-fm-purple-700: #4a1942

/* Neutral Colors (Enhanced for readability) */
--color-fm-neutral-500: #525251  /* Body text on white */
--color-fm-neutral-600: #404040  /* Body text on white */
--color-fm-neutral-700: #2d2d2d  /* Strong text */
--color-fm-neutral-900: #0f0f0f  /* Headings on white (near black) */
```

### Text Classes

**On Dark Backgrounds (V2PageWrapper):**
- `v2-text-primary`: White text (100% opacity) - for headings
- `v2-text-secondary`: White text (85% opacity) - for body text
- `v2-text-tertiary`: White text (70% opacity) - for captions
- `v2-accent`: Magenta-to-orange gradient text - for headline highlights

**On White Cards (v2-paper):**
- `text-fm-neutral-900`: Near black (#0f0f0f) - for headings
- `text-fm-neutral-700`: Dark grey (#2d2d2d) - for subheadings
- `text-fm-neutral-600`: Medium grey (#404040) - for body text
- `text-fm-magenta-600`: Brand magenta - for accent text in headings

### Card System
- `v2-paper`: Standard cards with magenta-tinted shadows
- `v2-paper-sm`: Smaller cards (stats, badges)
- `v2-paper-lg`: Large featured cards

### Button Classes
**On Dark Backgrounds:**
- `v2-btn v2-btn-primary`: White button with dark text
- `v2-btn v2-btn-secondary`: Glass button with white text

**On White Cards:**
- `v2-btn v2-btn-magenta`: Magenta gradient button
- `v2-btn v2-btn-outline`: Outlined button

### Badge Classes
- `v2-badge v2-badge-glass`: Glass effect badge
- `v2-badge v2-badge-gradient`: Gradient background badge
- `v2-badge v2-badge-outline`: Outlined badge
- `v2-badge v2-badge-solid`: Solid background badge

### Layout Classes
- `v2-container`: Standard container with responsive padding
- `v2-container-narrow`: Narrower max-width
- `v2-container-wide`: Wider max-width
- `v2-section`: Standard section padding

## File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── admin/             # Admin dashboard (protected)
│   ├── api/               # API routes
│   ├── blog/              # Blog page
│   ├── client/            # Client portal
│   ├── contact/           # Contact page
│   ├── creativeminds/     # Talent network page
│   ├── get-started/       # Lead generation page
│   ├── services/          # Services page
│   ├── showcase/          # Design showcase (dev only)
│   ├── work/              # Portfolio/case studies
│   ├── globals.css        # Main CSS with Tailwind v4 config
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── admin/             # Admin-specific components
│   ├── animations/        # GSAP animation components
│   ├── layout/            # Header, Footer, etc.
│   ├── layouts/           # Page wrappers (V2PageWrapper)
│   ├── sections/          # Homepage section components
│   └── ui/                # Reusable UI components
├── design-system/         # Design tokens and utilities
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and API clients
├── providers/             # Context providers
└── styles/                # Additional CSS files
```

## Key Components

### V2PageWrapper
Wraps all V2 pages with the dark gradient background and star animations.
```tsx
import { V2PageWrapper } from "@/components/layouts/V2PageWrapper";

export default function Page() {
  return (
    <V2PageWrapper>
      {/* Page content */}
    </V2PageWrapper>
  );
}
```

### Section Components (Homepage)
- `HeroSectionV2`: Main hero with 3D brain mascot
- `ServicesSectionV2`: Horizontal scroll services
- `FeaturesSectionV2`: Why choose us section
- `TestimonialsSectionV2`: Client testimonials
- `CTASectionV2`: Call to action

### 3D Brain Decorations
```tsx
<div className="absolute left-8 lg:left-20 top-1/3 hidden lg:block z-10">
  <img
    src="/3dasset/brain-learning.png"  // or brain-celebrating, brain-strategy, etc.
    alt="Description"
    className="w-28 lg:w-36 h-auto animate-v2-hero-float drop-shadow-2xl"
    style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
  />
</div>
```

Available brain assets:
- `/3dasset/brain-learning.png`
- `/3dasset/brain-celebrating.png`
- `/3dasset/brain-strategy.png`
- `/3dasset/brain-creative.png`
- `/3dasset/brain-teaching.png`

## Common Patterns

### Page Section Header
```tsx
<div className="max-w-3xl mx-auto" style={{ textAlign: 'center', marginBottom: '64px' }}>
  <div className="v2-badge v2-badge-glass mb-6">
    <Icon className="w-4 h-4 v2-text-primary" />
    <span className="v2-text-primary">Badge Text</span>
  </div>
  <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold v2-text-primary mb-8 leading-tight">
    Section <span className="v2-accent">Title</span>
  </h2>
  <p className="text-lg md:text-xl v2-text-secondary leading-relaxed">
    Section description text goes here.
  </p>
</div>
```

### CTA Section on White Card
```tsx
<div className="v2-paper rounded-3xl p-10 lg:p-14" style={{ textAlign: 'center' }}>
  <h2 className="font-display text-3xl font-bold text-fm-neutral-900 mb-6">
    CTA <span className="text-fm-magenta-600">Title</span>
  </h2>
  <p className="text-fm-neutral-600 mb-8 max-w-xl mx-auto">
    Description text
  </p>
  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
    <Link href="/get-started" className="v2-btn v2-btn-magenta">
      Primary CTA
      <ArrowRight className="w-5 h-5" />
    </Link>
    <Link href="/contact" className="v2-btn v2-btn-outline">
      Secondary CTA
    </Link>
  </div>
</div>
```

## Development Commands

```bash
npm run dev          # Start development server
npm run dev:turbo    # Start with Turbopack (faster)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Known Issues & Solutions

### 1. CSS Not Applying
- **Symptom**: Tailwind classes not working as expected
- **Solution**: Use inline styles for critical properties (especially `text-align`)

### 2. Hydration Mismatch with Stars
- **Symptom**: Console errors about hydration
- **Solution**: Stars are generated client-side in `V2PageWrapper` using `useEffect`

### 3. Performance Issues with Animations
- **Symptom**: Lag on contact section
- **Solution**: Performance fixes applied in `src/styles/performance-fixes.css`

### 4. Google Sheets API Errors
- **Symptom**: Fetch errors in admin
- **Solution**: Check `.env.local` credentials and Google Sheets API setup

### 5. Text Readability (FIXED)
- **Symptom**: Grey text hard to read, headings not popping
- **Root Cause**: Neutral colors were too light (e.g., `#717168`, `#545450`)
- **Solution**: Updated neutral color palette in globals.css to darker values:
  - `neutral-500`: `#717168` → `#525251`
  - `neutral-600`: `#545450` → `#404040`
  - `neutral-700`: `#3d3d3a` → `#2d2d2d`
  - `neutral-900`: `#18181b` → `#0f0f0f` (near black)
- **Also**: `v2-accent` now uses gradient for more visual impact

## Environment Variables

Required in `.env.local`:
```
GOOGLE_SHEETS_PRIVATE_KEY=...
GOOGLE_SHEETS_CLIENT_EMAIL=...
GOOGLE_SHEETS_SPREADSHEET_ID=...
NEXT_PUBLIC_SITE_URL=...
```

## Do's and Don'ts

### Do
- Use `V2PageWrapper` for all public pages
- Use inline styles for `textAlign` on section headers
- Follow the V2 design system patterns
- Use `v2-paper` variants for cards
- Add 3D brain decorations to major sections
- Use `text-fm-neutral-900` for headings on white cards (near black)
- Use `text-fm-neutral-600` for body text on white cards
- Use `text-fm-magenta-600` for accent/highlight text on white cards
- Use `v2-accent` class for gradient highlights in headings on dark backgrounds

### Don't
- Use `text-center` class directly on paragraphs with `v2-text-secondary`
- Mix V1 and V2 design patterns
- Add `!important` rules to fix CSS issues (find root cause instead)
- Modify globals.css cascade layers without understanding Tailwind v4
- Use lighter neutral colors (400, 500) for body text - they lack contrast
- Use plain `text-fm-neutral-500` for important text - too light

## Related Documentation

- `FREAKING-MINDS-DESIGN-SYSTEM.md` - Original design system docs
- `DEVELOPMENT-GUIDELINES.md` - Development standards
- `AI_TECHNICAL_ARCHITECTURE.md` - Technical architecture details
- `PROJECT_DOCUMENTATION.md` - Project overview
