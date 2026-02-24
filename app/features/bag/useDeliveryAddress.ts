"use client";

/**
 * useDeliveryAddress
 *
 * Manages the user's delivery address within the bag / checkout flow.
 * All state is client-only right now; integration points are clearly marked
 * for the backend developer.
 *
 * ── BACKEND INTEGRATION GUIDE ───────────────────────────────────────────────
 *
 * The `DeliveryAddress` type is intentionally identical to the `shippingAddress`
 * (jsonb) column in lib/db/schema/orders.ts so it can be passed directly when
 * creating an order via POST /api/orders.
 *
 * 1. FETCH saved address on mount — replace the stub useEffect below with:
 *
 *      useEffect(() => {
 *        if (!session?.user?.id) return;
 *        setIsLoading(true);
 *        fetch("/api/profile")
 *          .then((r) => r.json())
 *          .then((data: { shippingAddress?: DeliveryAddress | null }) => {
 *            setAddress(data.shippingAddress ?? null);
 *          })
 *          .catch(() => setAddress(null))
 *          .finally(() => setIsLoading(false));
 *      }, [session?.user?.id]);
 *
 * 2. PERSIST changes — replace `setAddress(next)` in `updateAddress` with:
 *
 *      await fetch("/api/profile", {
 *        method: "PATCH",
 *        headers: { "Content-Type": "application/json" },
 *        body: JSON.stringify({ shippingAddress: next }),
 *      });
 *      setAddress(next);
 *
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { useSession } from "@/lib/auth-client";

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

export const EMPTY_ADDRESS: DeliveryAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export function useDeliveryAddress() {
  const { data: session } = useSession();

  // TODO: Replace with real fetch when GET /api/profile is available.
  // See integration guide above.
  const [address, setAddress] = useState<DeliveryAddress | null>(null);
  const [isLoading] = useState(false);

  // TODO: Replace with PATCH /api/profile when backend is ready.
  const updateAddress = (next: DeliveryAddress) => {
    setAddress(next);
  };

  return {
    address,
    updateAddress,
    isLoading,
    isLoggedIn: Boolean(session?.user),
  };
}
