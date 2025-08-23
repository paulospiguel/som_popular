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
