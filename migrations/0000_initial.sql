CREATE TABLE IF NOT EXISTS "channels" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "url" text NOT NULL,
  "category" text NOT NULL DEFAULT 'uncategorized',
  "thumbnail" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);
