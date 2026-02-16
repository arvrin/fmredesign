import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Freaking Minds. Contact our digital marketing team in Bhopal for a free consultation and custom strategy proposal.",
  openGraph: {
    title: "Contact Us | Freaking Minds",
    description: "Get in touch with Freaking Minds for a free consultation and custom strategy proposal.",
  },
  alternates: {
    canonical: "https://freakingminds.in/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
