import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as authSchema from "./db/schema/auth";

/**
 * TODO BACKEND DEVELOPER - Auth configuration
 *
 * TASK:
 * - Set BETTER_AUTH_SECRET in production (and .env.local for dev). Use a long random string; never commit.
 *   Build will warn if default secret is used.
 * - Optional: configure trusted origins, session cookie domain, and session expiry per requirements.
 * - Optional: add rate limiting or abuse protection for sign-in/sign-up endpoints (e.g. at gateway or in API).
 *
 * EDGE CASES:
 * - Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET: Google sign-in will fail; document required env vars.
 * - baseURL in serverless: ensure VERCEL_URL or BETTER_AUTH_URL is set correctly for OAuth callbacks.
 */
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
});
