ALTER TABLE `participants` ADD `additional_info` text;--> statement-breakpoint
ALTER TABLE `participants` ADD `archived` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `participants` DROP COLUMN `age`;--> statement-breakpoint
ALTER TABLE `participants` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `participants` DROP COLUMN `district`;--> statement-breakpoint
ALTER TABLE `participants` DROP COLUMN `biography`;