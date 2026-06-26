"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type Patient = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const res = await fetch("/api/patients");
      if (res.ok) {
        const result = await res.json();
        if (result.success) setPatients(result.data.patients);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
  });

  return (
    <DashboardShell mode="admin">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Management</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Patients</h1>
        <p className="mt-2 text-sm text-muted">
          Browse and search all registered patients in the system.
        </p>

        {/* Search bar */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="min-h-11 w-full rounded-lg border border-border/60 bg-white/60 px-4 py-2 text-sm focus:border-primary focus:outline-none sm:max-w-xs"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p className="text-xs text-muted">
            {filtered.length} of {patients.length} patients
          </p>
        </div>

        {loading ? (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading patients…
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-10 text-center">
            <p className="font-display text-lg font-bold text-foreground">No patients found</p>
            <p className="mt-1 text-sm text-muted">No registered patients match your search.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-teal-light/50 font-bold text-foreground">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filtered.map((patient) => (
                    <tr key={patient._id} className="hover:bg-white/50 transition">
                      <td className="px-6 py-4 font-bold text-foreground">{patient.name}</td>
                      <td className="px-6 py-4 text-muted">{patient.email}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold capitalize text-primary">
                          {patient.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {new Date(patient.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
