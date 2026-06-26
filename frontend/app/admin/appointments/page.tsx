"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/providers/auth-provider";

type Appointment = {
  _id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
};

const STATUS_OPTIONS = ["all", "pending", "confirmed", "cancelled", "completed"] as const;
type FilterStatus = (typeof STATUS_OPTIONS)[number];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
  completed: "bg-primary/10 text-primary",
  pending: "bg-amber-50 text-amber-700",
};

export default function AdminAppointmentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const result = await res.json();
        if (result.success) setAppointments(result.data.appointments);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(id: string, newStatus: "confirmed" | "cancelled" | "completed") {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)),
        );
      } else {
        const result = await res.json();
        alert(result.error ?? "Failed to update");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = appointments.filter((a) => {
    const matchStatus = filter === "all" || a.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.patientName.toLowerCase().includes(q) ||
      a.patientEmail.toLowerCase().includes(q) ||
      (a.doctorName ?? "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <DashboardShell mode="admin">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Management</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Appointments</h1>
        <p className="mt-2 text-sm text-muted">
          Review, approve, cancel, and complete patient appointment requests.
        </p>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="min-h-11 w-full rounded-lg border border-border/60 bg-white/60 px-4 py-2 text-sm focus:border-primary focus:outline-none sm:max-w-xs"
            placeholder="Search patient, email, or doctor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-lg px-4 py-2 text-xs font-bold capitalize transition ${
                  filter === s
                    ? "bg-primary text-white"
                    : "border border-border/40 bg-white/60 text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading appointments…
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-10 text-center">
            <p className="font-display text-lg font-bold text-foreground">No appointments found</p>
            <p className="mt-1 text-sm text-muted">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-teal-light/50 font-bold text-foreground">
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Date &amp; Time</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filtered.map((appt) => (
                    <tr key={appt._id} className="hover:bg-white/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{appt.patientName}</p>
                        <p className="text-xs text-muted">{appt.patientEmail}</p>
                        <p className="text-xs text-muted">{appt.patientPhone}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-muted">
                        {appt.doctorName || "General Practitioner"}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">
                          {new Date(appt.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted">{appt.timeSlot || "Not specified"}</p>
                      </td>
                      <td className="px-6 py-4 max-w-[160px] truncate text-muted">
                        {appt.reason || "Routine Checkup"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLES[appt.status] ?? ""}`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {updatingId === appt._id ? (
                            <span className="text-xs text-muted italic">Saving…</span>
                          ) : (isAdmin || isDoctor) ? (
                            <>
                              {appt.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => void handleUpdateStatus(appt._id, "confirmed")}
                                    className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => void handleUpdateStatus(appt._id, "cancelled")}
                                    className="rounded bg-red-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-600 transition"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {appt.status === "confirmed" && (
                                <button
                                  onClick={() => void handleUpdateStatus(appt._id, "completed")}
                                  className="rounded bg-primary px-2.5 py-1 text-xs font-semibold text-white hover:bg-primary-dark transition"
                                >
                                  Complete
                                </button>
                              )}
                              {(appt.status === "cancelled" || appt.status === "completed") && (
                                <span className="text-xs text-muted italic">—</span>
                              )}
                            </>
                          ) : (
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLES[appt.status] ?? ""}`}>
                              {appt.status}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border/30 bg-teal-light/20 px-6 py-3 text-xs text-muted">
              Showing <strong>{filtered.length}</strong> of <strong>{appointments.length}</strong> appointments
            </div>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
