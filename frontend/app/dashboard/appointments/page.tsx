"use client";

import { useEffect, useState, Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Appointment = {
  _id: string;
  patientName: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
  completed: "bg-primary/10 text-primary",
  pending: "bg-amber-50 text-amber-700",
};

const STATUS_OPTIONS = ["all", "pending", "confirmed", "cancelled", "completed"] as const;
type FilterStatus = (typeof STATUS_OPTIONS)[number];

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/appointments");
        if (res.ok) {
          const result = await res.json();
          if (result.success) setAppointments(result.data.appointments);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setToastMessage("Appointment requested successfully! Our reception team will confirm shortly.");
      // Clear URL params
      window.history.replaceState(null, "", "/dashboard/appointments");
      
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const filtered = appointments.filter((a) => filter === "all" || a.status === filter);

  return (
    <DashboardShell mode="patient">
      <section className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Patient Portal</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">My Appointments</h1>
        <p className="mt-2 text-sm text-muted">View your full appointment history and upcoming scheduled visits.</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-lg px-4 py-2 text-xs font-bold capitalize transition ${filter === s ? "bg-primary text-white" : "border border-border/40 bg-white/60 text-muted hover:border-primary hover:text-primary"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <Link
            href="/appointment"
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary-dark transition"
          >
            + Book New Appointment
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-10 text-center">
            <p className="font-display text-lg font-bold text-foreground">No appointments</p>
            <p className="mt-1 text-sm text-muted">No appointments found for the selected filter.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-teal-light/50 font-bold text-foreground">
                    <th className="px-6 py-4">Specialist</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filtered.map((appt) => (
                    <tr key={appt._id} className="hover:bg-white/50 transition">
                      <td className="px-6 py-4 font-semibold text-foreground">{appt.doctorName || "General Clinician"}</td>
                      <td className="px-6 py-4 text-muted">
                        {new Date(appt.date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-muted">{appt.timeSlot || "Not specified"}</td>
                      <td className="px-6 py-4 text-muted truncate max-w-[180px]">{appt.reason || "Routine Checkup"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLES[appt.status] ?? ""}`}>
                          {appt.status}
                        </span>
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

        {/* Success Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex max-w-md animate-slide-in gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-xl transition-all duration-300">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white font-bold shrink-0">
              ✓
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-emerald-950">Success</h4>
              <p className="mt-0.5 text-xs leading-relaxed text-emerald-800">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-950 focus:outline-none shrink-0"
            >
              ✕
            </button>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

export default function DashboardAppointmentsPage() {
  return (
    <Suspense fallback={
      <DashboardShell mode="patient">
        <div className="flex h-40 items-center justify-center">Loading…</div>
      </DashboardShell>
    }>
      <AppointmentsContent />
    </Suspense>
  );
}
