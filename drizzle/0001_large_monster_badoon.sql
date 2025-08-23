ALTER TABLE `participants` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `participants` ADD `has_special_needs` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `participants` ADD `special_needs_description` text;