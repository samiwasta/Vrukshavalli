"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/util";

export default function FixedHeaderShell({
  topSlot,
  hasTopSlot,
  children,
}: {
  topSlot?: ReactNode;
  hasTopSlot?: boolean;
  children: ReactNode;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(0);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const sync = () => {
      setSpacerHeight(el.offsetHeight);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [topSlot]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 flex w-full flex-col bg-white shadow-md"
      >
        {topSlot}
        {children}
      </header>
      <div
        aria-hidden
        className={cn(
          "w-full shrink-0",
          spacerHeight === 0 &&
            (hasTopSlot
              ? "min-h-[10rem] lg:min-h-[13rem]"
              : "min-h-[7.75rem] lg:min-h-[10.5rem]"),
        )}
        style={spacerHeight > 0 ? { height: spacerHeight } : undefined}
      />
    </>
  );
}
