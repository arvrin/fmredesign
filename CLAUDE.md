# CLAUDE.md - FreakingMinds Website

Project-specific instructions for Claude Code when working on this codebase.

## Project Overview

FreakingMinds is a digital marketing agency platform built with Next.js 15 and Tailwind CSS v4. It includes:
- **Public website** — Marketing site with V2 dark magenta/purple theme, 3D brain decorations, glass-morphism
- **Admin dashboard** — Full agency management (clients, projects, content, invoices, proposals, leads, team, discovery, talent, contracts, social publishing, audit)
- **Client portal** — Client-facing dashboard (project tracking, content approval, contracts, documents, reports, support)
- **CreativeMinds** — Talent marketplace for freelance creatives
- **Blog** — Hardcoded blog with SEO (sitemap, JSON-LD, Open Graph)

## Tech Stack

- **Framework**: Next.js 15.5.12 (App Router)
- **React**: 19.1.0
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Animations**: GSAP 3.14.2 (ScrollTrigger, custom hooks)
- **Icons**: Lucide React
- **Forms**: react-hook-form + Zod (installed; Zod schemas in use for API validation, forms partially migrated)
- **Database**: Supabase (PostgreSQL) — primary backend for admin, client portal, and all data
- **Data Fetching**: @tanstack/react-query 5.x (admin hooks), @tanstack/react-table 8.x (data tables)
- **URL State**: nuqs 2.x (URL query string state management)
- **PDF**: jsPDF + jspdf-autotable (invoice/proposal PDF generation)
- **Email**: Resend 6.x (transactional email — optional, graceful degradation if key not set)
- **Social**: Meta Graph API v21.0 (Facebook/Instagram publishing — optional)
- **Background Jobs**: Inngest 3.x (durable job queue — retries, step functions, observability)
- **Auth**: bcryptjs (password hashing), HMAC-SHA256 (session signing)
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
│   │   ├── auth/login/     # Admin login page
│   │   ├── audit/          # Audit log viewer
│   │   ├── clients/        # Client list + [clientId] detail
│   │   ├── content/        # Content calendar + [id] detail/edit + new
│   │   ├── creativeminds/  # Talent pool management
│   │   ├── discovery/      # Discovery sessions + [id]/report + new
│   │   ├── invoice/        # Single invoice form
│   │   ├── invoices/       # Invoice list
│   │   ├── leads/          # Lead management + analytics
│   │   ├── projects/       # Project list + [id] detail/edit + new
│   │   ├── proposals/      # Proposal list
│   │   ├── scraped-contacts/ # Scraped contacts + scrape-jobs sub-page
│   │   ├── settings/       # App settings
│   │   ├── support/        # Support ticket management
│   │   ├── system/         # System diagnostics
│   │   ├── team/           # Team list + [memberId] detail/edit/assignments/documents/performance + new
│   │   └── users/          # Authorized user management (roles/permissions)
│   ├── api/
│   │   ├── admin/          # Admin APIs (auth, users, support, audit, social, messages, notifications, growth, scrape-jobs, webhooks, api-keys, settings, documents)
│   │   │   ├── api-keys/        # External API key management
│   │   │   ├── content/generate/ # AI content generation
│   │   │   ├── documents/       # Document management (CRUD, download, health, preview, storage)
│   │   │   ├── invoice-sequence/ # Invoice numbering API (persistent, Supabase-backed)
│   │   │   ├── scrape-jobs/     # Web scraping job management APIs (CRUD, config, execute, runs)
│   │   │   ├── scraped-contacts/ # Scraped contact management
│   │   │   ├── social/          # Social publishing APIs (accounts, publish, verify-token)
│   │   │   ├── upload-logo/     # Client logo upload
│   │   │   └── webhooks/        # Outgoing webhook management
│   │   ├── client-portal/  # Client portal APIs (profile, projects, content, contracts, etc.)
│   │   │   └── [clientId]/ # All client-scoped endpoints
│   │   ├── contracts/      # Contract CRUD API
│   │   ├── shared/[token]/ # Public share link resolver
│   │   ├── discovery/      # Discovery session API
│   │   ├── talent/         # CreativeMinds talent API + [slug]
│   │   └── ...             # Other APIs (clients, projects, invoices, leads, proposals, team, content)
│   ├── client/             # Client portal
│   │   ├── login/          # Client login page
│   │   └── [clientId]/     # Dashboard pages (overview, projects, content, contracts, reports, documents, support, settings)
│   ├── shared/[token]/     # Public shared resource viewer (documents, reports, content)
│   ├── creativeminds/      # Public talent application page
│   ├── talent/[slug]/      # Public talent profile viewer
│   ├── blog/               # Blog list + [slug] detail
│   ├── get-started/        # Lead capture / onboarding form
│   ├── about/, contact/, services/, work/  # Public pages
│   ├── privacy/, terms/    # Legal pages
│   ├── diagnostic/         # Design system diagnostic (dev only)
│   ├── wehave/             # Page index / sitemap (dev only)
│   ├── showcase/           # Design prototypes (dev only: navbars, footers, headings, etc.)
│   ├── sitemap.ts          # Dynamic sitemap generation (static pages + blog posts)
│   ├── robots.ts           # Robots.txt (disallows /admin, /client, /api, /diagnostic, /wehave, /showcase)
│   ├── globals.css         # Main CSS with Tailwind v4 config
│   └── layout.tsx          # Root layout (fonts, JSON-LD, analytics pixel)
├── components/
│   ├── admin/              # Admin components (modals, forms, dashboards)
│   │   ├── client-detail/  # Client detail page sections
│   │   ├── creativeminds/  # Talent pool management UI
│   │   ├── discovery/      # Discovery wizard section components
│   │   ├── leads/          # Lead pipeline management UI
│   │   ├── scrape-jobs/    # Scrape job management UI
│   │   ├── scraped-contacts/ # Scraped contacts UI
│   │   └── social/         # Social publishing (PublishButton, SocialAccountsPanel, SocialPublishStatus)
│   ├── animations/         # GSAP animation components
│   ├── layout/             # Header, Footer, ConditionalLayout
│   ├── layouts/            # V2PageWrapper
│   ├── public/             # TalentApplicationForm
│   ├── sections/           # Homepage sections (Hero, Services, Features, Testimonials, CTA)
│   └── ui/                 # Shared UI (Badge, Input, Toggle, tabs)
├── design-system/          # DashboardLayout, Card, Button, MetricCard, IconBox
├── hooks/                  # useAdminAuth, useAdminData, useBreadcrumbs, useCountUp, useGSAP, useMagneticEffect, useAdminFilters
│   └── admin/              # useClientDetail, useTeamMembers, useSocialAccounts, useCreativeMinds, useLeads, useScrapedContacts, useScrapeJobs
├── lib/
│   ├── admin/              # Admin types, auth, services, permissions, audit-log, PDF generators
│   │   ├── permissions.ts  # Role-based permission system (23 permissions, 5 roles)
│   │   ├── audit-log.ts    # Admin action audit logging
│   │   ├── invoice-numbering.ts  # API-backed invoice numbering (FM164/2025 format, Supabase persistence, localStorage fallback)
│   │   ├── proposal-numbering.ts # Auto-incrementing proposal numbers
│   │   ├── pdf-simple.ts   # Invoice PDF generator (jsPDF) — GST-compliant, multi-currency, SAC codes
│   │   ├── proposal-pdf-generator.ts # Proposal PDF generator
│   │   ├── discovery-service.ts # Discovery session CRUD
│   │   ├── discovery-types.ts # Discovery session types (10-section wizard)
│   │   ├── talent-types.ts # CreativeMinds talent pool types
│   │   ├── lead-types.ts   # Lead scoring and management types
│   │   ├── client-service.ts # Client service (API client pattern)
│   │   ├── client-types.ts # Rich client profile types
│   │   ├── contract-types.ts # Contract status, interface, transform helpers
│   │   ├── contract-templates.ts # Pre-defined contract templates
│   │   ├── proposal-types.ts # Proposal types
│   │   ├── api.ts          # Admin API helper utilities
│   │   ├── auth.ts         # Admin auth helpers
│   │   ├── toast.ts        # Admin toast notification utility
│   │   └── types.ts        # Core admin types (company info via env vars)
│   ├── client-portal/      # resolve-client, context, status-colors, export
│   ├── social/             # Social publishing (meta-api, publish-engine, token-crypto, types)
│   ├── email/              # Email notifications (Resend integration — send.ts, resend.ts)
│   ├── webhooks/           # Outgoing webhooks (deliver.ts, processor.ts, verify.ts)
│   ├── validations/        # Zod schemas (schemas.ts) — shared by API routes + forms
│   ├── api-key-auth.ts     # API key authentication (validateApiKey)
│   ├── admin-auth-middleware.ts  # requireAdminAuth() — admin API route guard
│   ├── client-session.ts   # requireClientAuth(), session cookies — client API route guard
│   ├── rate-limiter.ts     # In-memory rate limiter (5 req/60s per IP)
│   ├── env.ts              # Zod-validated environment variables
│   ├── blog-data.ts        # Hardcoded blog posts (add new posts here)
│   ├── notifications.ts    # In-app notification system (createNotification, notifyAdmins, notifyClient)
│   ├── supabase.ts         # Supabase admin client (getSupabaseAdmin + legacy supabaseAdmin Proxy)
│   ├── supabase-utils.ts   # Supabase helper utilities
│   └── utils.ts            # cn() classname utility
├── providers/              # SmoothScrollProvider (disabled — passes through)
├── middleware.ts           # Edge Runtime route protection (admin + client auth)
└── styles/                 # Additional CSS (performance-fixes.css)
```

## Supabase Backend

### Connection
- `src/lib/supabase.ts` — lazy-initialized admin client using `SUPABASE_SERVICE_ROLE_KEY` (full access, no RLS)
- **Preferred import**: `import { getSupabaseAdmin } from '@/lib/supabase'` — call `getSupabaseAdmin()` to get the client
- **Legacy import**: `import { supabaseAdmin } from '@/lib/supabase'` — still works via Proxy (backward compatible), but prefer the function

### Key Tables
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `clients` | Client profiles | id, name, email, slug, portal_password, logo, industry, status, health, account_manager, contract_*, services |
| `projects` | Client projects | id, client_id, name, status, progress, milestones (jsonb), deliverables (jsonb), budget, spent |
| `content_calendar` | Content items | id, project_id, client_id, title, description, content, status, platform, type, scheduled_date, published_date, author, assigned_designer, assigned_writer, image_url, video_url, hashtags[], mentions[], tags[], files[], client_feedback, revision_notes, approved_at, meta_post_id, last_publish_error, engagement (jsonb: likes/comments/shares/reach/impressions) |
| `contracts` | Client contracts | id, client_id, title, type, status, start_date, end_date, value, terms, template |
| `social_accounts` | Connected social accounts | id, client_id, platform, account_name, page_id, access_token (encrypted), is_active |
| `notifications` | In-app notifications | id, client_id, user_id, type, title, message, priority, action_url, read, created_at |
| `support_tickets` | Support system | id, client_id, subject, status, priority, category, assigned_to |
| `client_documents` | Shared files | id, client_id, name, file_url, file_type, category, file_size |
| `share_links` | Public share tokens | id, client_id, token (unique), resource_type, resource_id, expires_at |
| `client_sessions` | Portal sessions | id, client_id, email, client_name, expires_at |
| `authorized_users` | Admin team members | id, mobile_number, name, email, role, permissions, status |
| `admin_audit_log` | Audit trail | id, user_id, user_name, action, resource_type, resource_id, details (jsonb), ip_address, created_at |
| `leads` | Lead capture (get-started form) | id, name, email, phone, company, budget, services, source, status, score, notes, created_at |
| `invoices` | Invoice management | id, client_id, invoice_number, line_items (jsonb), subtotal, tax_rate, tax_amount, total, status, due_date, currency, cgst_amount, sgst_amount, igst_amount, place_of_supply, company_gstin |
| `invoice_sequences` | Persistent invoice numbering | id, prefix, current_counter, current_year, updated_at |
| `proposals` | Proposal management | id, client_id, proposal_number, title, sections (jsonb), total, status, valid_until |
| `talent_applications` | CreativeMinds applications | id, name, email, phone, category, skills, portfolio_url, experience, status |
| `team_members` | Agency team profiles | id, name, email, role, department, skills, avatar_url, status |
| `team_assignments` | Team member project assignments | id, team_member_id, client_id, project_id, role, hours_allocated, status |
| `ticket_replies` | Support ticket replies | id, ticket_id, sender, message, created_at |
| `admin_settings` | Admin configuration | id, key, value, updated_at |
| `api_keys` | External API key management | id, name, key_hash, permissions, last_used_at, status |
| `client_messages` | Client messaging | id, client_id, sender, message, read, created_at |
| `scrape_jobs` | Web scraping job definitions | id, name, source_type, config (jsonb), status, schedule |
| `scrape_job_runs` | Scrape job execution logs | id, job_id, status, results_count, started_at, completed_at |
| `scraped_contacts` | Scraped contact data | id, job_id, name, email, phone, company, source |
| `outgoing_webhooks` | Webhook definitions | id, name, url, events, secret, status |
| `outgoing_webhook_deliveries` | Webhook delivery logs | id, webhook_id, event, payload, response_code, delivered_at |

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
- **Cookie**: `fm-admin-session` (httpOnly, secure, sameSite=lax, 24h expiry)
- **Session format**: `timestamp.hmac_signature` — validated via constant-time comparison
- **Password comparison**: Uses `crypto.timingSafeEqual` (timing-attack safe)
- **Rate limiting**: 5 attempts/minute per IP on both password and mobile login
- **API**: `POST /api/admin/auth/password`, `POST /api/admin/auth/mobile`, `GET /api/admin/auth/session`, `POST /api/admin/auth/logout`
- **Auth helper**: `requireAdminAuth(request)` in `src/lib/admin-auth-middleware.ts` — use in **all** admin API routes

### Client Portal Auth
- **Method**: Email + `portal_password` field in `clients` table (bcrypt hashed, with auto-upgrade from legacy plaintext)
- **Cookie**: `fm_client_session` (HMAC-signed: `base64payload.hmac_signature`, httpOnly, secure, sameSite=lax, 7-day expiry)
- **Cookie signing**: HMAC-SHA256 using `ADMIN_PASSWORD` as key — prevents forgery. Signature verified with constant-time comparison.
- **Session storage**: `client_sessions` table in Supabase (7-day duration)
- **Rate limiting**: 5 attempts/minute per IP on login endpoint
- **API**: `POST /api/client-portal/login`, `POST /api/client-portal/logout`
- **Auth helper**: `requireClientAuth(request, clientId)` in `src/lib/client-session.ts` — use in **all** client portal API routes. Validates signed cookie AND ensures session belongs to the requested clientId.

### Middleware (`src/middleware.ts`)
- **Runtime**: Edge Runtime — uses Web Crypto API (`crypto.subtle`), NOT Node.js `crypto`
- **Protects**: `/admin/*` (validates HMAC session cookie), `/client/*` (validates HMAC-signed session cookie + expiry)
- **Allows through**: `/admin/auth/*`, `/client/login`
- **Cross-client prevention**: Compares session's clientId/slug against URL's clientId — redirects to own portal if mismatch
- **Does NOT apply to**: Public pages, API routes (APIs do their own auth via `requireAdminAuth`/`requireClientAuth`)

---

## Admin Dashboard

### Architecture
```
/admin/layout.tsx
  ├─ useAdminAuth() hook → validates session via /api/admin/auth/session (polls every 60s)
  ├─ If unauthenticated → redirect to /admin/auth/login
  └─ DashboardLayout variant="admin" with NavigationGroup[] navigation
```

### Admin Pages (34 total)
| Route | Purpose |
|-------|---------|
| `/admin` | Main dashboard (overview metrics) |
| `/admin/clients` | Client list |
| `/admin/clients/[clientId]` | Client detail |
| `/admin/projects` | Project list |
| `/admin/projects/[id]` | Project detail |
| `/admin/projects/[id]/edit` | Edit project |
| `/admin/projects/new` | Create project |
| `/admin/content` | Content calendar |
| `/admin/content/[id]` | Content detail |
| `/admin/content/[id]/edit` | Edit content |
| `/admin/content/new` | Create content |
| `/admin/team` | Team list |
| `/admin/team/[memberId]` | Member detail |
| `/admin/team/[memberId]/edit` | Edit member |
| `/admin/team/[memberId]/assignments` | Member assignments |
| `/admin/team/[memberId]/documents` | Member documents |
| `/admin/team/[memberId]/performance` | Member performance |
| `/admin/team/new` | Add team member |
| `/admin/invoices` | Invoice list |
| `/admin/invoice` | Create invoice |
| `/admin/proposals` | Proposal list |
| `/admin/leads` | Lead pipeline |
| `/admin/discovery` | Discovery sessions |
| `/admin/discovery/new` | New discovery |
| `/admin/discovery/[id]/report` | Discovery report |
| `/admin/creativeminds` | Talent pool management |
| `/admin/scraped-contacts` | Scraped contacts dashboard |
| `/admin/scraped-contacts/scrape-jobs` | Scrape job management |
| `/admin/support` | Support tickets |
| `/admin/users` | Authorized users (RBAC) |
| `/admin/audit` | Audit log |
| `/admin/settings` | App settings |
| `/admin/system` | System diagnostics |

### Admin API Routes
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/admin/auth/password` | POST | Password login |
| `/api/admin/auth/mobile` | POST | Mobile login |
| `/api/admin/auth/session` | GET | Validate session |
| `/api/admin/auth/logout` | POST | Clear session |
| `/api/admin/users` | GET, POST, PUT, DELETE | Manage authorized users |
| `/api/admin/api-keys` | GET, POST, PUT, DELETE | External API key management |
| `/api/admin/support` | GET, PUT | Admin support ticket management |
| `/api/admin/audit` | GET | Audit log viewer (filterable by resource_type, action) |
| `/api/admin/messages` | GET, POST | Admin messaging system |
| `/api/admin/notifications` | GET, POST | In-app notification management |
| `/api/admin/growth` | GET | Growth metrics/analytics |
| `/api/admin/settings` | GET, PUT | Admin app settings |
| `/api/admin/invoice-sequence` | GET, POST | Persistent invoice numbering (preview/increment) |
| `/api/admin/upload-logo` | POST | Client logo upload |
| `/api/admin/content/generate` | POST | AI content generation |
| `/api/admin/documents` | GET, POST, PUT, DELETE | Document management |
| `/api/admin/documents/download` | GET | Document file download |
| `/api/admin/documents/health` | GET | Document storage health check |
| `/api/admin/documents/preview` | GET | Document preview |
| `/api/admin/documents/storage` | GET | Document storage info |
| `/api/admin/scrape-jobs` | GET, POST, PUT, DELETE | Web scraping job CRUD |
| `/api/admin/scrape-jobs/config` | GET, POST | Scrape job configuration |
| `/api/admin/scrape-jobs/execute` | POST | Execute a scrape job |
| `/api/admin/scrape-jobs/runs` | GET | Scrape job execution history |
| `/api/admin/scraped-contacts` | GET, POST, PUT, DELETE | Scraped contact management |
| `/api/admin/webhooks` | GET, POST, PUT, DELETE | Outgoing webhook management |
| `/api/admin/social/accounts` | GET, POST, PUT, DELETE | Social media account CRUD |
| `/api/admin/social/publish` | POST | Publish content to Meta (Facebook/Instagram) |
| `/api/admin/social/verify-token` | POST | Verify Meta Graph API access token |
| `/api/clients` | GET, POST, PUT | Client CRUD |
| `/api/projects` | GET, POST, PUT | Project CRUD (supports `?id=xxx` single-item fetch) |
| `/api/content` | GET, POST, PUT, DELETE | Content CRUD (supports `?id=xxx` single-item fetch, server-side pagination `?page=X&pageSize=Y`, filters `?status=&type=&platform=&startDate=&endDate=`) |
| `/api/contracts` | GET, POST, PUT, DELETE | Contract CRUD |
| `/api/invoices` | GET, POST, PUT, DELETE | Invoice management (pagination `?page=X&pageSize=Y`, filters `?clientId=&status=&search=`) |
| `/api/proposals` | GET, POST, PUT, DELETE | Proposal management |
| `/api/team` | GET, POST, PUT | Team member management |
| `/api/leads` | GET, POST | Lead management |
| `/api/leads/analytics` | GET | Lead analytics |
| `/api/leads/convert` | POST | Convert lead to client |
| `/api/talent` | GET, POST | CreativeMinds talent applications |
| `/api/talent/[slug]` | GET | Individual talent profile |
| `/api/discovery` | GET, POST | Discovery session CRUD |

### Rate Limiting
- `src/lib/rate-limiter.ts` — in-memory sliding window (5 requests/60s per IP)
- Applied to: admin login (password + mobile), client portal login
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
       Pages: Overview, Projects, Content, Contracts, Reports, Documents, Support, Settings
```

### Client Portal API Routes
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/client-portal/login` | POST | Client login |
| `/api/client-portal/logout` | POST | Client logout |
| `/api/client-portal/[clientId]/auth` | GET | Verify client auth for specific client |
| `/api/client-portal/[clientId]/profile` | GET, PUT | Profile read/update |
| `/api/client-portal/[clientId]/projects` | GET | List projects |
| `/api/client-portal/[clientId]/content` | GET, PUT | Content + approval workflow |
| `/api/client-portal/[clientId]/contracts` | GET, POST, PUT | Client contract management |
| `/api/client-portal/[clientId]/proposals` | GET, POST, PUT | Client proposal viewing/updates |
| `/api/client-portal/[clientId]/notifications` | GET, POST | Client notifications |
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

## CreativeMinds (Talent Marketplace)

A talent pool platform connecting freelance creatives with the agency.

### How It Works
1. **Public application** (`/creativeminds`): Creatives apply via `TalentApplicationForm` with name, email, category, skills, portfolio, experience
2. **API submission** (`POST /api/talent`): Saves application to Supabase `talent_applications` table
3. **Admin review** (`/admin/creativeminds`): Team reviews, approves/rejects applications
4. **Public profiles** (`/talent/[slug]`): Approved talent get public profile pages

### Key Files
- `src/app/creativeminds/page.tsx` — Public landing + application form
- `src/components/public/TalentApplicationForm.tsx` — Application form component
- `src/app/talent/[slug]/page.tsx` — Public talent profile viewer
- `src/app/admin/creativeminds/page.tsx` — Admin talent management
- `src/lib/admin/talent-types.ts` — TalentProfile, TalentApplication types
- `src/app/api/talent/route.ts` — GET (list) / POST (apply)
- `src/app/api/talent/[slug]/route.ts` — GET individual profile

---

## Invoice & Proposal System

### Invoices (GST-Compliant)
- **Admin pages**: `/admin/invoices` (list with filters, pagination), `/admin/invoice` (creation form)
- **Component**: `src/components/admin/InvoiceFormNew.tsx` — Line items, multi-currency, GST split, SAC codes, live preview, PDF generation
- **PDF**: `src/lib/admin/pdf-simple.ts` — jsPDF-based invoice PDF generator with SAC column, CGST/SGST/IGST breakdown, multi-currency support
- **Numbering**: `src/lib/admin/invoice-numbering.ts` — API-backed `FM{counter}/{year}` format (e.g., `FM164/2025`), Supabase persistence via `invoice_sequences` table, localStorage fallback
- **Sequence API**: `GET/POST /api/admin/invoice-sequence` — GET previews next number, POST atomically increments
- **Company info**: Read from `COMPANY_PAN`, `COMPANY_MSME`, `COMPANY_ADDRESS` env vars (NOT hardcoded). GSTIN: `23BQNPM3447F1ZT` (Bhopal, MP, state code 23)
- **GST logic**: `InvoiceUtils.calculateGST()` in `types.ts` — same-state → CGST+SGST (split 50/50), different-state → IGST (full rate), international → no GST
- **Multi-currency**: INR, USD, GBP, AED, EUR — `CURRENCY_OPTIONS` in `types.ts`, auto-switch to USD for international clients
- **SAC codes**: Service Accounting Codes on line items, auto-filled from `AGENCY_SERVICES` in `types.ts`
- **API**: `GET/POST/PUT/DELETE /api/invoices`

### Proposals
- **Admin page** (`/admin/proposals`): List + creation
- **Component**: `src/components/admin/ProposalFormNew.tsx` — Multi-section proposal builder
- **PDF**: `src/lib/admin/proposal-pdf-generator.ts` — Proposal PDF output
- **Numbering**: `src/lib/admin/proposal-numbering.ts` — Auto-incrementing `PM{counter}/{year}` format (e.g., `PM164/2025`), localStorage-based
- **Storage**: `src/lib/admin/proposal-storage.ts` — Proposal persistence
- **API**: `GET/POST/PUT/DELETE /api/proposals`

---

## Discovery / Lead System

### Lead Capture
- **Public form** (`/get-started`): Multi-step onboarding form → `POST /api/leads`
- **Admin list** (`/admin/leads`): Lead pipeline with status tracking, scoring, analytics
- **Lead conversion** (`POST /api/leads/convert`): Convert lead to client
- **Analytics** (`GET /api/leads/analytics`): Lead source, status, conversion metrics

### Discovery Sessions
- **Admin pages**: `/admin/discovery` (list), `/admin/discovery/new` (create), `/admin/discovery/[id]/report` (report)
- **10-section wizard**: Company Fundamentals → Project Overview → Target Audience → Current State → Goals/KPIs → Competition/Market → Budget/Resources → Technical Requirements → Content/Creative → Next Steps
- **Types**: `src/lib/admin/discovery-types.ts`
- **Service**: `src/lib/admin/discovery-service.ts`
- **Components**: `src/components/admin/discovery/` (section form components)
- **API**: `GET/POST /api/discovery`

---

## Blog System

Blog content is **hardcoded** in `src/lib/blog-data.ts` (no CMS/database).

### Adding a Blog Post
1. Edit `src/lib/blog-data.ts` — add a new `BlogPost` object to the `blogPosts` array
2. Fields: `slug`, `title`, `excerpt`, `content` (markdown string), `category`, `tags`, `readTime`, `date`, `author`, `featured?`
3. The post automatically appears at `/blog` (list) and `/blog/[slug]` (detail)
4. Sitemap (`src/app/sitemap.ts`) auto-generates entries for all blog posts

---

## Share Links System

Allows clients to share specific resources (documents, reports, content) via public tokens.

- **Creation**: `POST /api/client-portal/[clientId]/share` — generates a unique token with optional expiry
- **Viewer**: `/shared/[token]` — public page that resolves token and displays the shared resource
- **API resolver**: `GET /api/shared/[token]` — looks up `share_links` table, returns resource data
- **Supabase table**: `share_links` (token, resource_type, resource_id, expires_at)

---

## Social Media Publishing

Allows publishing content directly to Facebook and Instagram via Meta Graph API v21.0.

### Architecture
```
src/lib/social/
├── types.ts           # SocialAccount, PublishResult, MetaPageInfo types
├── meta-api.ts        # Meta Graph API client (verifyPageToken, publishToFacebook, publishToInstagram)
├── publish-engine.ts  # publishContentItem() orchestrator — updates content_calendar with meta_post_id
├── token-crypto.ts    # AES-GCM encryption for storing access tokens securely
└── index.ts           # Public API exports
```

### How It Works
1. **Connect account** (`/admin/settings` → Social Accounts): Admin enters a Meta Page Access Token
2. **Token verification**: `POST /api/admin/social/verify-token` validates token against Meta API, returns page info
3. **Token storage**: Access token is AES-GCM encrypted using `META_TOKEN_SECRET` env var before saving to `social_accounts` table
4. **Publishing**: From content detail page, click "Publish Now" → `POST /api/admin/social/publish` → Meta Graph API
5. **Post tracking**: Published post ID saved to `content_calendar.meta_post_id`, errors to `last_publish_error`

### Key Components
- `PublishButton` — "Publish Now" button on content detail pages (shows for Instagram/Facebook content)
- `SocialAccountsPanel` — UI for managing connected social accounts (in admin settings)
- `SocialPublishStatus` — Status indicator showing publish state on content list items

### Environment
- `META_TOKEN_SECRET` (optional, min 32 chars) — AES-GCM key for encrypting stored access tokens. If not set, social publishing features are disabled.

---

## Contracts

Client contract management integrated into both admin dashboard and client portal.

### Key Files
- `src/lib/admin/contract-types.ts` — ContractStatus enum, Contract interface, transformContract()
- `src/lib/admin/contract-templates.ts` — Pre-defined contract templates
- `src/components/admin/ContractsTab.tsx` — Contract management UI (used in client detail)
- `src/app/api/contracts/route.ts` — Admin contract CRUD
- `src/app/api/client-portal/[clientId]/contracts/route.ts` — Client-side contract API
- `src/app/client/[clientId]/contracts/page.tsx` — Client portal contracts page

---

## Outgoing Webhooks

Event-driven webhook system for integrating with external services.

### Key Files
- `src/lib/webhooks/deliver.ts` — Webhook delivery engine (HTTP POST with retry)
- `src/lib/webhooks/processor.ts` — Event processor (matches events to registered webhooks)
- `src/lib/webhooks/verify.ts` — HMAC signature verification for webhook payloads
- `src/app/api/admin/webhooks/route.ts` — Webhook CRUD API

### How It Works
1. Admin registers a webhook URL with a secret and list of event types in `/admin/settings`
2. When an event occurs (e.g., invoice created, client updated), the processor matches it to registered webhooks
3. Payload is signed with HMAC using the webhook's secret and delivered via HTTP POST
4. Delivery logs stored in `outgoing_webhook_deliveries` table

---

## Web Scraping (Contact Discovery)

Automated web scraping for discovering potential contacts/leads.

### Admin Pages
- `/admin/scraped-contacts` — Scraped contacts dashboard (analytics, filters, table, bulk actions)
- `/admin/scraped-contacts/scrape-jobs` — Scrape job management (create, edit, execute, view runs)

### Key Files
- `src/hooks/admin/useScrapedContacts.ts` — React Query hook for scraped contacts
- `src/hooks/admin/useScrapeJobs.ts` — React Query hook for scrape jobs
- `src/components/admin/scraped-contacts/` — 7 UI components (table, filters, analytics, etc.)
- `src/components/admin/scrape-jobs/` — 9 UI components (job list, config, run history, etc.)

### API Routes
- `GET/POST/PUT/DELETE /api/admin/scraped-contacts` — Contact CRUD
- `GET/POST/PUT/DELETE /api/admin/scrape-jobs` — Job CRUD
- `GET/POST /api/admin/scrape-jobs/config` — Job configuration
- `POST /api/admin/scrape-jobs/execute` — Execute a scrape job
- `GET /api/admin/scrape-jobs/runs` — Job run history

---

## Notification & Email System

### In-App Notifications (`src/lib/notifications.ts`)
- `createNotification()` — sends `notification/send` event to Inngest
- `notifyAdmins()` — notify all admin users
- `notifyClient(clientId, options)` — notify a specific client
- Routed through Inngest for durable delivery with retries
- 17 notification types: contract, project, content, invoice, ticket, document, proposal, team-member, general

### Email Notifications (`src/lib/email/`)
- `send.ts` — routes through Inngest; falls back to direct Resend if Inngest unreachable
- `resend.ts` — Resend client initialization
- `notifyTeam()` — send to team email (`NOTIFICATION_EMAIL`)
- `notifyRecipient()` — send to specific email address
- Brand-styled HTML email templates
- Conditional on `RESEND_API_KEY` — graceful degradation if not configured

### Environment
- `RESEND_API_KEY` (optional) — Resend API key for sending emails
- `NOTIFICATION_EMAIL` (optional) — team email address for notifications

---

## Inngest — Durable Background Jobs

All fire-and-forget async patterns (notifications, emails, audit logs, webhooks, social publishing, AI generation) are routed through [Inngest](https://www.inngest.com) for durable execution with retries and observability.

### Architecture
```
src/lib/inngest/
  client.ts              # Inngest client singleton (typed event schemas)
  events.ts              # Event type definitions (TypeScript)
  index.ts               # Function registry (allFunctions array for serve())
  functions/
    audit.ts             # audit/log — 5 retries (compliance-critical)
    notifications.ts     # notification/send + notification/send-bulk (batch of 10)
    emails.ts            # email/send (throttle 10/s) + email/send-template (2-step)
    webhooks.ts          # webhook/deliver (fan-out per webhook, independent retries)
    social.ts            # social/publish (5-step: fetch → publish → update DB → audit)
    ai-content.ts        # ai/generate-content (3-step: LLM → insert → audit)
    platform-events.ts   # platform/event (replaces EventEmitter fan-out)

src/app/api/inngest/
  route.ts               # serve() handler — GET/POST/PUT
```

### How It Works
1. Existing functions (`createNotification`, `sendEmail`, `logAuditEvent`, `emitEvent`) use **dynamic `import()`** to send Inngest events — avoids bundling Node.js-only code in client components
2. Inngest receives events and invokes functions via `POST /api/inngest`
3. Each function uses `step.run()` for independently retried, checkpointed operations
4. On Vercel free plan (10s timeout), each step gets its own 10s window

### Adapter Pattern (zero call-site changes)
| Adapter | Event | Fallback |
|---------|-------|----------|
| `logAuditEvent()` | `audit/log` | Direct DB insert if Inngest unreachable |
| `createNotification()` | `notification/send` | Logs error only |
| `sendEmail()` | `email/send` | Direct Resend call if Inngest unreachable |
| `emitEvent()` | `platform/event` | Local EventEmitter if Inngest unreachable |
| `deliverToSubscribers()` | `webhook/deliver` | Direct HTTP delivery if Inngest unreachable |

### Async APIs
These endpoints return `{ status: 'queued' }` immediately — processing happens in Inngest:
- `POST /api/admin/social/publish` → `social/publish` function (5-step)
- `POST /api/admin/content/generate` → `ai/generate-content` function (3-step)

### Environment Variables
- `INNGEST_EVENT_KEY` (optional for dev) — Inngest API key for production
- `INNGEST_SIGNING_KEY` (optional for dev) — Webhook signature verification for production
- **Local dev**: Run `npx inngest-cli@latest dev` — no keys needed, dashboard at http://localhost:8288

### Important: Dynamic Imports
Inngest uses `node:async_hooks` which cannot be bundled for client-side. All adapter files use `import('@/lib/inngest/client')` (dynamic import) instead of top-level `import`. Event type constants are in `src/lib/events/types.ts` (client-safe) — import from there in client components, NOT from `emitter.ts`.

---

## Permission System (RBAC)

Defined in `src/lib/admin/permissions.ts`. Used for admin user management.

### Roles (hierarchy order)
| Role | Hierarchy | Description |
|------|-----------|-------------|
| `super_admin` | 100 | Full system access (`system.full_access`) |
| `admin` | 90 | All permissions except super_admin-only |
| `manager` | 70 | Clients, projects, content, finance (read/write) |
| `editor` | 50 | Content + clients + projects (read/write), finance (read) |
| `viewer` | 10 | Read-only across content, clients, projects, finance |

### Permission Categories
`system` (2), `content` (4), `users` (4), `clients` (4), `projects` (4), `finance` (4), `settings` (3) — **23 total permissions**

### Usage
```ts
import { PermissionService } from '@/lib/admin/permissions';
PermissionService.hasPermission(userPermissions, 'finance.write'); // true/false
PermissionService.canManageRole('admin', 'editor'); // true (higher hierarchy)
```

---

## SEO

- **Sitemap**: `src/app/sitemap.ts` — auto-generates XML sitemap with all static pages + blog posts
- **Robots.txt**: `src/app/robots.ts` — allows public pages, disallows `/admin`, `/client`, `/api`, `/diagnostic`, `/wehave`, `/showcase`
- **JSON-LD**: Structured data in `src/app/layout.tsx` — Organization, LocalBusiness, WebSite schemas
- **Open Graph / Twitter**: Configured in `layout.tsx` metadata with `/og-image.png`
- **Analytics**: GoodmanTech Observatory pixel in `<head>`

---

## GSAP Animation Hooks

Custom hooks in `src/hooks/`:

| Hook | Purpose |
|------|---------|
| `useGSAP` | Core GSAP + ScrollTrigger setup for component animations |
| `useMagneticEffect` | Mouse-following magnetic effect on elements |
| `useCountUp` | Animated number counter (for stats/metrics) |

GSAP animations work with native browser scroll (Lenis is disabled). ScrollTrigger-based animations fire on scroll position.

---

## Dev-Only Pages

These pages are blocked from search engines via `robots.ts`:

- `/diagnostic` — Design system component diagnostic/testing page
- `/wehave` — Site page index (lists all public, admin, client, and API routes)
- `/showcase/*` — Design prototypes: `navbars`, `footers`, `heading-styles`, `accent-text`, `accent-colors`, `design-directions`, `home-v2`, `home-v3`

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

### ConditionalLayout
`src/components/layout/ConditionalLayout.tsx` — Automatically selects header/footer based on route:
- `/admin/*` and `/client/*`: No header/footer (dashboard has own layout)
- `/showcase/*`: No header/footer (self-contained prototypes)
- `/showcase/home-v3`: HeaderV3 + FooterV2
- Everything else: HeaderV2 + FooterV2 (main site)

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
npm run test         # Run Vitest (watch mode)
npm run test:run     # Run Vitest (single run, for CI)
npm run test:coverage # Run Vitest with coverage report
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

# Company info (used in invoices/proposals)
COMPANY_PAN=...
COMPANY_MSME=...
COMPANY_ADDRESS=...

# Email notifications (optional — Resend)
RESEND_API_KEY=re_...
NOTIFICATION_EMAIL=team@freakingminds.com

# Social media publishing (optional — Meta Graph API)
META_TOKEN_SECRET=minimum-32-character-secret-key-here

# Inngest (durable background jobs — optional for local dev)
INNGEST_EVENT_KEY=...          # From inngest.com dashboard (production only)
INNGEST_SIGNING_KEY=...        # From inngest.com dashboard (production only)

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
- Use `requireAdminAuth(request)` in **all** admin API routes (`src/lib/admin-auth-middleware.ts`)
- Use `requireClientAuth(request, clientId)` in **all** client portal API routes (`src/lib/client-session.ts`)
- Use `resolveClientId()` in all client portal API routes (handles slug OR ID)
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

## Zod Validation Schemas

`src/lib/validations/schemas.ts` — shared between API routes (server validation) and forms (client validation).

Key schemas: `createClientSchema`, `updateClientSchema`, `createProjectSchema`, `createContentSchema`, `createTeamMemberSchema`, `createInvoiceSchema`, `createProposalSchema`, `createUserSchema`, `createLeadSchema`, `submitTalentApplicationSchema`, `createContractSchema`, `createDiscoverySchema`, `uploadDocumentSchema`, `contractActionSchema`, `proposalActionSchema`

Usage in API routes:
```ts
import { createClientSchema } from '@/lib/validations/schemas';
const body = createClientSchema.safeParse(await req.json());
if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
```

---

## Key Admin Components

| Component | File | Purpose |
|-----------|------|---------|
| `AddClientModal` | `admin/AddClientModal.tsx` | Modal for creating new clients |
| `AddLeadModal` | `admin/AddLeadModal.tsx` | Modal for adding leads manually |
| `InvoiceFormNew` | `admin/InvoiceFormNew.tsx` | Invoice creation with line items, GST split, multi-currency, SAC codes + PDF |
| `ProposalFormNew` | `admin/ProposalFormNew.tsx` | Proposal builder with sections + PDF |
| `ProposalDashboard` | `admin/ProposalDashboard.tsx` | Proposal list with filters |
| `CommandPalette` | `admin/CommandPalette.tsx` | Cmd+K quick navigation |
| `CommunicationHub` | `admin/CommunicationHub.tsx` | Client communication dashboard |
| `ClientDashboard` | `admin/ClientDashboard.tsx` | Individual client dashboard |
| `ClientPortalLink` | `admin/ClientPortalLink.tsx` | Client portal link generator |
| `DocumentManager` | `admin/DocumentManager.tsx` | Document upload/management |
| `FilterBar` | `admin/FilterBar.tsx` | Reusable filter bar for admin lists |
| `GrowthEngine` | `admin/GrowthEngine.tsx` | Growth metrics dashboard |
| `Pagination` | `admin/Pagination.tsx` | Reusable pagination component |
| `AdminSystem` | `admin/AdminSystem.tsx` | System health diagnostics |
| `AdminErrorBoundary` | `admin/AdminErrorBoundary.tsx` | Error boundary for admin pages |
| `SectionErrorBoundary` | `admin/SectionErrorBoundary.tsx` | Error boundary for dashboard sections |
| `ConfirmDialog` | `admin/ConfirmDialog.tsx` | Confirmation modal dialog (delete, destructive actions) |
| `ContractsTab` | `admin/ContractsTab.tsx` | Contract management UI for client detail page |
| `SkillSelector` | `admin/SkillSelector.tsx` | Skill selection component for team members |
| `TeamMemberSelect` | `admin/TeamMemberSelect.tsx` | Team member dropdown selector |
| `UploadModal` | `admin/UploadModal.tsx` | File upload modal |
| `UserFormModal` | `admin/UserFormModal.tsx` | User creation/editing modal |
| `PublishButton` | `admin/social/PublishButton.tsx` | Social media publish button for content items |
| `SocialAccountsPanel` | `admin/social/SocialAccountsPanel.tsx` | Connected social accounts manager |
| `SocialPublishStatus` | `admin/social/SocialPublishStatus.tsx` | Publish status indicator on content list |

### Component Subdirectories
| Directory | Purpose |
|-----------|---------|
| `admin/client-detail/` | Client detail page sections (11 sub-components) |
| `admin/creativeminds/` | Talent pool management UI (6 sub-components) |
| `admin/discovery/` | Discovery wizard section forms (4 sub-components) |
| `admin/leads/` | Lead pipeline management UI (6 sub-components) |
| `admin/scrape-jobs/` | Scrape job management UI (9 sub-components) |
| `admin/scraped-contacts/` | Scraped contacts UI (7 sub-components: table, filters, analytics, etc.) |
| `admin/social/` | Social publishing UI (5 sub-components) |

---

## Related Documentation

All documentation lives in `docs/` (only `README.md` and `CLAUDE.md` at root):
- `docs/FREAKING-MINDS-DESIGN-SYSTEM.md` - Original design system docs
- `docs/DEVELOPMENT-GUIDELINES.md` - Development standards
- `docs/AI_TECHNICAL_ARCHITECTURE.md` - Technical architecture details
- `docs/PROJECT_DOCUMENTATION.md` - Project overview
