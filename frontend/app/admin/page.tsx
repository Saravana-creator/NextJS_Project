"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
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

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
  completed: "bg-primary/10 text-primary",
  pending: "bg-amber-50 text-amber-700",
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [totalDoctorsCount, setTotalDoctorsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllAppointments();
    fetchTotalDoctors();
  }, []);

  async function fetchTotalDoctors() {
    try {
      const res = await fetch("/api/doctors");
      if (res.ok) {
        const result = await res.json();
        if (result.success) setTotalDoctorsCount(result.data.doctors.length);
      }
    } catch (err) {
      console.error("Error fetching doctors for count:", err);
    }
  }

  async function fetchAllAppointments() {
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
          prev.map((appt) => (appt._id === id ? { ...appt, status: newStatus } : appt)),
        );
      } else {
        const result = await res.json();
        alert(result.error ?? "Failed to update status");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const totalAppts = appointments.length;
  const pendingAppts = appointments.filter((a) => a.status === "pending").length;
  const confirmedAppts = appointments.filter((a) => a.status === "confirmed").length;
  const completedAppts = appointments.filter((a) => a.status === "completed").length;

  return (
    <DashboardShell mode="admin">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
          {isAdmin ? "Admin Command Center" : "Doctor Portal"}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">
          {isAdmin ? "Hospital Operations" : `Welcome, ${user?.name ?? "Doctor"}`}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {isAdmin
            ? "Manage clinic specialists, review incoming patient bookings, and monitor scheduling throughput."
            : "View and manage appointments that have been assigned to you."}
        </p>

        {/* Operational Stats (Admin only) */}
        {isAdmin && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Doctors" value={String(totalDoctorsCount)} note="Specialists active" />
            <StatCard label="Total Bookings" value={String(totalAppts)} note="Requested appointments" />
            <StatCard label="Pending Approval" value={String(pendingAppts)} note="Action required" />
            <StatCard label="Completed Visits" value={String(completedAppts)} note="Completed sessions" />
          </div>
        )}

        {/* Doctor stats */}
        {isDoctor && (
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <StatCard label="My Appointments" value={String(totalAppts)} note="Total assigned" />
            <StatCard label="Pending" value={String(pendingAppts)} note="Awaiting action" />
            <StatCard label="Completed" value={String(completedAppts)} note="Sessions done" />
          </div>
        )}

        {/* Appointment Table */}
        <div className="mt-10">
          <h3 className="font-display text-xl font-bold text-foreground">Incoming Patient Booking Requests</h3>

          {loading ? (
            <div className="mt-6 flex h-32 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
              <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading scheduling logs...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-10 text-center">
              <div className="clay-inset flex h-14 w-14 items-center justify-center rounded-full text-primary mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h4 className="font-display text-lg font-bold text-foreground">No bookings recorded</h4>
              <p className="mt-1 text-sm text-muted max-w-sm">No patients have requested bookings yet.</p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-teal-light/50 font-bold text-foreground">
                      <th className="px-6 py-4">Patient Details</th>
                      <th className="px-6 py-4">Specialist Assigned</th>
                      <th className="px-6 py-4">Date &amp; Slot</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {appointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-white/50 transition">
                        <td className="px-6 py-4">
                          <p className="font-bold text-foreground">{appt.patientName}</p>
                          <p className="text-xs text-muted mt-0.5">{appt.patientEmail}</p>
                          <p className="text-xs text-muted">{appt.patientPhone}</p>
                        </td>
                        <td className="px-6 py-4 text-muted font-semibold">
                          {appt.doctorName || "General Practitioner"}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-foreground">
                            {new Date(appt.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted mt-0.5">{appt.timeSlot || "Not specified"}</p>
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
                                    Mark Completed
                                  </button>
                                )}
                                {(appt.status === "cancelled" || appt.status === "completed") && (
                                  <span className="text-xs text-muted italic">No actions</span>
                                )}
                              </>
                            ) : (
                              // Doctor: read-only, no action buttons
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
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
