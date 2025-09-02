import type { Metadata } from "next";
import { ArrowRight, Search, Megaphone, Palette, BarChart3, Globe, Video, Zap, Target, Users, Award } from "lucide-react";

// Design System Components
import { 
  LinkButton,
  SectionBuilder,
  HeroSectionBuilder,
  ServiceCard,
  PricingCard,
  ProcessStep,
  patterns 
} from "@/design-system";

export const metadata: Metadata = {
  title: "Digital Marketing Services - Freaking Minds | SEO, Social Media, PPC & More",
  description: "Comprehensive digital marketing services in Bhopal. SEO, social media marketing, PPC, content creation, branding, and performance marketing. Results-driven solutions for your business growth.",
  keywords: [
    "digital marketing services bhopal",
    "seo services bhopal",
    "social media marketing",
    "ppc advertising",
    "content marketing",
    "branding services",
    "website design",
    "performance marketing"
  ],
  openGraph: {
    title: "Digital Marketing Services - Freaking Minds",
    description: "Transform your business with our comprehensive digital marketing services. From SEO to social media, we drive results that matter.",
    url: "https://freakingminds.in/services",
    type: "website",
  },
};

const services = [
  {
    icon: Search,
    title: "Search Engine Optimization (SEO)",
    description: "Dominate search results with our data-driven SEO strategies. We optimize your website for visibility, traffic, and conversions.",
    features: [
      "Keyword Research & Strategy",
      "On-page & Technical SEO",
      "Link Building & Content Marketing",
      "Local SEO Optimization",
      "SEO Audits & Reporting"
    ],
    results: "Average 150% increase in organic traffic within 6 months"
  },
  {
    icon: Megaphone,
    title: "Social Media Marketing",
    description: "Build engaged communities and drive brand awareness across all major social platforms with strategic content and campaigns.",
    features: [
      "Social Media Strategy",
      "Content Creation & Curation",
      "Community Management",
      "Paid Social Advertising",
      "Influencer Partnerships"
    ],
    results: "Average 200% growth in social engagement and followers"
  },
  {
    icon: BarChart3,
    title: "Pay-Per-Click (PPC) Advertising",
    description: "Maximize your ROI with targeted PPC campaigns across Google Ads, Facebook, and other platforms.",
    features: [
      "Google Ads Management",
      "Facebook & Instagram Ads",
      "Shopping Campaigns",
      "Remarketing Strategies",
      "Conversion Optimization"
    ],
    results: "Average 300% return on ad spend (ROAS)"
  },
  {
    icon: Palette,
    title: "Creative Design & Branding",
    description: "Create compelling visual identities and marketing materials that resonate with your target audience.",
    features: [
      "Brand Identity Design",
      "Logo & Visual Guidelines",
      "Marketing Collateral",
      "Packaging Design",
      "Brand Strategy Consulting"
    ],
    results: "Enhanced brand recognition by 180% on average"
  },
  {
    icon: Globe,
    title: "Website Design & Development",
    description: "Build fast, responsive, and conversion-optimized websites that serve as powerful marketing tools.",
    features: [
      "Responsive Web Design",
      "E-commerce Development",
      "Landing Page Optimization",
      "CMS Integration",
      "Performance Optimization"
    ],
    results: "Average 120% improvement in conversion rates"
  },
  {
    icon: Video,
    title: "Content Marketing & Video Production",
    description: "Engage your audience with high-quality content that tells your brand story and drives action.",
    features: [
      "Content Strategy",
      "Blog Writing & SEO Content",
      "Video Production",
      "Graphic Design",
      "Email Marketing"
    ],
    results: "250% increase in content engagement and lead generation"
  }
];

const packages = [
  {
    name: "Startup Spark",
    price: "₹25,000",
    period: "/month",
    description: "Perfect for startups and small businesses looking to establish their digital presence.",
    features: [
      "Basic SEO Setup",
      "Social Media Management (2 platforms)",
      "Monthly Content Creation",
      "Basic Analytics Reporting",
      "Email Support"
    ],
    popular: false
  },
  {
    name: "Growth Accelerator",
    price: "₹50,000",
    period: "/month",
    description: "Ideal for growing businesses ready to scale their digital marketing efforts.",
    features: [
      "Advanced SEO & Content Marketing",
      "Multi-platform Social Media",
      "PPC Campaign Management",
      "Monthly Strategy Calls",
      "Dedicated Account Manager"
    ],
    popular: true
  },
  {
    name: "Enterprise Excellence",
    price: "₹1,00,000",
    period: "/month",
    description: "Comprehensive solution for established businesses seeking market leadership.",
    features: [
      "Full-service Digital Marketing",
      "Custom Strategy Development",
      "Advanced Analytics & BI",
      "Weekly Performance Reviews",
      "Priority Support & Consultation"
    ],
    popular: false
  }
];

const process = [
  {
    step: "01",
    title: "Discovery & Audit",
    description: "We analyze your current digital presence, understand your goals, and identify opportunities for growth."
  },
  {
    step: "02",
    title: "Strategy Development",
    description: "Our team creates a comprehensive digital marketing strategy tailored to your business objectives and target audience."
  },
  {
    step: "03",
    title: "Implementation",
    description: "We execute your custom strategy with precision, using the latest tools and best practices for maximum impact."
  },
  {
    step: "04",
    title: "Monitor & Optimize",
    description: "Continuous monitoring and optimization ensure your campaigns deliver the best possible results and ROI."
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced Design System Version */}
      <HeroSectionBuilder
        badge={{
          text: "Comprehensive Digital Marketing Solutions",
          icon: <Zap className="w-4 h-4 mr-2" />
        }}
        headline={{
          text: "Services That Transform Your Business",
          level: "h1",
          accent: { text: "Transform", position: "middle" }
        }}
        description="From SEO and social media to PPC and creative design, we offer comprehensive digital marketing services that drive real business growth. Every strategy is custom-crafted to achieve your unique goals."
        background="gradient"
        maxWidth="xl"
        minHeight="large"
        content={
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton href="/contact" variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
              Get Custom Proposal
            </LinkButton>
            <LinkButton href="#process" variant="secondary" size="lg">
              View Our Process
            </LinkButton>
          </div>
        }
      />

      {/* Services Grid - Design System Version */}
      <SectionBuilder
        headline={{
          text: "Our Core Services",
          level: "h2",
          accent: { text: "Core Services", position: "end" }
        }}
        description="End-to-end digital marketing solutions designed to accelerate your business growth."
        background="light"
        content={
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                icon={<service.icon className="w-8 h-8" />}
                title={service.title}
                description={service.description}
                features={service.features}
                results={service.results}
                size="md"
                layout="horizontal"
              />
            ))}
          </div>
        }
      />

      {/* Our Process - Design System Version */}
      <section id="process">
        <SectionBuilder
        headline={{
          text: "Our Proven Process",
          level: "h2",
          accent: { text: "Process", position: "end" }
        }}
        description="A systematic approach that ensures consistent results and sustainable growth for your business."
        background="none"
        content={
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <ProcessStep
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
                isLast={index === process.length - 1}
                size="md"
                layout="horizontal"
              />
            ))}
          </div>
        }
      />
      </section>

      {/* Pricing Packages - Design System Version */}
      <SectionBuilder
        headline={{
          text: "Choose Your Growth Package",
          level: "h2",
          accent: { text: "Growth Package", position: "end" }
        }}
        description="Flexible packages designed to fit businesses of all sizes. All packages include dedicated support and monthly reporting."
        background="light"
        content={
          <>
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg) => (
                <PricingCard
                  key={pkg.name}
                  name={pkg.name}
                  price={pkg.price}
                  period={pkg.period}
                  description={pkg.description}
                  features={pkg.features}
                  popular={pkg.popular}
                  size="md"
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className={`${patterns.typography.body.secondary} mb-6`}>
                Need a custom solution? We create tailored packages for enterprise clients.
              </p>
              <LinkButton href="/contact" variant="secondary" size="lg">
                Request Custom Quote
              </LinkButton>
            </div>
          </>
        }
      />

      {/* CreativeMinds Talent Network Section */}
      <SectionBuilder
        badge={{
          text: "Need Custom Talent?",
          icon: <Users className="w-4 h-4" />
        }}
        headline={{
          text: "Access India's Top Creative Talent",
          level: "h2",
          accent: { text: "Creative Talent", position: "end" }
        }}
        description="Can't find the perfect fit for your project? Explore our curated network of 150+ verified creative professionals, from designers and developers to content creators and strategists."
        background="none"
        content={
          <div className="bg-white rounded-2xl border border-fm-neutral-200 p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {/* Talent Categories */}
              <div className="text-center">
                <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-fm-magenta-600" />
                </div>
                <h3 className="font-semibold text-fm-neutral-900 mb-2">Designers</h3>
                <p className="text-sm text-fm-neutral-600">UI/UX, Graphic Design, Branding, Illustration</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-fm-magenta-600" />
                </div>
                <h3 className="font-semibold text-fm-neutral-900 mb-2">Content Creators</h3>
                <p className="text-sm text-fm-neutral-600">Video Production, Photography, Copywriting</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-fm-magenta-600" />
                </div>
                <h3 className="font-semibold text-fm-neutral-900 mb-2">Strategists</h3>
                <p className="text-sm text-fm-neutral-600">Digital Strategy, Analytics, Campaign Management</p>
              </div>
            </div>
            
            <div className="bg-fm-magenta-50 rounded-xl p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <Award className="w-8 h-8 text-fm-magenta-600" />
                  <div>
                    <div className="text-2xl font-bold text-fm-magenta-700">95%</div>
                    <div className="text-sm text-fm-neutral-600">Client Satisfaction Rate</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Users className="w-8 h-8 text-fm-magenta-600" />
                  <div>
                    <div className="text-2xl font-bold text-fm-magenta-700">150+</div>
                    <div className="text-sm text-fm-neutral-600">Verified Professionals</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-fm-neutral-600 mb-6">
                All talent is pre-vetted, with proven track records and expertise in their respective fields. 
                Perfect for when you need specialized skills for specific projects.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <LinkButton 
                  href="/creativeminds" 
                  variant="primary" 
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Browse Talent Network
                </LinkButton>
                <LinkButton 
                  href="/creativeminds#apply" 
                  variant="outline" 
                  size="lg"
                  icon={<Users className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Join as Professional
                </LinkButton>
              </div>
            </div>
          </div>
        }
      />

      {/* CTA Section - Design System Version */}
      <SectionBuilder
        badge={{
          text: "Ready to Get Started?",
          icon: <Target className="w-4 h-4" />
        }}
        headline={{
          text: "Ready to Transform Your Business?",
          level: "h2"
        }}
        description="Let's discuss your goals and create a custom digital marketing strategy that drives real results for your business."
        background="gradient"
        content={
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton 
              href="/contact"
              variant="secondary" 
              size="lg" 
              className="bg-fm-neutral-50 text-fm-magenta-700 hover:bg-fm-neutral-100"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Start Your Project Today
            </LinkButton>
            <LinkButton href="tel:+919833257659" variant="ghost" size="lg" theme="dark">
              Call +91 98332 57659
            </LinkButton>
          </div>
        }
      />
    </div>
  );
}