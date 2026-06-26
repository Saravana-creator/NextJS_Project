"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type Hospital = {
  _id: string;
  name: string;
  emailDomain: string;
  isActive: boolean;
};

type Doctor = {
  _id: string;
  name: string;
  slug: string;
  email: string;
  specialty: string;
  experience: string;
  availability: string;
  isActive: boolean;
  credentials: string;
  hospitalId: { _id: string; name: string; emailDomain: string } | string;
};

type DoctorForm = {
  name: string;
  slug: string;
  email: string;
  password: string;
  hospitalId: string;
  role: string;
  specialty: string;
  experience: string;
  credentials: string;
  availability: string;
  bio: string;
  image: string;
};

const EMPTY_FORM: DoctorForm = {
  name: "",
  slug: "",
  email: "",
  password: "",
  hospitalId: "",
  role: "Dental Specialist",
  specialty: "",
  experience: "",
  credentials: "",
  availability: "Mon–Fri",
  bio: "",
  image: "",
};

function getHospitalDisplay(hospitalId: Doctor["hospitalId"]) {
  if (!hospitalId) return "—";
  if (typeof hospitalId === "string") return hospitalId;
  return `${hospitalId.name} (@${hospitalId.emailDomain})`;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<DoctorForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([fetchDoctors(), fetchHospitals()]);
  }, []);

  // Auto-generate email from name + selected hospital domain
  useEffect(() => {
    if (form.hospitalId && form.name) {
      const hospital = hospitals.find((h) => h._id === form.hospitalId);
      if (hospital) {
        const namePart = form.name
          .toLowerCase()
          .replace(/^dr\.?\s*/i, "")
          .replace(/\s+/g, ".")
          .replace(/[^a-z0-9.]/g, "");
        setForm((f) => ({ ...f, email: `${namePart}@${hospital.emailDomain}` }));
      }
    }
  }, [form.name, form.hospitalId, hospitals]);

  // Auto-generate slug from name
  useEffect(() => {
    if (form.name) {
      const slug = form.name
        .toLowerCase()
        .replace(/^dr\.?\s*/i, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setForm((f) => ({ ...f, slug }));
    }
  }, [form.name]);

  async function fetchDoctors() {
    setLoading(true);
    try {
      const res = await fetch("/api/doctors?activeOnly=false");
      if (res.ok) {
        const result = await res.json();
        if (result.success) setDoctors(result.data.doctors);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchHospitals() {
    try {
      const res = await fetch("/api/hospitals");
      if (res.ok) {
        const result = await res.json();
        if (result.success) setHospitals(result.data.hospitals);
      }
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    }
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setError(null);
    setSuccessMsg(null);
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.error ?? "Failed to save doctor");
        return;
      }
      setSuccessMsg(
        `Doctor "${form.name}" created successfully. Login: ${form.email} / ${form.password}`,
      );
      setShowModal(false);
      await fetchDoctors();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(id: string) {
    if (!confirm("Deactivate this doctor? They will no longer be able to log in.")) return;
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDoctors((prev) => prev.map((d) => (d._id === id ? { ...d, isActive: false } : d)));
      }
    } catch {
      alert("Failed to deactivate doctor.");
    }
  }

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q);
  });

  const activeHospitals = hospitals.filter((h) => h.isActive);

  return (
    <DashboardShell mode="admin">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Management</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Doctors</h1>
        <p className="mt-2 text-sm text-muted">
          Add and manage clinic specialists. Each doctor is linked to a hospital and gets a
          hospital-issued login account.
        </p>

        {successMsg && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            ✓ {successMsg}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="min-h-11 w-full rounded-lg border border-border/60 bg-white/60 px-4 py-2 text-sm focus:border-primary focus:outline-none sm:max-w-xs"
            placeholder="Search by name or specialty…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={openAdd}
            className="min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark transition"
          >
            + Add Doctor
          </button>
        </div>

        {hospitals.length === 0 && !loading && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-700">
            ⚠ No hospitals registered yet.{" "}
            <a href="/admin/hospitals" className="underline">
              Add a hospital first
            </a>{" "}
            before adding doctors.
          </div>
        )}

        {loading ? (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading doctors…
          </div>
        ) : (
          <div className="mt-6 soft-card overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-teal-light/50 font-bold text-foreground">
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Hospital</th>
                    <th className="px-6 py-4">Specialty</th>
                    <th className="px-6 py-4">Availability</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filtered.map((doc) => (
                    <tr key={doc._id} className="hover:bg-white/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted mt-0.5">{doc.email}</p>
                      </td>
                      <td className="px-6 py-4 text-muted text-xs font-semibold">
                        {getHospitalDisplay(doc.hospitalId)}
                      </td>
                      <td className="px-6 py-4 text-muted">{doc.specialty}</td>
                      <td className="px-6 py-4 text-muted">{doc.availability}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            doc.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                          }`}
                        >
                          {doc.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {doc.isActive && (
                          <button
                            onClick={() => void handleDeactivate(doc._id)}
                            className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted">
                        No doctors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Add Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl my-4">
            <h2 className="font-display text-xl font-extrabold text-foreground">Add New Doctor</h2>
            <p className="mt-1 text-sm text-muted">
              This creates both a doctor profile and a login account for the doctor.
            </p>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                {error}
              </p>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* Hospital Dropdown */}
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Hospital <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.hospitalId}
                  onChange={(e) => setForm((f) => ({ ...f, hospitalId: e.target.value }))}
                  className="rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Select a hospital…</option>
                  {activeHospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name} (@{h.emailDomain})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Dr. Vikram Menon"
                  className="rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Email — auto-generated */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Hospital Email <span className="text-xs text-primary">(auto-filled)</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="vikram@citycare.com"
                  className="rounded-lg border border-border/60 bg-slate-50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Temp Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Temp Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Min 8 characters"
                  className="rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Specialty */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.specialty}
                  onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                  placeholder="Orthodontics"
                  className="rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Experience */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Experience</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                  placeholder="e.g. 10 years"
                  className="rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Credentials */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Credentials</label>
                <input
                  type="text"
                  value={form.credentials}
                  onChange={(e) => setForm((f) => ({ ...f, credentials: e.target.value }))}
                  placeholder="MDS, BDS"
                  className="rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Availability */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Availability</label>
                <input
                  type="text"
                  value={form.availability}
                  onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))}
                  placeholder="Mon–Fri"
                  className="rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Bio */}
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  className="rounded-lg border border-border/60 bg-white/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none resize-none"
                  placeholder="Short professional biography…"
                />
              </div>

              {/* Slug (auto-generated, editable) */}
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  URL Slug <span className="text-xs text-primary">(auto-filled, editable)</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="vikram-menon"
                  className="rounded-lg border border-border/60 bg-slate-50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
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
                disabled={saving || !form.hospitalId || !form.name || !form.email || !form.password}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition disabled:opacity-60"
              >
                {saving ? "Creating…" : "Create Doctor Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
