'use client';

import Link from 'next/link';

export default function WeHavePage() {
  const publicPages = [
    { path: '/', name: 'Home', description: 'Main landing page' },
    { path: '/about', name: 'About', description: 'About the company' },
    { path: '/services', name: 'Services', description: 'Services offered' },
    { path: '/work', name: 'Work', description: 'Portfolio and work showcase' },
    { path: '/blog', name: 'Blog', description: 'Blog articles' },
    { path: '/contact', name: 'Contact', description: 'Contact page' },
    { path: '/get-started', name: 'Get Started', description: 'Getting started guide' },
    { path: '/creativeminds', name: 'Creative Minds', description: 'Creative talent network' },
  ];

  const showcasePages = [
    { path: '/showcase/home-v2', name: 'Home V2', description: 'Alternative home design v2' },
    { path: '/showcase/home-v3', name: 'Home V3', description: 'Alternative home design v3' },
    { path: '/showcase/design-directions', name: 'Design Directions', description: 'Design system showcase' },
  ];

  const adminPages = [
    { path: '/admin', name: 'Admin Dashboard', description: 'Main admin dashboard' },
    { path: '/admin/auth/login', name: 'Admin Login', description: 'Admin authentication' },
    { path: '/admin/clients', name: 'Clients', description: 'Client management' },
    { path: '/admin/leads', name: 'Leads', description: 'Lead management' },
    { path: '/admin/projects', name: 'Projects', description: 'Project management' },
    { path: '/admin/projects/new', name: 'New Project', description: 'Create new project' },
    { path: '/admin/content', name: 'Content', description: 'Content management' },
    { path: '/admin/content/new', name: 'New Content', description: 'Create new content' },
    { path: '/admin/proposals', name: 'Proposals', description: 'Proposal management' },
    { path: '/admin/invoice', name: 'Invoice', description: 'Invoice management' },
    { path: '/admin/discovery', name: 'Discovery', description: 'Discovery sessions' },
    { path: '/admin/discovery/new', name: 'New Discovery', description: 'Create discovery session' },
    { path: '/admin/team', name: 'Team', description: 'Team management' },
    { path: '/admin/team/new', name: 'New Team Member', description: 'Add team member' },
    { path: '/admin/creativeminds', name: 'Creative Minds Admin', description: 'Manage creative talent' },
    { path: '/admin/users', name: 'Users', description: 'User management' },
    { path: '/admin/settings', name: 'Settings', description: 'Admin settings' },
    { path: '/admin/system', name: 'System', description: 'System administration' },
    { path: '/admin/init-sheets', name: 'Init Sheets', description: 'Initialize Google Sheets' },
    { path: '/admin/test-sheets', name: 'Test Sheets', description: 'Test Google Sheets integration' },
    { path: '/admin/test-invoice', name: 'Test Invoice', description: 'Test invoice generation' },
  ];

  const adminDynamicPages = [
    { path: '/admin/clients/[clientId]', name: 'Client Detail', description: 'View/edit specific client' },
    { path: '/admin/discovery/[id]/report', name: 'Discovery Report', description: 'View discovery session report' },
    { path: '/admin/team/[memberId]', name: 'Team Member Detail', description: 'View team member profile' },
    { path: '/admin/team/[memberId]/edit', name: 'Edit Team Member', description: 'Edit team member details' },
    { path: '/admin/team/[memberId]/assignments', name: 'Member Assignments', description: 'View member project assignments' },
    { path: '/admin/team/[memberId]/documents', name: 'Member Documents', description: 'View member documents' },
    { path: '/admin/team/[memberId]/performance', name: 'Member Performance', description: 'View member performance metrics' },
  ];

  const clientPages = [
    { path: '/client/[clientId]', name: 'Client Dashboard', description: 'Client portal dashboard' },
    { path: '/client/[clientId]/projects', name: 'Client Projects', description: 'Client project view' },
    { path: '/client/[clientId]/content', name: 'Client Content', description: 'Client content view' },
    { path: '/client/[clientId]/reports', name: 'Client Reports', description: 'Client reports' },
    { path: '/client/[clientId]/support', name: 'Client Support', description: 'Client support' },
  ];

  const utilityPages = [
    { path: '/diagnostic', name: 'Diagnostic', description: 'System diagnostics' },
  ];

  const uiComponents = [
    { name: 'Badge', path: 'components/ui/Badge.tsx' },
    { name: 'Input', path: 'components/ui/Input.tsx' },
    { name: 'Tabs', path: 'components/ui/tabs.tsx' },
    { name: 'Toggle', path: 'components/ui/Toggle.tsx' },
  ];

  const layoutComponents = [
    { name: 'Header', path: 'components/layout/Header.tsx' },
    { name: 'HeaderV2', path: 'components/layout/HeaderV2.tsx' },
    { name: 'HeaderV3', path: 'components/layout/HeaderV3.tsx' },
    { name: 'FooterV2', path: 'components/layout/FooterV2.tsx' },
    { name: 'ConditionalLayout', path: 'components/layout/ConditionalLayout.tsx' },
    { name: 'V2PageWrapper', path: 'components/layouts/V2PageWrapper.tsx' },
  ];

  const sectionComponents = [
    { name: 'HeroSection', path: 'components/sections/HeroSection.tsx' },
    { name: 'HeroSectionV2', path: 'components/sections/HeroSectionV2.tsx' },
    { name: 'HeroSectionV3', path: 'components/sections/v3/HeroSectionV3.tsx' },
    { name: 'ServicesSection', path: 'components/sections/ServicesSection.tsx' },
    { name: 'ServicesSectionV2', path: 'components/sections/ServicesSectionV2.tsx' },
    { name: 'ServicesSectionV3', path: 'components/sections/v3/ServicesSectionV3.tsx' },
    { name: 'ContactSection', path: 'components/sections/ContactSection.tsx' },
    { name: 'ContactSectionV2', path: 'components/sections/ContactSectionV2.tsx' },
    { name: 'ContactSectionV3', path: 'components/sections/v3/ContactSectionV3.tsx' },
    { name: 'CaseStudiesSection', path: 'components/sections/CaseStudiesSection.tsx' },
    { name: 'CaseStudiesSectionV2', path: 'components/sections/CaseStudiesSectionV2.tsx' },
    { name: 'ClientsSection', path: 'components/sections/ClientsSection.tsx' },
    { name: 'ClientsSectionV2', path: 'components/sections/ClientsSectionV2.tsx' },
    { name: 'FeaturesSectionV2', path: 'components/sections/FeaturesSectionV2.tsx' },
    { name: 'PortfolioGridSection', path: 'components/sections/PortfolioGridSection.tsx' },
    { name: 'VideoPortfolioSection', path: 'components/sections/VideoPortfolioSection.tsx' },
    { name: 'CreativeNetworkSection', path: 'components/sections/CreativeNetworkSection.tsx' },
    { name: 'NewsletterSection', path: 'components/sections/NewsletterSection.tsx' },
    { name: 'WorkSectionV3', path: 'components/sections/v3/WorkSectionV3.tsx' },
    { name: 'TestimonialsSectionV3', path: 'components/sections/v3/TestimonialsSectionV3.tsx' },
    { name: 'StatsSectionV3', path: 'components/sections/v3/StatsSectionV3.tsx' },
  ];

  const adminComponents = [
    { name: 'ClientDashboard', path: 'components/admin/ClientDashboard.tsx' },
    { name: 'ClientProfile', path: 'components/admin/ClientProfile.tsx' },
    { name: 'AddClientModal', path: 'components/admin/AddClientModal.tsx' },
    { name: 'AddLeadModal', path: 'components/admin/AddLeadModal.tsx' },
    { name: 'CommunicationHub', path: 'components/admin/CommunicationHub.tsx' },
    { name: 'DocumentManager', path: 'components/admin/DocumentManager.tsx' },
    { name: 'GrowthEngine', path: 'components/admin/GrowthEngine.tsx' },
    { name: 'InvoiceFormNew', path: 'components/admin/InvoiceFormNew.tsx' },
    { name: 'ProposalDashboard', path: 'components/admin/ProposalDashboard.tsx' },
    { name: 'ProposalFormNew', path: 'components/admin/ProposalFormNew.tsx' },
    { name: 'ClientPortalLink', path: 'components/admin/ClientPortalLink.tsx' },
    { name: 'AdminSystem', path: 'components/admin/AdminSystem.tsx' },
    { name: 'DiscoveryWizard', path: 'components/admin/discovery/DiscoveryWizard.tsx' },
  ];

  const discoveryForms = [
    { name: 'CompanyFundamentalsForm', path: 'components/admin/discovery/sections/CompanyFundamentalsForm.tsx' },
    { name: 'ProjectOverviewForm', path: 'components/admin/discovery/sections/ProjectOverviewForm.tsx' },
    { name: 'TargetAudienceForm', path: 'components/admin/discovery/sections/TargetAudienceForm.tsx' },
    { name: 'CurrentStateForm', path: 'components/admin/discovery/sections/CurrentStateForm.tsx' },
    { name: 'GoalsKPIsForm', path: 'components/admin/discovery/sections/GoalsKPIsForm.tsx' },
    { name: 'CompetitionMarketForm', path: 'components/admin/discovery/sections/CompetitionMarketForm.tsx' },
    { name: 'ContentCreativeForm', path: 'components/admin/discovery/sections/ContentCreativeForm.tsx' },
    { name: 'TechnicalRequirementsForm', path: 'components/admin/discovery/sections/TechnicalRequirementsForm.tsx' },
    { name: 'BudgetResourcesForm', path: 'components/admin/discovery/sections/BudgetResourcesForm.tsx' },
    { name: 'NextStepsForm', path: 'components/admin/discovery/sections/NextStepsForm.tsx' },
  ];

  const designSystemAtoms = [
    { name: 'Badge', path: 'design-system/components/atoms/Badge/Badge.tsx' },
    { name: 'Headline', path: 'design-system/components/atoms/Typography/Headline.tsx' },
    { name: 'LinkButton', path: 'design-system/components/atoms/LinkButton/LinkButton.tsx' },
  ];

  const designSystemPrimitives = [
    { name: 'Button', path: 'design-system/components/primitives/Button.tsx' },
    { name: 'Card', path: 'design-system/components/primitives/Card.tsx' },
  ];

  const designSystemMolecules = [
    { name: 'GlassCard', path: 'design-system/components/molecules/GlassCard/GlassCard.tsx' },
    { name: 'StatCard', path: 'design-system/components/molecules/StatCard/StatCard.tsx' },
  ];

  const designSystemOrganisms: { name: string; path: string }[] = [];

  const designSystemLayouts = [
    { name: 'DashboardLayout', path: 'design-system/components/layouts/DashboardLayout.tsx' },
  ];

  const designSystemPatterns = [
    { name: 'MetricCard', path: 'design-system/components/patterns/MetricCard.tsx' },
  ];

  const publicComponents = [
    { name: 'TalentApplicationForm', path: 'components/public/TalentApplicationForm.tsx' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
            We Have
          </h1>
          <p className="text-gray-400 text-lg">
            Complete directory of all pages and components in the codebase
          </p>
        </div>

        {/* Pages Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-purple-400">Pages</h2>

          {/* Public Pages */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-pink-400">Public Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicPages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="block p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-all hover:bg-gray-800"
                >
                  <div className="font-medium text-white">{page.name}</div>
                  <div className="text-sm text-gray-400">{page.path}</div>
                  <div className="text-xs text-gray-500 mt-1">{page.description}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Showcase Pages */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-pink-400">Showcase Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {showcasePages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="block p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-all hover:bg-gray-800"
                >
                  <div className="font-medium text-white">{page.name}</div>
                  <div className="text-sm text-gray-400">{page.path}</div>
                  <div className="text-xs text-gray-500 mt-1">{page.description}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Pages */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-pink-400">Admin Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminPages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="block p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-orange-500 transition-all hover:bg-gray-800"
                >
                  <div className="font-medium text-white">{page.name}</div>
                  <div className="text-sm text-gray-400">{page.path}</div>
                  <div className="text-xs text-gray-500 mt-1">{page.description}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Dynamic Pages */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-pink-400">Admin Dynamic Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminDynamicPages.map((page) => (
                <div
                  key={page.path}
                  className="block p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="font-medium text-white">{page.name}</div>
                  <div className="text-sm text-gray-400">{page.path}</div>
                  <div className="text-xs text-gray-500 mt-1">{page.description}</div>
                  <div className="text-xs text-orange-500 mt-1">Dynamic route - requires ID parameter</div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Pages */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-pink-400">Client Portal Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientPages.map((page) => (
                <div
                  key={page.path}
                  className="block p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="font-medium text-white">{page.name}</div>
                  <div className="text-sm text-gray-400">{page.path}</div>
                  <div className="text-xs text-gray-500 mt-1">{page.description}</div>
                  <div className="text-xs text-yellow-500 mt-1">Dynamic route - requires clientId</div>
                </div>
              ))}
            </div>
          </div>

          {/* Utility Pages */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-pink-400">Utility Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {utilityPages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="block p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-green-500 transition-all hover:bg-gray-800"
                >
                  <div className="font-medium text-white">{page.name}</div>
                  <div className="text-sm text-gray-400">{page.path}</div>
                  <div className="text-xs text-gray-500 mt-1">{page.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-purple-400">Components</h2>

          {/* UI Components */}
          <ComponentSection title="UI Components" components={uiComponents} color="blue" />

          {/* Layout Components */}
          <ComponentSection title="Layout Components" components={layoutComponents} color="green" />

          {/* Section Components */}
          <ComponentSection title="Section Components" components={sectionComponents} color="purple" />

          {/* Admin Components */}
          <ComponentSection title="Admin Components" components={adminComponents} color="orange" />

          {/* Discovery Forms */}
          <ComponentSection title="Discovery Form Sections" components={discoveryForms} color="yellow" />

          {/* Public Components */}
          <ComponentSection title="Public Components" components={publicComponents} color="pink" />

          {/* Design System */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-cyan-400">Design System</h3>

            <ComponentSection title="Atoms" components={designSystemAtoms} color="cyan" />
            <ComponentSection title="Primitives" components={designSystemPrimitives} color="cyan" />
            <ComponentSection title="Molecules" components={designSystemMolecules} color="teal" />
            <ComponentSection title="Organisms" components={designSystemOrganisms} color="emerald" />
            <ComponentSection title="Layouts" components={designSystemLayouts} color="lime" />
            <ComponentSection title="Patterns" components={designSystemPatterns} color="green" />
          </div>
        </section>

        {/* Summary Stats */}
        <section className="mt-16 p-8 bg-gray-800/50 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatBox label="Total Pages" value="46" />
            <StatBox label="Public Pages" value="8" />
            <StatBox label="Admin Pages" value="28" />
            <StatBox label="Total Components" value="87" />
          </div>
        </section>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Freaking Minds - Where Fiction Ends, We Begin</p>
        </footer>
      </div>
    </div>
  );
}

function ComponentSection({
  title,
  components,
  color
}: {
  title: string;
  components: { name: string; path: string }[];
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-400 border-blue-500/30',
    green: 'text-green-400 border-green-500/30',
    purple: 'text-purple-400 border-purple-500/30',
    orange: 'text-orange-400 border-orange-500/30',
    yellow: 'text-yellow-400 border-yellow-500/30',
    pink: 'text-pink-400 border-pink-500/30',
    cyan: 'text-cyan-400 border-cyan-500/30',
    teal: 'text-teal-400 border-teal-500/30',
    emerald: 'text-emerald-400 border-emerald-500/30',
    lime: 'text-lime-400 border-lime-500/30',
  };

  return (
    <div className="mb-8">
      <h3 className={`text-lg font-semibold mb-3 ${colorClasses[color]?.split(' ')[0] || 'text-gray-400'}`}>
        {title} ({components.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {components.map((comp) => (
          <div
            key={comp.path}
            className={`p-3 bg-gray-800/30 rounded-lg border ${colorClasses[color]?.split(' ')[1] || 'border-gray-700'}`}
          >
            <div className="font-medium text-white text-sm">{comp.name}</div>
            <div className="text-xs text-gray-500 truncate" title={comp.path}>
              {comp.path}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-4 bg-gray-900/50 rounded-lg">
      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}
