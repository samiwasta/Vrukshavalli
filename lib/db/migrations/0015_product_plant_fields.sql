ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "plant_type" text;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "pot_sizes" text[];
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "light" text;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "water" text;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "size_detail" text;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "pet_friendly" boolean DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "care_level" text DEFAULT 'Easy';
--> statement-breakpoint
INSERT INTO "categories" ("name", "slug", "description", "created_at", "updated_at")
SELECT 'Indoor Plants', 'indoor-plants', 'Plants suitable for indoors', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "categories" WHERE "slug" = 'indoor-plants');
--> statement-breakpoint
INSERT INTO "categories" ("name", "slug", "description", "created_at", "updated_at")
SELECT 'Outdoor Plants', 'outdoor-plants', 'Plants for gardens and outdoor spaces', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "categories" WHERE "slug" = 'outdoor-plants');
