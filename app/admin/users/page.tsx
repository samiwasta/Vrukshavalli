"use client";

import { useEffect, useState, useCallback } from "react";
import {
  IconLoader2,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconUsers,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  phone: string | null;
  role: "customer" | "admin";
  createdAt: string;
  email?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [updating, setUpdating] = useState<string | null>(null);

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

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [search]);

  const toggleRole = async (user: User) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;

    setUpdating(user.id);
    const r = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    const d = await r.json();
    if (d.success) {
      toast.success(`${user.name} is now ${newRole}`);
      fetchUsers();
    } else {
      toast.error("Failed to update user");
    }
    setUpdating(null);
  };

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
        <IconUsers className="w-6 h-6 text-violet-600" /> Users
      </h1>

      <div className="mb-5">
        <div className="relative w-64">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 w-full"
            placeholder="Search users…"
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
          <p className="text-center py-16 text-stone-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-left">
                  <th className="px-4 py-3 font-medium text-stone-600">Name</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Phone</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Role</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Joined</th>
                  <th className="px-4 py-3 font-medium text-stone-600"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${user.role === "admin" ? "bg-violet-500" : "bg-stone-400"}`}>
                          {user.name.slice(0, 1).toUpperCase()}
                        </div>
                        <span className="font-medium text-stone-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{user.phone ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${user.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-stone-100 text-stone-600"}`}>
                        {user.role === "admin" ? <IconShieldCheck className="w-3 h-3" /> : <IconUser className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{new Date(user.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRole(user)}
                        disabled={updating === user.id}
                        className={`text-xs font-medium hover:underline ${user.role === "admin" ? "text-stone-500" : "text-violet-600"} disabled:opacity-40`}
                      >
                        {updating === user.id
                          ? <IconLoader2 className="w-3 h-3 animate-spin inline" />
                          : user.role === "admin" ? "Revoke admin" : "Make admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-stone-500">{pagination.total} users</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50">
              <IconChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-stone-600">{page} / {pagination.totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages} className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50">
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
