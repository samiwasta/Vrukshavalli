import { db } from "./db";
import { users } from "./db/schema/users";
import { eq } from "drizzle-orm";
import { getSession } from "./session";

export async function getCurrentUser(request: Request) {
  const session = await getSession(request);

  if (!session?.user) return null;

  const authUser = session.user;

  let user = await db.query.users.findFirst({
    where: eq(users.authId, authUser.id),
  });

  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({
        authId: authUser.id,
        name: authUser.name ?? "User",
        role: "customer",
      })
      .returning();

    user = newUser;
  }

  return {
    ...user,
    email: authUser.email,
  };
}