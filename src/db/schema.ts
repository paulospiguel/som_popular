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

export type SystemLog = typeof systemLogs.$inferSelect;
export type NewSystemLog = typeof systemLogs.$inferInsert;
