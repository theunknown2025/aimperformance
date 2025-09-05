import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  // Static export for landing page only
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable server-side features for static export
  experimental: {
    esmExternals: false,
  },
  // Optimize for static export
  distDir: '.next-landing',
  // Ensure all pages are static
  generateStaticParams: true,
};

export default nextConfig;
