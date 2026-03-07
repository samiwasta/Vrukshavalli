"use client";

import { useEffect, useState, useCallback } from "react";
import {
  IconLoader2,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconMessage,
  IconX,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  ip: string | null;
  createdAt: string;
}

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [viewing, setViewing] = useState<ContactSubmission | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);

    const r = await fetch(`/api/admin/contact?${params}`);
    const d = await r.json();
    if (d.success) {
      setSubmissions(d.data);
      setPagination(d.pagination);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);
  useEffect(() => { setPage(1); }, [search]);

  useEffect(() => {
    document.body.style.overflow = viewing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [viewing]);

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
        <IconMessage className="w-6 h-6 text-rose-600" /> Contact Submissions
      </h1>

      <div className="mb-5">
        <div className="relative w-64">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 w-full"
            placeholder="Search name, email, subject…"
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
        ) : submissions.length === 0 ? (
          <p className="text-center py-16 text-stone-400">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-left">
                  <th className="px-4 py-3 font-medium text-stone-600">Name</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Contact</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Subject</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Date</th>
                  <th className="px-4 py-3 font-medium text-stone-600"></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-stone-800">{sub.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-stone-600 flex items-center gap-1">
                          <IconMail className="w-3 h-3" /> {sub.email}
                        </span>
                        {sub.phone && (
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <IconPhone className="w-3 h-3" /> {sub.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-700">{sub.subject}</td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{new Date(sub.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setViewing(sub)} className="text-xs text-primary-600 hover:underline font-medium">
                        View
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
          <p className="text-sm text-stone-500">{pagination.total} submissions</p>
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

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-stone-900 text-lg">Message from {viewing.name}</h2>
              <button onClick={() => setViewing(null)} className="text-stone-400 hover:text-stone-600">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Email</p>
                  <a href={`mailto:${viewing.email}`} className="text-primary-600 hover:underline">{viewing.email}</a>
                </div>
                {viewing.phone && (
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Phone</p>
                    <p className="text-stone-700">{viewing.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Date</p>
                  <p className="text-stone-700">{new Date(viewing.createdAt).toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-stone-400 mb-1">Subject</p>
                <p className="font-medium text-stone-800">{viewing.subject}</p>
              </div>

              <div>
                <p className="text-xs text-stone-400 mb-1">Message</p>
                <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-700 whitespace-pre-wrap">
                  {viewing.message}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject)}`}
                className="flex-1 py-2.5 text-sm rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors text-center"
              >
                Reply via Email
              </a>
              <button onClick={() => setViewing(null)} className="flex-1 py-2.5 text-sm rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
