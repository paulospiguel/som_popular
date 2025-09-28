ALTER TABLE "participants" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "archived";