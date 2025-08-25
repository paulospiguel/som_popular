CREATE TABLE `event_judges` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`judge_id` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `judges` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_active` integer DEFAULT true NOT NULL,
	`notes` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
ALTER TABLE `event_evaluations` ADD `operator_id` text NOT NULL;