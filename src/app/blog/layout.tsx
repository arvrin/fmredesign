import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Stay ahead with marketing insights, SEO tips, social media strategies, and industry trends from the Freaking Minds team.',
  keywords: [
    'marketing blog',
    'seo tips',
    'social media strategy',
    'marketing insights',
    'content marketing tips',
  ],
  openGraph: {
    title: 'Blog | Freaking Minds',
    description:
      'Expert marketing tips, SEO guides, and industry insights.',
    url: 'https://freakingminds.in/blog',
  },
  alternates: {
    canonical: 'https://freakingminds.in/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
