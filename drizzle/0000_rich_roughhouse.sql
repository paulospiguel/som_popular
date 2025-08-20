CREATE TABLE `system_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`category` text DEFAULT 'system' NOT NULL,
	`metadata` text,
	`ip_address` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`message` text,
	`created_at` integer
);
