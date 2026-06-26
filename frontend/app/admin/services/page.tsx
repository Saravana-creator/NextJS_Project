"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

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

type ServiceForm = {
  title: string;
  slug: string;
  description: string;
  price: string;
  duration: string;
  category: string;
};

const EMPTY_FORM: ServiceForm = {
  title: "",
  slug: "",
  description: "",
  price: "",
  duration: "",
  category: "general",
};

const CATEGORIES = ["general", "cosmetic", "orthodontic", "surgical", "pediatric", "preventive"];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void fetchServices(); }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const res = await fetch("/api/services?activeOnly=false");
      if (res.ok) {
        const result = await res.json();
        if (result.success) setServices(result.data.services);
      }
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(svc: Service) {
    setEditTarget(svc);
    setForm({ title: svc.title, slug: svc.slug, description: svc.description, price: svc.price, duration: svc.duration, category: svc.category });
    setError(null);
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const url = editTarget ? `/api/services/${editTarget._id}` : "/api/services";
      const method = editTarget ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await res.json();
      if (!res.ok || !result.success) { setError(result.error ?? "Failed to save"); return; }
      setShowModal(false);
      await fetchServices();
    } catch { setError("Network error."); } finally { setSaving(false); }
  }

  async function handleDeactivate(id: string) {
    if (!confirm("Deactivate this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    setServices((prev) => prev.map((s) => (s._id === id ? { ...s, isActive: false } : s)));
  }

  return (
    <DashboardShell mode="admin">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Management</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Services</h1>
        <p className="mt-2 text-sm text-muted">Create, edit, and manage dental services offered by the clinic.</p>

        <div className="mt-8 flex justify-end">
          <button onClick={openAdd} className="min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark transition">
            + Add Service
          </button>
        </div>

        {loading ? (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
            Loading services…
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-teal-light/50 font-bold text-foreground">
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {services.map((svc) => (
                    <tr key={svc._id} className="hover:bg-white/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{svc.title}</p>
                        <p className="text-xs text-muted mt-0.5 max-w-xs truncate">{svc.description}</p>
                      </td>
                      <td className="px-6 py-4"><span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold capitalize text-primary">{svc.category}</span></td>
                      <td className="px-6 py-4 text-muted">{svc.price || "—"}</td>
                      <td className="px-6 py-4 text-muted">{svc.duration || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${svc.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                          {svc.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(svc)} className="rounded border border-border/60 px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary transition">Edit</button>
                          {svc.isActive && <button onClick={() => void handleDeactivate(svc._id)} className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition">Deactivate</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-muted">No services yet. Add your first service.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <h2 className="font-display text-xl font-extrabold text-foreground">{editTarget ? "Edit Service" : "Add New Service"}</h2>
            {error && <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">{error}</p>}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {([["title", "Service Title"], ["slug", "URL Slug"], ["price", "Starting Price"], ["duration", "Duration"]] as [keyof ServiceForm, string][]).map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">{label}</label>
                  <input value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className="rounded-lg border border-border/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="rounded-lg border border-border/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="rounded-lg border border-border/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none resize-none" />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-semibold text-muted hover:border-primary hover:text-primary transition">Cancel</button>
              <button onClick={() => void handleSave()} disabled={saving} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition disabled:opacity-60">{saving ? "Saving…" : editTarget ? "Save Changes" : "Add Service"}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
