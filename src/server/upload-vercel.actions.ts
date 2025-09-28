"use server";

import { createId } from "@paralleldrive/cuid2";

import type { Upload } from "@/infra/database/schema";
import { extractUploadIdFromUrl } from "@/lib/upload-utils";
import {
  VERCEL_BLOB_CONFIG,
  checkFileExistsInVercelBlob,
  deleteFromVercelBlob,
  uploadToVercelBlob,
  validateVercelBlobConfig,
} from "@/services/storage/vercel-blob-config";

import { createUploadRecord } from "./uploads";

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  filename?: string;
  uploadId?: string;
  error?: string;
}

export interface UploadOptions {
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number;
  renameFile?: boolean;
  uploadedBy?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isPublic?: boolean;
  metadata?: Record<string, unknown>;
}

const DEFAULT_OPTIONS: UploadOptions = {
  folder: VERCEL_BLOB_CONFIG.FOLDERS.GENERAL,
  allowedTypes: VERCEL_BLOB_CONFIG.ALLOWED_TYPES,
  maxSize: VERCEL_BLOB_CONFIG.MAX_FILE_SIZE,
  renameFile: true,
  isPublic: true,
};

/**
 * Validar arquivo antes do upload
 */
function validateFile(
  file: File,
  options: UploadOptions
): { valid: boolean; error?: string } {
  // Verificar tamanho
  if (file.size > (options.maxSize || VERCEL_BLOB_CONFIG.MAX_FILE_SIZE)) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${Math.round((options.maxSize || VERCEL_BLOB_CONFIG.MAX_FILE_SIZE) / 1024 / 1024)}MB`,
    };
  }

  // Verificar tipo
  const allowedTypes = options.allowedTypes || VERCEL_BLOB_CONFIG.ALLOWED_TYPES;
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Gerar nome único para o arquivo
 */
function generateUniqueFilename(
  originalName: string,
  renameFile: boolean
): string {
  if (!renameFile) {
    console.log("generateUniqueFilename - Using original name:", originalName);
    return originalName;
  }

  const fileExtension = originalName.split(".").pop();
  const uniqueId = createId();
  const uniqueFilename = `${uniqueId}.${fileExtension}`;
  console.log(
    "generateUniqueFilename - Generated unique name:",
    uniqueFilename
  );
  return uniqueFilename;
}

/**
 * Server Action principal para upload de arquivos usando Vercel Blob
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    console.log("uploadFile - Starting upload with options:", options);
    const config = { ...DEFAULT_OPTIONS, ...options };
    console.log("uploadFile - Final config:", config);

    // Validar configuração do Vercel Blob
    const blobValidation = validateVercelBlobConfig();
    if (!blobValidation.valid) {
      console.log(
        "uploadFile - Vercel Blob config invalid:",
        blobValidation.error
      );
      return {
        success: false,
        error: blobValidation.error || "Configuração do Vercel Blob inválida",
      };
    }

    // Validar arquivo
    const fileValidation = validateFile(file, config);
    if (!fileValidation.valid) {
      console.log("uploadFile - File validation failed:", fileValidation.error);
      return {
        success: false,
        error: fileValidation.error || "Arquivo inválido",
      };
    }

    console.log("uploadFile - File validation passed");

    // Gerar nome único para o arquivo
    const filename = generateUniqueFilename(file.name, config.renameFile!);
    const folder = config.folder || VERCEL_BLOB_CONFIG.FOLDERS.GENERAL;

    console.log("uploadFile - Generated filename:", filename);
    console.log("uploadFile - Using folder:", folder);

    // Fazer upload para Vercel Blob
    const uploadResult = await uploadToVercelBlob(file, folder, filename);
    if (!uploadResult.success) {
      console.log("uploadFile - Upload failed:", uploadResult.error);
      return {
        success: false,
        error: uploadResult.error || "Erro no upload",
      };
    }

    console.log("uploadFile - Upload successful:", uploadResult.url);

    // Salvar registro no banco de dados
    const uploadData = {
      originalName: file.name,
      filename: filename,
      filePath: `${folder}/${filename}`,
      publicUrl: uploadResult.url!,
      mimeType: file.type,
      fileSize: file.size,
      storageProvider: "vercel-blob",
      folder: folder,
      uploadedBy: config.uploadedBy,
      relatedEntityType: config.relatedEntityType,
      relatedEntityId: config.relatedEntityId,
      isPublic: config.isPublic ?? true,
      metadata: config.metadata ? JSON.stringify(config.metadata) : null,
    };

    console.log("uploadFile - Creating upload record with data:", uploadData);
    const uploadRecord = await createUploadRecord(uploadData);

    if (!uploadRecord.success) {
      console.error(
        "uploadFile - Failed to save upload record:",
        uploadRecord.error
      );
      // Tentar remover o arquivo do Vercel Blob se falhou ao salvar no banco
      await deleteFromVercelBlob(uploadResult.url!);
      return {
        success: false,
        error: uploadRecord.error || "Erro ao salvar registro de upload",
      };
    }

    console.log(
      "uploadFile - Upload record saved successfully:",
      uploadRecord.upload?.id
    );

    return {
      success: true,
      url: uploadResult.url || "",
      path: `${folder}/${filename}`,
      filename: filename,
      uploadId: uploadRecord.upload?.id || "",
    };
  } catch (error) {
    console.error("uploadFile - Unexpected error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro desconhecido no upload",
    };
  }
}

/**
 * Upload específico para fotos de participantes
 */
export async function uploadParticipantPhoto(
  file: File
): Promise<UploadResult> {
  return uploadFile(file, {
    folder: VERCEL_BLOB_CONFIG.FOLDERS.PARTICIPANTS,
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    maxSize: 5 * 1024 * 1024, // 5MB para fotos
    renameFile: true,
  });
}

/**
 * Upload específico para regulamentos PDF
 */
export async function uploadRegulationFile(file: File): Promise<UploadResult> {
  console.log("uploadRegulationFile - Starting upload for file:", file.name);

  const result = await uploadFile(file, {
    folder: VERCEL_BLOB_CONFIG.FOLDERS.REGULATIONS,
    allowedTypes: ["application/pdf"],
    maxSize: 20 * 1024 * 1024, // 20MB para PDFs
    renameFile: true,
  });

  console.log("uploadRegulationFile - Upload result:", result);
  console.log("uploadRegulationFile - Upload ID:", result.uploadId);

  return result;
}

/**
 * Upload específico para documentos de eventos
 */
export async function uploadEventDocument(file: File): Promise<UploadResult> {
  return uploadFile(file, {
    folder: VERCEL_BLOB_CONFIG.FOLDERS.EVENTS,
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ],
    maxSize: 15 * 1024 * 1024, // 15MB para documentos
    renameFile: true,
  });
}

/**
 * Upload específico para documentos gerais
 */
export async function uploadDocument(file: File): Promise<UploadResult> {
  return uploadFile(file, {
    folder: VERCEL_BLOB_CONFIG.FOLDERS.DOCUMENTS,
    allowedTypes: VERCEL_BLOB_CONFIG.ALLOWED_TYPES,
    maxSize: 50 * 1024 * 1024, // 50MB para documentos gerais
    renameFile: true,
  });
}

/**
 * Remover arquivo do Vercel Blob
 */
export async function removeFile(
  url: string
): Promise<{ success: boolean; error?: string }> {
  try {
    return await deleteFromVercelBlob(url);
  } catch (error) {
    console.error("Erro ao remover arquivo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao remover arquivo",
    };
  }
}

/**
 * Verificar se arquivo existe no Vercel Blob
 */
export async function checkFileExists(
  url: string
): Promise<{ success: boolean; exists?: boolean; error?: string }> {
  try {
    return await checkFileExistsInVercelBlob(url);
  } catch (error) {
    console.error("Erro ao verificar arquivo:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao verificar arquivo",
    };
  }
}

/**
 * Buscar informações do arquivo a partir da URL
 */
export async function getFileInfoFromUrl(
  url: string
): Promise<{ success: boolean; upload?: Upload; error?: string }> {
  try {
    console.log("getFileInfoFromUrl - URL:", url);
    const uploadId = extractUploadIdFromUrl(url);
    console.log("getFileInfoFromUrl - Upload ID:", uploadId);

    if (!uploadId) {
      console.log("getFileInfoFromUrl - No upload ID found");
      return { success: false, error: "Não foi possível extrair ID da URL" };
    }

    // Importar a função de busca por ID
    const { getUploadById } = await import("./uploads");
    const result = await getUploadById(uploadId);
    console.log("getFileInfoFromUrl - Result:", result);
    return result;
  } catch (error) {
    console.error("Erro ao buscar informações do arquivo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar arquivo",
    };
  }
}

/**
 * Listar arquivos de uma pasta
 */
export async function listFilesInFolder(
  folder: string,
  limit: number = 100
): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const { listFilesInFolder: listFiles } = await import(
      "@/services/storage/vercel-blob-config"
    );
    return await listFiles(folder, limit);
  } catch (error) {
    console.error("Erro ao listar arquivos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao listar arquivos",
    };
  }
}
