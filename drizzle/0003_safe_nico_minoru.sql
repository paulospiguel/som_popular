CREATE TABLE `evaluation_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`judge_id` text NOT NULL,
	`current_participant_id` text,
	`is_active` integer DEFAULT true NOT NULL,
	`started_at` integer,
	`ended_at` integer
);
--> statement-breakpoint
CREATE TABLE `event_evaluations` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`participant_id` text NOT NULL,
	`judge_id` text NOT NULL,
	`score` integer NOT NULL,
	`notes` text,
	`criteria` text,
	`is_published` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'operador' NOT NULL;