"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";

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

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/appointments");
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            setAppointments(result.data.appointments);
          }
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const completed = appointments.filter((a) => a.status === "completed").length;

  return (
    <DashboardShell mode="patient">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
          Patient Portal
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">
          Welcome back, {user?.name || "Patient"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Access your appointment summaries, dental history, and support options below.
        </p>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Appointments" value={String(total)} note="All-time history" />
          <StatCard label="Confirmed Visits" value={String(confirmed)} note="Upcoming sessions" />
          <StatCard label="Pending Approval" value={String(pending)} note="Awaiting confirmation" />
          <StatCard label="Completed Care" value={String(completed)} note="Past sessions" />
        </div>

        {/* Appointment List Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-foreground">Your Appointment History</h3>
            <Link
              href="/appointment"
              className="inline-flex min-h-9 items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary-dark"
            >
              Book New Appointment
            </Link>
          </div>

          {loading ? (
            <div className="mt-6 flex h-32 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
              <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Loading your records...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-10 text-center">
              <div className="clay-inset flex h-14 w-14 items-center justify-center rounded-full text-primary mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <h4 className="font-display text-lg font-bold text-foreground">No appointments found</h4>
              <p className="mt-1 text-sm text-muted max-w-sm">You haven&apos;t scheduled any dental appointments yet. Click above to reserve your first slot.</p>
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
                    {appointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-white/50 transition">
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {appt.doctorName || "General Clinician"}
                        </td>
                        <td className="px-6 py-4 text-muted">
                          {new Date(appt.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-muted">{appt.timeSlot || "Not specified"}</td>
                        <td className="px-6 py-4 text-muted truncate max-w-xs">{appt.reason || "Routine Checkup"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              appt.status === "confirmed"
                                ? "bg-success/10 text-success"
                                : appt.status === "cancelled"
                                ? "bg-error/10 text-error"
                                : appt.status === "completed"
                                ? "bg-primary/10 text-primary"
                                : "bg-gold/10 text-gold"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
