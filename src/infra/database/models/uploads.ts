import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { relatedEntityTypeEnum, storageProviderEnum } from "../enums";

/**
 * Uploads de arquivos vinculados a entidades do sistema.
 */
export const uploads = pgTable("uploads", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  filePath: text("file_path").notNull(),
  publicUrl: text("public_url").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  storageProvider: storageProviderEnum("storage_provider").notNull(),
  folder: varchar("folder", { length: 100 }).notNull().default("general"),
  uploadedBy: varchar("uploaded_by", { length: 128 }),
  relatedEntityType: relatedEntityTypeEnum("related_entity_type"),
  relatedEntityId: varchar("related_entity_id", { length: 128 }),
  isPublic: boolean("is_public").notNull().default(true),
  isArchived: boolean("is_archived").notNull().default(false),
  metadata: text("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

export type Upload = typeof uploads.$inferSelect;
export type NewUpload = typeof uploads.$inferInsert;
