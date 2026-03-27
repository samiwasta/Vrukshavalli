import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";
import { AdminSidebar } from "./AdminSidebar";

export const metadata = { title: "Admin — Vrukshavalli" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session?.user) redirect("/login");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.authId, session.user.id),
  });

  if (!dbUser || dbUser.role !== "admin") redirect("/");

  return (
    <div className="flex h-screen bg-stone-50 font-sans overflow-hidden">
      <AdminSidebar userName={session.user.name ?? "Admin"} />

      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        {children}
      </main>
    </div>
  );
}

