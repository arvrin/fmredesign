import { HeroSectionV2 } from "@/components/sections/HeroSectionV2";
import { ServicesSectionV2 } from "@/components/sections/ServicesSectionV2";
import { FeaturesSectionV2 } from "@/components/sections/FeaturesSectionV2";
import { ClientsSectionV2 } from "@/components/sections/ClientsSectionV2";
import { CreativeMindsSectionV2 } from "@/components/sections/CreativeMindsSectionV2";
import { ContactSectionV2 } from "@/components/sections/ContactSectionV2";
import { V2PageWrapper } from "@/components/layouts/V2PageWrapper";
import { PageLoader } from "@/components/ui/PageLoader";

export default function Home() {
  return (
    <V2PageWrapper starCount={60}>
      <PageLoader />
      <HeroSectionV2 />
      <ServicesSectionV2 />
      <FeaturesSectionV2 />
      <ClientsSectionV2 />
      <CreativeMindsSectionV2 />
      <ContactSectionV2 />
    </V2PageWrapper>
  );
}
