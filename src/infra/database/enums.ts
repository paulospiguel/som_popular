import { pgEnum } from "drizzle-orm/pg-core";

// Enums para participantes
export const participantCategoryEnum = pgEnum("participant_category", [
  "vocal",
  "band",
  "duo",
  "individual",
]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "no-experience",
  "amateur",
  "professional",
]);

export const participantStatusEnum = pgEnum("participant_status", [
  "approved",
  "pending",
  "rejected",
]);

// Enums para eventos
export const eventTypeEnum = pgEnum("event_type", [
  "festival",
  "qualifying",
  "semi-final",
  "final",
]);

export const eventCategoryEnum = pgEnum("event_category", [
  "rock",
  "pop",
  "country",
  "popular-music",
  "free",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "ongoing",
  "completed",
  "cancelled",
  "deactivated",
]);

export const approvalModeEnum = pgEnum("approval_mode", [
  "automatic",
  "manual",
]);

export const registrationStatusEnum = pgEnum("registration_status", [
  "pending",
  "approved",
  "rejected",
  "registered",
]);

export const evaluationSessionStatusEnum = pgEnum("evaluation_session_status", [
  "active",
  "inactive",
  "completed",
]);

// Enums para sistema
export const logSeverityEnum = pgEnum("log_severity", [
  "critical",
  "major",
  "minor",
  "none",
]);

export const systemLogCategoryEnum = pgEnum("system_log_category", [
  "system",
  "auth",
  "event",
  "participant",
  "judge",
  "upload",
  "error",
]);

export const systemLogStatusEnum = pgEnum("system_log_status", [
  "pending",
  "success",
  "error",
  "warning",
]);

export const systemSettingCategoryEnum = pgEnum("system_setting_category", [
  "general",
  "email",
  "upload",
  "event",
  "security",
]);

// Enums para uploads
export const storageProviderEnum = pgEnum("storage_provider", [
  "vercel-blob",
  "local",
  "aws-s3",
  "cloudinary",
]);

export const relatedEntityTypeEnum = pgEnum("related_entity_type", [
  "participant",
  "event",
  "judge",
  "regulation",
  "general",
]);

export const registrationMethodEnum = pgEnum("registration_method", [
  "online",
  "platform",
  "automatic",
]);
