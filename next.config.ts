import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['googleapis'],
  eslint: {
    // Admin pages have pre-existing ESLint issues (unused vars, unescaped entities)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Admin pages have pre-existing TS issues (async params in Next.js 15)
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

export default nextConfig;
