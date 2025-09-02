import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CreativeNetworkSection } from "@/components/sections/CreativeNetworkSection";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <CreativeNetworkSection />
      <CaseStudiesSection />
    </>
  );
}
