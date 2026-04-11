"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

export interface DeliveryAddress {
  id?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
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
  const { data: session, isPending } = useSession();

  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<DeliveryAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ LOAD ADDRESSES
  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        setIsLoading(true);

        const res = await fetch("/api/addresses");

        if (res.status === 401) {
      setAddresses([]);
      setSelectedAddress(null);
      return;
    }

    if (!res.ok) {
      console.error("API failed:", res.status);
      return;
    }

        const json = await res.json();

        const list: DeliveryAddress[] = json.data ?? [];

        setAddresses(list);

        const defaultAddress =
          list.find((a) => a.isDefault) ?? list[0] ?? null;

        setSelectedAddress(defaultAddress);
      } catch (err) {
        console.error("LOAD ADDRESS ERROR", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [session, isPending]);

  // ✅ ADD ADDRESS
  const addAddress = async (next: DeliveryAddress) => {
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...next, isDefault: true }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const json = await res.json();

      const newAddress = json.data;

      setAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddress(newAddress);
    } catch (err) {
      console.error("SAVE ADDRESS ERROR", err);
    }
  };

  return {
    address: selectedAddress,
    addresses,
    setSelectedAddress,
    addAddress,
    isLoading,
    isLoggedIn: !!session?.user,
  };
}