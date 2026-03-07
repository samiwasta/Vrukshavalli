import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";

const f = createUploadthing();

export const ourFileRouter = {
  productImages: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  }).middleware(async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) throw new Error("Unauthorized");

    const [dbUser] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.authId, session.user.id))
      .limit(1);

    if (!dbUser || dbUser.role !== "admin") throw new Error("Forbidden");

    return { userId: session.user.id };
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
