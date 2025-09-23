import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { events } from "./events";
import { uploads } from "./uploads";

/**
 * Jurados e associações com eventos.
 */
export const judges = pgTable("judges", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"),
  photoImageId: varchar("photo_image_id", { length: 128 }).references(
    () => uploads.id,
    {
      onDelete: "set null",
      onUpdate: "cascade",
    }
  ),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

export const eventJudges = pgTable("event_judges", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: varchar("event_id", { length: 128 }).references(() => events.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  judgeId: varchar("judge_id", { length: 128 }).references(() => judges.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

export type Judge = typeof judges.$inferSelect;
export type NewJudge = typeof judges.$inferInsert;
