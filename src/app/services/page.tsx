'use client';

import { ArrowRight, Search, Megaphone, Palette, BarChart3, Globe, Video, Zap, Target, Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { V2PageWrapper } from "@/components/layouts/V2PageWrapper";

const services = [
  {
    icon: Search,
    id: "seo",
    title: "Search Engine Optimization (SEO)",
    tagline: "Get found. Get chosen.",
    description: "Dominate search results with our data-driven SEO strategies. We optimize your website for visibility, traffic, and conversions.",
    features: ["Keyword Research & Strategy", "On-page & Technical SEO", "Link Building & Content Marketing", "Local SEO Optimization", "SEO Audits & Reporting"],
    results: "Proven strategies to boost organic traffic and search visibility",
    colorClass: "v2-gradient-seo"
  },
  {
    icon: Megaphone,
    id: "social",
    title: "Social Media Marketing",
    tagline: "Stop posting. Start connecting.",
    description: "Build engaged communities and drive brand awareness across all major social platforms with strategic content and campaigns.",
    features: ["Social Media Strategy", "Content Creation & Curation", "Community Management", "Paid Social Advertising", "Influencer Partnerships"],
    results: "Build engaged communities that drive brand awareness",
    colorClass: "v2-gradient-social"
  },
  {
    icon: BarChart3,
    id: "performance",
    altIds: ["performance-marketing"],
    title: "Pay-Per-Click (PPC) Advertising",
    tagline: "Every rupee. Maximum impact.",
    description: "Maximize your ROI with targeted PPC campaigns across Google Ads, Facebook, and other platforms.",
    features: ["Google Ads Management", "Facebook & Instagram Ads", "Shopping Campaigns", "Remarketing Strategies", "Conversion Optimization"],
    results: "Data-driven campaigns that maximize your ad spend ROI",
    colorClass: "v2-gradient-performance"
  },
  {
    icon: Palette,
    id: "branding",
    altIds: ["brand-strategy"],
    title: "Creative Design & Branding",
    tagline: "Look unforgettable.",
    description: "Create compelling visual identities and marketing materials that resonate with your target audience.",
    features: ["Brand Identity Design", "Logo & Visual Guidelines", "Marketing Collateral", "Packaging Design", "Brand Strategy Consulting"],
    results: "Build memorable brand identities that stand out",
    colorClass: "v2-gradient-brand"
  },
  {
    icon: Globe,
    id: "web",
    altIds: ["digital-experience"],
    title: "Website Design & Development",
    tagline: "Fast. Beautiful. Converting.",
    description: "Build fast, responsive, and conversion-optimized websites that serve as powerful marketing tools.",
    features: ["Responsive Web Design", "E-commerce Development", "Landing Page Optimization", "CMS Integration", "Performance Optimization"],
    results: "Fast, responsive sites that convert visitors into customers",
    colorClass: "v2-gradient-web"
  },
  {
    icon: Video,
    id: "content",
    altIds: ["creative-content"],
    title: "Content Marketing & Video Production",
    tagline: "Stories that sell.",
    description: "Engage your audience with high-quality content that tells your brand story and drives action.",
    features: ["Content Strategy", "Blog Writing & SEO Content", "Video Production", "Graphic Design", "Email Marketing"],
    results: "Content that drives engagement and generates quality leads",
    colorClass: "v2-gradient-content"
  }
];

const packages = [
  {
    name: "Startup Spark",
    price: "₹25,000",
    period: "/month",
    description: "Perfect for startups and small businesses looking to establish their digital presence.",
    features: ["Basic SEO Setup", "Social Media Management (2 platforms)", "Monthly Content Creation", "Basic Analytics Reporting", "Email Support"],
    popular: false
  },
  {
    name: "Growth Accelerator",
    price: "₹50,000",
    period: "/month",
    description: "Ideal for growing businesses ready to scale their digital marketing efforts.",
    features: ["Advanced SEO & Content Marketing", "Multi-platform Social Media", "PPC Campaign Management", "Monthly Strategy Calls", "Dedicated Account Manager"],
    popular: true
  },
  {
    name: "Enterprise Excellence",
    price: "₹1,00,000",
    period: "/month",
    description: "Comprehensive solution for established businesses seeking market leadership.",
    features: ["Full-service Digital Marketing", "Custom Strategy Development", "Advanced Analytics & BI", "Weekly Performance Reviews", "Priority Support & Consultation"],
    popular: false
  }
];

const process = [
  { step: "01", title: "Discovery & Audit", description: "We analyze your current digital presence, understand your goals, and identify opportunities for growth." },
  { step: "02", title: "Strategy Development", description: "Our team creates a comprehensive digital marketing strategy tailored to your business objectives and target audience." },
  { step: "03", title: "Implementation", description: "We execute your custom strategy with precision, using the latest tools and best practices for maximum impact." },
  { step: "04", title: "Monitor & Optimize", description: "Continuous monitoring and optimization ensure your campaigns deliver the best possible results and ROI." }
];

export default function ServicesPage() {
  return (
    <V2PageWrapper>
      {/* Hero Section */}
      <section className="relative z-10 v2-section pt-32 lg:pt-40">
        <div className="v2-container v2-container-wide">
          <div className="max-w-4xl mx-auto" style={{ textAlign: 'center' }}>
            {/* Badge */}
            <div className="v2-badge v2-badge-glass mb-8">
              <Zap className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">Comprehensive Digital Marketing Solutions</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold v2-text-primary mb-8 leading-tight">
              Services That{' '}
              <span className="v2-accent">Transform</span>{' '}
              Your Business
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed" style={{ marginBottom: '48px' }}>
              From SEO and social media to PPC and creative design, we offer comprehensive digital marketing services that drive real business growth. Every strategy is custom-crafted to achieve your unique goals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="v2-btn v2-btn-primary">
                Get Custom Proposal
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#process" className="v2-btn v2-btn-secondary">
                View Our Process
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative z-10 v2-section">
        <div className="v2-container">
          <div className="max-w-3xl mx-auto" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="v2-badge v2-badge-glass mb-6">
              <Award className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">What We Offer</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold v2-text-primary mb-8 leading-tight">
              Our <span className="v2-accent">Core Services</span>
            </h2>
            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed">
              End-to-end digital marketing solutions designed to accelerate your business growth.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.title} id={service.id} className="relative v2-paper rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 scroll-mt-24">
                  {/* Alt anchor IDs for footer links */}
                  {service.altIds?.map((altId) => (
                    <div key={altId} id={altId} style={{ position: 'absolute', top: '-6rem' }} />
                  ))}
                  {/* Icon & Tagline */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl ${service.colorClass} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-fm-magenta-600 font-semibold text-sm tracking-wide uppercase">{service.tagline}</p>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-xl font-bold text-fm-neutral-900 mb-3">{service.title}</h3>
                  <p className="text-fm-neutral-600 text-sm mb-6 leading-relaxed">{service.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-fm-magenta-500 flex-shrink-0" />
                        <span className="text-sm text-fm-neutral-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Results Badge */}
                  <div className="pt-4 border-t border-fm-neutral-100">
                    <p className="text-sm text-fm-magenta-600 font-semibold">{service.results}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="relative z-10 v2-section">
        <div className="v2-container">
          {/* Floating Brain */}
          <div className="absolute right-8 lg:right-20 top-0 hidden lg:block z-10">
            <img
              src="/3dasset/brain-strategy.png"
              alt="Strategic Thinking"
              className="w-32 lg:w-44 h-auto animate-v2-hero-float drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
            />
          </div>

          <div className="max-w-3xl mx-auto" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="v2-badge v2-badge-glass mb-6">
              <Target className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">Our Proven Process</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold v2-text-primary mb-8 leading-tight">
              A Systematic Approach to{' '}
              <span className="v2-accent">Success</span>
            </h2>
            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed">
              A systematic approach that ensures consistent results and sustainable growth for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 lg:gap-8">
            {process.map((step, index) => (
              <div key={step.step} className="v2-paper rounded-2xl p-8 text-center relative">
                <div className="font-display text-5xl font-bold text-fm-magenta-100 mb-4">{step.step}</div>
                <h3 className="font-display text-xl font-bold text-fm-neutral-900 mb-3">{step.title}</h3>
                <p className="text-fm-neutral-600 text-sm leading-relaxed">{step.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-fm-neutral-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 v2-section">
        <div className="v2-container">
          <div className="max-w-3xl mx-auto" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="v2-badge v2-badge-glass mb-6">
              <Zap className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">Transparent Pricing</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold v2-text-primary mb-8 leading-tight">
              Choose Your{' '}
              <span className="v2-accent">Growth Package</span>
            </h2>
            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed">
              Flexible packages designed to fit businesses of all sizes. All packages include dedicated support and monthly reporting.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative v2-paper rounded-2xl p-8 ${
                  pkg.popular ? 'ring-2 ring-fm-magenta-500 xl:scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-fm-magenta-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-2xl font-bold text-fm-neutral-900 mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-fm-magenta-600">{pkg.price}</span>
                  <span className="text-fm-neutral-500">{pkg.period}</span>
                </div>
                <p className="text-fm-neutral-600 text-sm mb-6 leading-relaxed">{pkg.description}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-fm-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-fm-magenta-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`v2-btn v2-btn-full ${pkg.popular ? 'v2-btn-magenta' : 'v2-btn-neutral'}`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <p className="v2-text-secondary" style={{ marginBottom: '16px' }}>
              Need a custom solution? We create tailored packages for enterprise clients.
            </p>
            <Link href="/contact" className="v2-btn v2-btn-secondary">
              Request Custom Quote
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 v2-section pb-32">
        <div className="v2-container v2-container-narrow">
          <div className="v2-paper rounded-3xl p-10 lg:p-14" style={{ textAlign: 'center' }}>
            <div className="v2-badge v2-badge-light mb-6">
              <Target className="w-4 h-4" />
              <span>Ready to Get Started?</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-fm-neutral-900 mb-6 leading-tight">
              Ready to Transform Your Business?
            </h2>
            <p className="text-fm-neutral-600 mb-8 max-w-xl mx-auto">
              Let's discuss your goals and create a custom digital marketing strategy that drives real results for your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="v2-btn v2-btn-magenta">
                Start Your Project Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="tel:+919833257659" className="v2-btn v2-btn-outline">
                Call +91 98332 57659
              </Link>
            </div>
          </div>
        </div>
      </section>
    </V2PageWrapper>
  );
}
