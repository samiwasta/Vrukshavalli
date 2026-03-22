CREATE TABLE IF NOT EXISTS "garden_service_enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"services" jsonb NOT NULL,
	"message" text,
	"ip" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
