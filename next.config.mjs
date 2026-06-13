/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove console.log in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Don't expose Next.js version in headers
  poweredByHeader: false,
  // Optimize imports for large icon/component libraries — only bundle what's used
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
