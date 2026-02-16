import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";

// Display font - elegant serif for headlines (authority & sophistication)
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Body font - modern, highly readable sans
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Accent font - for special moments
const instrument = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://freakingminds.in'),
  title: {
    default: "Freaking Minds - Digital Marketing Agency in Bhopal | We Don't Just Market, We Create Movements",
    template: "%s | Freaking Minds",
  },
  description: "Leading digital marketing agency in Bhopal. Data-driven creative solutions that transform ambitious brands into market leaders.",
  keywords: [
    "digital marketing agency bhopal",
    "seo services bhopal",
    "social media marketing",
    "performance marketing",
    "creative design agency",
    "digital strategy consulting"
  ],
  authors: [{ name: "Freaking Minds" }],
  creator: "Freaking Minds",
  publisher: "Freaking Minds",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freakingminds.in",
    title: "Freaking Minds - Digital Marketing Agency",
    description: "We Don't Just Market, We Create Movements. Leading digital marketing agency in Bhopal delivering measurable results.",
    siteName: "Freaking Minds",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Freaking Minds Digital Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@freakingminds",
    title: "Freaking Minds - Digital Marketing Agency",
    description: "We Don't Just Market, We Create Movements",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://freakingminds.in/#organization',
        name: 'Freaking Minds',
        url: 'https://freakingminds.in',
        logo: {
          '@type': 'ImageObject',
          url: 'https://freakingminds.in/logo.png',
        },
        sameAs: [
          'https://www.instagram.com/freakingminds/',
          'https://www.linkedin.com/company/freakingminds/',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-9833257659',
          contactType: 'customer service',
          email: 'hello@freakingminds.in',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi'],
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://freakingminds.in/#localbusiness',
        name: 'Freaking Minds',
        description: 'Leading digital marketing agency in Bhopal. Data-driven creative solutions that transform ambitious brands into market leaders.',
        url: 'https://freakingminds.in',
        telephone: '+91-9833257659',
        email: 'hello@freakingminds.in',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Bhopal',
          addressRegion: 'Madhya Pradesh',
          addressCountry: 'IN',
        },
        priceRange: '$$',
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '18:00',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://freakingminds.in/#website',
        url: 'https://freakingminds.in',
        name: 'Freaking Minds',
        publisher: { '@id': 'https://freakingminds.in/#organization' },
      },
    ],
  };

  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} ${instrument.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <SmoothScrollProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

