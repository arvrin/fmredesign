'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: "TechStart India",
    category: "E-commerce",
    description: "Complete digital transformation including brand identity, website redesign, and full-funnel marketing.",
    metric: "+300%",
    metricLabel: "Traffic Growth",
    tags: ["SEO", "PPC", "Branding"],
    bgColor: "#1e1b4b",
    gradientFrom: "#1e1b4b",
    gradientTo: "#312e81",
    size: "large",
  },
  {
    title: "GrowthCo",
    category: "SaaS",
    description: "B2B lead generation and conversion optimization.",
    metric: "5x",
    metricLabel: "ROAS",
    tags: ["Performance", "CRO"],
    bgColor: "#164e63",
    gradientFrom: "#164e63",
    gradientTo: "#0e7490",
    size: "small",
  },
  {
    title: "FreshBite",
    category: "Food & Beverage",
    description: "Social media strategy that turned local into city-wide.",
    metric: "500K+",
    metricLabel: "Followers",
    tags: ["Social", "Content"],
    bgColor: "#9a3412",
    gradientFrom: "#9a3412",
    gradientTo: "#c2410c",
    size: "small",
  },
  {
    title: "HealthPlus",
    category: "Healthcare",
    description: "Brand repositioning and digital marketing for healthcare provider chain.",
    metric: "180%",
    metricLabel: "Brand Recall",
    tags: ["Branding", "Strategy"],
    bgColor: "#065f46",
    gradientFrom: "#065f46",
    gradientTo: "#047857",
    size: "medium",
  },
  {
    title: "FinEdge",
    category: "Fintech",
    description: "Complete digital presence overhaul and performance marketing.",
    metric: "₹2Cr",
    metricLabel: "Revenue Generated",
    tags: ["Web", "PPC"],
    bgColor: "#581c87",
    gradientFrom: "#581c87",
    gradientTo: "#7c3aed",
    size: "medium",
  },
];

export function WorkSectionV3() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const largeProject = projects.find(p => p.size === 'large');
  const smallProjects = projects.filter(p => p.size === 'small');
  const mediumProjects = projects.filter(p => p.size === 'medium');

  return (
    <section
      ref={sectionRef}
      className="relative py-28 lg:py-36 bg-fm-cream"
    >
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div
              className={`
                flex items-center gap-4 mb-6
                transition-all duration-700
                ${isVisible ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <div
                className={`
                  h-px bg-fm-magenta-600 transition-all duration-700
                  ${isVisible ? 'w-12' : 'w-0'}
                `}
                style={{ transitionDelay: '200ms' }}
              />
              <p className="text-fm-magenta-600 text-sm font-semibold tracking-[0.2em] uppercase">
                Selected Work
              </p>
            </div>
            <h2
              className={`
                text-4xl md:text-5xl lg:text-6xl font-bold text-fm-ink leading-[1.1]
                transition-all duration-700 delay-100
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Results that<br />
              <span className="text-fm-neutral-400">speak for themselves</span>
            </h2>
          </div>

          <Link
            href="/work"
            className={`
              group inline-flex items-center gap-2 text-fm-ink font-semibold
              transition-all duration-700 delay-200
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <span className="border-b-2 border-transparent group-hover:border-fm-ink transition-colors duration-300">
              View all projects
            </span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Featured Project */}
          {largeProject && (
            <Link
              href="/work"
              className={`
                group lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-3xl
                transition-all duration-700 delay-300
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              onMouseEnter={() => setHoveredProject(largeProject.title)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Gradient background */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${largeProject.gradientFrom} 0%, ${largeProject.gradientTo} 100%)`,
                }}
              />

              {/* Grain texture overlay */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 lg:p-12 h-full min-h-[520px] flex flex-col justify-between">
                {/* Top: Category + Tags */}
                <div className="flex items-start justify-between">
                  <span className="text-white/80 text-sm font-semibold tracking-wide">
                    {largeProject.category}
                  </span>
                  <div className="flex gap-2">
                    {largeProject.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-white/15 backdrop-blur-sm rounded-full border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom: Title + Metric */}
                <div>
                  <div className="mb-8">
                    <span
                      className="text-7xl lg:text-[7rem] font-bold text-white block leading-none"
                      style={{
                        fontFamily: 'var(--font-display)',
                        textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                      }}
                    >
                      {largeProject.metric}
                    </span>
                    <span className="text-white/70 text-sm mt-3 block font-medium uppercase tracking-wider">
                      {largeProject.metricLabel}
                    </span>
                  </div>

                  <h3
                    className="text-2xl lg:text-3xl font-bold text-white mb-3"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                  >
                    {largeProject.title}
                  </h3>
                  <p className="text-white/80 max-w-md leading-relaxed">
                    {largeProject.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div
                  className={`
                    absolute bottom-8 right-8 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm
                    flex items-center justify-center
                    transition-all duration-300
                    ${hoveredProject === largeProject.title ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                  `}
                >
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          )}

          {/* Small Projects Stack */}
          {smallProjects.map((project, index) => (
            <Link
              href="/work"
              key={project.title}
              className={`
                group relative overflow-hidden rounded-3xl
                transition-all duration-700
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
              onMouseEnter={() => setHoveredProject(project.title)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Gradient background */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${project.gradientFrom} 0%, ${project.gradientTo} 100%)`,
                }}
              />

              {/* Grain texture */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative z-10 p-6 lg:p-8 min-h-[260px] flex flex-col justify-between">
                <span className="text-white/80 text-sm font-semibold tracking-wide">
                  {project.category}
                </span>

                <div>
                  <span
                    className="text-5xl font-bold text-white block leading-none"
                    style={{
                      fontFamily: 'var(--font-display)',
                      textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    {project.metric}
                  </span>
                  <span className="text-white/70 text-xs mt-2 mb-4 block font-medium uppercase tracking-wider">
                    {project.metricLabel}
                  </span>
                  <h3
                    className="text-lg font-bold text-white"
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}
                  >
                    {project.title}
                  </h3>
                </div>

                {/* Hover indicator */}
                <div
                  className={`
                    absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/20
                    flex items-center justify-center
                    transition-all duration-300
                    ${hoveredProject === project.title ? 'opacity-100' : 'opacity-0'}
                  `}
                >
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </Link>
          ))}

          {/* Medium Projects */}
          {mediumProjects.map((project, index) => (
            <Link
              href="/work"
              key={project.title}
              className={`
                group relative overflow-hidden rounded-3xl lg:col-span-1
                transition-all duration-700
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${600 + index * 100}ms` }}
              onMouseEnter={() => setHoveredProject(project.title)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Gradient background */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${project.gradientFrom} 0%, ${project.gradientTo} 100%)`,
                }}
              />

              {/* Grain texture */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative z-10 p-6 lg:p-8 min-h-[300px] flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-white/80 text-sm font-semibold tracking-wide">
                    {project.category}
                  </span>
                  <div className="flex gap-2">
                    {project.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-white/15 backdrop-blur-sm rounded-full border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span
                    className="text-5xl lg:text-6xl font-bold text-white block leading-none"
                    style={{
                      fontFamily: 'var(--font-display)',
                      textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    {project.metric}
                  </span>
                  <span className="text-white/70 text-xs mt-2 mb-4 block font-medium uppercase tracking-wider">
                    {project.metricLabel}
                  </span>
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-white/75 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Hover indicator */}
                <div
                  className={`
                    absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/20
                    flex items-center justify-center
                    transition-all duration-300
                    ${hoveredProject === project.title ? 'opacity-100' : 'opacity-0'}
                  `}
                >
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
