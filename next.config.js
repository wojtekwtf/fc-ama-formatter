/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: switch off so vercel doesnt complain at builds
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig