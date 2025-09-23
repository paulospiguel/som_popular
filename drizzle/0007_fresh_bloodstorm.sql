ALTER TABLE "uploads" ALTER COLUMN "folder" SET DEFAULT 'general';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "rules_text" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "rules_file_id" varchar(128);--> statement-breakpoint
ALTER TABLE "judges" ADD COLUMN "photo_image_id" varchar(128);--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "photo_image_id" varchar(128);--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "original_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "filename" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "file_path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "public_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "mime_type" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "file_size" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "storage_provider" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "uploaded_by" varchar(128);--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "related_entity_type" varchar(50);--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "related_entity_id" varchar(128);--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "is_public" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "is_archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "metadata" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "image_id" varchar(128);--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_rules_file_id_uploads_id_fk" FOREIGN KEY ("rules_file_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "judges" ADD CONSTRAINT "judges_photo_image_id_uploads_id_fk" FOREIGN KEY ("photo_image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_photo_image_id_uploads_id_fk" FOREIGN KEY ("photo_image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_image_id_uploads_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "rules";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "rules_file";--> statement-breakpoint
ALTER TABLE "judges" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "avatar";--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "ranking_photo";--> statement-breakpoint
ALTER TABLE "uploads" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "uploads" DROP COLUMN "uuid";--> statement-breakpoint
ALTER TABLE "uploads" DROP COLUMN "extension";--> statement-breakpoint
ALTER TABLE "uploads" DROP COLUMN "url";--> statement-breakpoint
ALTER TABLE "uploads" DROP COLUMN "tags";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "image";