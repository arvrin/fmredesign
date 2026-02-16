'use client';

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { HeaderV2 } from "@/components/layout/HeaderV2";
import { FooterV2 } from "@/components/layout/FooterV2";
import { HeaderV3 } from "@/components/layout/HeaderV3";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || false;
  const isClientRoute = pathname?.startsWith('/client') || false;
  const isShowcaseRoute = pathname?.startsWith('/showcase') || false;
  const isV3Route = pathname?.startsWith('/showcase/home-v3') || false;

  if (isAdminRoute || isClientRoute) {
    // Admin and client routes render without main site header/footer
    return <main id="main-content">{children}</main>;
  }

  if (isV3Route) {
    // V3 routes use refined editorial header/footer
    return (
      <>
        <HeaderV3 />
        <main id="main-content">{children}</main>
        <FooterV2 />
      </>
    );
  }

  if (isShowcaseRoute) {
    // Showcase routes render without header/footer - they have their own layouts
    return <main id="main-content">{children}</main>;
  }

  // Main site routes now use V2 dark theme header/footer
  // No BackgroundAnimations - V2 pages have their own star background via V2PageWrapper
  return (
    <>
      <HeaderV2 />
      <main id="main-content">{children}</main>
      <FooterV2 />
    </>
  );
}
