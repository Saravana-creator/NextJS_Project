"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type Hospital = {
  _id: string;
  name: string;
  slug: string;
  emailDomain: string;
  address: string;
  phone: string;
  description: string;
  isActive: boolean;
  createdAt: string;
};

type HospitalForm = {
  name: string;
  slug: string;
  emailDomain: string;
  address: string;
  phone: string;
  description: string;
};

const EMPTY_FORM: HospitalForm = {
  name: "",
  slug: "",
  emailDomain: "",
  address: "",
  phone: "",
  description: "",
};

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<HospitalForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchHospitals();
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (form.name) {
      const slug = form.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setForm((f) => ({ ...f, slug }));
    }
  }, [form.name]);

  async function fetchHospitals() {
    setLoading(true);
    try {
      const res = await fetch("/api/hospitals");
      if (res.ok) {
        const result = await res.json();
        if (result.success) setHospitals(result.data.hospitals);
      }
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.error ?? "Failed to save hospital");
        return;
      }
      setShowModal(false);
      await fetchHospitals();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(hospital: Hospital) {
    const action = hospital.isActive ? "deactivate" : "activate";
    if (
      !confirm(
        hospital.isActive
          ? `Deactivate "${hospital.name}"? All linked doctors will be blocked from logging in.`
          : `Activate "${hospital.name}"?`,
      )
    )
      return;

    setTogglingId(hospital._id);
    try {
      const res = await fetch(`/api/hospitals/${hospital._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !hospital.isActive }),
      });
      if (res.ok) {
        setHospitals((prev) =>
          prev.map((h) => (h._id === hospital._id ? { ...h, isActive: !hospital.isActive } : h)),
        );
      } else {
        const result = await res.json();
        alert(result.error ?? `Failed to ${action} hospital`);
      }
    } catch {
      alert("Network error.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(hospital: Hospital) {
    if (
      !confirm(
        `Delete "${hospital.name}"? This will permanently remove the hospital and deactivate all linked doctor accounts.`,
      )
    )
      return;

    try {
      const res = await fetch(`/api/hospitals/${hospital._id}`, { method: "DELETE" });
      if (res.ok) {
        setHospitals((prev) => prev.filter((h) => h._id !== hospital._id));
      } else {
        const result = await res.json();
        alert(result.error ?? "Failed to delete hospital");
      }
    } catch {
      alert("Network error.");
    }
  }

  return (
    <DashboardShell mode="admin">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Management</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Hospitals</h1>
        <p className="mt-2 text-sm text-muted">
          Register hospital partners. Each hospital has a unique email domain — doctors must be issued
          an email under that domain to get a login account.
        </p>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-muted font-semibold">
            {hospitals.length} hospital{hospitals.length !== 1 ? "s" : ""} registered
          </p>
          <button
            onClick={openAdd}
            className="min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark transition"
          >
            + Add Hospital
          </button>
        </div>

        {loading ? (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading hospitals…
          </div>
        ) : hospitals.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-12 text-center">
            <div className="clay-inset flex h-16 w-16 items-center justify-center rounded-2xl text-primary mb-5">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">No hospitals yet</h3>
            <p className="mt-1 text-sm text-muted max-w-sm">
              Add your first hospital to start creating doctor accounts.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hospitals.map((hospital) => (
              <div
                key={hospital._id}
                className={`soft-card rounded-2xl border p-6 transition ${
                  hospital.isActive ? "border-white/60" : "border-red-100 bg-red-50/30 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      {hospital.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-mono font-semibold text-primary">
                      @{hospital.emailDomain}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      hospital.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {hospital.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {hospital.address && (
                  <p className="mt-3 text-xs text-muted leading-relaxed">{hospital.address}</p>
                )}
                {hospital.phone && (
                  <p className="mt-1 text-xs text-muted">{hospital.phone}</p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => void handleToggleActive(hospital)}
                    disabled={togglingId === hospital._id}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold transition disabled:opacity-60 ${
                      hospital.isActive
                        ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {togglingId === hospital._id
                      ? "…"
                      : hospital.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                  <button
                    onClick={() => void handleDelete(hospital)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Hospital Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <h2 className="font-display text-xl font-extrabold text-foreground">Add Hospital</h2>
            <p className="mt-1 text-xs text-muted">
              Doctors added under this hospital must have an email ending in @emaildomain.
            </p>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                {error}
              </p>
            )}

            <div className="mt-5 grid gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Hospital Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="City Care Dental"
                  className="rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Email Domain <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted font-semibold">@</span>
                  <input
                    type="text"
                    value={form.emailDomain}
                    onChange={(e) => setForm((f) => ({ ...f, emailDomain: e.target.value.toLowerCase() }))}
                    placeholder="citycare.com"
                    className="flex-1 rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none font-mono"
                  />
                </div>
                <p className="text-xs text-muted">
                  Doctors must use an email ending with @{form.emailDomain || "yourdomain.com"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  URL Slug <span className="text-xs text-primary">(auto-filled)</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="city-care-dental"
                  className="rounded-lg border border-border/60 bg-slate-50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="123 Main St, Chennai"
                  className="rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-semibold text-muted hover:border-primary hover:text-primary transition"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleSave()}
                disabled={saving || !form.name || !form.emailDomain}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition disabled:opacity-60"
              >
                {saving ? "Creating…" : "Create Hospital"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
