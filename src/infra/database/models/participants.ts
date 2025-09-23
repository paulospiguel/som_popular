import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { uploads } from "./uploads";

/**
 * Participantes cadastrados para os eventos do festival.
 */
export const participants = pgTable("participants", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  stageName: varchar("stage_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  photoImageId: varchar("photo_image_id", { length: 128 }).references(
    () => uploads.id,
    {
      onDelete: "set null",
      onUpdate: "cascade",
    }
  ),
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

export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;
