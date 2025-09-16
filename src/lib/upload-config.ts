// Configurações de upload para o Next.js App Router
export const UPLOAD_CONFIG = {
  // Tamanho máximo do arquivo (10MB)
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB em bytes

  // Tipos de arquivo permitidos
  ALLOWED_TYPES: [
    // Imagens
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    // PDFs
    "application/pdf",
    // Documentos
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ],

  // Configurações do Next.js para Server Actions
  NEXT_CONFIG: {
    serverActions: {
      // bodySizeLimit: "5mb",
    },
  },

  // Configurações do Vercel para Server Actions
  VERCEL_CONFIG: {
    maxDuration: 30, // 30 segundos
    memory: 1024, // 1GB de memória
  },
};

// Função para validar o tamanho do arquivo
export function validateFileSize(file: File): {
  valid: boolean;
  error?: string;
} {
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }
  return { valid: true };
}

// Função para validar o tipo do arquivo
export function validateFileType(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Tipo de arquivo não permitido",
    };
  }
  return { valid: true };
}

// Função para validar arquivo completo
export function validateFile(file: File): { valid: boolean; error?: string } {
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  return { valid: true };
}
