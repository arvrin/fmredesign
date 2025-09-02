import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['googleapis'],
  // Fix for Next.js 15 fetch and navigation issues
  experimental: {
    // Disable static generation for dynamic routes in dev
    staleTimes: {
      dynamic: 0,
      static: 300,
    },
    // Reduce prefetch in development
    ...(process.env.NODE_ENV === 'development' && {
      optimizePackageImports: ['lucide-react'],
    }),
  },
  // Additional fixes for dev mode
  ...(process.env.NODE_ENV === 'development' && {
    // Disable webpack cache to prevent stale data issues
    webpack: (config: any) => {
      config.cache = false;
      return config;
    },
  }),
};

export default nextConfig;
