import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),

  subject: text("subject").notNull(),
  message: text("message").notNull(),

  ip: text("ip"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSubmissionSchema =
  createInsertSchema(contactSubmissions);

export const selectContactSubmissionSchema =
  createSelectSchema(contactSubmissions);