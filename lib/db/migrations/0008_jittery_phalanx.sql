ALTER TABLE "orders" ADD COLUMN "cashfree_order_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_session_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_time" timestamp;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "gateway_response" jsonb;