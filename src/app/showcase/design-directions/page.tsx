'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Sparkles, Play, Target, TrendingUp, Zap, Award, Users, Palette, Globe, Code } from 'lucide-react';

// ============================================
// BENTO VARIATION 1: Classic Gradient Text
// Clean bento with gradient headlines
// ============================================
function BentoVariation1() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FAFAFA] py-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Navigation */}
        <nav className={`flex justify-between items-center mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <img src="/brain.png" alt="FM" className="w-10 h-10" />
            <span className="text-fm-neutral-900 font-semibold text-lg">Freaking Minds</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Services', 'Work', 'About', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-fm-neutral-500 hover:text-fm-magenta-600 text-sm transition-colors">{item}</a>
            ))}
          </div>
          <a href="#" className="px-5 py-2.5 bg-fm-neutral-900 text-white text-sm rounded-full hover:bg-fm-magenta-600 transition-colors">
            Get Started
          </a>
        </nav>

        {/* Bento Grid */}
        <div className={`grid grid-cols-12 gap-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Hero Card - Large */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 md:p-12 border border-fm-neutral-200 min-h-[400px] flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-fm-magenta-50 text-fm-magenta-700 text-xs font-medium rounded-full mb-6">
                <Sparkles className="w-3 h-3" />
                Digital Marketing Agency
              </span>
              <h1
                className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em]"
                style={{
                  background: 'linear-gradient(135deg, #a82548 0%, #d64d6f 40%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Ideas that
                <br />
                move markets.
              </h1>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <a href="#" className="group px-6 py-3 bg-fm-neutral-900 text-white text-sm font-medium rounded-full hover:bg-fm-magenta-600 transition-all flex items-center gap-2">
                Start a Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#" className="px-6 py-3 border border-fm-neutral-300 text-fm-neutral-700 text-sm rounded-full hover:border-fm-magenta-300 hover:text-fm-magenta-600 transition-all">
                View Work
              </a>
            </div>
          </div>

          {/* Stats Card */}
          <div className="col-span-12 lg:col-span-4 bg-fm-neutral-900 rounded-3xl p-8 text-white flex flex-col justify-between min-h-[400px]">
            <div>
              <span className="text-fm-neutral-400 text-xs uppercase tracking-widest">Our Impact</span>
              <div
                className="text-[4rem] md:text-[5rem] font-bold leading-none mt-4"
                style={{
                  background: 'linear-gradient(135deg, #ec75a0 0%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                250+
              </div>
              <p className="text-fm-neutral-400 mt-2">Projects delivered with excellence</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div>
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-fm-neutral-500 text-xs mt-1">Retention</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">10+</div>
                <div className="text-fm-neutral-500 text-xs mt-1">Years</div>
              </div>
            </div>
          </div>

          {/* Service Cards Row */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-3xl p-6 border border-fm-neutral-200 group hover:border-fm-magenta-300 hover:shadow-lg hover:shadow-fm-magenta-100/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-fm-magenta-100 rounded-2xl flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-fm-magenta-600" />
            </div>
            <h3 className="text-fm-neutral-900 font-semibold text-lg mb-2">Brand Strategy</h3>
            <p className="text-fm-neutral-500 text-sm">Define your unique position in the market.</p>
            <ArrowUpRight className="w-5 h-5 text-fm-neutral-300 group-hover:text-fm-magenta-600 mt-4 transition-colors" />
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-3xl p-6 border border-fm-neutral-200 group hover:border-fm-magenta-300 hover:shadow-lg hover:shadow-fm-magenta-100/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-fm-magenta-100 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-fm-magenta-600" />
            </div>
            <h3 className="text-fm-neutral-900 font-semibold text-lg mb-2">Digital Marketing</h3>
            <p className="text-fm-neutral-500 text-sm">Data-driven campaigns that convert.</p>
            <ArrowUpRight className="w-5 h-5 text-fm-neutral-300 group-hover:text-fm-magenta-600 mt-4 transition-colors" />
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-3xl p-6 border border-fm-neutral-200 group hover:border-fm-magenta-300 hover:shadow-lg hover:shadow-fm-magenta-100/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-fm-magenta-100 rounded-2xl flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-fm-magenta-600" />
            </div>
            <h3 className="text-fm-neutral-900 font-semibold text-lg mb-2">Web Development</h3>
            <p className="text-fm-neutral-500 text-sm">Beautiful, fast, converting websites.</p>
            <ArrowUpRight className="w-5 h-5 text-fm-neutral-300 group-hover:text-fm-magenta-600 mt-4 transition-colors" />
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-3xl p-6 border border-fm-neutral-200 group hover:border-fm-magenta-300 hover:shadow-lg hover:shadow-fm-magenta-100/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-fm-magenta-100 rounded-2xl flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-fm-magenta-600" />
            </div>
            <h3 className="text-fm-neutral-900 font-semibold text-lg mb-2">Social Media</h3>
            <p className="text-fm-neutral-500 text-sm">Build community and engagement.</p>
            <ArrowUpRight className="w-5 h-5 text-fm-neutral-300 group-hover:text-fm-magenta-600 mt-4 transition-colors" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BENTO VARIATION 2: Gradient Cards with Masked Text
// Cards have gradient backgrounds, text masks
// ============================================
function BentoVariation2() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-white py-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Navigation */}
        <nav className={`flex justify-between items-center mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <div
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FM
            </div>
            <span className="text-fm-neutral-400 text-sm">Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Work', 'Services', 'About', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-fm-neutral-500 hover:text-fm-magenta-600 text-sm transition-colors">{item}</a>
            ))}
          </div>
          <a
            href="#"
            className="px-5 py-2.5 text-white text-sm rounded-full transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)' }}
          >
            Let's Talk
          </a>
        </nav>

        {/* Bento Grid */}
        <div className={`grid grid-cols-12 gap-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main Hero - Gradient Background */}
          <div
            className="col-span-12 lg:col-span-7 rounded-3xl p-8 md:p-12 min-h-[450px] flex flex-col justify-between relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #a82548 0%, #d64d6f 50%, #f97316 100%)' }}
          >
            {/* Decorative circles */}
            <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/10" />
            <div className="absolute bottom-[-30px] left-[20%] w-[100px] h-[100px] rounded-full bg-white/10" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 text-white text-xs font-medium rounded-full mb-6 backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                Creative Excellence
              </span>
              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
                We craft brands
                <br />
                that resonate.
              </h1>
            </div>

            <div className="relative z-10 flex items-center gap-4 mt-8">
              <a href="#" className="group px-6 py-3 bg-white text-fm-magenta-700 text-sm font-medium rounded-full hover:bg-fm-neutral-100 transition-all flex items-center gap-2">
                Start Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#" className="px-6 py-3 border border-white/30 text-white text-sm rounded-full hover:bg-white/10 transition-all flex items-center gap-2">
                <Play className="w-4 h-4" />
                Watch Reel
              </a>
            </div>
          </div>

          {/* Brain Mascot Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 bg-fm-neutral-100 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[450px]">
            <img src="/brain.png" alt="Freaking Minds" className="w-40 md:w-48 h-auto mb-6" />
            <h3
              className="text-2xl font-bold text-center"
              style={{
                background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Think Different.
              <br />
              Market Smarter.
            </h3>
          </div>

          {/* Stats Row */}
          <div className="col-span-6 md:col-span-3 bg-fm-neutral-900 rounded-3xl p-6 flex flex-col justify-center">
            <div
              className="text-4xl md:text-5xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #ec75a0 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              250+
            </div>
            <div className="text-fm-neutral-400 text-sm mt-2">Projects</div>
          </div>

          <div className="col-span-6 md:col-span-3 bg-fm-neutral-900 rounded-3xl p-6 flex flex-col justify-center">
            <div
              className="text-4xl md:text-5xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #ec75a0 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              95%
            </div>
            <div className="text-fm-neutral-400 text-sm mt-2">Retention</div>
          </div>

          <div className="col-span-6 md:col-span-3 bg-fm-neutral-900 rounded-3xl p-6 flex flex-col justify-center">
            <div
              className="text-4xl md:text-5xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #ec75a0 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              10+
            </div>
            <div className="text-fm-neutral-400 text-sm mt-2">Years</div>
          </div>

          <div className="col-span-6 md:col-span-3 bg-fm-neutral-900 rounded-3xl p-6 flex flex-col justify-center">
            <div
              className="text-4xl md:text-5xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #ec75a0 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ₹50Cr
            </div>
            <div className="text-fm-neutral-400 text-sm mt-2">Revenue Generated</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BENTO VARIATION 3: Mixed Gradient & Glass
// Glassmorphism with gradient accents
// ============================================
function BentoVariation3() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-fm-neutral-50 py-12">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at ${20 + mousePos.x * 20}% ${30 + mousePos.y * 20}%, rgba(168, 37, 72, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at ${70 - mousePos.x * 15}% ${60 - mousePos.y * 15}%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)
          `,
          transition: 'background 0.3s ease-out',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Navigation */}
        <nav className={`flex justify-between items-center mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-fm-neutral-900 font-semibold">Freaking Minds</span>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full p-1 border border-fm-neutral-200">
            {['Work', 'Services', 'About', 'Blog'].map((item, i) => (
              <a
                key={item}
                href="#"
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  i === 0 ? 'bg-fm-neutral-900 text-white' : 'text-fm-neutral-600 hover:text-fm-magenta-600'
                }`}
              >
                {item}
              </a>
            ))}
          </div>
          <a
            href="#"
            className="px-5 py-2.5 text-white text-sm rounded-full transition-all hover:scale-105 shadow-lg shadow-fm-magenta-200/50"
            style={{ background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)' }}
          >
            Get Started
          </a>
        </nav>

        {/* Bento Grid */}
        <div className={`grid grid-cols-12 gap-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main Card - Glass effect */}
          <div className="col-span-12 lg:col-span-8 bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl min-h-[400px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-fm-magenta-500 animate-pulse" />
                <span
                  className="text-sm font-medium"
                  style={{
                    background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Digital Marketing Redefined
                </span>
              </div>
              <h1
                className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1] tracking-[-0.03em]"
                style={{
                  background: 'linear-gradient(135deg, #18181b 0%, #a82548 50%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%',
                  animation: 'gradientMove 6s ease infinite',
                }}
              >
                Create.
                <br />
                Connect.
                <br />
                Convert.
              </h1>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <a
                href="#"
                className="group px-6 py-3.5 text-white text-sm font-medium rounded-full transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-fm-magenta-200/50"
                style={{ background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)' }}
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Brain + CTA Card */}
          <div className="col-span-12 lg:col-span-4 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #a82548 0%, #d64d6f 50%, #f97316 100%)' }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-white/30" />
              <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full border border-white/30" />
            </div>
            <img src="/brain.png" alt="FM" className="w-36 h-auto mb-6 relative z-10 drop-shadow-2xl" />
            <p className="text-white/80 text-center text-sm mb-4 relative z-10">Ready to transform your brand?</p>
            <a href="#" className="px-6 py-3 bg-white text-fm-magenta-700 text-sm font-medium rounded-full hover:bg-fm-neutral-100 transition-all relative z-10">
              Book a Call
            </a>
          </div>

          {/* Service Pills */}
          <div className="col-span-12 flex flex-wrap gap-3 justify-center py-4">
            {[
              { icon: Palette, label: 'Brand Strategy' },
              { icon: TrendingUp, label: 'Digital Marketing' },
              { icon: Code, label: 'Web Development' },
              { icon: Globe, label: 'Social Media' },
              { icon: Target, label: 'SEO & SEM' },
              { icon: Zap, label: 'Content Creation' },
            ].map((service) => (
              <div
                key={service.label}
                className="flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-fm-neutral-200 hover:border-fm-magenta-300 hover:shadow-lg hover:shadow-fm-magenta-100/30 transition-all cursor-pointer group"
              >
                <service.icon className="w-4 h-4 text-fm-magenta-600" />
                <span className="text-fm-neutral-700 text-sm group-hover:text-fm-magenta-700 transition-colors">{service.label}</span>
              </div>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="col-span-6 md:col-span-3 bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg text-center">
            <div
              className="text-3xl md:text-4xl font-bold mb-1"
              style={{
                background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              250+
            </div>
            <div className="text-fm-neutral-500 text-sm">Projects</div>
          </div>

          <div className="col-span-6 md:col-span-3 bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg text-center">
            <div
              className="text-3xl md:text-4xl font-bold mb-1"
              style={{
                background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              95%
            </div>
            <div className="text-fm-neutral-500 text-sm">Client Retention</div>
          </div>

          <div className="col-span-6 md:col-span-3 bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg text-center">
            <div
              className="text-3xl md:text-4xl font-bold mb-1"
              style={{
                background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              10+
            </div>
            <div className="text-fm-neutral-500 text-sm">Years Experience</div>
          </div>

          <div className="col-span-6 md:col-span-3 bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg text-center">
            <div
              className="text-3xl md:text-4xl font-bold mb-1"
              style={{
                background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ₹50Cr
            </div>
            <div className="text-fm-neutral-500 text-sm">Revenue Generated</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}

// ============================================
// BENTO VARIATION 4: Dark Bento with Gradient Borders
// Dark theme with gradient border accents
// ============================================
function BentoVariation4() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-fm-neutral-900 py-12">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Navigation */}
        <nav className={`flex justify-between items-center mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <img src="/brain.png" alt="FM" className="w-10 h-10" />
            <span className="text-white font-semibold">Freaking Minds</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Work', 'Services', 'About', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-fm-neutral-400 hover:text-white text-sm transition-colors">{item}</a>
            ))}
          </div>
          <a
            href="#"
            className="px-5 py-2.5 text-white text-sm rounded-full transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)' }}
          >
            Get Started
          </a>
        </nav>

        {/* Bento Grid */}
        <div className={`grid grid-cols-12 gap-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main Hero Card with gradient border */}
          <div className="col-span-12 lg:col-span-8 p-[1px] rounded-3xl bg-gradient-to-br from-fm-magenta-500 via-fm-magenta-600/50 to-fm-magenta-500 min-h-[400px]">
            <div className="bg-fm-neutral-900 rounded-3xl p-8 md:p-12 h-full flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-fm-neutral-800 text-fm-magenta-400 text-xs font-medium rounded-full mb-6 border border-fm-neutral-700">
                  <Sparkles className="w-3 h-3" />
                  Digital Marketing Agency
                </span>
                <h1
                  className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1] tracking-[-0.03em]"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #ec75a0 50%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Where creativity
                  <br />
                  meets strategy.
                </h1>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <a
                  href="#"
                  className="group px-6 py-3.5 text-white text-sm font-medium rounded-full transition-all hover:scale-105 flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)' }}
                >
                  Start a Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#" className="px-6 py-3.5 border border-fm-neutral-700 text-fm-neutral-300 text-sm rounded-full hover:border-fm-magenta-500 hover:text-white transition-all">
                  Our Work
                </a>
              </div>
            </div>
          </div>

          {/* Stats Stack */}
          <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-4 min-h-[400px]">
            <div className="p-[1px] rounded-3xl bg-gradient-to-br from-fm-magenta-500/50 to-transparent">
              <div className="bg-fm-neutral-900 rounded-3xl p-6 h-full flex flex-col justify-center">
                <div
                  className="text-5xl md:text-6xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #ec75a0 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  250+
                </div>
                <div className="text-fm-neutral-400 text-sm mt-2">Projects Delivered</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-[1px] rounded-3xl bg-gradient-to-br from-fm-magenta-500/50 to-transparent">
                <div className="bg-fm-neutral-900 rounded-3xl p-5 h-full flex flex-col justify-center">
                  <div
                    className="text-3xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #ec75a0 0%, #f97316 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    95%
                  </div>
                  <div className="text-fm-neutral-500 text-xs mt-1">Retention</div>
                </div>
              </div>
              <div className="p-[1px] rounded-3xl bg-gradient-to-br from-fm-magenta-500/50 to-transparent">
                <div className="bg-fm-neutral-900 rounded-3xl p-5 h-full flex flex-col justify-center">
                  <div
                    className="text-3xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #ec75a0 0%, #f97316 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    10+
                  </div>
                  <div className="text-fm-neutral-500 text-xs mt-1">Years</div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards with gradient hover */}
          {[
            { icon: Palette, title: 'Brand Strategy', desc: 'Define your market position' },
            { icon: TrendingUp, title: 'Digital Marketing', desc: 'Data-driven campaigns' },
            { icon: Code, title: 'Web Development', desc: 'Fast, beautiful websites' },
            { icon: Globe, title: 'Social Media', desc: 'Build your community' },
          ].map((service) => (
            <div key={service.title} className="col-span-6 md:col-span-3 group">
              <div className="p-[1px] rounded-2xl bg-fm-neutral-800 group-hover:bg-gradient-to-br group-hover:from-fm-magenta-500 group-hover:to-fm-magenta-500 transition-all duration-300">
                <div className="bg-fm-neutral-900 rounded-2xl p-5 h-full">
                  <service.icon className="w-8 h-8 text-fm-neutral-600 group-hover:text-fm-magenta-400 transition-colors mb-4" />
                  <h3 className="text-white font-semibold mb-1">{service.title}</h3>
                  <p className="text-fm-neutral-500 text-sm">{service.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// BENTO VARIATION 5: Asymmetric with Image Masks
// Creative asymmetric layout with clipped images
// ============================================
function BentoVariation5() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-white py-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Navigation */}
        <nav className={`flex justify-between items-center mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Freaking Minds
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Work', 'Services', 'About', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-fm-neutral-500 hover:text-fm-magenta-600 text-sm transition-colors">{item}</a>
            ))}
          </div>
          <a href="#" className="px-5 py-2.5 bg-fm-neutral-900 text-white text-sm rounded-full hover:bg-fm-magenta-600 transition-colors">
            Let's Talk
          </a>
        </nav>

        {/* Bento Grid - Asymmetric */}
        <div className={`grid grid-cols-12 gap-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
            {/* Headline Card */}
            <div className="bg-fm-neutral-100 rounded-3xl p-8 md:p-10">
              <span className="text-fm-magenta-600 text-sm font-medium mb-4 block">Digital Marketing Agency</span>
              <h1
                className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em]"
                style={{
                  background: 'linear-gradient(180deg, #18181b 0%, #a82548 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Transform your brand with strategic creativity.
              </h1>
              <div className="flex items-center gap-4 mt-8">
                <a
                  href="#"
                  className="group px-6 py-3 text-white text-sm font-medium rounded-full transition-all flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #a82548 0%, #f97316 100%)' }}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-fm-neutral-900 rounded-3xl p-6">
                <div
                  className="text-4xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #ec75a0 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  250+
                </div>
                <div className="text-fm-neutral-400 text-sm mt-1">Projects</div>
              </div>
              <div className="bg-fm-neutral-900 rounded-3xl p-6">
                <div
                  className="text-4xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #ec75a0 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  95%
                </div>
                <div className="text-fm-neutral-400 text-sm mt-1">Retention</div>
              </div>
            </div>
          </div>

          {/* Right Column - Larger */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
            {/* Main Visual Card */}
            <div
              className="rounded-3xl p-8 md:p-12 min-h-[350px] flex flex-col justify-between relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #a82548 0%, #d64d6f 40%, #f97316 100%)' }}
            >
              {/* Masked brain shape */}
              <div className="absolute top-1/2 right-8 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64">
                <div
                  className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  }}
                >
                  <img src="/brain.png" alt="FM" className="w-32 md:w-40 h-auto" />
                </div>
              </div>

              <div className="relative z-10 max-w-md">
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
                  We don't just market.
                  <br />
                  We move people.
                </h2>
                <p className="text-white/70 text-sm">
                  Strategic creativity that transforms ambitious brands into market leaders.
                </p>
              </div>

              <a href="#" className="relative z-10 inline-flex items-center gap-2 text-white text-sm font-medium mt-6">
                <Play className="w-8 h-8 p-2 bg-white/20 rounded-full" />
                Watch our showreel
              </a>
            </div>

            {/* Service Pills Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Brand Strategy', 'Digital Marketing', 'Web Dev', 'Social Media'].map((service) => (
                <div key={service} className="bg-fm-neutral-100 rounded-2xl p-4 text-center hover:bg-fm-magenta-50 hover:shadow-lg transition-all cursor-pointer group">
                  <span className="text-fm-neutral-700 text-sm font-medium group-hover:text-fm-magenta-700 transition-colors">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Main Showcase Page
// ============================================
export default function DesignDirectionsShowcase() {
  const [activeVariation, setActiveVariation] = useState<1 | 2 | 3 | 4 | 5 | null>(null);

  const variations = [
    { key: 1 as const, label: 'Clean Gradient', desc: 'White cards, gradient text headlines' },
    { key: 2 as const, label: 'Gradient Cards', desc: 'Gradient hero, dark stat cards' },
    { key: 3 as const, label: 'Glass + Gradient', desc: 'Glassmorphism with gradient mesh' },
    { key: 4 as const, label: 'Dark + Borders', desc: 'Dark theme, gradient borders' },
    { key: 5 as const, label: 'Asymmetric', desc: 'Creative layout, masked elements' },
  ];

  return (
    <div className="min-h-screen bg-fm-neutral-100">
      {/* Showcase Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-fm-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-fm-neutral-900 font-bold text-lg">Bento Grid Variations</h1>
              <p className="text-fm-neutral-500 text-sm">With gradient text and masked effects</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {variations.map((v) => (
                <button
                  key={v.key}
                  onClick={() => setActiveVariation(activeVariation === v.key ? null : v.key)}
                  className={`px-4 py-2 text-sm rounded-full transition-all ${
                    activeVariation === v.key
                      ? 'bg-fm-magenta-600 text-white'
                      : 'text-fm-neutral-600 hover:text-fm-magenta-700 bg-fm-neutral-100 hover:bg-fm-magenta-50'
                  }`}
                >
                  {v.key}: {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Variation Sections */}
      <div className="space-y-6 p-4 md:p-6">
        {/* Variation 1 */}
        <div className={`transition-all duration-500 ${activeVariation && activeVariation !== 1 ? 'opacity-30 scale-[0.99]' : 'opacity-100'}`}>
          <div className="mb-4 px-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-fm-magenta-600 text-white text-xs font-bold rounded-full">1</span>
              <h2 className="text-fm-neutral-900 text-lg font-bold">Clean Gradient Text</h2>
            </div>
            <p className="text-fm-neutral-500 text-sm mt-1 ml-10">White card backgrounds with gradient text headlines. Classic, professional feel.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-fm-neutral-200 shadow-sm">
            <BentoVariation1 />
          </div>
        </div>

        {/* Variation 2 */}
        <div className={`transition-all duration-500 ${activeVariation && activeVariation !== 2 ? 'opacity-30 scale-[0.99]' : 'opacity-100'}`}>
          <div className="mb-4 px-2 pt-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-fm-magenta-600 text-white text-xs font-bold rounded-full">2</span>
              <h2 className="text-fm-neutral-900 text-lg font-bold">Gradient Hero Cards</h2>
            </div>
            <p className="text-fm-neutral-500 text-sm mt-1 ml-10">Full gradient hero section with dark stat cards. Bold and impactful.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-fm-neutral-200 shadow-sm">
            <BentoVariation2 />
          </div>
        </div>

        {/* Variation 3 */}
        <div className={`transition-all duration-500 ${activeVariation && activeVariation !== 3 ? 'opacity-30 scale-[0.99]' : 'opacity-100'}`}>
          <div className="mb-4 px-2 pt-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-fm-magenta-600 text-white text-xs font-bold rounded-full">3</span>
              <h2 className="text-fm-neutral-900 text-lg font-bold">Glassmorphism + Gradient</h2>
            </div>
            <p className="text-fm-neutral-500 text-sm mt-1 ml-10">Glass effect cards with animated gradient mesh background. Modern and interactive.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-fm-neutral-200 shadow-sm">
            <BentoVariation3 />
          </div>
        </div>

        {/* Variation 4 */}
        <div className={`transition-all duration-500 ${activeVariation && activeVariation !== 4 ? 'opacity-30 scale-[0.99]' : 'opacity-100'}`}>
          <div className="mb-4 px-2 pt-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-fm-magenta-600 text-white text-xs font-bold rounded-full">4</span>
              <h2 className="text-fm-neutral-900 text-lg font-bold">Dark + Gradient Borders</h2>
            </div>
            <p className="text-fm-neutral-500 text-sm mt-1 ml-10">Dark theme with gradient border accents. Premium, sophisticated look.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-fm-neutral-200 shadow-sm">
            <BentoVariation4 />
          </div>
        </div>

        {/* Variation 5 */}
        <div className={`transition-all duration-500 ${activeVariation && activeVariation !== 5 ? 'opacity-30 scale-[0.99]' : 'opacity-100'}`}>
          <div className="mb-4 px-2 pt-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-fm-magenta-600 text-white text-xs font-bold rounded-full">5</span>
              <h2 className="text-fm-neutral-900 text-lg font-bold">Asymmetric + Masked</h2>
            </div>
            <p className="text-fm-neutral-500 text-sm mt-1 ml-10">Creative asymmetric layout with hexagonal mask on the brain. Dynamic composition.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-fm-neutral-200 shadow-sm">
            <BentoVariation5 />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-fm-neutral-200 mt-8 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-fm-neutral-400 text-sm">
            All variations use FM brand colors with gradient text effects (magenta #a82548 to orange #f97316).
          </p>
        </div>
      </footer>
    </div>
  );
}
