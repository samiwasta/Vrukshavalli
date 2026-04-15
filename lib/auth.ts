import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sql } from "drizzle-orm";
import { db } from "./db";
import * as authSchema from "./db/schema/auth";

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),

  trustedOrigins: [
    "http://localhost:3000",
    "https://vrukshavalli.vercel.app",
    "https://vrukshavalligardenstore.com",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],

  secret: process.env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),

  databaseHooks: {
    user: {
      create: {
        before: async (userPayload) => {
          const raw = userPayload.email;
          const email =
            typeof raw === "string" ? raw.trim().toLowerCase() : raw;
          if (typeof email !== "string" || !email) {
            throw new APIError("BAD_REQUEST", {
              message: "A valid email is required.",
            });
          }
          const [existing] = await db
            .select({ id: authSchema.user.id })
            .from(authSchema.user)
            .where(sql`lower(${authSchema.user.email}) = ${email}`)
            .limit(1);
          if (existing) {
            throw new APIError("CONFLICT", {
              message:
                "An account with this email already exists. Sign in instead.",
            });
          }
          return {
            data: {
              ...userPayload,
              email,
            },
          };
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
});