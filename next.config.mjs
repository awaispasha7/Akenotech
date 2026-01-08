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
  // Don't explicitly define env here - let Next.js use process.env directly
  // This avoids Railway's secret validation checking for these variables
  // Defaults are handled in src/config/api.ts
};

export default nextConfig;