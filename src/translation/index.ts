// Funções de tradução para enums do banco de dados

// Traduções para categorias de participantes
export const PARTICIPANT_CATEGORY_TRANSLATIONS = {
  vocal: "Vocal",
  band: "Banda",
  duo: "Dupla",
  individual: "Individual",
} as const;

// Traduções para níveis de experiência
export const EXPERIENCE_LEVEL_TRANSLATIONS = {
  "no-experience": "Não tem experiência",
  amateur: "Amador",
  professional: "Profissional",
} as const;

// Traduções para status de participantes
export const PARTICIPANT_STATUS_TRANSLATIONS = {
  approved: "Aprovado",
  pending: "Pendente",
  rejected: "Rejeitado",
} as const;

// Traduções para tipos de eventos
export const EVENT_TYPE_TRANSLATIONS = {
  festival: "Festival",
  qualifying: "Classificatória",
  "semi-final": "Semi-Final",
  final: "Final",
} as const;

// Traduções para categorias de eventos
export const EVENT_CATEGORY_TRANSLATIONS = {
  rock: "Rock",
  pop: "Pop",
  country: "Sertanejo",
  "popular-music": "Música Popular",
  free: "Livre",
} as const;

// Traduções para status de eventos
export const EVENT_STATUS_TRANSLATIONS = {
  draft: "Rascunho",
  published: "Publicado",
  ongoing: "Em Curso",
  completed: "Concluído",
  cancelled: "Cancelado",
  deactivated: "Inativado",
} as const;

// Traduções para modos de aprovação
export const APPROVAL_MODE_TRANSLATIONS = {
  automatic: "Automática",
  manual: "Supervisionada",
} as const;

// Traduções para status de inscrições
export const REGISTRATION_STATUS_TRANSLATIONS = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
} as const;

// Traduções para status de sessões de avaliação
export const EVALUATION_SESSION_STATUS_TRANSLATIONS = {
  active: "Ativa",
  inactive: "Inativa",
  completed: "Concluída",
} as const;

// Traduções para severidade de logs
export const LOG_SEVERITY_TRANSLATIONS = {
  critical: "Crítico",
  major: "Maior",
  minor: "Menor",
  none: "Sem Classificação",
} as const;

// Traduções para categorias de logs do sistema
export const SYSTEM_LOG_CATEGORY_TRANSLATIONS = {
  system: "Sistema",
  auth: "Autenticação",
  event: "Evento",
  participant: "Participante",
  judge: "Jurado",
  upload: "Upload",
  error: "Erro",
} as const;

// Traduções para status de logs do sistema
export const SYSTEM_LOG_STATUS_TRANSLATIONS = {
  pending: "Pendente",
  success: "Sucesso",
  error: "Erro",
  warning: "Aviso",
} as const;

// Traduções para categorias de configurações do sistema
export const SYSTEM_SETTING_CATEGORY_TRANSLATIONS = {
  general: "Geral",
  email: "E-mail",
  upload: "Upload",
  event: "Evento",
  security: "Segurança",
} as const;

// Traduções para provedores de armazenamento
export const STORAGE_PROVIDER_TRANSLATIONS = {
  "vercel-blob": "Vercel Blob",
  local: "Local",
  "aws-s3": "AWS S3",
  cloudinary: "Cloudinary",
} as const;

// Traduções para tipos de entidades relacionadas
export const RELATED_ENTITY_TYPE_TRANSLATIONS = {
  participant: "Participante",
  event: "Evento",
  judge: "Jurado",
  regulation: "Regulamento",
  general: "Geral",
} as const;

// Funções de conversão genéricas
export function translateParticipantCategory(
  value: keyof typeof PARTICIPANT_CATEGORY_TRANSLATIONS
): string {
  return PARTICIPANT_CATEGORY_TRANSLATIONS[value] || value;
}

export function translateExperienceLevel(
  value: keyof typeof EXPERIENCE_LEVEL_TRANSLATIONS
): string {
  return EXPERIENCE_LEVEL_TRANSLATIONS[value] || value;
}

export function translateParticipantStatus(
  value: keyof typeof PARTICIPANT_STATUS_TRANSLATIONS
): string {
  return PARTICIPANT_STATUS_TRANSLATIONS[value] || value;
}

export function translateEventType(
  value: keyof typeof EVENT_TYPE_TRANSLATIONS
): string {
  return EVENT_TYPE_TRANSLATIONS[value] || value;
}

export function translateEventCategory(
  value: keyof typeof EVENT_CATEGORY_TRANSLATIONS
): string {
  return EVENT_CATEGORY_TRANSLATIONS[value] || value;
}

export function translateEventStatus(
  value: keyof typeof EVENT_STATUS_TRANSLATIONS
): string {
  return EVENT_STATUS_TRANSLATIONS[value] || value;
}

export function translateApprovalMode(
  value: keyof typeof APPROVAL_MODE_TRANSLATIONS
): string {
  return APPROVAL_MODE_TRANSLATIONS[value] || value;
}

export function translateRegistrationStatus(
  value: keyof typeof REGISTRATION_STATUS_TRANSLATIONS
): string {
  return REGISTRATION_STATUS_TRANSLATIONS[value] || value;
}

export function translateEvaluationSessionStatus(
  value: keyof typeof EVALUATION_SESSION_STATUS_TRANSLATIONS
): string {
  return EVALUATION_SESSION_STATUS_TRANSLATIONS[value] || value;
}

export function translateLogSeverity(
  value: keyof typeof LOG_SEVERITY_TRANSLATIONS
): string {
  return LOG_SEVERITY_TRANSLATIONS[value] || value;
}

export function translateSystemLogCategory(
  value: keyof typeof SYSTEM_LOG_CATEGORY_TRANSLATIONS
): string {
  return SYSTEM_LOG_CATEGORY_TRANSLATIONS[value] || value;
}

export function translateSystemLogStatus(
  value: keyof typeof SYSTEM_LOG_STATUS_TRANSLATIONS
): string {
  return SYSTEM_LOG_STATUS_TRANSLATIONS[value] || value;
}

export function translateSystemSettingCategory(
  value: keyof typeof SYSTEM_SETTING_CATEGORY_TRANSLATIONS
): string {
  return SYSTEM_SETTING_CATEGORY_TRANSLATIONS[value] || value;
}

export function translateStorageProvider(
  value: keyof typeof STORAGE_PROVIDER_TRANSLATIONS
): string {
  return STORAGE_PROVIDER_TRANSLATIONS[value] || value;
}

export function translateRelatedEntityType(
  value: keyof typeof RELATED_ENTITY_TYPE_TRANSLATIONS
): string {
  return RELATED_ENTITY_TYPE_TRANSLATIONS[value] || value;
}

// Função genérica para traduzir qualquer enum
export function translateEnum(
  value: string,
  translations: Record<string, string>
): string {
  return translations[value] || value;
}

// Função para obter todas as opções de um enum com suas traduções
export function getEnumOptions<T extends Record<string, string>>(
  translations: T
): Array<{ value: keyof T; label: string }> {
  return Object.entries(translations).map(([value, label]) => ({
    value: value as keyof T,
    label,
  }));
}
