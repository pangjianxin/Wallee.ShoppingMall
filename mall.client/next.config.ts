import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output:"standalone",
  reactStrictMode: true,
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
