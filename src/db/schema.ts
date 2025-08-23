import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Tabela de logs do sistema
 */
export const systemLogs = sqliteTable("system_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  action: text("action").notNull(),
  category: text("category").notNull().default("system"),
  metadata: text("metadata"),
  ipAddress: text("ip_address"),
  status: text("status").notNull().default("pending"),
  message: text("message"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

/**
 * Tabela de participantes do festival
 */
export const participants = sqliteTable("participants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  avatar: text("avatar"),
  category: text("category").notNull(),
  experience: text("experience").notNull(),
  additionalInfo: text("additional_info"),
  hasSpecialNeeds: integer("has_special_needs", { mode: "boolean" })
    .notNull()
    .default(false),
  specialNeedsDescription: text("special_needs_description"),
  status: text("status").notNull().default("approved"),
  rejectionReason: text("rejection_reason"),
  archived: integer("archived", { mode: "boolean" }).notNull().default(false),
  acceptsEmailNotifications: integer("accepts_email_notifications", {
    mode: "boolean",
  })
    .notNull()
    .default(false),
  registrationDate: integer("registration_date", {
    mode: "timestamp",
  }).$defaultFn(() => new Date()),
  approvedAt: integer("approved_at", { mode: "timestamp" }),
  approvedBy: text("approved_by"),
  rejectedAt: integer("rejected_at", { mode: "timestamp" }),
  rejectedBy: text("rejected_by"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

/**
 * Tabela de eventos do festival
 */
export const events = sqliteTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'classificatoria', 'semi-final', 'final'
  category: text("category").notNull(), // 'fado', 'guitarra', 'cavaquinho', etc.
  location: text("location").notNull(),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").notNull().default(0),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  registrationStartDate: integer("registration_start_date", { mode: "timestamp" }),
  registrationEndDate: integer("registration_end_date", { mode: "timestamp" }),
  status: text("status").notNull().default("draft"), // 'draft', 'published', 'ongoing', 'completed', 'cancelled'
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),
  requiresApproval: integer("requires_approval", { mode: "boolean" }).notNull().default(false),
  rules: text("rules"),
  prizes: text("prizes"), // JSON string com informações dos prémios
  notes: text("notes"),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

/**
 * Tabela de inscrições em eventos
 */
export const eventRegistrations = sqliteTable("event_registrations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: text("event_id").notNull(),
  participantId: text("participant_id").notNull(),
  status: text("status").notNull().default("registered"), // 'registered', 'confirmed', 'cancelled', 'no_show'
  registrationDate: integer("registration_date", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export type SystemLog = typeof systemLogs.$inferSelect;
export type NewSystemLog = typeof systemLogs.$inferInsert;
export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type NewEventRegistration = typeof eventRegistrations.$inferInsert;
