ALTER TABLE "products" ADD COLUMN "stock_capacity" integer;
UPDATE "products" SET "stock_capacity" = GREATEST("stock", 1) WHERE "stock_capacity" IS NULL;