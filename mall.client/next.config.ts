import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output:"standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aos-comment.amap.com",
      },
    ],
  },
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
