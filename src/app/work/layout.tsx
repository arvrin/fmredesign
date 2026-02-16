import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work - Case Studies & Results",
  description: "Explore our portfolio of successful marketing campaigns, brand transformations, and web development projects for clients worldwide.",
  openGraph: {
    title: "Our Work - Case Studies & Results | Freaking Minds",
    description: "Explore our portfolio of successful marketing campaigns and brand transformations.",
  },
  alternates: {
    canonical: "https://freakingminds.in/work",
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
