import type { NextConfig } from "next";

const bucketDomain = process.env.NEXT_PUBLIC_S3_BUCKET_DOMAIN || '';

// Extraction du protocole et du hostname
const [maybeProtocol, maybeHost] = bucketDomain.includes('://')
  ? bucketDomain.split('://')
  : ['https', bucketDomain];

const remotePattern = {
  protocol: maybeProtocol === 'http' ? 'http' : 'https', // forcer type littéral
  hostname: maybeHost.split('/')[0],
  port: '',
  pathname: '/**',
} as const; // <-- 👈 force un typage constant compatible

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [remotePattern],
  },
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_ENV === "production",
  },
  productionBrowserSourceMaps: process.env.NEXT_PUBLIC_ENV === "development",
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: {
    position: "bottom-left",
  },
};

export default nextConfig;
