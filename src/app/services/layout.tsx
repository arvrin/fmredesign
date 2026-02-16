import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Comprehensive digital marketing services including SEO, social media, PPC, branding, web development, and content marketing. Custom strategies for your business.",
  openGraph: {
    title: "Services | Freaking Minds",
    description: "Comprehensive digital marketing services including SEO, social media, PPC, branding, and web development.",
  },
  alternates: {
    canonical: "https://freakingminds.in/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
