// Utilitários para trabalhar com enums e suas traduções

import {
  APPROVAL_MODE_TRANSLATIONS,
  EVALUATION_SESSION_STATUS_TRANSLATIONS,
  EVENT_CATEGORY_TRANSLATIONS,
  EVENT_STATUS_TRANSLATIONS,
  EVENT_TYPE_TRANSLATIONS,
  EXPERIENCE_LEVEL_TRANSLATIONS,
  getEnumOptions,
  LOG_SEVERITY_TRANSLATIONS,
  PARTICIPANT_CATEGORY_TRANSLATIONS,
  PARTICIPANT_STATUS_TRANSLATIONS,
  REGISTRATION_STATUS_TRANSLATIONS,
  RELATED_ENTITY_TYPE_TRANSLATIONS,
  STORAGE_PROVIDER_TRANSLATIONS,
  SYSTEM_LOG_CATEGORY_TRANSLATIONS,
  SYSTEM_LOG_STATUS_TRANSLATIONS,
  SYSTEM_SETTING_CATEGORY_TRANSLATIONS,
  translateApprovalMode,
  translateEvaluationSessionStatus,
  translateEventCategory,
  translateEventStatus,
  translateEventType,
  translateExperienceLevel,
  translateLogSeverity,
  translateParticipantCategory,
  translateParticipantStatus,
  translateRegistrationStatus,
  translateRelatedEntityType,
  translateStorageProvider,
  translateSystemLogCategory,
  translateSystemLogStatus,
  translateSystemSettingCategory,
} from "../../translation";

// Função genérica para obter opções de enum com traduções
export const ENUM_OPTIONS = {
  participantCategories: getEnumOptions(PARTICIPANT_CATEGORY_TRANSLATIONS),
  experienceLevels: getEnumOptions(EXPERIENCE_LEVEL_TRANSLATIONS),
  participantStatuses: getEnumOptions(PARTICIPANT_STATUS_TRANSLATIONS),
  eventTypes: getEnumOptions(EVENT_TYPE_TRANSLATIONS),
  eventCategories: getEnumOptions(EVENT_CATEGORY_TRANSLATIONS),
  eventStatuses: getEnumOptions(EVENT_STATUS_TRANSLATIONS),
  approvalModes: getEnumOptions(APPROVAL_MODE_TRANSLATIONS),
  registrationStatuses: getEnumOptions(REGISTRATION_STATUS_TRANSLATIONS),
  evaluationSessionStatuses: getEnumOptions(
    EVALUATION_SESSION_STATUS_TRANSLATIONS
  ),
  logSeverities: getEnumOptions(LOG_SEVERITY_TRANSLATIONS),
  systemLogCategories: getEnumOptions(SYSTEM_LOG_CATEGORY_TRANSLATIONS),
  systemLogStatuses: getEnumOptions(SYSTEM_LOG_STATUS_TRANSLATIONS),
  systemSettingCategories: getEnumOptions(SYSTEM_SETTING_CATEGORY_TRANSLATIONS),
  storageProviders: getEnumOptions(STORAGE_PROVIDER_TRANSLATIONS),
  relatedEntityTypes: getEnumOptions(RELATED_ENTITY_TYPE_TRANSLATIONS),
} as const;

// Funções de tradução centralizadas
export const translate = {
  participantCategory: translateParticipantCategory,
  experienceLevel: translateExperienceLevel,
  participantStatus: translateParticipantStatus,
  eventType: translateEventType,
  eventCategory: translateEventCategory,
  eventStatus: translateEventStatus,
  approvalMode: translateApprovalMode,
  registrationStatus: translateRegistrationStatus,
  evaluationSessionStatus: translateEvaluationSessionStatus,
  logSeverity: translateLogSeverity,
  systemLogCategory: translateSystemLogCategory,
  systemLogStatus: translateSystemLogStatus,
  systemSettingCategory: translateSystemSettingCategory,
  storageProvider: translateStorageProvider,
  relatedEntityType: translateRelatedEntityType,
} as const;

// Exemplo de uso:
// const categoryLabel = translate.participantCategory("band"); // "Banda"
// const statusLabel = translate.participantStatus("approved"); // "Aprovado"
// const options = ENUM_OPTIONS.participantCategories; // [{ value: "vocal", label: "Vocal" }, ...]
