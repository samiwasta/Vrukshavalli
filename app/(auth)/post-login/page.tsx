"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";

export default function PostLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        const json = await res.json();

        if (cancelled) return;

        if (!res.ok || !json?.success) {
          router.replace("/login");
          return;
        }

        const role = json?.data?.role;
        router.replace(role === "admin" ? "/admin" : "/");
      } catch {
        if (!cancelled) router.replace("/");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="rounded-2xl border border-primary-200/80 bg-white/90 p-8 text-center shadow-[0_8px_32px_rgba(7,61,43,0.08)] backdrop-blur">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
        <IconLoader2 className="h-5 w-5 animate-spin text-primary-700" />
      </div>
      <p className="font-sans text-sm text-primary-700">Signing you in…</p>
    </div>
  );
}
