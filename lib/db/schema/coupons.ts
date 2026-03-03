import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { pgEnum } from "drizzle-orm/pg-core";

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "flat",
]);

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),

  code: text("code").notNull().unique(),

  /** "percentage" → discountPct is a %, "flat" → discountPct is a ₹ amount */
  discountType: discountTypeEnum("discount_type")
  .default("percentage")
  .notNull(),

  discountPct: integer("discount_pct").notNull(),

  description: text("description"),

  maxUses: integer("max_uses"),

  usedCount: integer("used_count").default(0).notNull(),

  expiresAt: timestamp("expires_at"),

  /** If true, only customers with zero previous orders can use this coupon */
  newUsersOnly: boolean("new_users_only").default(false).notNull(),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCouponSchema = createInsertSchema(coupons);
export const selectCouponSchema = createSelectSchema(coupons);

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;