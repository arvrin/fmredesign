import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://freakingminds.in'),
  title: "Freaking Minds - Digital Marketing Agency in Bhopal | We Don't Just Market, We Create Movements",
  description: "Leading digital marketing agency in Bhopal. Data-driven creative solutions that transform ambitious brands into market leaders. 50+ years experience, 250+ successful campaigns.",
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
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

