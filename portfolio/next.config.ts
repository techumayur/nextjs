import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // 🔥 COMPLETELY DISABLE SERVER-SIDE PROCESSING
    formats: ['image/avif', 'image/webp'] as const,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "techumayur.local",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.techumayur.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.techumayur.in",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: '**.techumayur.in',
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'techumayur.in',
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['gsap', 'swiper', 'react-bootstrap'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
