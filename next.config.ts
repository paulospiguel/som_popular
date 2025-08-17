import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Configurações para o middleware funcionar com Turbopack
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
  // Configuração específica para o middleware
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('better-sqlite3');
    }
    return config;
  },
};

export default nextConfig;
