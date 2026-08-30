/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  // TEMPORARY: bundle the seeded SQLite file into every serverless function so
  // the storefront has catalog data without a hosted database. Remove once a
  // real DATABASE_URL (Postgres) is configured.
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./prisma/dev.db"],
    },
  },
};

export default nextConfig;
