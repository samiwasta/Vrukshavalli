"use client";

import { useEffect, useState, useCallback } from "react";
import {
  IconLoader2,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconUsers,
} from "@tabler/icons-react";

interface DisplayAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  alias: string | null;
}

interface UserRow {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
  displayAddress: DisplayAddress | null;
}

function formatAddressLines(addr: DisplayAddress | null | undefined): string[] {
  if (!addr || typeof addr !== "object") return [];
  const lines: string[] = [];
  if (addr.fullName) {
    lines.push(
      addr.alias ? `${addr.fullName} (${addr.alias})` : addr.fullName
    );
  }
  const street = [addr.line1, addr.line2].filter(Boolean).join(", ");
  if (street) lines.push(street);
  const cityState = [addr.city, addr.state].filter(Boolean).join(", ");
  const locality = [cityState, addr.pincode].filter(Boolean).join(" - ");
  if (locality) lines.push(locality);
  if (addr.phone) lines.push(addr.phone);
  return lines;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);

    const r = await fetch(`/api/admin/users?${params}`);
    const d = await r.json();
    if (d.success) {
      setUsers(d.data);
      setPagination(d.pagination);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
        <IconUsers className="w-6 h-6 text-violet-600" /> Customers
      </h1>

      <div className="mb-5">
        <div className="relative w-full max-w-md">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 w-full"
            placeholder="Search by name, phone, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <IconLoader2 className="w-6 h-6 text-primary-500 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center py-16 text-stone-400">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-left">
                  <th className="px-4 py-3 font-medium text-stone-600 whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600 whitespace-nowrap">
                    Phone
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600 whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600 min-w-[200px]">
                    Primary address
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600 whitespace-nowrap">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const addrLines = formatAddressLines(user.displayAddress);
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-stone-100 hover:bg-stone-50 transition-colors align-top"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-stone-400 shrink-0">
                            {user.name.slice(0, 1).toUpperCase()}
                          </div>
                          <span className="font-medium text-stone-800">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-stone-600 whitespace-nowrap">
                        {user.phone ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-600 break-all max-w-[220px]">
                        {user.email ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {addrLines.length ? (
                          <div className="space-y-0.5 text-xs leading-relaxed">
                            {addrLines.map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-500 text-xs whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-stone-500">
            {pagination.total} customers
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
            >
              <IconChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-stone-600">
              {page} / {pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pagination.totalPages}
              className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
            >
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {pagination.totalPages <= 1 && pagination.total > 0 && (
        <p className="text-sm text-stone-500 mt-4">
          {pagination.total} customers
        </p>
      )}
    </div>
  );
}
