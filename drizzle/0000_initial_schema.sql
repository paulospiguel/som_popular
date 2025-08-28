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
	`operator_id` text NOT NULL,
	`score` integer NOT NULL,
	`notes` text,
	`criteria` text,
	`is_published` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `event_judges` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`judge_id` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `event_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`action` text NOT NULL,
	`category` text DEFAULT 'event' NOT NULL,
	`severity` text DEFAULT 'none' NOT NULL,
	`metadata` text,
	`user_id` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`message` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `event_registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`participant_id` text NOT NULL,
	`status` text DEFAULT 'registered' NOT NULL,
	`registration_date` integer,
	`notes` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`location` text NOT NULL,
	`max_participants` integer,
	`current_participants` integer DEFAULT 0 NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`registration_start_date` integer,
	`registration_end_date` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`is_public` integer DEFAULT true NOT NULL,
	`requires_approval` integer DEFAULT false NOT NULL,
	`rules` text,
	`prizes` text,
	`notes` text,
	`created_by` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
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
CREATE TABLE `participants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`avatar` text,
	`category` text NOT NULL,
	`experience` text NOT NULL,
	`additional_info` text,
	`has_special_needs` integer DEFAULT false NOT NULL,
	`special_needs_description` text,
	`status` text DEFAULT 'approved' NOT NULL,
	`rejection_reason` text,
	`archived` integer DEFAULT false NOT NULL,
	`accepts_email_notifications` integer DEFAULT false NOT NULL,
	`registration_date` integer,
	`approved_at` integer,
	`approved_by` text,
	`rejected_at` integer,
	`rejected_by` text,
	`notes` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `participants_email_unique` ON `participants` (`email`);--> statement-breakpoint
CREATE TABLE `system_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`category` text DEFAULT 'system' NOT NULL,
	`metadata` text,
	`ip_address` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`message` text,
	`severity` text DEFAULT 'none' NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'operator' NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
