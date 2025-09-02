import type { Metadata } from "next";
import { ArrowRight, Search, TrendingUp, Lightbulb, Target, BookOpen } from "lucide-react";

// Design System Components
import { 
  LinkButton,
  HeroSectionBuilder,
  SectionBuilder,
  ArticleCard,
  SidebarWidget,
  FeaturedArticle,
  patterns 
} from "@/design-system";

export const metadata: Metadata = {
  title: "Digital Marketing Blog - Freaking Minds | Tips, Strategies & Industry Insights",
  description: "Stay updated with the latest digital marketing trends, strategies, and insights. Expert advice on SEO, social media, PPC, content marketing, and more from Freaking Minds.",
  keywords: [
    "digital marketing blog",
    "seo tips",
    "social media marketing strategies",
    "content marketing insights",
    "digital marketing trends",
    "marketing best practices",
    "freaking minds blog"
  ],
  openGraph: {
    title: "Digital Marketing Blog - Expert Insights & Strategies",
    description: "Get the latest digital marketing insights, tips, and strategies from industry experts. Stay ahead of the curve with Freaking Minds.",
    url: "https://freakingminds.in/blog",
    type: "website",
  },
};

const featuredPost = {
  title: "The Ultimate Guide to Digital Marketing in 2024: Trends That Will Shape Your Strategy",
  excerpt: "Discover the top digital marketing trends for 2024 including AI-powered marketing, voice search optimization, privacy-first strategies, and the rise of video commerce. Learn how to adapt your strategy for maximum impact.",
  category: "Strategy",
  readTime: "12 min read",
  date: "March 15, 2024",
  author: "Rajesh Sharma",
  image: "/placeholder-blog-featured.jpg",
  featured: true
};

const blogPosts = [
  {
    title: "10 SEO Mistakes That Are Killing Your Website Traffic",
    excerpt: "Avoid these common SEO pitfalls that could be sabotaging your search rankings. From technical issues to content problems, we cover the top mistakes and how to fix them.",
    category: "SEO",
    readTime: "8 min read",
    date: "March 12, 2024",
    author: "Priya Patel",
    image: "/placeholder-blog-1.jpg",
    tags: ["SEO", "Technical SEO", "Website Optimization"]
  },
  {
    title: "Social Media ROI: How to Measure and Improve Your Returns",
    excerpt: "Learn how to track, measure, and optimize your social media ROI with practical metrics, tools, and strategies that actually work for businesses of all sizes.",
    category: "Social Media",
    readTime: "6 min read",
    date: "March 10, 2024",
    author: "Sneha Agarwal",
    image: "/placeholder-blog-2.jpg",
    tags: ["Social Media", "ROI", "Analytics"]
  },
  {
    title: "PPC Campaign Optimization: Advanced Strategies for Better Results",
    excerpt: "Take your PPC campaigns to the next level with advanced optimization techniques, bid strategies, and conversion tracking methods that maximize your ad spend.",
    category: "PPC",
    readTime: "10 min read",
    date: "March 8, 2024",
    author: "Amit Kumar",
    image: "/placeholder-blog-3.jpg",
    tags: ["PPC", "Google Ads", "Optimization"]
  },
  {
    title: "Content Marketing That Converts: A Step-by-Step Framework",
    excerpt: "Build a content marketing strategy that drives real business results. From ideation to distribution, learn the framework top brands use to create converting content.",
    category: "Content Marketing",
    readTime: "7 min read",
    date: "March 5, 2024",
    author: "Rajesh Sharma",
    image: "/placeholder-blog-4.jpg",
    tags: ["Content Marketing", "Strategy", "Conversion"]
  },
  {
    title: "Local SEO for Multi-Location Businesses: Complete Guide",
    excerpt: "Master local SEO for businesses with multiple locations. Learn how to optimize Google My Business, manage reviews, and dominate local search results.",
    category: "Local SEO",
    readTime: "9 min read",
    date: "March 3, 2024",
    author: "Priya Patel",
    image: "/placeholder-blog-5.jpg",
    tags: ["Local SEO", "Multi-Location", "Google My Business"]
  },
  {
    title: "Email Marketing Automation: Workflows That Drive Sales",
    excerpt: "Discover high-converting email automation workflows that nurture leads and drive sales. Includes templates, best practices, and real-world examples.",
    category: "Email Marketing",
    readTime: "11 min read",
    date: "March 1, 2024",
    author: "Sneha Agarwal",
    image: "/placeholder-blog-6.jpg",
    tags: ["Email Marketing", "Automation", "Lead Nurturing"]
  }
];

const categories = [
  { name: "All Posts", count: 45, active: true },
  { name: "SEO", count: 12 },
  { name: "Social Media", count: 8 },
  { name: "PPC", count: 6 },
  { name: "Content Marketing", count: 10 },
  { name: "Strategy", count: 9 }
];

const popularTags = [
  "Digital Marketing", "SEO", "Social Media", "PPC", "Content Strategy", 
  "Analytics", "Conversion Optimization", "Lead Generation", "Branding", "E-commerce"
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Design System Version with Search */}
      <HeroSectionBuilder
        badge={{
          text: "Expert Insights & Industry Knowledge",
          icon: <BookOpen className="w-4 h-4 mr-2" />
        }}
        headline={{
          text: "Digital Marketing Insights That Drive Results",
          level: "h1",
          accent: { text: "Insights", position: "middle" }
        }}
        description="Stay ahead of the curve with expert insights, proven strategies, and actionable tips from our team of digital marketing professionals. Learn what works, avoid what doesn't, and transform your marketing approach."
        background="light"
        maxWidth="xl"
        minHeight="large"
        content={
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-fm-neutral-500" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700 transition-colors"
            />
          </div>
        }
      />

      {/* Featured Post - Design System Version */}
      <section className={`${patterns.layout.section} bg-fm-neutral-50 py-16`}>
        <div className={`${patterns.layout.container} ${patterns.layout.maxWidth.xl}`}>
          <FeaturedArticle
            title={featuredPost.title}
            excerpt={featuredPost.excerpt}
            category={featuredPost.category}
            readTime={featuredPost.readTime}
            date={featuredPost.date}
            author={featuredPost.author}
            layout="horizontal"
            size="lg"
            imageSlot={
              <div className="aspect-square lg:aspect-auto bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-900 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-24 h-24 mx-auto mb-4 text-fm-neutral-200" />
                  <p className="text-fm-neutral-200">Featured Article Visual</p>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Blog Content - Design System Version */}
      <section className={`${patterns.layout.section} bg-fm-neutral-50 py-24`}>
        <div className={`${patterns.layout.container} ${patterns.layout.maxWidth.xl}`}>
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Category Filter - Simplified Version */}
              <div className="flex flex-wrap gap-3 mb-12">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                      category.active 
                        ? 'bg-fm-magenta-700 text-white' 
                        : 'bg-fm-neutral-200 text-fm-neutral-700 hover:bg-fm-neutral-300'
                    }`}
                  >
                    {category.name} ({category.count})
                  </div>
                ))}
              </div>

              {/* Blog Posts Grid - Design System Version */}
              <div className="grid md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                  <ArticleCard
                    key={post.title}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    readTime={post.readTime}
                    date={post.date}
                    author={post.author}
                    tags={post.tags}
                    size="md"
                    layout="vertical"
                    imageSlot={
                      <div className="aspect-video bg-gradient-to-br from-fm-magenta-100 to-fm-magenta-200 flex items-center justify-center">
                        <Lightbulb className="w-12 h-12 text-fm-magenta-700" />
                      </div>
                    }
                  />
                ))}
              </div>

              {/* Load More Button - Design System Version */}
              <div className="text-center mt-12">
                <LinkButton variant="secondary" size="lg">
                  Load More Articles
                </LinkButton>
              </div>
            </div>

            {/* Sidebar - Design System Version */}
            <div className="lg:col-span-1 space-y-8">
              {/* Newsletter Signup - Simplified Version */}
              <div className="bg-fm-magenta-700 rounded-xl p-6 text-white mb-8">
                <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
                <p className="text-fm-neutral-200 mb-6 text-sm">
                  Get the latest digital marketing insights delivered to your inbox weekly.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 rounded-lg text-fm-neutral-900 placeholder-fm-neutral-500"
                  />
                  <LinkButton variant="secondary" size="sm" className="w-full bg-fm-neutral-50 text-fm-magenta-700 hover:bg-fm-neutral-100" fullWidth>
                    Subscribe
                  </LinkButton>
                </div>
              </div>

              {/* Popular Tags - Simplified Version */}
              <div className="bg-fm-neutral-50 border border-fm-neutral-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <div
                      key={index}
                      className="text-xs bg-fm-neutral-200 text-fm-neutral-700 px-3 py-2 rounded hover:bg-fm-magenta-100 hover:text-fm-magenta-700 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <SidebarWidget
                title="Recent Posts"
                variant="default"
                size="md"
              >
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map((post, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-fm-magenta-100 to-fm-magenta-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-6 h-6 text-fm-magenta-700" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-fm-neutral-900 line-clamp-2 mb-1 hover:text-fm-magenta-700 transition-colors">
                          <a href="#">{post.title}</a>
                        </h4>
                        <p className="text-xs text-fm-neutral-500">{post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SidebarWidget>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Design System Version */}
      <SectionBuilder
        badge={{
          text: "Ready to Take Action?",
          icon: <Target className="w-4 h-4" />
        }}
        headline={{
          text: "Ready to Implement These Strategies?",
          level: "h2"
        }}
        description="Turn insights into action with our expert team. We'll help you implement proven strategies that drive real business results."
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
              Start Your Marketing Journey
            </LinkButton>
            <LinkButton href="#" variant="ghost" size="lg" theme="dark">
              Download Free Guide
            </LinkButton>
          </div>
        }
      />
    </div>
  );
}