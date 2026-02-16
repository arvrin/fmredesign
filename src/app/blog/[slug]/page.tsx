'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, User, Tag, Calendar, Share2 } from 'lucide-react';
import { V2PageWrapper } from '@/components/layouts/V2PageWrapper';
import { getPostBySlug, getRelatedPosts } from '@/lib/blog-data';

function renderMarkdown(content: string) {
  const lines = content.trim().split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let orderedListItems: string[] = [];
  let key = 0;

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-2 mb-6 text-fm-neutral-600 leading-relaxed pl-4">
          {listItems.map((item, i) => (
            <li key={i}>{formatInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
    if (orderedListItems.length > 0) {
      elements.push(
        <ol key={key++} className="list-decimal list-inside space-y-2 mb-6 text-fm-neutral-600 leading-relaxed pl-4">
          {orderedListItems.map((item, i) => (
            <li key={i}>{formatInline(item)}</li>
          ))}
        </ol>
      );
      orderedListItems = [];
    }
  }

  function formatInline(text: string): React.ReactNode {
    // Bold
    const parts = text.split(/\*\*(.*?)\*\*/g);
    if (parts.length > 1) {
      return parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-fm-neutral-900">
            {part}
          </strong>
        ) : (
          part
        )
      );
    }
    return text;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      flushList();
      const text = trimmed.slice(3);
      elements.push(
        <h2 key={key++} className="font-display text-2xl lg:text-3xl font-bold text-fm-neutral-900 mt-10 mb-4">
          {text}
        </h2>
      );
      continue;
    }

    // H3
    if (trimmed.startsWith('### ')) {
      flushList();
      const text = trimmed.slice(4);
      elements.push(
        <h3 key={key++} className="font-display text-xl lg:text-2xl font-semibold text-fm-neutral-900 mt-8 mb-3">
          {text}
        </h3>
      );
      continue;
    }

    // Unordered list
    if (trimmed.startsWith('- ')) {
      listItems.push(trimmed.slice(2));
      continue;
    }

    // Ordered list
    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)/);
    if (orderedMatch) {
      orderedListItems.push(orderedMatch[1]);
      continue;
    }

    // Paragraph
    flushList();
    elements.push(
      <p key={key++} className="text-fm-neutral-600 leading-relaxed mb-6">
        {formatInline(trimmed)}
      </p>
    );
  }

  flushList();
  return elements;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <V2PageWrapper>
        <section className="relative z-10 v2-section pt-32 lg:pt-40 pb-20">
          <div className="v2-container v2-container-narrow" style={{ textAlign: 'center' }}>
            <h1 className="font-display text-4xl font-bold v2-text-primary mb-6">
              Article Not Found
            </h1>
            <p className="v2-text-secondary mb-8">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/blog" className="v2-btn v2-btn-primary">
              <ArrowLeft className="w-5 h-5" />
              Back to Blog
            </Link>
          </div>
        </section>
      </V2PageWrapper>
    );
  }

  const relatedPosts = getRelatedPosts(slug, 3);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${post.title} - FreakingMinds Blog`;

  return (
    <V2PageWrapper>
      {/* Hero */}
      <section className="relative z-10 v2-section pt-32 lg:pt-40">
        <div className="v2-container v2-container-narrow">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 v2-text-secondary hover:v2-text-primary transition-colors mb-8 text-sm py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Category Badge */}
          <div className="v2-badge v2-badge-glass mb-6">
            <Tag className="w-4 h-4 v2-text-primary" />
            <span className="v2-text-primary">{post.category}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold v2-text-primary mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 v2-text-secondary text-sm mb-6">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium v2-text-secondary"
                style={{ background: 'rgba(201, 50, 93, 0.08)' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="relative z-10 v2-section pt-0">
        <div className="v2-container v2-container-narrow">
          <div className="v2-paper-lg rounded-3xl p-8 md:p-12 lg:p-16">
            <div className="prose-fm max-w-none lg:max-w-3xl lg:mx-auto">
              {renderMarkdown(post.content)}
            </div>

            {/* Share Buttons */}
            <div className="mt-12 pt-8 border-t border-fm-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="flex items-center gap-2 text-fm-neutral-700 font-semibold">
                  <Share2 className="w-5 h-5" />
                  Share this article
                </span>
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-fm-neutral-100 text-fm-neutral-700 rounded-full text-sm font-medium hover:bg-fm-magenta-50 hover:text-fm-magenta-600 transition-all"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-fm-neutral-100 text-fm-neutral-700 rounded-full text-sm font-medium hover:bg-fm-magenta-50 hover:text-fm-magenta-600 transition-all"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-fm-neutral-100 text-fm-neutral-700 rounded-full text-sm font-medium hover:bg-fm-magenta-50 hover:text-fm-magenta-600 transition-all"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="relative z-10 v2-section">
          <div className="v2-container v2-container-narrow">
            <h2 className="font-display text-2xl md:text-3xl font-bold v2-text-primary mb-8">
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group v2-paper rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="v2-tag v2-tag-magenta">
                      {related.category}
                    </span>
                    <span className="text-fm-neutral-500 text-xs">{related.readTime}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-fm-neutral-900 mb-2 group-hover:text-fm-magenta-700 transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-fm-neutral-600 text-sm line-clamp-2">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative z-10 v2-section pb-32">
        <div className="v2-container v2-container-narrow">
          <div className="v2-paper rounded-3xl p-10 lg:p-14" style={{ textAlign: 'center' }}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-fm-neutral-900 mb-6 leading-tight">
              Ready to Grow Your <span className="text-fm-magenta-600">Business</span>?
            </h2>
            <p className="text-fm-neutral-600 mb-8 max-w-xl mx-auto">
              Turn these insights into action. Our team can help you implement proven strategies that drive real results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/get-started" className="v2-btn v2-btn-magenta">
                Get a Free Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="v2-btn v2-btn-outline">
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </V2PageWrapper>
  );
}
