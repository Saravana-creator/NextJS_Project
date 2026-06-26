"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/providers/auth-provider";

type Service = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  isActive: boolean;
};

export default function AdminPricingPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const res = await fetch("/api/services?activeOnly=true");
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setServices(result.data.services);
        }
      }
    } catch (err) {
      console.error("Error fetching services for pricing:", err);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(svc: Service) {
    setEditingId(svc._id);
    setEditPrice(svc.price);
    setError(null);
  }

  async function savePrice(id: string) {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: editPrice }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setServices((prev) =>
          prev.map((s) => (s._id === id ? { ...s, price: editPrice } : s)),
        );
        setEditingId(null);
      } else {
        setError(result.error ?? "Failed to save pricing");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <DashboardShell mode="admin">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Command Center</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Service Pricing</h1>
        <p className="mt-2 text-sm text-muted">
          Adjust clinic consultation fees and procedural pricing directly. Changes apply immediately to the public services catalog.
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading pricing index…
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-teal-light/50 font-bold text-foreground">
                    <th className="px-6 py-4">Service Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Estimated Duration</th>
                    <th className="px-6 py-4">Current Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {services.map((svc) => (
                    <tr key={svc._id} className="hover:bg-white/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{svc.title}</p>
                        <p className="text-xs text-muted mt-0.5 max-w-sm truncate">{svc.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold capitalize text-primary">
                          {svc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted">{svc.duration || "N/A"}</td>
                      <td className="px-6 py-4">
                        {editingId === svc._id ? (
                          <input
                            type="text"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-28 rounded-lg border border-border/60 bg-white px-3 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                            placeholder="e.g. ₹5,000"
                            autoFocus
                          />
                        ) : (
                          <span className="font-bold text-foreground text-base">
                            {svc.price || "Contact Us"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {editingId === svc._id ? (
                            <>
                              <button
                                onClick={() => void savePrice(svc._id)}
                                disabled={savingId === svc._id}
                                className="rounded bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark transition disabled:opacity-60"
                              >
                                {savingId === svc._id ? "Saving…" : "Save"}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="rounded border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted hover:bg-slate-50 transition"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startEdit(svc)}
                              className="rounded border border-border/60 px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary transition"
                            >
                              Edit Price
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted">
                        No active services found to configure pricing for.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
