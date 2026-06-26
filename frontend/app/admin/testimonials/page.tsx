"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type Testimonial = {
  _id: string;
  patientName: string;
  rating: number;
  review: string;
  treatment: string;
  isApproved: boolean;
  createdAt: string;
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => { void fetchTestimonials(); }, []);

  async function fetchTestimonials() {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials?approvedOnly=false");
      if (res.ok) {
        const result = await res.json();
        if (result.success) setTestimonials(result.data.testimonials);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string, approve: boolean) {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: approve }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t._id === id ? { ...t, isApproved: approve } : t)),
        );
      }
    } catch { /* silent */ }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setTestimonials((prev) => prev.filter((t) => t._id !== id));
  }

  const filtered = testimonials.filter((t) => {
    if (filter === "pending") return !t.isApproved;
    if (filter === "approved") return t.isApproved;
    return true;
  });

  return (
    <DashboardShell mode="admin">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Content</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Testimonials</h1>
        <p className="mt-2 text-sm text-muted">
          Review, approve, or remove patient testimonials. Approved reviews appear on the public site.
        </p>

        <div className="mt-6 flex gap-2">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-xs font-bold capitalize transition ${filter === f ? "bg-primary text-white" : "border border-border/40 bg-white/60 text-muted hover:border-primary hover:text-primary"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
            Loading testimonials…
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <div key={t._id} className={`soft-card rounded-xl p-5 border ${t.isApproved ? "border-emerald-200/60" : "border-amber-200/60"}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${t.isApproved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {t.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <p className="mt-3 text-sm italic leading-relaxed text-foreground">&ldquo;{t.review}&rdquo;</p>
                <div className="mt-4 border-t border-border/30 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.patientName}</p>
                    <p className="text-xs text-muted">{t.treatment}</p>
                  </div>
                  <div className="flex gap-2">
                    {!t.isApproved ? (
                      <button
                        onClick={() => void handleApprove(t._id, true)}
                        className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => void handleApprove(t._id, false)}
                        className="rounded border border-amber-300 px-2.5 py-1 text-xs font-bold text-amber-700 hover:bg-amber-50 transition"
                      >
                        Unapprove
                      </button>
                    )}
                    <button
                      onClick={() => void handleDelete(t._id)}
                      className="rounded border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-10 text-center">
                <p className="font-bold text-foreground">No testimonials</p>
                <p className="mt-1 text-sm text-muted">No testimonials match the selected filter.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
