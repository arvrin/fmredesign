import { HeroSectionV3 } from "@/components/sections/v3/HeroSectionV3";
import { ServicesSectionV3 } from "@/components/sections/v3/ServicesSectionV3";
import { WorkSectionV3 } from "@/components/sections/v3/WorkSectionV3";
import { TestimonialsSectionV3 } from "@/components/sections/v3/TestimonialsSectionV3";
import { StatsSectionV3 } from "@/components/sections/v3/StatsSectionV3";
import { ContactSectionV3 } from "@/components/sections/v3/ContactSectionV3";

export default function HomeV3Page() {
  return (
    <main className="bg-fm-cream min-h-screen">
      {/* Editorial Luxury Homepage */}
      <HeroSectionV3 />
      <ServicesSectionV3 />
      <WorkSectionV3 />
      <TestimonialsSectionV3 />
      <StatsSectionV3 />
      <ContactSectionV3 />
    </main>
  );
}
