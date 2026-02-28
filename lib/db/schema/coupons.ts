import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),

  code: text("code").notNull().unique(),

  discountPct: integer("discount_pct").notNull(),

  maxUses: integer("max_uses"),

  usedCount: integer("used_count").default(0).notNull(),

  expiresAt: timestamp("expires_at"),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCouponSchema = createInsertSchema(coupons);
export const selectCouponSchema = createSelectSchema(coupons);

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;