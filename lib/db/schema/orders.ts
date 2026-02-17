import { pgTable, text, integer, timestamp, decimal, uuid, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

/**
 * TODO BACKEND DEVELOPER - Orders API and user id alignment
 *
 * TASK:
 * - Implement Orders API: GET /api/orders (list for current user), GET /api/orders/[id] (single + auth check),
 *   POST /api/orders (create order from cart; validate items, stock, totals). Protect all routes with auth.
 * - Implement /orders page (or app/orders/page.tsx) to show user's orders and track status; page can call
 *   GET /api/orders and display orderNumber, status, totalAmount, createdAt; optional: GET /api/orders/[id]
 *   for detail. Navbar already links to /orders for logged-in users.
 * - Resolve user id type: orders.userId references users.id (uuid). Better Auth uses user.id (text).
 *   Either store auth user id in users table and use that as FK, or add a stable mapping (e.g. users.authId text
 *   unique) and use users.id for orders; ensure creating an order uses the correct user id from session.
 *
 * EDGE CASES:
 * - Unauthenticated request to GET /api/orders or POST: return 401.
 * - Order not found or not owned by current user: return 404.
 * - POST order: validate cart/items exist, stock sufficient; deduct stock or reserve; generate unique
 *   orderNumber; validate shipping/billing address shape.
 * - Pagination for list orders: support page/limit; default sort by createdAt desc.
 * - Cart: Navbar links to /cart but no cart API or page yet. Either add cart table (userId, productId,
 *   quantity) + GET/POST/DELETE /api/cart, or derive cart from client/session; POST /api/orders should
 *   accept order payload (items, address, payment method) and validate before creating order.
 */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status", { 
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"] 
  }).default("pending").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  billingAddress: jsonb("billing_address"),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status", { 
    enum: ["pending", "paid", "failed", "refunded"] 
  }).default("pending").notNull(),
  items: jsonb("items").notNull(), // Array of {productId, name, price, quantity, image}
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
