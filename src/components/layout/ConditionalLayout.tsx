'use client';

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundAnimations } from "@/components/layout/BackgroundAnimations";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || false;
  const isClientRoute = pathname?.startsWith('/client') || false;
  
  if (isAdminRoute || isClientRoute) {
    // Admin and client routes render without main site header/footer
    return <main id="main-content">{children}</main>;
  }
  
  // Regular routes include header, footer, and background animations
  return (
    <>
      <BackgroundAnimations />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}