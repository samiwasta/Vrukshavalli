ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "apply_delivery_charge" boolean DEFAULT true NOT NULL;
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "delivery_fee" decimal(10,2);
