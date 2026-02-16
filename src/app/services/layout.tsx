import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Brand Strategy, Design & Performance Marketing",
  description: "Full-service marketing solutions: brand strategy, creative design, performance marketing, SEO, social media, and web development. Custom strategies for your business.",
  openGraph: {
    title: "Services - Brand Strategy, Design & Performance Marketing | Freaking Minds",
    description: "Full-service marketing solutions: brand strategy, creative design, performance marketing, SEO, and web development.",
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
