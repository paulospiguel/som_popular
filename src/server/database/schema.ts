import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Tabela de logs do sistema
 */
export const systemLogs = pgTable("system_logs", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  action: varchar("action", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull().default("system"),
  metadata: text("metadata"),
  ipAddress: varchar("ip_address", { length: 45 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  message: text("message"),
  severity: varchar("severity", { length: 50 }).notNull().default("none"),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

/**
 * Tabela de participantes do festival
 */
export const participants = pgTable("participants", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  stageName: varchar("stage_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  avatar: text("avatar"),
  rankingPhoto: text("ranking_photo"), // Foto opcional para exibição no ranking
  age: integer("age"),
  category: varchar("category", { length: 100 }).notNull(),
  experience: varchar("experience", { length: 100 }).notNull(),
  additionalInfo: text("additional_info"),
  hasSpecialNeeds: boolean("has_special_needs").notNull().default(false),
  specialNeedsDescription: text("special_needs_description"),
  status: varchar("status", { length: 50 }).notNull().default("approved"),
  rejectionReason: text("rejection_reason"),
  archived: boolean("archived").notNull().default(false),
  acceptsEmailNotifications: boolean("accepts_email_notifications")
    .notNull()
    .default(false),
  registrationDate: timestamp("registration_date", {
    withTimezone: true,
  }).$defaultFn(() => new Date()),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approvedBy: varchar("approved_by", { length: 128 }),
  rejectedAt: timestamp("rejected_at", { withTimezone: true }),
  rejectedBy: varchar("rejected_by", { length: 128 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

/**
 * Tabela de jurados do festival
 */
export const judges = pgTable("judges", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

/**
 * Tabela de associação de jurados com eventos
 */
export const eventJudges = pgTable("event_judges", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: varchar("event_id", { length: 128 }).notNull(),
  judgeId: varchar("judge_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

/**
 * Tabela de eventos do festival
 */
export const events = pgTable("events", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").notNull().default(0),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  registrationStartDate: timestamp("registration_start_date", {
    withTimezone: true,
  }),
  registrationEndDate: timestamp("registration_end_date", {
    withTimezone: true,
  }),
  status: varchar("status", { length: 50 }).notNull().default("draft"),
  isPublic: boolean("is_public").notNull().default(true),
  requiresApproval: boolean("requires_approval").notNull().default(false),
  approvalMode: varchar("approval_mode", { length: 50 })
    .notNull()
    .default("automatic"),
  rules: text("rules"),
  rulesFile: text("rules_file"),
  prizes: text("prizes"),
  notes: text("notes"),
  createdBy: varchar("created_by", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

/**
 * Tabela de inscrições em eventos
 */
export const eventRegistrations = pgTable("event_registrations", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: varchar("event_id", { length: 128 }).notNull(),
  participantId: varchar("participant_id", { length: 128 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  registeredAt: timestamp("registered_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  rejectedAt: timestamp("rejected_at", { withTimezone: true }),
});

/**
 * Tabela de logs específicos de eventos
 */
export const eventLogs = pgTable("event_logs", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: varchar("event_id", { length: 128 }).notNull(),
  participantId: varchar("participant_id", { length: 128 }),
  action: varchar("action", { length: 255 }).notNull(),
  description: text("description"),
  metadata: text("metadata"),
  performedBy: varchar("performed_by", { length: 128 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  severity: varchar("severity", { length: 50 }).notNull().default("info"),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

/**
 * Tabela de sessões de avaliação
 */
export const evaluationSessions = pgTable("evaluation_sessions", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: varchar("event_id", { length: 128 }).notNull(),
  judgeId: varchar("judge_id", { length: 128 }).notNull(),
  sessionName: varchar("session_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  startedAt: timestamp("started_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  notes: text("notes"),
});

/**
 * Tabela de avaliações de eventos pelos jurados
 */
export const eventEvaluations = pgTable("event_evaluations", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: varchar("event_id", { length: 128 }).notNull(),
  participantId: varchar("participant_id", { length: 128 }).notNull(),
  judgeId: varchar("judge_id", { length: 128 }).notNull(),
  sessionId: varchar("session_id", { length: 128 }),
  technicalScore: integer("technical_score").notNull(),
  artisticScore: integer("artistic_score").notNull(),
  presentationScore: integer("presentation_score").notNull(),
  totalScore: integer("total_score").notNull(),
  feedback: text("feedback"),
  isPublic: boolean("is_public").notNull().default(false),
  evaluatedAt: timestamp("evaluated_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

/**
 * Tabela de configurações do sistema
 */
export const systemSettings = pgTable("system_settings", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull().default("general"),
  isPublic: boolean("is_public").notNull().default(false),
  updatedBy: varchar("updated_by", { length: 128 }),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

// Tipos derivados dos schemas
export type SystemLog = typeof systemLogs.$inferSelect;
export type NewSystemLog = typeof systemLogs.$inferInsert;

export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;

export type Judge = typeof judges.$inferSelect;
export type NewJudge = typeof judges.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type NewEventRegistration = typeof eventRegistrations.$inferInsert;

export type EventLog = typeof eventLogs.$inferSelect;
export type NewEventLog = typeof eventLogs.$inferInsert;

export type EvaluationSession = typeof evaluationSessions.$inferSelect;
export type NewEvaluationSession = typeof evaluationSessions.$inferInsert;

export type EventEvaluation = typeof eventEvaluations.$inferSelect;
export type NewEventEvaluation = typeof eventEvaluations.$inferInsert;

export type SystemSetting = typeof systemSettings.$inferSelect;
export type NewSystemSetting = typeof systemSettings.$inferInsert;
