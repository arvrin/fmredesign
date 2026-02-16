import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Freaking Minds collects, uses, and protects your personal information. Read our comprehensive privacy policy.",
  openGraph: {
    title: "Privacy Policy | Freaking Minds",
    description: "Learn how Freaking Minds collects, uses, and protects your personal information.",
  },
  alternates: {
    canonical: "https://freakingminds.in/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
