import { del, head, list, put } from "@vercel/blob";

// Configuração do Vercel Blob
export const VERCEL_BLOB_CONFIG = {
  // Limites do Vercel Blob
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB (limite do Vercel Blob)
  ALLOWED_TYPES: [
    // Imagens
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",

    // Documentos
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",

    // Arquivos de áudio
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/mp3",

    // Arquivos de vídeo
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/quicktime",
    "video/webm",

    // Arquivos compactados
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",

    // Outros
    "application/json",
    "application/xml",
  ],

  // Pastas organizadas por tipo de conteúdo
  FOLDERS: {
    PARTICIPANTS: "participants",
    EVENTS: "events",
    REGULATIONS: "regulations",
    DOCUMENTS: "documents",
    GENERAL: "general",
  },

  // Configurações de cache
  CACHE_CONTROL: "public, max-age=31536000", // 1 ano
};

// Função para validar configuração do Vercel Blob
export function validateVercelBlobConfig(): { valid: boolean; error?: string } {
  // O Vercel Blob usa a variável de ambiente BLOB_READ_WRITE_TOKEN automaticamente
  // Não precisamos validar nada específico, o Vercel gerencia isso
  return { valid: true };
}

// Função para fazer upload de arquivo para Vercel Blob
export async function uploadToVercelBlob(
  file: File,
  folder: string = VERCEL_BLOB_CONFIG.FOLDERS.GENERAL,
  customFilename?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Usar nome customizado se fornecido, senão usar nome original
    const filename = customFilename || file.name;
    const fullPath = `${folder}/${filename}`;

    console.log("uploadToVercelBlob - Uploading file:", {
      filename,
      folder,
      fullPath,
      fileSize: file.size,
      fileType: file.type,
    });

    const blob = await put(fullPath, file, {
      access: "public",
      cacheControlMaxAge: 31536000, // 1 ano
    });

    console.log("uploadToVercelBlob - Upload successful:", blob.url);

    return {
      success: true,
      url: blob.url,
    };
  } catch (error) {
    console.error("Erro no upload para Vercel Blob:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro no upload para Vercel Blob",
    };
  }
}

// Função para remover arquivo do Vercel Blob
export async function deleteFromVercelBlob(
  url: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await del(url);
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover arquivo do Vercel Blob:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao remover arquivo",
    };
  }
}

// Função para verificar se arquivo existe no Vercel Blob
export async function checkFileExistsInVercelBlob(
  url: string
): Promise<{ success: boolean; exists?: boolean; error?: string }> {
  try {
    await head(url);
    return { success: true, exists: true };
  } catch (error) {
    // Se o arquivo não existe, o Vercel Blob retorna 404
    if (error instanceof Error && error.message.includes("404")) {
      return { success: true, exists: false };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao verificar arquivo",
    };
  }
}

// Função para listar arquivos de uma pasta
export async function listFilesInFolder(
  folder: string,
  limit: number = 100
): Promise<{ success: boolean; blobs?: unknown[]; error?: string }> {
  try {
    const { blobs } = await list({
      prefix: `${folder}/`,
      limit,
    });

    return { success: true, blobs };
  } catch (error) {
    console.error("Erro ao listar arquivos da pasta:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao listar arquivos",
    };
  }
}

// Função para obter informações de um arquivo
export async function getFileInfoFromVercelBlob(
  url: string
): Promise<{ success: boolean; info?: unknown; error?: string }> {
  try {
    const info = await head(url);
    return { success: true, info };
  } catch (error) {
    console.error("Erro ao obter informações do arquivo:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao obter informações",
    };
  }
}
