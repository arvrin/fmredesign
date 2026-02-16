import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the team behind Freaking Minds. We're a passionate digital marketing agency in Bhopal creating data-driven strategies that transform brands.",
  openGraph: {
    title: "About Us | Freaking Minds",
    description: "Meet the team behind Freaking Minds. Passionate digital marketers creating data-driven strategies that transform brands.",
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
