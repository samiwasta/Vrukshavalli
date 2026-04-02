import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const giftingEnquiries = pgTable("gifting_enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),

  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company").notNull(),

  moq: text("moq").notNull(),
  deliveryType: text("delivery_type").notNull(),

  ip: text("ip"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGiftingEnquirySchema =
  createInsertSchema(giftingEnquiries);

export const selectGiftingEnquirySchema =
  createSelectSchema(giftingEnquiries);