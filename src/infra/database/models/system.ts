import { createId } from "@paralleldrive/cuid2";
import { boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Tabelas relacionadas à configuração e monitoramento do sistema.
 */
export const systemLogs = pgTable("system_logs", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(() => createId()),
  action: varchar("action", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull().default("system"),
  metadata: text("metadata"),
  ipAddress: varchar("ip_address", { length: 45 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  message: text("message"),
  severity: varchar("severity", { length: 50 }).notNull().default("none"),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(() => new Date()),
});

export const systemSettings = pgTable("system_settings", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(() => createId()),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull().default("general"),
  isPublic: boolean("is_public").notNull().default(false),
  updatedBy: varchar("updated_by", { length: 128 }),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$defaultFn(() => new Date()),
});

export type SystemLog = typeof systemLogs.$inferSelect;
export type NewSystemLog = typeof systemLogs.$inferInsert;

export type SystemSetting = typeof systemSettings.$inferSelect;
export type NewSystemSetting = typeof systemSettings.$inferInsert;
