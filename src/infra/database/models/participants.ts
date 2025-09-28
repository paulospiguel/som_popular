import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import {
  experienceLevelEnum,
  participantCategoryEnum,
  participantStatusEnum,
  registrationMethodEnum,
} from "../enums";

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
  category: participantCategoryEnum("category"),
  experience: experienceLevelEnum("experience"),
  additionalInfo: text("additional_info"),
  hasSpecialNeeds: boolean("has_special_needs").notNull().default(false),
  specialNeedsDescription: text("special_needs_description"),
  status: participantStatusEnum("status")
    .notNull()
    .default(participantStatusEnum.enumValues[0]),
  rejectionReason: text("rejection_reason"),
  isActive: boolean("is_active").notNull().default(true),
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
  registrationMethod: registrationMethodEnum("registration_method")
    .notNull()
    .default(registrationMethodEnum.enumValues[0]),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;
