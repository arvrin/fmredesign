import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started',
  description:
    'Start your digital marketing journey with FreakingMinds. Tell us about your project and get a free, no-obligation consultation within 24 hours.',
  keywords: [
    'get started digital marketing',
    'free marketing consultation',
    'start a project',
    'digital marketing quote',
  ],
  openGraph: {
    title: 'Get Started | Freaking Minds',
    description:
      'Tell us about your project and get a free consultation within 24 hours.',
    url: 'https://freakingminds.in/get-started',
  },
  alternates: {
    canonical: 'https://freakingminds.in/get-started',
  },
};

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
