import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["127.0.0.1", "images.unsplash.com"],
  },
};

export default nextConfig;
