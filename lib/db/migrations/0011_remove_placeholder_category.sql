UPDATE "products"
SET "category_id" = NULL
WHERE "category_id" IN (
  SELECT "id" FROM "categories"
  WHERE "name" = 'Updated Category Name'
     OR LOWER(TRIM("name")) = 'updated category name'
     OR "slug" = 'updated-category-name'
);

DELETE FROM "categories"
WHERE "name" = 'Updated Category Name'
   OR LOWER(TRIM("name")) = 'updated category name'
   OR "slug" = 'updated-category-name';
