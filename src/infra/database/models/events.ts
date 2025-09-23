import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "../auth-schema";

import { participants } from "./participants";
import { uploads } from "./uploads";

/**
 * Eventos, inscrições e avaliações.
 */
export const events = pgTable("events", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  subtitle: varchar("subtitle", { length: 255 }),
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
  rulesText: text("rules_text"),
  rulesFileId: varchar("rules_file_id", { length: 128 }).references(
    () => uploads.id,
    {
      onDelete: "set null",
      onUpdate: "cascade",
    }
  ),
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

export const eventRegistrations = pgTable("event_registrations", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: varchar("event_id", { length: 128 })
    .notNull()
    .references(() => events.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  participantId: varchar("participant_id", { length: 128 })
    .notNull()
    .references(() => participants.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  registeredAt: timestamp("registered_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  rejectedAt: timestamp("rejected_at", { withTimezone: true }),
});

export const eventLogs = pgTable("event_logs", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: varchar("event_id", { length: 128 })
    .notNull()
    .references(() => events.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  participantId: varchar("participant_id", { length: 128 }).references(
    () => participants.id,
    {
      onDelete: "cascade",
      onUpdate: "cascade",
    }
  ),
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

export const evaluationSessions = pgTable("evaluation_sessions", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: varchar("event_id", { length: 128 })
    .notNull()
    .references(() => events.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  judgeId: varchar("judge_id", { length: 128 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  sessionName: varchar("session_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  startedAt: timestamp("started_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  notes: text("notes"),
});

export const eventEvaluations = pgTable("event_evaluations", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: varchar("event_id", { length: 128 })
    .notNull()
    .references(() => events.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  participantId: varchar("participant_id", { length: 128 })
    .notNull()
    .references(() => participants.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  judgeId: varchar("judge_id", { length: 128 }).notNull(),
  sessionId: varchar("session_id", { length: 128 }).references(
    () => evaluationSessions.id,
    {
      onDelete: "cascade",
      onUpdate: "cascade",
    }
  ),
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
