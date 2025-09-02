import type { Metadata } from "next";
import { ArrowRight, Users, Target, Award, Heart, Lightbulb, TrendingUp, Sparkles, Zap } from "lucide-react";

// Design System Components
import { 
  LinkButton,
  Headline, 
  SectionBuilder,
  HeroSectionBuilder,
  ValueCard,
  TeamCard,
  StatCard,
  patterns 
} from "@/design-system";

// Newsletter Component
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export const metadata: Metadata = {
  title: "About Us - Freaking Minds | Digital Marketing Experts in Bhopal",
  description: "Meet the team behind Freaking Minds. 50+ years of combined experience in digital marketing, creative design, and strategic consulting. Based in Bhopal, serving clients across India.",
  keywords: [
    "about freaking minds",
    "digital marketing team bhopal",
    "marketing agency team",
    "creative agency about",
    "digital marketing experts",
    "bhopal marketing professionals"
  ],
  openGraph: {
    title: "About Freaking Minds - Digital Marketing Experts",
    description: "Meet our passionate team of digital marketing experts dedicated to transforming businesses through creative excellence and strategic innovation.",
    url: "https://freakingminds.in/about",
    type: "website",
  },
};

const values = [
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Innovation",
    description: "We constantly push boundaries and explore new creative territories to deliver cutting-edge solutions that set our clients apart."
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Authenticity", 
    description: "We believe in genuine brand stories and authentic connections. Every strategy we create reflects the true essence of your brand."
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Results",
    description: "Data-driven approach ensures every campaign delivers measurable ROI. We don't just create beautiful campaigns, we create business growth."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Collaboration",
    description: "Your success is our success. We work as an extension of your team, bringing expertise while respecting your vision and goals."
  }
];

const teamMembers = [
  {
    name: "Rajesh Sharma",
    role: "Founder & Creative Director",
    experience: "15+ years",
    expertise: "Brand Strategy, Creative Direction",
    description: "Visionary leader with a passion for transforming brands through innovative marketing strategies."
  },
  {
    name: "Priya Patel",
    role: "Head of Digital Strategy",
    experience: "12+ years",
    expertise: "Digital Marketing, Performance Analytics",
    description: "Data-driven strategist who turns complex analytics into actionable growth strategies."
  },
  {
    name: "Amit Kumar",
    role: "Senior Creative Designer",
    experience: "10+ years",
    expertise: "Visual Design, Brand Identity",
    description: "Award-winning designer who brings brands to life through compelling visual storytelling."
  },
  {
    name: "Sneha Gupta",
    role: "Content Strategy Lead",
    experience: "8+ years",
    expertise: "Content Marketing, Social Media",
    description: "Master storyteller who crafts content that resonates with audiences and drives engagement."
  }
];

const stats = [
  { number: "50+", label: "Years Combined Experience" },
  { number: "250+", label: "Successful Campaigns" },
  { number: "100+", label: "Happy Clients" },
  { number: "15+", label: "Industry Awards" }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section - Enhanced Design System Version */}
      <HeroSectionBuilder
        badge={{
          text: "Meet the Minds Behind the Magic",
          icon: <Users className="w-4 h-4 mr-2" />
        }}
        headline={{
          text: "We're Not Just a Team, We're Your Partners in Growth",
          level: "h1",
          accent: { text: "Partners", position: "end" }
        }}
        description="Founded in the heart of Bhopal, Freaking Minds has been revolutionizing digital marketing for over a decade. We combine strategic thinking with creative excellence to deliver campaigns that don't just look good—they drive real business results."
        background="light"
        maxWidth="xl"
        minHeight="large"
        content={
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton href="/get-started" variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
              Start Your Journey
            </LinkButton>
            <LinkButton href="/work" variant="secondary" size="lg">
              View Our Work
            </LinkButton>
          </div>
        }
      />

      {/* Stats Section - Design System Version */}
      <section className={`${patterns.layout.section} ${patterns.sectionBackground.light} py-20`}>
        <div className={`${patterns.layout.container} ${patterns.layout.maxWidth.xl}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                number={stat.number}
                label={stat.label}
                variant="minimal"
                size="md"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section - Design System Version */}
      <SectionBuilder
        badge={{
          text: "Our Core Values",
          icon: <Award className="w-4 h-4" />
        }}
        headline={{
          text: "What Drives Our Excellence",
          level: "h2",
          accent: { text: "Excellence", position: "end" }
        }}
        description="These fundamental principles guide every decision we make and every campaign we create."
        background="none"
        content={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <ValueCard
                key={value.title}
                icon={value.icon}
                title={value.title}
                description={value.description}
                size="md"
                hover={true}
              />
            ))}
          </div>
        }
      />

      {/* Team Section - Design System Version */}
      <SectionBuilder
        badge={{
          text: "Meet Our Team",
          icon: <Users className="w-4 h-4" />
        }}
        headline={{
          text: "The Creative Minds Behind Your Success",
          level: "h2",
          accent: { text: "Creative Minds", position: "middle" }
        }}
        description="Our diverse team brings together decades of experience in digital marketing, creative design, and strategic consulting."
        background="light"
        withGlow={true}
        content={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamCard
                key={member.name}
                name={member.name}
                role={member.role}
                experience={member.experience}
                expertise={member.expertise}
                description={member.description}
                size="md"
              />
            ))}
          </div>
        }
      />

      {/* Join Our Extended Team - CreativeMinds Network */}
      <SectionBuilder
        badge={{
          text: "Join Our Extended Team",
          icon: <Sparkles className="w-4 h-4" />
        }}
        headline={{
          text: "Expand Your Creative Horizons",
          level: "h2",
          accent: { text: "Creative Horizons", position: "end" }
        }}
        description="Love what you see? We're always looking for exceptional creative professionals to join our extended network. Be part of projects that make a real difference."
        background="none"
        content={
          <div className="bg-white rounded-2xl border border-fm-neutral-200 p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-fm-magenta-600" />
                </div>
                <h3 className="font-semibold text-fm-neutral-900 mb-2">Collaborative Environment</h3>
                <p className="text-fm-neutral-600">Work alongside industry experts on cutting-edge projects that push creative boundaries.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-fm-magenta-600" />
                </div>
                <h3 className="font-semibold text-fm-neutral-900 mb-2">Professional Growth</h3>
                <p className="text-fm-neutral-600">Access continuous learning opportunities and work on diverse projects across industries.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-fm-magenta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-fm-magenta-600" />
                </div>
                <h3 className="font-semibold text-fm-neutral-900 mb-2">Award-Winning Work</h3>
                <p className="text-fm-neutral-600">Add prestigious projects to your portfolio while working on campaigns that win industry recognition.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-fm-magenta-50 to-fm-orange-50 rounded-xl p-6 mb-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-fm-neutral-900 mb-3">What We're Looking For</h3>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-fm-neutral-700">Designers</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-fm-neutral-700">Developers</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-fm-neutral-700">Copywriters</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-fm-neutral-700">Strategists</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-fm-neutral-700">Content Creators</span>
                </div>
                <p className="text-fm-neutral-600">Passionate professionals who share our values of innovation, authenticity, and results-driven creativity.</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <LinkButton 
                  href="/creativeminds" 
                  variant="primary" 
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Explore CreativeMinds
                </LinkButton>
                <LinkButton 
                  href="/creativeminds#apply" 
                  variant="outline" 
                  size="lg"
                  icon={<Users className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Apply Now
                </LinkButton>
              </div>
            </div>
          </div>
        }
      />

      {/* Newsletter Section - Strategic Placement */}
      <NewsletterSection 
        title="Stay Connected with Our Journey"
        description="Get behind-the-scenes insights, company updates, and industry expertise from the Freaking Minds team delivered straight to your inbox."
        variant="default"
      />

      {/* Achievement Stats - Design System Version */}
      <section className={`${patterns.layout.section} bg-gradient-to-r from-fm-magenta-700 to-fm-magenta-800 py-20`}>
        <div className={`${patterns.layout.container} ${patterns.layout.maxWidth.xl}`}>
          <div className="text-center mb-16">
            <Headline 
              level="h2" 
              theme="dark"
              align="center"
              className="mb-6"
            >
              Proven Track Record of Success
            </Headline>
            <p className="text-lg text-fm-magenta-100 max-w-2xl mx-auto leading-relaxed">
              Numbers don&apos;t lie. Here&apos;s the impact we&apos;ve created for our clients over the years.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <StatCard
                key={`achievement-${stat.label}`}
                number={stat.number}
                label={stat.label}
                variant="gradient"
                size="lg"
                icon={<TrendingUp className="w-6 h-6" />}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Design System Version */}
      <SectionBuilder
        badge={{
          text: "Ready to Get Started?",
          icon: <ArrowRight className="w-4 h-4" />
        }}
        headline={{
          text: "Let's Create Something Amazing Together",
          level: "h2",
          accent: { text: "Amazing", position: "middle" }
        }}
        description="Join the growing list of successful brands that trust Freaking Minds with their digital marketing success."
        background="light"
        withGlow={true}
        content={
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <LinkButton 
              href="/get-started"
              variant="primary" 
              size="lg" 
              icon={<ArrowRight className="w-5 h-5" />} 
              iconPosition="right"
              animation="scale"
            >
              Let&apos;s Create Magic Together
            </LinkButton>
            <LinkButton href="/contact" variant="outline" size="lg">
              Schedule a Call
            </LinkButton>
          </div>
        }
      />
    </div>
  );
}