/**
 * CreativeMinds Public Landing Page
 * Talent registration and network information
 */

'use client';

import { useState } from 'react';
import { TalentApplication } from '@/lib/admin/talent-types';
import { TalentApplicationForm } from '@/components/public/TalentApplicationForm';

// Design System Components
import { 
  LinkButton,
  HeroSectionBuilder,
  StatCard,
  patterns 
} from '@/design-system';

import { 
  Users, 
  Star, 
  Zap, 
  Globe, 
  TrendingUp, 
  Award,
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles
} from 'lucide-react';

export default function CreativeMindsPage() {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleApplicationSubmit = async (application: TalentApplication) => {
    try {
      const response = await fetch('/api/talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_application',
          application
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
        setShowApplicationForm(false);
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Network error. Please try again.');
    }
  };

  if (showApplicationForm) {
    return (
      <TalentApplicationForm
        onSubmit={handleApplicationSubmit}
        onCancel={() => setShowApplicationForm(false)}
      />
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fm-magenta-50 to-fm-neutral-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-fm-neutral-900 mb-4">
            Application Submitted Successfully! 🎉
          </h1>
          
          <p className="text-lg text-fm-neutral-600 mb-8">
            Thank you for joining the CreativeMinds network. Our team will review your application 
            and get back to you within 48 hours.
          </p>
          
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-fm-magenta-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-fm-magenta-600">1</span>
                </div>
                <span className="text-sm">Application review (24-48 hours)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-fm-magenta-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-fm-magenta-600">2</span>
                </div>
                <span className="text-sm">Portfolio verification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-fm-magenta-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-fm-magenta-600">3</span>
                </div>
                <span className="text-sm">Welcome to the network & first project opportunities</span>
              </div>
            </div>
          </div>
          
          <LinkButton
            href="https://freakingminds.in"
            variant="primary"
            size="lg"
            icon={<ArrowRight className="h-4 w-4" />}
            iconPosition="right"
          >
            Visit Freaking Minds
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Design System Version */}
      <HeroSectionBuilder
        badge={{
          text: "Join India's Premium Talent Network",
          icon: <Sparkles className="w-4 h-4 mr-2" />
        }}
        headline={{
          text: "Welcome to CreativeMinds",
          level: "h1",
          accent: { text: "CreativeMinds", position: "end" }
        }}
        description="Connect with premium brands, earn consistently, and grow your career with India's most trusted creative talent network. Join 500+ verified professionals."
        background="light"
        maxWidth="xl"
        minHeight="large"
        content={
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LinkButton
                variant="primary"
                size="lg"
                onClick={() => setShowApplicationForm(true)}
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
                className="px-8 py-4 text-lg"
              >
                Apply to Join Network
              </LinkButton>
              
              <LinkButton
                variant="outline"
                size="lg"
                onClick={() => {
                  const video = document.getElementById('demo-video') as HTMLVideoElement;
                  if (video) {
                    video.play();
                    video.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                icon={<Play className="h-5 w-5" />}
                iconPosition="left"
                className="px-8 py-4 text-lg"
              >
                Watch Demo
              </LinkButton>
            </div>
            
            {/* Stats - Subtle Hero Treatment */}
            <div className="bg-fm-magenta-50/80 backdrop-blur-sm border border-fm-magenta-200/60 rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">
                    500+
                  </div>
                  <div className="text-sm text-fm-neutral-700 font-medium">
                    Verified Talents
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">
                    100+
                  </div>
                  <div className="text-sm text-fm-neutral-700 font-medium">
                    Active Clients
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">
                    ₹2Cr+
                  </div>
                  <div className="text-sm text-fm-neutral-700 font-medium">
                    Projects Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">
                    4.9★
                  </div>
                  <div className="text-sm text-fm-neutral-700 font-medium">
                    Average Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      {/* Video Demo Section */}
      <section className={`${patterns.layout.section} py-16`}>
        <div className={`${patterns.layout.container} max-w-4xl mx-auto`}>
          <video 
            id="demo-video"
            className="w-full rounded-2xl shadow-2xl"
            controls
            poster="/api/placeholder/800/450"
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`${patterns.layout.section} py-20`}>
        <div className={`${patterns.layout.container} ${patterns.layout.maxWidth.xl}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-fm-neutral-900 mb-4">
              Why Join CreativeMinds?
            </h2>
            <p className="text-xl text-fm-neutral-600 max-w-2xl mx-auto">
              We're not just another freelance platform. We're a premium network 
              that values quality over quantity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="p-3 bg-fm-magenta-100 rounded-xl w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-fm-magenta-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Projects</h3>
              <p className="text-fm-neutral-600">
                Work with top brands and startups. Average project value: ₹25,000+
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="p-3 bg-fm-magenta-100 rounded-xl w-fit mb-4">
                <Zap className="h-6 w-6 text-fm-magenta-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Payments</h3>
              <p className="text-fm-neutral-600">
                Get paid within 7 days of project completion. No payment delays.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="p-3 bg-fm-magenta-100 rounded-xl w-fit mb-4">
                <Users className="h-6 w-6 text-fm-magenta-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Curated Network</h3>
              <p className="text-fm-neutral-600">
                Join an exclusive community of verified professionals. Quality over quantity.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="p-3 bg-fm-magenta-100 rounded-xl w-fit mb-4">
                <Globe className="h-6 w-6 text-fm-magenta-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Exposure</h3>
              <p className="text-fm-neutral-600">
                Work with international clients and expand your portfolio globally.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="p-3 bg-fm-magenta-100 rounded-xl w-fit mb-4">
                <Award className="h-6 w-6 text-fm-magenta-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Skill Development</h3>
              <p className="text-fm-neutral-600">
                Access to workshops, courses, and mentorship from industry experts.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="p-3 bg-fm-magenta-100 rounded-xl w-fit mb-4">
                <Star className="h-6 w-6 text-fm-magenta-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Recognition</h3>
              <p className="text-fm-neutral-600">
                Build your reputation with verified reviews and showcase your work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-white py-20">
        <div className={`${patterns.layout.container} ${patterns.layout.maxWidth.xl}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-fm-neutral-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-fm-neutral-600">
              Hear from our network members who've grown their careers with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-fm-neutral-50 rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-fm-neutral-700 mb-4">
                "Joined CreativeMinds 8 months ago. Tripled my income and work with amazing brands. 
                The quality of projects is unmatched!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fm-magenta-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-fm-magenta-600">P</span>
                </div>
                <div>
                  <div className="font-semibold">Priya Sharma</div>
                  <div className="text-sm text-fm-neutral-600">UI/UX Designer</div>
                </div>
              </div>
            </div>
            
            <div className="bg-fm-neutral-50 rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-fm-neutral-700 mb-4">
                "The payment system is incredible. Always paid on time, great communication 
                from the Freaking Minds team. Highly recommend!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fm-magenta-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-fm-magenta-600">R</span>
                </div>
                <div>
                  <div className="font-semibold">Rohit Patel</div>
                  <div className="text-sm text-fm-neutral-600">Full Stack Developer</div>
                </div>
              </div>
            </div>
            
            <div className="bg-fm-neutral-50 rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-fm-neutral-700 mb-4">
                "As a content creator, CreativeMinds connected me with brands that align 
                with my values. Genuine partnerships, not just transactions."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fm-magenta-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-fm-magenta-600">A</span>
                </div>
                <div>
                  <div className="font-semibold">Anita Gupta</div>
                  <div className="text-sm text-fm-neutral-600">Content Creator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-800 py-20">
        <div className={`${patterns.layout.container} max-w-4xl mx-auto text-center`}>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-fm-magenta-100 mb-8 max-w-2xl mx-auto">
            Join CreativeMinds today and connect with premium brands looking for 
            talented professionals like you.
          </p>
          
          <LinkButton
            variant="secondary"
            size="lg"
            onClick={() => setShowApplicationForm(true)}
            icon={<ArrowRight className="h-5 w-5" />}
            iconPosition="right"
            className="px-8 py-4 text-lg bg-white text-fm-magenta-600 border-white hover:bg-fm-magenta-50"
          >
            Start Your Application
          </LinkButton>
          
          <div className="mt-8 text-fm-magenta-100">
            <p className="text-sm">
              Application review time: 24-48 hours • No application fee • Premium network
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-fm-neutral-900 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold text-white mb-4">
            CreativeMinds by Freaking Minds
          </div>
          <p className="text-fm-neutral-400 mb-6">
            India's Premier Creative Talent Network
          </p>
          <div className="flex justify-center gap-8 text-sm text-fm-neutral-400">
            <a href="https://freakingminds.in" className="hover:text-white">Main Website</a>
            <a href="mailto:hello@freakingminds.in" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </div>
  );
}