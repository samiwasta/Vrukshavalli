import { pgTable, text, integer, timestamp, boolean, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * TODO BACKEND DEVELOPER - User model and profile API
 *
 * TASK:
 * - Align with Better Auth: auth uses schema in lib/db/schema/auth.ts (user.id is text). This table uses
 *   uuid. Decide single source of truth: either use auth.user as primary and extend with profile fields in
 *   another table keyed by auth user id, or sync auth sign-up into this users table (e.g. authId text unique
 *   referencing auth user id) so orders and app logic can use users.id. Avoid duplicate user records.
 * - Implement Profile API: GET /api/profile (current user profile), PATCH /api/profile (update name, phone,
 *   etc.). Require auth; return 401 if not logged in. Implement /profile page (app/profile/page.tsx) to
 *   display and edit profile; navbar links to /profile for logged-in users.
 *
 * EDGE CASES:
 * - Profile not found (user in auth but not in users table): create on first profile fetch or on first order.
 * - PATCH validation: sanitize inputs; do not allow changing email via this endpoint if auth handles email.
 * - Password change: prefer Better Auth flow; do not store raw password in app users table if auth has its own.
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  password: text("password").notNull(),
  role: text("role", { enum: ["customer", "admin"] }).default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
