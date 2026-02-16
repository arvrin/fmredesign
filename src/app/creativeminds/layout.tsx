import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CreativeMinds Talent Network',
  description:
    'Join the CreativeMinds talent network — a curated community of designers, marketers, writers, and creators. Apply today and connect with top brands.',
  keywords: [
    'creativeminds talent network',
    'freelance creative jobs india',
    'digital marketing talent',
    'creative community',
    'freelancer network India',
  ],
  openGraph: {
    title: 'CreativeMinds Talent Network | Freaking Minds',
    description:
      'A curated community of verified creative professionals. Apply to join and connect with brands.',
    url: 'https://freakingminds.in/creativeminds',
  },
  alternates: {
    canonical: 'https://freakingminds.in/creativeminds',
  },
};

export default function CreativeMindsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
