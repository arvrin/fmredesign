import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  ArrowRight,
  Star,
  Heart
} from 'lucide-react';
import './footer-animations.css';

const navigation = {
  services: [
    { name: 'SEO & Search Marketing', href: '/services' },
    { name: 'Social Media Management', href: '/services' },
    { name: 'Creative Design', href: '/services' },
    { name: 'Performance Marketing', href: '/services' },
    { name: 'Mobile Marketing', href: '/services' },
    { name: 'Digital Strategy', href: '/services' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Work', href: '/work' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Free Resources', href: '/resources' },
    { name: 'Digital Marketing Guide', href: '/resources/guide' },
    { name: 'Industry Reports', href: '/resources/reports' },
    { name: 'Webinars', href: '/resources/webinars' },
    { name: 'Tools', href: '/resources/tools' },
    { name: 'Templates', href: '/resources/templates' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR Compliance', href: '/gdpr' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/Freakingmindsdigital' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/freakingminds' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/freakingminds' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/freaking-minds' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/freakingminds' },
];

export function Footer() {
  return (
    <footer className="relative bg-fm-neutral-900 text-fm-neutral-300 overflow-hidden">
      {/* Premium Newsletter Section - Light Theme */}
      <div className="relative py-0 bg-gradient-to-b from-fm-neutral-50 to-fm-neutral-100 overflow-visible border-b border-fm-neutral-200/50">
        {/* Ambient Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, rgba(179,41,104,0.08) 0%, transparent 50%),
                          radial-gradient(ellipse at 70% 80%, rgba(255,107,53,0.05) 0%, transparent 50%)`
            }}
          />
        </div>
        
        <div className="relative z-10 px-4 md:px-8 lg:px-16" style={{ paddingTop: '5rem', paddingBottom: '5rem', maxWidth: '1440px', margin: '0 auto' }}>
          {/* Enhanced Newsletter Container - Matching CTA Section Style */}
          <div className="relative" style={{ marginTop: '0', marginBottom: '0' }}>
            {/* Signature Magenta Glow Effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-fm-magenta-400/20 via-fm-magenta-300/10 to-fm-magenta-400/20 rounded-3xl blur-2xl opacity-60" />
            <div className="absolute -inset-2 bg-fm-magenta-500/10 rounded-3xl blur-xl" />
            
            {/* Glass Container with Enhanced Styling */}
            <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40" style={{ padding: '3rem 2rem' }}>
              <div className="max-w-2xl mx-auto text-center">
                {/* Badge - Consistent with project standard */}
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-fm-magenta-50/80 backdrop-blur-sm border border-fm-magenta-200 rounded-full text-fm-magenta-700 text-sm font-medium footer-animate-fade-in badge-glow">
                    <Star className="w-4 h-4 mr-2 animate-pulse-slow" />
                    Newsletter
                  </div>
                </div>
              
                <h2 className="font-bold text-fm-neutral-900 footer-animate-fade-in-up mb-8" 
                    style={{ 
                      fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                      lineHeight: '1.15',
                      animationDelay: '100ms',
                      marginBottom: '2rem'
                    }}>
                  Stay{' '}
                  <span className="text-fm-magenta-700 relative inline-block">
                    Ahead
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-3 text-fm-magenta-700"
                      viewBox="0 0 200 12"
                      fill="currentColor"
                    >
                      <path d="M2 8c40-6 80-6 120 0s80 6 120 0" stroke="currentColor" strokeWidth="3" fill="none" />
                    </svg>
                  </span>{' '}
                  of the Curve
                </h2>
              
                <div className="flex justify-center mb-10">
                  <p className="text-lg text-fm-neutral-600 leading-relaxed footer-animate-fade-in-up text-center" 
                     style={{ maxWidth: '520px', animationDelay: '200ms', lineHeight: '1.6' }}>
                    Get the latest digital marketing insights, trends, and strategies delivered 
                    straight to your inbox. No spam, just valuable content.
                  </p>
                </div>
              
                <div className="footer-animate-scale-in" style={{ animationDelay: '300ms' }}>
                  <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 max-w-xl mx-auto mb-8">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 bg-fm-neutral-100/80 border border-fm-neutral-300 px-6 py-4 rounded-xl text-fm-neutral-900 placeholder-fm-neutral-500 focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700 focus:bg-white transition-all duration-300 shadow-lg text-base"
                      style={{ minHeight: '56px' }}
                    />
                    <Button variant="primary" size="lg" className="sm:flex-shrink-0 group shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105" style={{ minHeight: '56px', paddingLeft: '2rem', paddingRight: '2rem' }}>
                      <span className="mr-2">Subscribe</span>
                      <ArrowRight className="w-5 h-5 inline-block transform transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-fm-neutral-600 font-medium">
                    Join 2,500+ marketers getting weekly insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Main Footer Content */}
      <div className="relative overflow-hidden">
        {/* Footer Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 footer-gradient-bg" />
          <div className="noise-overlay" />
        </div>
        
        <div className="relative z-10 px-4 md:px-8 lg:px-16" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '1440px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Enhanced Company Info */}
            <div className="lg:col-span-2 footer-animate-fade-in-up">
              <Link href="/" className="inline-block mb-8">
                <span className="text-2xl md:text-3xl font-bold text-fm-magenta-400 footer-logo transition-all duration-300 hover:scale-105">Freaking Minds</span>
              </Link>
              
              <p className="text-fm-neutral-400 leading-relaxed mb-10 text-lg">
                We don&apos;t just market, we{' '}
                <span className="text-fm-magenta-400 font-semibold">create movements</span>. 
                Leading digital marketing agency in Bhopal delivering data-driven creative 
                solutions that transform ambitious brands into market leaders.
              </p>

              {/* Enhanced Contact Info */}
              <div className="space-y-2 mb-10">
                <div className="contact-info-item">
                  <Phone className="w-6 h-6 text-fm-magenta-400 flex-shrink-0 contact-info-icon" />
                  <span className="text-fm-neutral-300 ml-4 text-lg">+91 98765 43210</span>
                </div>
                <div className="contact-info-item">
                  <Mail className="w-6 h-6 text-fm-magenta-400 flex-shrink-0 contact-info-icon" />
                  <span className="text-fm-neutral-300 ml-4 text-lg">hello@freakingminds.in</span>
                </div>
                <div className="contact-info-item">
                  <MapPin className="w-6 h-6 text-fm-magenta-400 flex-shrink-0 contact-info-icon" />
                  <span className="text-fm-neutral-300 ml-4 text-lg">Bhopal, Madhya Pradesh, India</span>
                </div>
              </div>

              {/* Premium Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-fm-neutral-800 hover:bg-fm-magenta-700 w-12 h-12 rounded-2xl flex items-center justify-center group footer-animate-scale-in transition-colors duration-300"
                      style={{ animationDelay: `${index * 100 + 400}ms` }}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <IconComponent className="w-6 h-6 text-fm-neutral-400 group-hover:text-fm-neutral-50 transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Premium Navigation Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:col-span-3">
              <div className="footer-animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h3 className="text-fm-neutral-50 font-bold mb-8 text-lg">Services</h3>
                <ul className="space-y-4">
                  {navigation.services.map((item, index) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href}
                        className="footer-link-premium text-fm-neutral-400 hover:text-fm-magenta-400 transition-all duration-300 text-base"
                        style={{ animationDelay: `${index * 50 + 300}ms` }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <h3 className="text-fm-neutral-50 font-bold mb-8 text-lg">Company</h3>
                <ul className="space-y-4">
                  {navigation.company.map((item, index) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href}
                        className="footer-link-premium text-fm-neutral-400 hover:text-fm-magenta-400 transition-all duration-300 text-base"
                        style={{ animationDelay: `${index * 50 + 400}ms` }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <h3 className="text-fm-neutral-50 font-bold mb-8 text-lg">Resources</h3>
                <ul className="space-y-4 mb-8">
                  {navigation.resources.map((item, index) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href}
                        className="footer-link-premium text-fm-neutral-400 hover:text-fm-magenta-400 transition-all duration-300 text-base"
                        style={{ animationDelay: `${index * 50 + 500}ms` }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Bottom Bar */}
      <div className="border-t border-fm-neutral-800/50 backdrop-blur-sm bg-fm-neutral-900/80">
        <div className="px-4 md:px-8 lg:px-16" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '1440px', margin: '0 auto' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 footer-animate-fade-in">
            <div className="text-fm-neutral-500 font-medium">
              © 2025 Freaking Minds. All rights reserved.
            </div>
            
            <div className="flex flex-wrap items-center gap-8">
              {navigation.legal.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="footer-link-premium text-sm text-fm-neutral-500 hover:text-fm-magenta-400 transition-all duration-300"
                  style={{ animationDelay: `${index * 50 + 200}ms` }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="text-fm-neutral-500 font-medium flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-fm-magenta-400 heart-beat" /> in Bhopal
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}