import type { NextConfig } from "next";

// Intelligent Serverless & Local Gateway Resolver
// Automatically links Vercel cloud deployments directly to the production backend,
// while preserving zero-configuration local dual-port development (localhost:3001).
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 
  (process.env.NODE_ENV === 'production' || process.env.VERCEL 
    ? 'https://amardeutsch-platform-backend.vercel.app' 
    : 'http://localhost:3001');

const nextConfig: NextConfig = {
  compress: true, // Enable strict gzip/Brotli compression to eliminate load time bottlenecks
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/backend/Customer-Analytics',
          destination: `${BACKEND_URL}/backend/Customer-Analytics`,
        },
        {
          source: '/backend/customer-analytics',
          destination: `${BACKEND_URL}/backend/Customer-Analytics`,
        },
        {
          source: '/backend',
          destination: `${BACKEND_URL}/backend/Dashboard`,
        },
        {
          source: '/backend/:path*',
          destination: `${BACKEND_URL}/backend/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    // Maximum Enterprise Website Security & Data Protection Headers
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, // Prevents clickjacking attacks
          { key: 'X-Content-Type-Options', value: 'nosniff' }, // Protects against MIME-sniffing exploits
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, // Prevents referrer leak of internal paths
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }, // Enforces secure SSL connection
          { key: 'X-XSS-Protection', value: '1; mode=block' }
        ],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
