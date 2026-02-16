import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Stay ahead with digital marketing insights, SEO tips, social media strategies, and industry trends from the FreakingMinds team.',
  keywords: [
    'digital marketing blog',
    'seo tips',
    'social media strategy',
    'marketing insights',
    'content marketing tips',
  ],
  openGraph: {
    title: 'Blog | Freaking Minds',
    description:
      'Expert digital marketing tips, SEO guides, and industry insights.',
    url: 'https://freakingminds.in/blog',
  },
  alternates: {
    canonical: 'https://freakingminds.in/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
