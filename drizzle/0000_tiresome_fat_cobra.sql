CREATE TABLE "evaluation_sessions" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"event_id" varchar(128) NOT NULL,
	"judge_id" varchar(128) NOT NULL,
	"session_name" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "event_evaluations" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"event_id" varchar(128) NOT NULL,
	"participant_id" varchar(128) NOT NULL,
	"judge_id" varchar(128) NOT NULL,
	"session_id" varchar(128),
	"technical_score" integer NOT NULL,
	"artistic_score" integer NOT NULL,
	"presentation_score" integer NOT NULL,
	"total_score" integer NOT NULL,
	"feedback" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"evaluated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "event_judges" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"event_id" varchar(128) NOT NULL,
	"judge_id" varchar(128) NOT NULL,
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "event_logs" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"event_id" varchar(128) NOT NULL,
	"participant_id" varchar(128),
	"action" varchar(255) NOT NULL,
	"description" text,
	"metadata" text,
	"performed_by" varchar(128),
	"ip_address" varchar(45),
	"user_agent" text,
	"severity" varchar(50) DEFAULT 'info' NOT NULL,
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"event_id" varchar(128) NOT NULL,
	"participant_id" varchar(128) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"registered_at" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"rejected_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(100) NOT NULL,
	"category" varchar(100) NOT NULL,
	"location" varchar(255) NOT NULL,
	"max_participants" integer,
	"current_participants" integer DEFAULT 0 NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"registration_start_date" timestamp with time zone,
	"registration_end_date" timestamp with time zone,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"requires_approval" boolean DEFAULT false NOT NULL,
	"approval_mode" varchar(50) DEFAULT 'automatic' NOT NULL,
	"rules" text,
	"rules_file" text,
	"prizes" text,
	"notes" text,
	"created_by" varchar(128) NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "judges" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"avatar" text,
	"ranking_photo" text,
	"category" varchar(100) NOT NULL,
	"experience" varchar(100) NOT NULL,
	"additional_info" text,
	"has_special_needs" boolean DEFAULT false NOT NULL,
	"special_needs_description" text,
	"status" varchar(50) DEFAULT 'approved' NOT NULL,
	"rejection_reason" text,
	"archived" boolean DEFAULT false NOT NULL,
	"accepts_email_notifications" boolean DEFAULT false NOT NULL,
	"registration_date" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"approved_by" varchar(128),
	"rejected_at" timestamp with time zone,
	"rejected_by" varchar(128),
	"notes" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "participants_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"action" varchar(255) NOT NULL,
	"category" varchar(100) DEFAULT 'system' NOT NULL,
	"metadata" text,
	"ip_address" varchar(45),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"message" text,
	"severity" varchar(50) DEFAULT 'none' NOT NULL,
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"account_id" varchar(255) NOT NULL,
	"provider_id" varchar(100) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" varchar(255),
	"password" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"user_id" varchar(128) NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'operator' NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"identifier" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;