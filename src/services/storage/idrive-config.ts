import { S3Client } from "@aws-sdk/client-s3";

// Configuração do IDrive e2
export const IDRIVE_CONFIG = {
  // Regiões disponíveis do IDrive e2
  REGIONS: {
    chicago: "l4g4.ch11.idrivee2-2.com",
    dallas: "dallas.idrivee2-2.com",
    los_angeles: "los-angeles.idrivee2-2.com",
    miami: "miami.idrivee2-2.com",
    new_york: "new-york.idrivee2-2.com",
    seattle: "seattle.idrivee2-2.com",
    singapore: "singapore.idrivee2-2.com",
    tokyo: "tokyo.idrivee2-2.com",
    toronto: "toronto.idrivee2-2.com",
    vancouver: "vancouver.idrivee2-2.com",
  },

  // Configurações padrão
  DEFAULT_REGION: "chicago",
  MAX_FILE_SIZE: 5 * 1024 * 1024 * 1024, // 5GB (limite do IDrive e2)
  ALLOWED_TYPES: [
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
    "video/mp4",
    "video/avi",
    "video/mov",
    "audio/mp3",
    "audio/wav",
    "audio/mpeg",
  ],
};

// Função para criar cliente S3 do IDrive e2
export function createIDriveClient() {
  const accessKeyId = process.env.IDRIVE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.IDRIVE_SECRET_ACCESS_KEY;
  const endpoint = process.env.IDRIVE_ENDPOINT_URL;
  const region = process.env.IDRIVE_REGION || IDRIVE_CONFIG.DEFAULT_REGION;

  console.log("accessKeyId", accessKeyId);
  console.log("secretAccessKey", secretAccessKey);
  console.log("endpoint", endpoint);
  console.log("region", region);

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    throw new Error(
      "Configurações do IDrive e2 não encontradas. Verifique as variáveis de ambiente: IDRIVE_ACCESS_KEY_ID, IDRIVE_SECRET_ACCESS_KEY, IDRIVE_ENDPOINT_URL"
    );
  }

  console.log("creating IDrive client");

  return new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true, // Necessário para IDrive e2
  });
}

// Função para obter URL pública do arquivo
export function getIDrivePublicUrl(bucketName: string, key: string): string {
  if (!bucketName) {
    throw new Error("Nome do bucket não fornecido");
  }

  const endpoint = process.env.IDRIVE_ENDPOINT_URL;
  if (!endpoint) {
    throw new Error("IDRIVE_ENDPOINT_URL não configurado");
  }

  // Remove o protocolo https:// se presente
  const cleanEndpoint = endpoint.replace(/^https?:\/\//, "");

  const url = `https://${bucketName}.${cleanEndpoint}/${key}`;

  // Validar se a URL é válida
  try {
    new URL(url);
    return url;
  } catch (error) {
    throw new Error(
      `URL inválida gerada: ${url}. Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`
    );
  }
}

// Função para validar configuração do IDrive e2
export function validateIDriveConfig(): { valid: boolean; error?: string } {
  const requiredVars = [
    "IDRIVE_ACCESS_KEY_ID",
    "IDRIVE_SECRET_ACCESS_KEY",
    "IDRIVE_BUCKET_NAME",
    "IDRIVE_ENDPOINT_URL",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    return {
      valid: false,
      error: `Variáveis de ambiente obrigatórias não encontradas: ${missingVars.join(", ")}`,
    };
  }

  return { valid: true };
}
