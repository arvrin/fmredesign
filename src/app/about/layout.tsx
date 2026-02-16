import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Our Story & Team",
  description: "Meet the team behind Freaking Minds. We're a full-service creative marketing agency creating data-driven strategies that transform brands.",
  openGraph: {
    title: "About Us - Our Story & Team | Freaking Minds",
    description: "Meet the team behind Freaking Minds. A full-service creative marketing agency creating data-driven strategies that transform brands.",
  },
  alternates: {
    canonical: "https://freakingminds.in/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
