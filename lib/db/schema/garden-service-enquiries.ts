import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const gardenServiceEnquiries = pgTable("garden_service_enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),

  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),

  address: text("address").notNull(),
  services: jsonb("services").notNull().$type<string[]>(),
  message: text("message"),

  ip: text("ip"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGardenServiceEnquirySchema = createInsertSchema(
  gardenServiceEnquiries
);
export const selectGardenServiceEnquirySchema = createSelectSchema(
  gardenServiceEnquiries
);
