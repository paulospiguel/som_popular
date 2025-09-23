/**
 * Utilitários para upload de arquivos
 * Este arquivo contém funções utilitárias que não são Server Actions
 */

/**
 * Extrair ID do upload a partir da URL
 * A URL contém o ID do arquivo que pode ser usado para buscar informações no banco
 */
export function extractUploadIdFromUrl(url: string): string | null {
  try {
    console.log("extractUploadIdFromUrl - URL:", url);

    // Verificar se a URL é válida
    if (!url || typeof url !== "string") {
      console.log("extractUploadIdFromUrl - Invalid URL");
      return null;
    }

    // Para URLs locais: /upload/folder/filename.ext
    if (url.startsWith("/upload/")) {
      const parts = url.split("/");
      const filename = parts[parts.length - 1];
      const uploadId = filename.split(".")[0];
      console.log("extractUploadIdFromUrl - Local upload ID:", uploadId);
      return uploadId;
    }

    // Para URLs do Vercel Blob: https://[hash].public.blob.vercel-storage.com/folder/filename.ext
    if (url.includes("blob.vercel-storage.com")) {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/").filter(Boolean);
        if (pathParts.length > 0) {
          const filename = pathParts[pathParts.length - 1];
          const uploadId = filename.split(".")[0];
          console.log(
            "extractUploadIdFromUrl - Vercel Blob upload ID:",
            uploadId
          );
          return uploadId;
        }
      } catch (urlError) {
        console.error("URL inválida:", url, urlError);
        return null;
      }
    }

    // Para URLs de storage externo: https://bucket.domain.com/folder/filename.ext
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/").filter(Boolean);
        if (pathParts.length > 0) {
          const filename = pathParts[pathParts.length - 1];
          const uploadId = filename.split(".")[0];
          console.log(
            "extractUploadIdFromUrl - External storage upload ID:",
            uploadId
          );
          return uploadId;
        }
      } catch (urlError) {
        console.error("URL inválida:", url, urlError);
        return null;
      }
    }

    console.log("extractUploadIdFromUrl - No upload ID found");
    return null;
  } catch (error) {
    console.error("Erro ao extrair ID da URL:", error);
    return null;
  }
}

/**
 * Verificar se uma URL é de upload local
 */
export function isLocalUploadUrl(url: string): boolean {
  return Boolean(url && typeof url === "string" && url.startsWith("/upload/"));
}

/**
 * Verificar se uma URL é de storage externo
 */
export function isExternalStorageUrl(url: string): boolean {
  return Boolean(
    url &&
      typeof url === "string" &&
      (url.startsWith("http://") || url.startsWith("https://"))
  );
}

/**
 * Verificar se uma URL é do Vercel Blob
 */
export function isVercelBlobUrl(url: string): boolean {
  return Boolean(
    url && typeof url === "string" && url.includes("blob.vercel-storage.com")
  );
}

/**
 * Obter pasta do upload a partir da URL
 */
export function getUploadFolderFromUrl(url: string): string | null {
  try {
    if (!url || typeof url !== "string") {
      return null;
    }

    if (url.startsWith("/upload/")) {
      const parts = url.split("/");
      if (parts.length >= 3) {
        return parts[2]; // /upload/folder/filename.ext
      }
    }

    // Para URLs do Vercel Blob: https://[hash].public.blob.vercel-storage.com/folder/filename.ext
    if (url.includes("blob.vercel-storage.com")) {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2) {
          return pathParts[0]; // folder/filename.ext
        }
      } catch (urlError) {
        console.error("URL inválida:", url, urlError);
        return null;
      }
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2) {
          return pathParts[0]; // https://domain.com/folder/filename.ext
        }
      } catch (urlError) {
        console.error("URL inválida:", url, urlError);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Erro ao extrair pasta da URL:", error);
    return null;
  }
}

/**
 * Obter nome do arquivo a partir da URL
 */
export function getFilenameFromUrl(url: string): string | null {
  try {
    if (!url || typeof url !== "string") {
      return null;
    }

    if (url.startsWith("/upload/")) {
      const parts = url.split("/");
      return parts[parts.length - 1];
    }

    // Para URLs do Vercel Blob: https://[hash].public.blob.vercel-storage.com/folder/filename.ext
    if (url.includes("blob.vercel-storage.com")) {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/").filter(Boolean);
        return pathParts[pathParts.length - 1];
      } catch (urlError) {
        console.error("URL inválida:", url, urlError);
        return null;
      }
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/").filter(Boolean);
        return pathParts[pathParts.length - 1];
      } catch (urlError) {
        console.error("URL inválida:", url, urlError);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Erro ao extrair nome do arquivo da URL:", error);
    return null;
  }
}
