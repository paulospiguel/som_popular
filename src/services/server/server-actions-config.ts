// Configurações específicas para Server Actions
export const SERVER_ACTIONS_CONFIG = {
  // Configurações de upload
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxDuration: 30, // 30 segundos
    memory: 1024, // 1GB de memória
  },

  // Configurações do Vercel para Server Actions
  vercel: {
    functions: {
      maxDuration: 30, // 30 segundos
      memory: 1024, // 1GB de memória
    },
  },

  // Configurações do Next.js para Server Actions
  nextjs: {
    serverActions: {
      // bodySizeLimit: "5mb",
    },
    serverExternalPackages: ["sharp"],
  },
};

// Função para configurar Server Actions com limite de tamanho
export function configureServerAction() {
  // Esta função pode ser usada para configurar Server Actions
  // com limites específicos de tamanho e duração
  return {
    maxDuration: SERVER_ACTIONS_CONFIG.upload.maxDuration,
    memory: SERVER_ACTIONS_CONFIG.upload.memory,
  };
}
