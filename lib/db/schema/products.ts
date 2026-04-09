import { pgTable, text, integer, timestamp, boolean, decimal, uuid, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { categories } from "./categories";

const decimalFromApi = z.union([
  z.string(),
  z.number().transform((n) => String(n)),
]);


export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  image: text("image").notNull(),
  images: text("images").array(),
  categoryId: uuid("category_id").references(() => categories.id),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  stock: integer("stock").default(0).notNull(),
  stockCapacity: integer("stock_capacity"),
  isNew: boolean("is_new").default(false),
  isBestSeller: boolean("is_best_seller").default(false),
  isHandPicked: boolean("is_hand_picked").default(false),
  isCeramicFeatured: boolean("is_ceramic_featured").default(false),
  isActive: boolean("is_active").default(true).notNull(),
  plantType: text("plant_type"),
  potSizes: text("pot_sizes").array(),
  light: text("light"),
  water: text("water"),
  sizeDetail: text("size_detail"),
  petFriendly: boolean("pet_friendly").default(false),
  careLevel: text("care_level").default("Easy"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
},
(table) => ({
    nameIdx: index("products_name_idx").on(table.name),
  })
);

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const insertProductSchema = createInsertSchema(products, {
  price: decimalFromApi,
  originalPrice: z.union([decimalFromApi, z.null()]).optional(),
  rating: z.union([decimalFromApi, z.null()]).optional(),
  plantType: z.preprocess(
    (v) => (v === "" || v === undefined ? null : v),
    z.enum(["indoor", "outdoor"]).nullable().optional(),
  ),
  potSizes: z.array(z.string()).nullable().optional(),
  light: z.string().nullable().optional(),
  water: z.string().nullable().optional(),
  sizeDetail: z.string().nullable().optional(),
  petFriendly: z.boolean().optional(),
  careLevel: z.string().nullable().optional(),
});
export const selectProductSchema = createSelectSchema(products);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
