/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// next.config.js
module.exports = {
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
}
