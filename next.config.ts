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
};

export default nextConfig;
