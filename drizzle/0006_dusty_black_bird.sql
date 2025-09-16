CREATE TABLE "uploads" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"uuid" varchar(128) NOT NULL,
	"extension" varchar(100) NOT NULL,
	"folder" varchar(100) NOT NULL,
	"url" text NOT NULL,
	"tags" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
