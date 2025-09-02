import type { Metadata } from "next";
import { ArrowRight, TrendingUp, Users, Award, Eye, MousePointer, ShoppingCart, Zap, Star, Sparkles } from "lucide-react";

// Design System Components
import { 
  LinkButton,
  SectionBuilder,
  HeroSectionBuilder,
  CaseStudyCard,
  PortfolioCard,
  TestimonialCard,
  IndustryCard,
  StatCard,
  patterns 
} from "@/design-system";

// Newsletter Component
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export const metadata: Metadata = {
  title: "Our Work - Freaking Minds | Digital Marketing Case Studies & Portfolio",
  description: "Explore our successful digital marketing campaigns and case studies. See how we've helped 250+ businesses achieve remarkable growth through strategic marketing solutions.",
  keywords: [
    "freaking minds portfolio",
    "digital marketing case studies",
    "marketing campaign results",
    "client success stories",
    "bhopal marketing agency work",
    "seo case studies",
    "social media success stories"
  ],
  openGraph: {
    title: "Our Work - Digital Marketing Success Stories",
    description: "Discover how we've transformed businesses through innovative digital marketing strategies. Real results, real growth, real success.",
    url: "https://freakingminds.in/work",
    type: "website",
  },
};

const caseStudies = [
  {
    client: "TechStart Solutions",
    industry: "Technology",
    title: "300% Increase in Lead Generation Through Strategic SEO",
    description: "Transformed a B2B tech startup's online presence with comprehensive SEO strategy, content marketing, and targeted campaigns.",
    image: "/placeholder-case-study-1.jpg",
    results: [
      { metric: "Organic Traffic", value: "+250%", icon: TrendingUp },
      { metric: "Lead Generation", value: "+300%", icon: Users },
      { metric: "Keyword Rankings", value: "50+ Top 10", icon: Award }
    ],
    tags: ["SEO", "Content Marketing", "Lead Generation"],
    duration: "6 months",
    featured: true
  },
  {
    client: "Fashion Forward",
    industry: "E-commerce",
    title: "₹2Cr+ Revenue Growth Through Social Commerce",
    description: "Leveraged social media marketing and influencer partnerships to drive massive e-commerce growth for a fashion brand.",
    image: "/placeholder-case-study-2.jpg",
    results: [
      { metric: "Revenue Growth", value: "+400%", icon: ShoppingCart },
      { metric: "Social Following", value: "+150K", icon: Users },
      { metric: "Conversion Rate", value: "+85%", icon: MousePointer }
    ],
    tags: ["Social Media", "E-commerce", "Influencer Marketing"],
    duration: "8 months",
    featured: true
  },
  {
    client: "HealthCare Plus",
    industry: "Healthcare",
    title: "Digital Transformation for Healthcare Practice",
    description: "Complete digital overhaul including website redesign, local SEO, and reputation management for a healthcare clinic.",
    image: "/placeholder-case-study-3.jpg",
    results: [
      { metric: "Online Bookings", value: "+180%", icon: Users },
      { metric: "Local Visibility", value: "+200%", icon: Eye },
      { metric: "Patient Reviews", value: "4.8/5 Rating", icon: Star }
    ],
    tags: ["Local SEO", "Website Design", "Reputation Management"],
    duration: "4 months",
    featured: false
  },
  {
    client: "EduTech Academy",
    industry: "Education",
    title: "5X Enrollment Growth Through PPC & Content",
    description: "Strategic PPC campaigns and educational content marketing drove massive enrollment growth for an online education platform.",
    image: "/placeholder-case-study-4.jpg",
    results: [
      { metric: "Enrollments", value: "+500%", icon: Users },
      { metric: "Cost Per Lead", value: "-60%", icon: TrendingUp },
      { metric: "Course Completion", value: "+40%", icon: Award }
    ],
    tags: ["PPC", "Content Marketing", "Education"],
    duration: "10 months",
    featured: false
  },
  {
    client: "Restaurant Chain",
    industry: "Food & Beverage",
    title: "Multi-Location Social Media Success",
    description: "Unified social media strategy across 15 locations, driving foot traffic and online orders through location-based marketing.",
    image: "/placeholder-case-study-5.jpg",
    results: [
      { metric: "Foot Traffic", value: "+120%", icon: Users },
      { metric: "Online Orders", value: "+280%", icon: ShoppingCart },
      { metric: "Brand Engagement", value: "+350%", icon: Eye }
    ],
    tags: ["Social Media", "Local Marketing", "Multi-Location"],
    duration: "12 months",
    featured: false
  },
  {
    client: "Real Estate Pro",
    industry: "Real Estate",
    title: "Lead Generation Revolution in Real Estate",
    description: "Comprehensive digital strategy including SEO, PPC, and social media advertising generated high-quality leads for property sales.",
    image: "/placeholder-case-study-6.jpg",
    results: [
      { metric: "Qualified Leads", value: "+220%", icon: Users },
      { metric: "Property Sales", value: "+150%", icon: Award },
      { metric: "Cost Per Lead", value: "-45%", icon: TrendingUp }
    ],
    tags: ["Lead Generation", "Real Estate", "Multi-Channel"],
    duration: "9 months",
    featured: false
  }
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "TechStart Solutions",
    role: "CEO",
    content: "Freaking Minds transformed our digital presence completely. The results speak for themselves - 300% increase in leads and our best year ever!",
    rating: 5
  },
  {
    name: "Priya Sharma",
    company: "Fashion Forward",
    role: "Marketing Director",
    content: "The team's creative approach and strategic thinking helped us achieve ₹2Cr+ in additional revenue. Truly exceptional partnership!",
    rating: 5
  },
  {
    name: "Dr. Amit Patel",
    company: "HealthCare Plus",
    role: "Practice Owner",
    content: "Professional, results-driven, and truly understands our industry. Our online presence has never been stronger.",
    rating: 5
  }
];

const industries = [
  { name: "Technology", count: "25+" },
  { name: "E-commerce", count: "40+" },
  { name: "Healthcare", count: "30+" },
  { name: "Education", count: "20+" },
  { name: "Real Estate", count: "35+" },
  { name: "Food & Beverage", count: "15+" },
  { name: "Manufacturing", count: "20+" },
  { name: "Professional Services", count: "25+" }
];

export default function WorkPage() {
  const featuredCases = caseStudies.filter(study => study.featured);
  const otherCases = caseStudies.filter(study => !study.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced Design System Version */}
      <HeroSectionBuilder
        badge={{
          text: "Real Results, Real Success Stories",
          icon: <Award className="w-4 h-4 mr-2" />
        }}
        headline={{
          text: "Our Work Speaks Louder Than Words",
          level: "h1",
          accent: { text: "Louder", position: "middle" }
        }}
        description="Discover how we've transformed businesses across industries through innovative digital marketing strategies. Each case study represents real growth, real results, and real partnerships that drive success."
        background="light"
        maxWidth="xl"
        minHeight="large"
        content={
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton href="/get-started" variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
              Start Your Success Story
            </LinkButton>
            <LinkButton href="#" variant="secondary" size="lg">
              Download Portfolio
            </LinkButton>
          </div>
        }
      />

      {/* Impact Stats - Design System Version */}
      <section className={`${patterns.layout.section} bg-gradient-to-r from-fm-magenta-700 to-fm-magenta-800 py-16`}>
        <div className={`${patterns.layout.container} ${patterns.layout.maxWidth.xl}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="250+" label="Successful Projects" variant="gradient" size="lg" icon={<Award className="w-6 h-6" />} />
            <StatCard number="₹50Cr+" label="Revenue Generated" variant="gradient" size="lg" icon={<TrendingUp className="w-6 h-6" />} />
            <StatCard number="300%" label="Average ROI Increase" variant="gradient" size="lg" icon={<TrendingUp className="w-6 h-6" />} />
            <StatCard number="98%" label="Client Satisfaction" variant="gradient" size="lg" icon={<Users className="w-6 h-6" />} />
          </div>
        </div>
      </section>

      {/* Featured Case Studies - Design System Version */}
      <SectionBuilder
        headline={{
          text: "Featured Success Stories",
          level: "h2",
          accent: { text: "Success Stories", position: "end" }
        }}
        description="In-depth case studies showcasing our most impactful campaigns and the strategies behind them."
        background="light"
        content={
          <div className="space-y-16">
            {featuredCases.map((study, index) => (
              <CaseStudyCard
                key={study.client}
                client={study.client}
                industry={study.industry}
                title={study.title}
                description={study.description}
                results={study.results}
                tags={study.tags}
                duration={study.duration}
                reversed={index % 2 === 1}
                imageSlot={
                  <div className="aspect-video bg-gradient-to-br from-fm-magenta-100 to-fm-magenta-200 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Zap className="w-16 h-16 text-fm-magenta-700 mx-auto mb-4" />
                      <p className="text-fm-magenta-700 font-semibold">Case Study Visual</p>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        }
      />

      {/* Other Case Studies Grid - Design System Version */}
      <SectionBuilder
        headline={{
          text: "More Success Stories",
          level: "h2",
          accent: { text: "Success Stories", position: "end" }
        }}
        description="Explore additional case studies showcasing our diverse expertise across industries."
        background="none"
        content={
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherCases.map((study) => (
              <PortfolioCard
                key={study.client}
                client={study.client}
                industry={study.industry}
                title={study.title}
                description={study.description}
                results={study.results}
                tags={study.tags}
                duration={study.duration}
                imageSlot={
                  <div className="aspect-video bg-gradient-to-br from-fm-magenta-100 to-fm-magenta-200 flex items-center justify-center">
                    <Zap className="w-12 h-12 text-fm-magenta-700" />
                  </div>
                }
                size="md"
              />
            ))}
          </div>
        }
      />

      {/* Industries We Serve - Design System Version */}
      <SectionBuilder
        headline={{
          text: "Industries We Serve",
          level: "h2",
          accent: { text: "Serve", position: "end" }
        }}
        description="Our expertise spans across multiple industries, bringing specialized knowledge to every project."
        background="light"
        content={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry) => (
              <IndustryCard
                key={industry.name}
                name={industry.name}
                count={industry.count}
                size="md"
                hover={true}
              />
            ))}
          </div>
        }
      />

      {/* Client Testimonials - Design System Version */}
      <SectionBuilder
        headline={{
          text: "What Our Clients Say",
          level: "h2",
          accent: { text: "Clients Say", position: "end" }
        }}
        description="Don't just take our word for it. Hear from the businesses we've helped transform."
        background="none"
        content={
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.name}
                name={testimonial.name}
                company={testimonial.company}
                role={testimonial.role}
                content={testimonial.content}
                rating={testimonial.rating}
                size="md"
                showQuotes={true}
              />
            ))}
          </div>
        }
      />

      {/* Newsletter Section - Strategic Placement */}
      <NewsletterSection 
        title="Get More Success Stories & Insights"
        description="Loved these results? Get exclusive case studies, marketing insights, and growth strategies from our latest campaigns delivered to your inbox weekly."
        subscriberCount="3,200+ marketers"
        variant="default"
      />

      {/* CreativeMinds Network CTA */}
      <SectionBuilder
        badge={{
          text: "Want to Be Part of These Success Stories?",
          icon: <Sparkles className="w-4 h-4" />
        }}
        headline={{
          text: "Join Our Creative Network",
          level: "h2",
          accent: { text: "Creative Network", position: "end" }
        }}
        description="Are you a creative professional inspired by these results? Join our curated network of top talent and be part of projects that make a real impact."
        background="light"
        content={
          <div className="bg-white rounded-2xl border border-fm-neutral-200 p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-fm-magenta-600" />
                </div>
                <h3 className="font-semibold text-fm-neutral-900 mb-2">Be Part of Award-Winning Projects</h3>
                <p className="text-fm-neutral-600">Work on campaigns that generate real results and win industry recognition.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-fm-magenta-600" />
                </div>
                <h3 className="font-semibold text-fm-neutral-900 mb-2">Grow Your Professional Portfolio</h3>
                <p className="text-fm-neutral-600">Add impressive case studies to your portfolio while working with top brands.</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-fm-neutral-600 mb-6">
                Whether you're a designer, developer, copywriter, or strategist, we're always looking for exceptional talent to join our network.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <LinkButton 
                  href="/creativeminds" 
                  variant="primary" 
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Explore Creative Network
                </LinkButton>
                <LinkButton 
                  href="/creativeminds#apply" 
                  variant="outline" 
                  size="lg"
                  icon={<Users className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Apply to Join
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
          icon: <TrendingUp className="w-4 h-4" />
        }}
        headline={{
          text: "Ready to Be Our Next Success Story?",
          level: "h2"
        }}
        description="Join the growing list of businesses that have transformed their digital presence with our proven strategies. Let's create your success story together."
        background="gradient"
        content={
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton 
              href="/get-started"
              variant="secondary" 
              size="lg" 
              className="bg-fm-neutral-50 text-fm-magenta-700 hover:bg-fm-neutral-100"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Start Your Project
            </LinkButton>
            <LinkButton href="/contact" variant="ghost" size="lg" theme="dark">
              Schedule Discovery Call
            </LinkButton>
          </div>
        }
      />
    </div>
  );
}