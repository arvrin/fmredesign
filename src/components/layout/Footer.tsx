import React from 'react';
import Link from 'next/link';
import { LinkButton } from '@/design-system';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  Heart,
  Users,
  Zap
} from 'lucide-react';


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
  creatives: [
    { name: 'Join Network', href: '/creativeminds' },
    { name: 'Apply Now', href: '/creativeminds#apply' },
    { name: 'Talent Portal', href: '/creativeminds#portal' },
    { name: 'Success Stories', href: '/creativeminds#stories' },
    { name: 'Resources', href: '/creativeminds#resources' },
    { name: 'Community', href: '/creativeminds#community' },
  ],
  quickActions: [
    { name: 'Get Started', href: '/get-started' },
    { name: 'Join CreativeMinds', href: '/creativeminds' },
    { name: 'Schedule Call', href: '/contact#schedule' },
    { name: 'View Portfolio', href: '/work' },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:col-span-3">
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
                <h3 className="text-fm-neutral-50 font-bold mb-8 text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-fm-magenta-400" />
                  For Creatives
                </h3>
                <ul className="space-y-4">
                  {navigation.creatives.map((item, index) => (
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

          {/* Quick Actions Section */}
          <div className="mt-16 pt-12 border-t border-fm-neutral-800/50">
            <div className="footer-animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <h3 className="text-fm-neutral-50 font-bold mb-8 text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-fm-magenta-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {navigation.quickActions.map((item, index) => (
                  <LinkButton
                    key={item.name}
                    href={item.href}
                    variant="outline"
                    size="md"
                    className="border-fm-neutral-700 text-fm-neutral-300 hover:bg-fm-magenta-600 hover:border-fm-magenta-600 hover:text-white transition-all duration-300"
                    style={{ animationDelay: `${index * 100 + 700}ms` }}
                  >
                    {item.name}
                  </LinkButton>
                ))}
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