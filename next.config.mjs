import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true
  },
  // Explicitly define environment variables for Next.js
  // These will be embedded at build time, but defaults are provided in api.ts
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    NEXT_PUBLIC_FOOTBALL_API_URL: process.env.NEXT_PUBLIC_FOOTBALL_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  },
};

export default nextConfig;