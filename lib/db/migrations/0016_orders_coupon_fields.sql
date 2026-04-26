ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "coupon_code" text;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discount_amount" decimal(10,2);
