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
  age: integer("age"),
  city: text("city"),
  district: text("district"),
  category: text("category").notNull(), // "fado", "guitarra", "concertina", etc.
  experience: text("experience").notNull(), // "iniciante", "intermedio", "avancado"
  biography: text("biography"),
  status: text("status").notNull().default("pending"), // "pending", "approved", "rejected"
  acceptsEmailNotifications: integer("accepts_email_notifications", {
    mode: "boolean",
  })
    .notNull()
    .default(false), // Novo campo
  registrationDate: integer("registration_date", {
    mode: "timestamp",
  }).$defaultFn(() => new Date()),
  approvedAt: integer("approved_at", { mode: "timestamp" }),
  approvedBy: text("approved_by"), // ID do admin que aprovou
  notes: text("notes"), // Notas administrativas
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export type SystemLog = typeof systemLogs.$inferSelect;
export type NewSystemLog = typeof systemLogs.$inferInsert;
export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;
