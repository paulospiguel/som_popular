/**
 * Utilitários para migração do sistema de upload
 * Este arquivo ajuda na transição do sistema antigo para o Vercel Blob
 */

import { isLocalUploadUrl, isVercelBlobUrl } from "./upload-utils";

/**
 * Detectar o tipo de storage baseado na URL
 */
export function detectStorageType(
  url: string
): "local" | "s3" | "idrive" | "vercel-blob" | "unknown" {
  if (!url || typeof url !== "string") {
    return "unknown";
  }

  if (isLocalUploadUrl(url)) {
    return "local";
  }

  if (isVercelBlobUrl(url)) {
    return "vercel-blob";
  }

  if (url.includes("amazonaws.com") || url.includes("s3.")) {
    return "s3";
  }

  if (url.includes("idrivee2-2.com") || url.includes("idrive")) {
    return "idrive";
  }

  return "unknown";
}

/**
 * Verificar se uma URL precisa ser migrada para Vercel Blob
 */
export function needsMigration(url: string): boolean {
  const storageType = detectStorageType(url);
  return (
    storageType === "local" || storageType === "s3" || storageType === "idrive"
  );
}

/**
 * Obter informações de migração de uma URL
 */
export function getMigrationInfo(url: string): {
  needsMigration: boolean;
  currentType: string;
  suggestedAction: string;
} {
  const storageType = detectStorageType(url);
  const needsMigrate = needsMigration(url);

  let suggestedAction = "";
  switch (storageType) {
    case "local":
      suggestedAction =
        "Migrar para Vercel Blob para melhor performance e escalabilidade";
      break;
    case "s3":
      suggestedAction =
        "Considerar migração para Vercel Blob para simplificar a configuração";
      break;
    case "idrive":
      suggestedAction =
        "Considerar migração para Vercel Blob para melhor integração com Vercel";
      break;
    case "vercel-blob":
      suggestedAction = "Já está usando Vercel Blob - nenhuma ação necessária";
      break;
    default:
      suggestedAction = "Tipo de storage desconhecido - verificar configuração";
  }

  return {
    needsMigration: needsMigrate,
    currentType: storageType,
    suggestedAction,
  };
}

/**
 * Validar se o sistema está configurado para Vercel Blob
 */
export function validateVercelBlobConfig(): {
  isConfigured: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Verificar variável de ambiente
  if (process.env.STORAGE_PROVIDER !== "vercel-blob") {
    issues.push("STORAGE_PROVIDER não está configurado para 'vercel-blob'");
    recommendations.push("Configure STORAGE_PROVIDER=vercel-blob no .env");
  }

  // Verificar token do Vercel Blob
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    issues.push("BLOB_READ_WRITE_TOKEN não está configurado");
    recommendations.push(
      "Configure BLOB_READ_WRITE_TOKEN no .env (ou use o token automático do Vercel)"
    );
  }

  // Verificar se está em produção no Vercel
  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
    recommendations.push(
      "No Vercel, o BLOB_READ_WRITE_TOKEN é configurado automaticamente"
    );
  }

  return {
    isConfigured: issues.length === 0,
    issues,
    recommendations,
  };
}

/**
 * Gerar relatório de migração
 */
export function generateMigrationReport(urls: string[]): {
  totalUrls: number;
  needsMigration: number;
  alreadyVercelBlob: number;
  unknown: number;
  breakdown: Record<string, number>;
  recommendations: string[];
} {
  const breakdown: Record<string, number> = {};
  let needsMigration = 0;
  let alreadyVercelBlob = 0;
  let unknown = 0;

  urls.forEach((url) => {
    const storageType = detectStorageType(url);
    breakdown[storageType] = (breakdown[storageType] || 0) + 1;

    if (needsMigration(url)) {
      needsMigration++;
    } else if (storageType === "vercel-blob") {
      alreadyVercelBlob++;
    } else if (storageType === "unknown") {
      unknown++;
    }
  });

  const recommendations: string[] = [];

  if (needsMigration > 0) {
    recommendations.push(
      `${needsMigration} URLs precisam ser migradas para Vercel Blob`
    );
  }

  if (breakdown.local > 0) {
    recommendations.push(
      `${breakdown.local} URLs locais devem ser migradas para melhor performance`
    );
  }

  if (breakdown.s3 > 0) {
    recommendations.push(
      `${breakdown.s3} URLs do S3 podem ser migradas para simplificar a configuração`
    );
  }

  if (breakdown.idrive > 0) {
    recommendations.push(
      `${breakdown.idrive} URLs do IDrive podem ser migradas para melhor integração`
    );
  }

  return {
    totalUrls: urls.length,
    needsMigration,
    alreadyVercelBlob,
    unknown,
    breakdown,
    recommendations,
  };
}
