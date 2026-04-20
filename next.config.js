/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'pdf-parse/worker', 'pdfjs-dist'],
  },
};

module.exports = nextConfig;
