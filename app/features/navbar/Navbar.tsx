import type { ReactNode } from "react";
import FixedHeaderShell from "@/app/features/navbar/FixedHeaderShell";
import NavbarDesktop from "@/app/features/navbar/NavbarDesktop";
import NavbarMobile from "@/app/features/navbar/NavbarMobile";

export default function Navbar({ topSlot }: { topSlot?: ReactNode }) {
  return (
    <FixedHeaderShell topSlot={topSlot} hasTopSlot={Boolean(topSlot)}>
      <div className="hidden w-full lg:block">
        <NavbarDesktop />
      </div>
      <div className="w-full lg:hidden">
        <NavbarMobile />
      </div>
    </FixedHeaderShell>
  );
}
