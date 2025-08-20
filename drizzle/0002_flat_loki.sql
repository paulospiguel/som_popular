CREATE TABLE `participants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`age` integer,
	`city` text,
	`district` text,
	`category` text NOT NULL,
	`experience` text NOT NULL,
	`biography` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`registration_date` integer,
	`approved_at` integer,
	`approved_by` text,
	`notes` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `participants_email_unique` ON `participants` (`email`);