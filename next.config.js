/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["jspdf"],
  },
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
