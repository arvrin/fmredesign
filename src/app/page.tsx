'use client';

import dynamic from 'next/dynamic';
import { HeroSectionV2 } from "@/components/sections/HeroSectionV2";
import { V2PageWrapper } from "@/components/layouts/V2PageWrapper";
import { PageLoader } from "@/components/ui/PageLoader";

// Dynamically import below-the-fold sections to reduce initial bundle
const ServicesSectionV2 = dynamic(
  () => import("@/components/sections/ServicesSectionV2").then(m => ({ default: m.ServicesSectionV2 })),
  { ssr: false }
);
const FeaturesSectionV2 = dynamic(
  () => import("@/components/sections/FeaturesSectionV2").then(m => ({ default: m.FeaturesSectionV2 })),
  { ssr: false }
);
const ClientsSectionV2 = dynamic(
  () => import("@/components/sections/ClientsSectionV2").then(m => ({ default: m.ClientsSectionV2 })),
  { ssr: false }
);
const CreativeMindsSectionV2 = dynamic(
  () => import("@/components/sections/CreativeMindsSectionV2").then(m => ({ default: m.CreativeMindsSectionV2 })),
  { ssr: false }
);
const ContactSectionV2 = dynamic(
  () => import("@/components/sections/ContactSectionV2").then(m => ({ default: m.ContactSectionV2 })),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <PageLoader />
      <V2PageWrapper starCount={60}>
        <HeroSectionV2 />
        <ServicesSectionV2 />
        <FeaturesSectionV2 />
        <ClientsSectionV2 />
        <CreativeMindsSectionV2 />
        <ContactSectionV2 />
      </V2PageWrapper>
    </>
  );
}
