import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desabilitar turbopack em produção para evitar problemas
  ...(process.env.NODE_ENV === "development" && { turbopack: {} }),

  // Configurações para SQLite
  serverExternalPackages: ["better-sqlite3"],

  // Configurações de build
  experimental: {
    // Desabilitar features experimentais em produção
    ...(process.env.NODE_ENV === "development" && {
      serverComponentsExternalPackages: ["better-sqlite3"],
    }),
  },

  // Configurações de output
  output: "standalone",

  // Configurações de webpack
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Configurações específicas para o servidor
      config.externals = config.externals || [];
      config.externals.push("better-sqlite3");
    }

    return config;
  },
};

export default nextConfig;
