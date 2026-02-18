# Freaking Minds Development Guidelines & Principles
*Tight, practical development rules & guardrails for building the Freaking Minds website*

---

## 0) Tech Stack & Architecture
- **Framework**: Next.js (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + design tokens; shadcn/ui for primitives
- **Animation**: Framer Motion (subtle, purposeful)
- **CMS**: Headless (Contentful / Sanity / Strapi). All page copy, case studies, blog, metadata managed in CMS.
- **Search**: Client-side fuzzy (MiniSearch) for blogs/resources; Algolia if scale demands
- **Deployment**: Vercel (Edge CDN, Image Optimization, ISR)
- **Data fetching**: SSG/ISR for all marketing pages; SSR only where necessary (e.g., search results)
- **Analytics**: GA4 + privacy-friendly PostHog (events), server-side tagging where possible
- **Monitoring**: Vercel Analytics + Sentry (FE errors) + UptimeRobot/Better Stack

---

## 1) Performance Budgets (Web Vitals)
- **LCP** < 2.0s, **CLS** < 0.1, **INP** < 200ms, **TTI** < 3.5s, **TBT** < 150ms
- **Images**: serve AVIF/WebP, `<Image>` component with sizes & responsive srcset; no images > 200KB above-the-fold.
- **Fonts**: self-hosted variable fonts, font-display: swap, subset Latin.
- **JS**: aim for < 150KB hydrated JS on the homepage; code-split routes and components; no heavy client libraries for simple UI.
- **Third-party**: hard cap < 2 blocking third-parties; lazy-load anything non-critical (chat, heatmaps).
- **Animations**: 60fps; avoid layout thrash; prefer transform/opacity.

---

## 2) Accessibility (WCAG 2.2 AA)
- **Semantic HTML** for all content; one H1 per page.
- **Focus states** visible; keyboard-navigable everywhere; skip-to-content link.
- **Color contrast** ratio ≥ 4.5:1 (normal text).
- **ARIA** only to enhance semantics—not to replace them.
- **Media**: transcripts/captions; images require meaningful alt.
- **Component contracts** must specify accessible names, roles, and states.

---

## 3) SEO & Content Ops
- **Metadata from CMS**: title (≤ 60 chars), meta description (≤ 155), canonical, OG/Twitter cards per page.
- **Structured Data**: Organization, WebSite, BreadcrumbList, Article for blogs/cases, Service where relevant.
- **URL strategy**: `/services/[slug]`, `/work/[case-study]`, `/blog/[post]`, `/about`, `/contact`, `/playbook` (resources).
- **XML sitemap** & humans.txt; robots.txt with clean disallow rules; trailing slashes consistent.
- **Internal links** in copy (2–3 per section) + related content blocks.
- **301s** for legacy URLs; no 404 drift after launch.
- **Page copy** written for readability first (Flesch 60+), then keywords (no stuffing).

---

## 4) Design System → Dev Tokens

Define tokens once and generate Tailwind config & CSS vars.

### Color (Freaking Minds Brand)
```css
/* Primary Brand Colors */
--fm-magenta-900: #8f184c;     /* Primary brand - existing */
--fm-magenta-800: #a1215a;     /* Darker variation */
--fm-magenta-700: #b32968;     /* Base brand */
--fm-magenta-600: #c53276;     /* Lighter variation */
--fm-magenta-500: #d73a84;     /* Accent variation */

/* Supporting Colors */
--fm-purple-900: #4a0e2b;      /* Deep contrast */
--fm-orange-600: #ff6b35;      /* CTA accent */

/* Neutrals */
--fm-neutral-900: #1a1a1a;     /* Primary text */
--fm-neutral-700: #404040;     /* Secondary text */
--fm-neutral-600: #666666;     /* Tertiary text */
--fm-neutral-300: #e6e6e6;     /* Borders */
--fm-neutral-100: #f8f9fa;     /* Backgrounds */
--fm-neutral-50: #ffffff;      /* Pure white */
```

### Typography
- **Font**: Inter Variable
- **Base**: 16px, scale 1.25
- **Display** (64/72), **H1** (44/52), **H2** (32/40), **H3** (24/32), **Body** (16/24), **Small** (14/20)

### Space
- **Base unit**: 4px grid
- **Scale**: 1,2,3,4,6,8,12,16,20,24,32

### Other Tokens
- **Radius**: 12px default, 24px for hero cards
- **Elevation**: 0/2/6/12dp w/ soft shadows; prefers-reduced-motion honors
- **Motion**: 150–250ms ease-out; large transitions 300–400ms

All tokens live in `/design-tokens/tokens.json` → build script maps to Tailwind & CSS variables.

---

## 5) Component Library (dev-ready specs)

### Core Blocks
- **Hero** (variant: image/video/no-media; CTA primary + secondary; supports split layout)
- **ServiceCard** (icon/svg, h3, 2–3 bullets, link)
- **CaseStudyTeaser** (logo, title, 1-line outcome, tags, link)
- **Testimonial** (quote, author, role, avatar/logo, schema markup)
- **Stat** (value, label, optional tooltip, from CMS)
- **CTA section** (headline, subhead, single primary CTA)
- **RichText** (prose styling, anchor linkable headings, TOC option)
- **Tabs** (keyboard accessible, roving tabindex)
- **Accordion** (disclosure pattern)
- **Form** (Contact/Brief) with Zod validation + server actions; honeypot + rate limit

### Acceptance Criteria per Component
- Receives content from CMS schema
- Renders without JS (progressive enhancement)
- a11y roles/labels documented
- Visual regression snapshot in Chromatic/Storybook
- Unit test for logic branches (Vitest/RTL)

---

## 6) Content Modeling (CMS)
- **Singletons**: Home, About, Contact, Navigation, Footer, Site Settings (global SEO, social, schema).
- **Collections**: Service, CaseStudy, BlogPost, Testimonial, ClientLogo, TeamMember, Resource.
- **Blocks (portable)**: Hero, FeatureGrid, StatsRow, TestimonialRow, CaseStudyGrid, FAQ, CTA.
- **Fields**: title, slug, excerpt, body (portable rich text), media, SEO, structured data fields.

---

## 7) Content & Brand Voice Guardrails (for AI)
- **Voice**: clear, expert, friendly, never hypey; verbs > adjectives.
- **Structure**: one idea per paragraph; scannable subheads; bullets over walls of text.
- **Case studies**: challenge → strategy → execution → measurable outcome (metric + time frame).

### AI Prompts
- "Write a 120-word service intro for {service}, target audience {role}, pain {x}, include one proof point and one CTA."
- "Draft 3 alt-text options for this image: {description}. Keep ≤ 120 chars."
- **Approval workflow**: AI draft → editor review (tone, compliance) → legal/brand sign-off → publish.

---

## 8) Forms, Leads & Consent
- **Contact/Brief form**: name, email, company, budget range, timeline, goals; optional file upload (10MB).
- **Spam**: honeypot + server-side rate limit; no CAPTCHA unless abused.
- **Consent banner** (GDPR/CCPA friendly); store preferences; do not auto-track until consent.
- **CRM webhook** (HubSpot/Pipedrive) + Slack notification; error fallback email.

---

## 9) Security & Privacy
- **Strict CSP** (script-src self vercel analytics + allowed list); no inline scripts.
- **HTTPS only**; HSTS; secure cookies; CSRF on forms; input sanitization (Zod).
- **Regular dependency audits**; Renovate bot for updates.
- **Backups**: CMS daily; export on deploy.
- **Minimal data collection**; publish privacy policy & DPA links.

---

## 10) Internationalization / Localization (optional)
- Plan routing with next-intl if needed. Centralize strings; fallback to English.
- Locale-aware metadata, dates, numerals.

---

## 11) Deployment & Environments
- **Branches**: main (prod), develop (staging), feature branches → PRs.
- **CI/CD**: lint (ESLint), typecheck, unit tests, Storybook build, Lighthouse CI (budget thresholds).
- **Previews**: Vercel PR previews with seeded CMS data.
- **Rollbacks**: keep last 5 deploys hot-swappable.

---

## 12) QA Launch Checklist
- [ ] Validate Core Web Vitals on live URLs (home, service, case, blog, contact).
- [ ] 404/500 custom pages tested; 301s verified.
- [ ] All links click-tested; external links rel="noopener".
- [ ] Open Graph/Twitter cards for top pages.
- [ ] Sitemap submitted to GSC; errors cleared.
- [ ] Forms tested with and without JS; email notifications received.
- [ ] Accessibility pass with axe and manual keyboard sweep.
- [ ] Consent banner behaves per region; analytics events firing.

---

## 13) Post-Launch Growth Loops
- **Event taxonomy**: cta_click, form_start, form_submit, case_study_expand, video_play, link_out.
- **Monthly insights deck**: traffic → conversions → content that assisted; action items.
- **A/B test queue** (1 live test at a time): hero headline, case-study layout, CTA wording.

---

## 14) Page-by-Page Blueprints

### Home
- Above-the-fold value prop, proof (logos), primary CTA.
- 3 key services, 1 featured case study, testimonials, newsletter, footer CTA.
- No auto-carousels.

### Services
- Each service page: problem → our approach → deliverables → timeline → FAQs → CTA.
- Cross-link to 1–2 relevant case studies.

### Work (Case Studies)
- Outcome metric in hero ("+214% qualified leads in 90 days").
- Media gallery (images/video), tech stack, team notes.
- Next/previous to keep reading loop.

### About
- Mission, values, leadership, culture photos (real, not stock).
- Awards, certifications, talks.
- CSR/community bits (BNI/local involvement if relevant).

### Blog/Resources
- Topic clusters; author bios; estimated read time; newsletter CTA mid-article.

### Contact
- Short form + email + phone + office map; SLA promise for replies.

---

## 15) Coding Standards
- **TypeScript strict mode**; ESLint (Airbnb-ish) + Prettier; commitlint conventional commits.
- **File structure**: feature folders with co-located tests and styles.
- **No anonymous default exports** for complex components; document props with TSDoc.
- **Write unit tests** for utilities and any logic-bearing component.
- **Avoid any**; prefer discriminated unions for variants.
- **Don't ship unused CSS**; rely on Tailwind's JIT purge.

---

## 16) Freaking Minds Brand Guidelines

### Brand Colors Usage
```css
/* Primary Actions */
.fm-btn-primary {
  background: var(--fm-magenta-700);
  color: var(--fm-neutral-50);
}

/* Secondary Actions */
.fm-btn-secondary {
  background: transparent;
  color: var(--fm-magenta-700);
  border: 2px solid var(--fm-magenta-700);
}

/* Accent/CTA */
.fm-btn-accent {
  background: var(--fm-orange-600);
  color: var(--fm-neutral-50);
}
```

### Typography Hierarchy
```css
/* Hero Headlines */
.fm-display-xl { 
  font-size: 4rem; 
  font-weight: 700; 
  color: var(--fm-neutral-900); 
}

/* Section Headlines */
.fm-h1 { 
  font-size: 2.5rem; 
  font-weight: 600; 
  color: var(--fm-neutral-900); 
}

/* Body Text */
.fm-body { 
  font-size: 1rem; 
  font-weight: 400; 
  color: var(--fm-neutral-700); 
  line-height: 1.5; 
}
```

### Component Patterns
```jsx
// Service Card Pattern
const ServiceCard = ({ icon, title, description, link }) => (
  <div className="fm-service-card">
    <div className="fm-service-card__icon">{icon}</div>
    <h3 className="fm-service-card__title">{title}</h3>
    <p className="fm-service-card__description">{description}</p>
    <a href={link} className="fm-service-card__link">
      Learn More →
    </a>
  </div>
);

// Case Study Card Pattern
const CaseStudyCard = ({ client, title, result, image, tags, link }) => (
  <div className="fm-case-study-card">
    <img src={image} alt={title} className="fm-case-study-card__image" />
    <div className="fm-case-study-card__content">
      <div className="fm-case-study-card__client">{client}</div>
      <h3 className="fm-case-study-card__title">{title}</h3>
      <p className="fm-case-study-card__result">{result}</p>
      <div className="fm-case-study-card__tags">
        {tags.map(tag => (
          <span key={tag} className="fm-case-study-card__tag">{tag}</span>
        ))}
      </div>
    </div>
  </div>
);
```

---

## 17) Performance Optimization Specific to Freaking Minds

### Image Strategy
```javascript
// Hero images - prioritize loading
<Image
  src="/hero-marketing.jpg"
  alt="Digital Marketing Strategy"
  width={1200}
  height={600}
  priority
  className="fm-hero__image"
/>

// Case study images - lazy load
<Image
  src="/case-study.jpg"
  alt="Client Success Story"
  width={400}
  height={250}
  loading="lazy"
  className="fm-case-study__image"
/>
```

### Animation Guidelines
```css
/* Subtle hover effects */
.fm-card {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.fm-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--fm-shadow-lg);
}

/* Scroll-triggered animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fm-animate-in {
  animation: fadeInUp 0.6s ease-out;
}
```

---

## 18) Content Management Guidelines

### CMS Content Structure
```javascript
// Service Schema
const ServiceSchema = {
  title: "Social Media Management",
  slug: "social-media-management",
  excerpt: "Build authentic connections that drive business results",
  icon: "social-media-icon.svg",
  description: "Rich text content...",
  features: ["Content Strategy", "Community Management", "Analytics"],
  pricing: {
    starting: 2500,
    currency: "INR"
  },
  caseStudies: ["case-study-1", "case-study-2"],
  seo: {
    title: "Social Media Management Services | Freaking Minds",
    description: "Professional social media management...",
    keywords: ["social media", "digital marketing", "bhopal"]
  }
};

// Case Study Schema
const CaseStudySchema = {
  title: "Increased Lead Generation by 300%",
  slug: "lead-generation-success",
  client: "Tech Startup",
  challenge: "Low online visibility...",
  solution: "Comprehensive digital strategy...",
  results: {
    metric: "Lead Generation",
    improvement: "+300%",
    timeframe: "6 months"
  },
  images: ["before.jpg", "after.jpg"],
  tags: ["SEO", "PPC", "Content Marketing"],
  testimonial: "Working with Freaking Minds..."
};
```

---

## 19) Testing Strategy

### Component Testing
```javascript
// Service Card Test
describe('ServiceCard', () => {
  it('renders service information correctly', () => {
    const props = {
      icon: 'icon.svg',
      title: 'SEO Services',
      description: 'Improve your search rankings',
      link: '/services/seo'
    };
    
    render(<ServiceCard {...props} />);
    
    expect(screen.getByText('SEO Services')).toBeInTheDocument();
    expect(screen.getByText('Improve your search rankings')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/services/seo');
  });
});

// Visual Regression Test
describe('Visual Regression', () => {
  it('matches homepage snapshot', async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });
});
```

### Performance Testing
```javascript
// Lighthouse CI Configuration
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/services',
        'http://localhost:3000/work',
        'http://localhost:3000/about',
        'http://localhost:3000/contact'
      ],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }]
      }
    }
  }
};
```

---

## 20) Launch & Maintenance Checklist

### Pre-Launch
- [ ] All design system tokens implemented
- [ ] Components match design specifications
- [ ] Mobile responsiveness tested on real devices
- [ ] Performance budgets met
- [ ] Accessibility compliance verified
- [ ] SEO metadata complete
- [ ] Analytics tracking implemented
- [ ] Forms submission tested
- [ ] CMS content populated
- [ ] SSL certificate configured

### Post-Launch
- [ ] Monitor Core Web Vitals weekly
- [ ] Review analytics monthly
- [ ] Update case studies quarterly
- [ ] Design system audit every 6 months
- [ ] Security dependency updates monthly
- [ ] Content freshness review quarterly
- [ ] A/B testing roadmap planned
- [ ] User feedback collection active

---

*These guidelines ensure the Freaking Minds website maintains high quality, performance, and consistency while supporting the team's efficient development workflow.*

**Version**: 1.0  
**Last Updated**: 2024  
**Review Cycle**: Monthly