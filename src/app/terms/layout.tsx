import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service for Freaking Minds digital marketing agency. Understand your rights and obligations when using our services.",
  openGraph: {
    title: "Terms of Service | Freaking Minds",
    description: "Read the Terms of Service for Freaking Minds digital marketing agency.",
  },
  alternates: {
    canonical: "https://freakingminds.in/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
