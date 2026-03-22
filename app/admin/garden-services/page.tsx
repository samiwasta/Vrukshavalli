"use client";

import { useEffect, useState, useCallback } from "react";
import {
  IconLoader2,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconSpray,
  IconX,
  IconMail,
  IconPhone,
  IconMapPin,
} from "@tabler/icons-react";

const SERVICE_LABELS: Record<string, string> = {
  landscaping: "Landscaping",
  "vertical-gardening": "Vertical Gardening",
  "farm-development": "Farm Development",
};

interface GardenEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
  message: string | null;
  createdAt: string;
}

export default function AdminGardenServicesPage() {
  const [enquiries, setEnquiries] = useState<GardenEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [viewing, setViewing] = useState<GardenEnquiry | null>(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);

    const r = await fetch(`/api/admin/garden-services?${params}`);
    const d = await r.json();
    if (d.success) {
      setEnquiries(d.data);
      setPagination(d.pagination);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    void fetchEnquiries();
  }, [fetchEnquiries]);
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    document.body.style.overflow = viewing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [viewing]);

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
        <IconSpray className="w-6 h-6 text-primary-600" /> Garden Services
      </h1>

      <div className="mb-5">
        <div className="relative w-full max-w-md">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 w-full"
            placeholder="Search name, email, phone, address…"
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
        ) : enquiries.length === 0 ? (
          <p className="text-center py-16 text-stone-400">
            No garden service enquiries yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-left">
                  <th className="px-4 py-3 font-medium text-stone-600">Name</th>
                  <th className="px-4 py-3 font-medium text-stone-600">
                    Contact
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600">
                    Services
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600">Date</th>
                  <th className="px-4 py-3 font-medium text-stone-600"></th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-stone-800">
                      {enq.fullName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-stone-600 flex items-center gap-1">
                          <IconMail className="w-3 h-3 shrink-0" /> {enq.email}
                        </span>
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <IconPhone className="w-3 h-3 shrink-0" /> {enq.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(enq.services) ? enq.services : []).map(
                          (id) => (
                            <span
                              key={id}
                              className="text-[10px] font-medium bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 rounded-full"
                            >
                              {SERVICE_LABELS[id] ?? id}
                            </span>
                          )
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs whitespace-nowrap">
                      {new Date(enq.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setViewing(enq)}
                        className="text-xs text-primary-600 hover:underline font-medium"
                      >
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
          <p className="text-sm text-stone-500">
            {pagination.total} enquiries
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

      {viewing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-stone-900 text-lg">
                Enquiry — {viewing.fullName}
              </h2>
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm mb-5">
              <InfoRow
                label="Email"
                value={viewing.email}
                link={`mailto:${viewing.email}`}
              />
              <InfoRow
                label="Phone"
                value={viewing.phone}
                link={`tel:${viewing.phone}`}
              />
              <div>
                <p className="text-xs text-stone-400 mb-1 flex items-center gap-1">
                  <IconMapPin className="w-3 h-3" /> Site / project address
                </p>
                <p className="text-stone-700 whitespace-pre-wrap">
                  {viewing.address}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 mb-1">Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(viewing.services) ? viewing.services : []).map(
                    (id) => (
                      <span
                        key={id}
                        className="text-xs font-medium bg-primary-50 text-primary-700 px-2 py-1 rounded-lg"
                      >
                        {SERVICE_LABELS[id] ?? id}
                      </span>
                    )
                  )}
                </div>
              </div>
              {viewing.message?.trim() ? (
                <div>
                  <p className="text-xs text-stone-400 mb-1">Notes</p>
                  <p className="text-stone-700 whitespace-pre-wrap">
                    {viewing.message}
                  </p>
                </div>
              ) : null}
              <InfoRow
                label="Submitted"
                value={new Date(viewing.createdAt).toLocaleString("en-IN")}
              />
            </div>

            <div className="flex gap-3">
              <a
                href={`mailto:${viewing.email}?subject=${encodeURIComponent("Re: Garden services enquiry")}`}
                className="flex-1 py-2.5 text-sm rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors text-center"
              >
                Reply via Email
              </a>
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="flex-1 py-2.5 text-sm rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  link,
}: {
  label: string;
  value: string;
  link?: string;
}) {
  return (
    <div>
      <p className="text-xs text-stone-400 mb-0.5">{label}</p>
      {link ? (
        <a
          href={link}
          className="text-primary-600 hover:underline text-sm break-all"
        >
          {value}
        </a>
      ) : (
        <p className="text-stone-700 text-sm">{value}</p>
      )}
    </div>
  );
}
