"use server";

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

import { createId } from "@paralleldrive/cuid2";

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  filename?: string;
  error?: string;
}

export interface UploadOptions {
  folder?: string; // Subpasta dentro de upload (ex: "participants", "events", "regulations")
  allowedTypes?: string[]; // Tipos MIME permitidos
  maxSize?: number; // Tamanho máximo em bytes
  renameFile?: boolean; // Se deve renomear o arquivo com ID único
}

const DEFAULT_OPTIONS: UploadOptions = {
  folder: "general",
  allowedTypes: [
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
  maxSize: 10 * 1024 * 1024, // 10MB
  renameFile: true,
};

/**
 * Server Action para upload de arquivos
 * Em desenvolvimento: armazena em public/upload
 * Em produção: preparado para storage externo
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const config = { ...DEFAULT_OPTIONS, ...options };

    // Validar tipo de arquivo
    if (!config.allowedTypes!.includes(file.type)) {
      return {
        success: false,
        error: `Tipo de arquivo não permitido: ${file.type}. Tipos aceitos: ${config.allowedTypes!.join(", ")}`,
      };
    }

    // Validar tamanho
    if (file.size > config.maxSize!) {
      const maxSizeMB = config.maxSize! / (1024 * 1024);
      return {
        success: false,
        error: `Arquivo muito grande. Máximo permitido: ${maxSizeMB}MB`,
      };
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.name.split(".").pop();
    const uniqueId = createId();
    const filename = config.renameFile
      ? `${uniqueId}.${fileExtension}`
      : file.name;

    // Determinar pasta de destino
    const uploadFolder = config.folder || "general";
    const isProduction = process.env.NODE_ENV === "production";

    let filePath: string;
    let publicUrl: string;

    if (isProduction) {
      // Em produção, usar storage externo (configurável via env)
      const storageProvider = process.env.STORAGE_PROVIDER || "local";

      if (storageProvider === "local") {
        // Fallback para local mesmo em produção
        filePath = join(
          process.cwd(),
          "public",
          "upload",
          uploadFolder,
          filename
        );
        publicUrl = `/upload/${uploadFolder}/${filename}`;
      } else {
        // Aqui você pode implementar outros providers (AWS S3, Google Cloud, etc.)
        return {
          success: false,
          error:
            "Storage externo não implementado ainda. Use STORAGE_PROVIDER=local",
        };
      }
    } else {
      // Em desenvolvimento, sempre usar local
      filePath = join(
        process.cwd(),
        "public",
        "upload",
        uploadFolder,
        filename
      );
      publicUrl = `/upload/${uploadFolder}/${filename}`;
    }

    // Criar diretório se não existir
    const dirPath = join(process.cwd(), "public", "upload", uploadFolder);
    await mkdir(dirPath, { recursive: true });

    // Converter File para Buffer e salvar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
      filename: filename,
    };
  } catch (error) {
    console.error("Erro no upload:", error);
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
    folder: "participants",
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    maxSize: 5 * 1024 * 1024, // 5MB para fotos
    renameFile: true,
  });
}

/**
 * Upload específico para regulamentos PDF
 */
export async function uploadrulesFile(file: File): Promise<UploadResult> {
  return uploadFile(file, {
    folder: "regulations",
    allowedTypes: ["application/pdf"],
    maxSize: 20 * 1024 * 1024, // 20MB para PDFs
    renameFile: true,
  });
}

/**
 * Upload específico para documentos gerais
 */
export async function uploadDocument(file: File): Promise<UploadResult> {
  return uploadFile(file, {
    folder: "documents",
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
 * Remover arquivo (para limpeza)
 */
export async function removeFile(
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { unlink } = await import("fs/promises");
    await unlink(filePath);
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover arquivo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao remover arquivo",
    };
  }
}
