/** @type {import('next').NextConfig} */
const path = require("path")
const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  experimental: { 
    outputFileTracing: true,
    outputFileTracingRoot: path.join(__dirname, '../../'),
    outputFileTracingIncludes: {
      '/lib': ['./src/lib/*'],
    },
  }
};

module.exports = nextConfig;
