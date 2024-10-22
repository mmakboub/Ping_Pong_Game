/** @type {import('next').NextConfig} */
require("dotenv").config();
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "cdn.intra.42.fr",
      },
      {
        protocol: 'https',
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: 'https',
        hostname: "i.pinimg.com",
      },
      {
        protocol: 'https',
        hostname: "res.cloudinary.com",
      }
    ]
  },
};

module.exports = nextConfig;
