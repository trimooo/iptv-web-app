CREATE TABLE "channels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"category" text DEFAULT 'uncategorized' NOT NULL,
	"thumbnail" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
