import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Explore our portfolio of successful digital marketing campaigns, brand transformations, and web development projects for clients across India.",
  openGraph: {
    title: "Our Work | Freaking Minds",
    description: "Explore our portfolio of successful digital marketing campaigns and brand transformations.",
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
