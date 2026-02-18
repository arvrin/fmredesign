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
- **Database**: Supabase (PostgreSQL) — primary backend for admin, client portal, and all data
- **Legacy**: Google Sheets API (leads/discovery forms only)

## Critical: Tailwind v4 Cascade Layer Fix (globals.css)

**IMPORTANT**: Tailwind v4 puts utility classes inside `@layer utilities`, which has **lower priority** than unlayered CSS. This means any bare element selector in globals.css (e.g., `p { margin: 0 }`) will silently override Tailwind utilities like `mx-auto`, `mb-4`, `h-8` on those elements.

### The Root Cause
Unlayered CSS resets on elements (`p`, `h1-h6`, `img`, `input`) in `globals.css` were overriding Tailwind utility classes because CSS cascade layers work like this:
```
@layer base     → lowest priority
@layer utilities → higher, but still lower than unlayered
unlayered CSS   → HIGHEST priority (wins over all layers)
```

### The Fix Applied
All element-level resets in `globals.css` have been moved into `@layer base` so Tailwind utilities properly override them:

```css
/* BEFORE (broken) — unlayered, beats Tailwind utilities */
p { margin: 0; }
img { height: auto; display: block; }

/* AFTER (fixed) — in @layer base, Tailwind utilities win */
@layer base {
  p { margin: 0; }
  img { height: auto; display: block; }
}
```

**Elements fixed**: `p`, `h1-h6`, `img`, `input`, `select`, `textarea`

### What This Means for Development
- `mx-auto` on `<p>` elements now works (previously silently failed)
- `mb-4`, `mb-8`, etc. on `<p>` and headings now work
- `h-8`, `h-12`, etc. on `<img>` elements now work
- Height utilities on `<input>` elements now work
- If you add new element-level resets to globals.css, **always put them inside `@layer base`**

### Text Centering (Still Use Inline Styles)
`text-center` still has issues due to other unlayered CSS conflicts. Continue using inline styles for text-align:

```tsx
// Still use inline style for textAlign
<div style={{ textAlign: 'center' }}>
  <h2 className="v2-text-primary mb-8">Title</h2>
  <p className="v2-text-secondary max-w-2xl mx-auto">Description</p>
</div>
```

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
├── app/
│   ├── admin/              # Admin dashboard (auth-protected)
│   │   ├── auth/           # Login pages
│   │   └── ...             # Dashboard pages (clients, projects, content, team, etc.)
│   ├── api/
│   │   ├── admin/          # Admin APIs (auth, users, support)
│   │   ├── client-portal/  # Client portal APIs (profile, projects, content, etc.)
│   │   │   └── [clientId]/ # All client-scoped endpoints
│   │   ├── shared/[token]/ # Public share link resolver
│   │   └── ...             # Other APIs (clients, projects, invoices, leads, talent)
│   ├── client/             # Client portal
│   │   ├── login/          # Client login page
│   │   └── [clientId]/     # Dashboard pages (overview, projects, content, reports, documents, support, settings)
│   ├── shared/[token]/     # Public shared resource viewer
│   ├── about/, blog/, contact/, services/, work/, get-started/  # Public pages
│   ├── globals.css         # Main CSS with Tailwind v4 config
│   └── middleware.ts       # Route protection (admin + client auth)
├── components/
│   ├── admin/              # Admin-specific components
│   ├── animations/         # GSAP animation components
│   ├── layout/             # Header, Footer
│   ├── layouts/            # V2PageWrapper
│   ├── sections/           # Homepage sections
│   └── ui/                 # Shared UI (Badge, Input, Toggle, tabs)
├── design-system/          # DashboardLayout, Card, Button, MetricCard, IconBox
├── hooks/                  # useAdminAuth, useAdminData, useBreadcrumbs, etc.
├── lib/
│   ├── admin/              # Admin types, auth, services, permissions, rate-limiter
│   ├── client-portal/      # resolve-client, context, status-colors, export
│   ├── supabase.ts         # Supabase admin client
│   └── utils.ts            # cn() classname utility
├── providers/              # Context providers
└── styles/                 # Additional CSS (performance-fixes.css)
```

## Supabase Backend

### Connection
- `src/lib/supabase.ts` — lazy-initialized admin client using `SUPABASE_SERVICE_ROLE_KEY` (full access, no RLS)
- Import: `import { supabaseAdmin } from '@/lib/supabase'`

### Key Tables
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `clients` | Client profiles | id, name, email, slug, portal_password, logo, industry, status, health, account_manager, contract_*, services |
| `projects` | Client projects | id, client_id, name, status, progress, milestones (jsonb), deliverables (jsonb), budget, spent |
| `content_calendar` | Content items | id, client_id, title, status, platform, type, scheduled_date, approved_at, client_feedback, revision_notes |
| `support_tickets` | Support system | id, client_id, subject, status, priority, category, assigned_to |
| `client_documents` | Shared files | id, client_id, name, file_url, file_type, category, file_size |
| `share_links` | Public share tokens | id, client_id, token (unique), resource_type, resource_id, expires_at |
| `client_sessions` | Portal sessions | id, client_id, email, client_name, expires_at |
| `authorized_users` | Admin team members | id, mobile_number, name, email, role, permissions, status |

### resolveClientId Pattern
URL param `[clientId]` can be **slug OR database ID**. Always use the resolver:
```ts
import { resolveClientId } from '@/lib/client-portal/resolve-client';
const resolved = await resolveClientId(clientId); // tries slug first, then id
if (!resolved) return 404;
// Use resolved.id for DB queries, resolved.slug for URLs
```

---

## Authentication

### Admin Auth (Dual Method)
- **Password**: `ADMIN_PASSWORD` env var → HMAC-SHA256 signed session token
- **Mobile**: Lookup in `authorized_users` table by normalized mobile (`+91XXXXXXXXXX`)
- **Cookie**: `fm-admin-session` (httpOnly, secure, 24h expiry)
- **Session format**: `timestamp.hmac_signature` — validated via constant-time comparison
- **API**: `POST /api/admin/auth/password`, `POST /api/admin/auth/mobile`, `GET /api/admin/auth/session`, `POST /api/admin/auth/logout`
- **Auth helper**: `requireAdminAuth(request)` in `src/lib/admin/auth.ts` — use in all admin API routes

### Client Portal Auth
- **Method**: Email + `portal_password` field in `clients` table
- **Cookie**: `fm_client_session` (base64-encoded JSON with clientId, slug, email, expires)
- **Session storage**: `client_sessions` table in Supabase (7-day duration)
- **API**: `POST /api/client-portal/login`, `POST /api/client-portal/logout`

### Middleware (`src/middleware.ts`)
- **Protects**: `/admin/*` (validates HMAC cookie), `/client/*` (validates base64 cookie + expiry)
- **Allows through**: `/admin/auth/*`, `/client/login`
- **Client slug check**: Prevents clients from accessing other clients' portals
- **Does NOT apply to**: Public pages, API routes (APIs do their own auth)

---

## Admin Dashboard

### Architecture
```
/admin/layout.tsx
  ├─ useAdminAuth() hook → validates session via /api/admin/auth/session (polls every 60s)
  ├─ If unauthenticated → redirect to /admin/auth/login
  └─ DashboardLayout variant="admin" with NavigationGroup[] navigation
```

### Admin API Routes
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/admin/auth/password` | POST | Password login |
| `/api/admin/auth/mobile` | POST | Mobile login |
| `/api/admin/auth/session` | GET | Validate session |
| `/api/admin/auth/logout` | POST | Clear session |
| `/api/admin/users` | GET, POST, PUT, DELETE | Manage authorized users |
| `/api/admin/support` | GET, PUT | Admin support ticket management |
| `/api/clients` | GET, POST, PUT | Client CRUD |
| `/api/projects` | GET, POST, PUT | Project CRUD |
| `/api/content` | GET, POST, PUT | Content CRUD |
| `/api/invoices` | GET, POST | Invoice management |
| `/api/proposals` | GET, POST | Proposal management |
| `/api/team` | GET, POST, PUT | Team member management |
| `/api/leads` | GET, POST | Lead management |
| `/api/leads/analytics` | GET | Lead analytics |
| `/api/leads/convert` | POST | Convert lead to client |
| `/api/talent` | GET, POST | CreativeMinds talent |

### Rate Limiting
- `src/lib/admin/rate-limiter.ts` — in-memory sliding window (5 requests/60s per IP)
- Uses `x-forwarded-for` / `x-real-ip` headers
- Returns 429 when exceeded
- **Caveat**: In-memory map resets on serverless cold starts

---

## Client Portal

### Architecture
```
/client/[clientId]/layout.tsx
  ├─ Fetches profile from /api/client-portal/[clientId]/profile
  ├─ ClientPortalProvider context (profile, clientId, slug, refreshProfile)
  └─ DashboardLayout variant="client" with NavigationGroup[] navigation
       Pages: Overview, Projects, Content, Reports, Documents, Support, Settings
```

### Client Portal API Routes
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/client-portal/login` | POST | Client login |
| `/api/client-portal/logout` | POST | Client logout |
| `/api/client-portal/[clientId]/profile` | GET, PUT | Profile read/update |
| `/api/client-portal/[clientId]/projects` | GET | List projects |
| `/api/client-portal/[clientId]/content` | GET, PUT | Content + approval workflow |
| `/api/client-portal/[clientId]/reports` | GET | Performance reports |
| `/api/client-portal/[clientId]/documents` | GET | Document vault |
| `/api/client-portal/[clientId]/activity` | GET | Activity feed |
| `/api/client-portal/[clientId]/share` | GET, POST, DELETE | Share link CRUD |
| `/api/client-portal/[clientId]/support/tickets` | GET, POST | Support tickets |
| `/api/shared/[token]` | GET | Public share link resolver |

### useClientPortal() Hook
```tsx
const { profile, clientId, slug, refreshProfile } = useClientPortal();
// profile: ClientProfile (name, logo, industry, status, health, contractDetails, etc.)
// clientId: actual database ID (NOT the URL slug)
// slug: URL-friendly identifier
// refreshProfile: () => void — call after saving profile changes
```

### Key Shared Utilities (`src/lib/client-portal/`)
- `resolve-client.ts` — `resolveClientId(slugOrId)` → `{id, slug} | null`
- `context.tsx` — `ClientPortalProvider` + `useClientPortal()` hook
- `status-colors.ts` — `getStatusColor()`, `getPriorityColor()`, `getHealthColor()`
- `export.ts` — `downloadCSV(filename, headers, rows)`

---

## Critical: DashboardLayout Navigation

`DashboardLayout` expects **`NavigationGroup[]`**, NOT a flat array of items.

```tsx
// CORRECT — wrapped in a group
const navigation = [
  {
    title: 'Main',  // optional section header
    items: [
      { label: 'Dashboard', href: '/admin', icon: <Icon /> },
      { label: 'Projects', href: '/admin/projects', icon: <Icon /> },
    ],
  },
];

// WRONG — flat array (sidebar will be empty, pages appear as 404)
const navigation = [
  { label: 'Dashboard', href: '/admin', icon: <Icon /> },
];
```

**Types:**
```ts
interface NavigationGroup { title?: string; items: NavigationItem[]; }
interface NavigationItem { label: string; href: string; icon?: ReactNode; badge?: string | number; }
```

### Dashboard Component Variants
- `DashboardCard variant="admin"` — magenta gradient bg, backdrop-blur
- `DashboardCard variant="client"` — v2-paper white card with soft shadow
- `DashboardButton variant="admin"` — magenta gradient with shadow
- `DashboardButton variant="client"` — magenta gradient with glow + rounded

---

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

### 1. CSS Not Applying / Tailwind Utilities Silently Failing (FIXED)
- **Symptom**: Tailwind classes like `mx-auto`, `mb-4`, `h-8` not working on `<p>`, headings, `<img>`, or form elements
- **Root Cause**: Unlayered element resets in `globals.css` (`p { margin: 0 }`, `img { height: auto }`, etc.) had higher cascade priority than `@layer utilities`
- **Solution**: All element resets moved into `@layer base` in `globals.css`. If you add new element-level CSS, always wrap it in `@layer base`
- **Note**: `text-center` still needs inline `style={{ textAlign: 'center' }}` due to separate unlayered conflicts

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
# Supabase (required for admin + client portal)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Admin auth
ADMIN_PASSWORD=your_secure_password

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Sheets (legacy — leads/discovery only)
GOOGLE_SHEETS_PRIVATE_KEY=...
GOOGLE_SHEETS_CLIENT_EMAIL=...
GOOGLE_SHEETS_SPREADSHEET_ID=...
```

## Workflow Rules

### Before Starting Implementation
- **Confirm existing state first**: Before starting any implementation, scan the codebase and identify what's already built and working. Do NOT re-plan or re-implement completed work. Ask the user if unsure rather than assuming prior work is incomplete.
- **Present UI approach before coding**: For visual/design changes (hero sections, page layouts, color schemes, component redesigns), describe the planned approach in 3-5 bullet points and get approval BEFORE writing code.

### During Implementation
- **Never ignore TypeScript errors**: Always fix them properly. Treat build errors as blockers that must be resolved before considering a task complete. Never suggest `@ts-ignore`, `any` casts, or suppressing errors.
- **Verification sweep after multi-file changes**: When implementing changes across many files (design system migration, refactoring, pattern replacement), do a grep-based verification sweep AFTER the main implementation to catch missed instances. Search for remaining old patterns before declaring the task complete.

### Before Declaring Done
- **Build must pass**: Run `npm run build` (or at minimum `npx tsc --noEmit`) before declaring any task complete. A task with build errors is NOT complete.
- **All files must be staged**: Before pushing to git, run `git status` and ensure ALL modified and newly created files are included. Check that imports reference files that exist in the repo.

---

## Do's and Don'ts

### Do — Public Pages
- Use `V2PageWrapper` for all public pages
- Use inline styles for `textAlign` on section headers
- Use `v2-paper` variants for cards, `v2-accent` for gradient highlights
- Use `text-fm-neutral-900` for headings, `text-fm-neutral-600` for body text on white cards

### Do — Backend / Dashboards
- Use `resolveClientId()` in all client portal API routes (handles slug OR ID)
- Use `requireAdminAuth(request)` in all admin API routes
- Wrap navigation in `NavigationGroup[]` for `DashboardLayout` (not flat arrays)
- Use `variant="client"` for client portal components, `variant="admin"` for admin
- Use `useClientPortal()` hook in all client portal pages
- Use `getStatusColor()` / `getPriorityColor()` from `src/lib/client-portal/status-colors.ts`
- Add new element-level CSS inside `@layer base` in globals.css

### Don't
- Pass flat `NavigationItem[]` to `DashboardLayout` — wrap in `{ items: [...] }`
- Use `text-center` class directly (use inline `style={{ textAlign: 'center' }}`)
- Add `!important` rules to fix CSS issues (find root cause instead)
- Add element-level CSS outside of `@layer base` — it will override Tailwind utilities
- Access Supabase tables without RLS awareness — admin client bypasses RLS
- Store secrets in client-side code — use `NEXT_PUBLIC_` prefix only for public values
- Mix V1 and V2 design patterns

## Related Documentation

- `FREAKING-MINDS-DESIGN-SYSTEM.md` - Original design system docs
- `DEVELOPMENT-GUIDELINES.md` - Development standards
- `AI_TECHNICAL_ARCHITECTURE.md` - Technical architecture details
- `PROJECT_DOCUMENTATION.md` - Project overview
