// Configurações do middleware para uploads
export const middlewareConfig = {
  // Configurações de upload
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ],
  },

  // Configurações do Next.js para Server Actions
  nextjs: {
    serverActions: {
      // bodySizeLimit: "5mb",
    },
  },

  // Configurações do Vercel para Server Actions
  vercel: {
    functions: {
      maxDuration: 30, // 30 segundos
      memory: 1024, // 1GB de memória
    },
  },
};
