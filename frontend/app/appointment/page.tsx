"use client";

import { useState, useEffect } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/ui/section";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

type Doctor = { _id: string; name: string; role: string; specialty: string };

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export default function AppointmentPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setDoctors(result.data.doctors);
      })
      .catch(() => {/* silent — form still usable without doctors */});
  }, []);

  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    doctorName: "",
    date: "",
    timeSlot: "",
    reason: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        patientName: user.name || "",
        patientEmail: user.email || "",
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to book appointment");
      }

      setSuccess(result.data.message || "Appointment booked successfully!");
      setFormData({
        patientName: user?.name || "",
        patientEmail: user?.email || "",
        patientPhone: "",
        doctorName: "",
        date: "",
        timeSlot: "",
        reason: "",
      });
      router.push("/dashboard/appointments?success=true");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Section
        eyebrow="Online Booking"
        title="Schedule Your Visit"
        description="Fill out the form below to request a dental appointment. Our reception team will reach out shortly to confirm your slot."
      >
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Booking Form */}
          <div>
            {success && (
              <div className="mb-6 rounded-xl border border-success/30 bg-success/10 p-5 text-sm font-semibold text-success flex items-center gap-3">
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                  <p className="font-bold text-foreground text-base">Booking Confirmed</p>
                  <p className="text-muted mt-1">{success}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl border border-error/30 bg-error/10 p-5 text-sm font-semibold text-error flex items-center gap-3 animate-pulse">
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="soft-card grid gap-5 rounded-2xl p-8 border border-white/60">
              <h3 className="font-display text-lg font-bold text-foreground">Patient & Appointment Details</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="patientName" className="text-xs font-bold uppercase tracking-wider text-muted">Full Name</label>
                  <input
                    id="patientName"
                    name="patientName"
                    required
                    value={formData.patientName}
                    onChange={handleChange}
                    readOnly={!!user}
                    className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none read-only:bg-slate-100 read-only:cursor-not-allowed read-only:text-slate-500"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="patientPhone" className="text-xs font-bold uppercase tracking-wider text-muted">Phone Number</label>
                  <input
                    id="patientPhone"
                    name="patientPhone"
                    type="tel"
                    required
                    value={formData.patientPhone}
                    onChange={handleChange}
                    className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none"
                    placeholder="e.g. 9876543210"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="patientEmail" className="text-xs font-bold uppercase tracking-wider text-muted">Email Address</label>
                  <input
                    id="patientEmail"
                    name="patientEmail"
                    type="email"
                    required
                    value={formData.patientEmail}
                    onChange={handleChange}
                    readOnly={!!user}
                    className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none read-only:bg-slate-100 read-only:cursor-not-allowed read-only:text-slate-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="doctorName" className="text-xs font-bold uppercase tracking-wider text-muted">Select Doctor</label>
                  <select
                    id="doctorName"
                    name="doctorName"
                    required
                    value={formData.doctorName}
                    onChange={handleChange}
                    className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none"
                  >
                    <option value="" disabled>Choose a specialist...</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc.name}>
                        {doc.name} — {doc.specialty || doc.role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-muted">Appointment Date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="timeSlot" className="text-xs font-bold uppercase tracking-wider text-muted">Time Slot</label>
                  <select
                    id="timeSlot"
                    name="timeSlot"
                    required
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none"
                  >
                    <option value="" disabled>Choose a preferred time...</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reason" className="text-xs font-bold uppercase tracking-wider text-muted">Reason for Visit</label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  value={formData.reason}
                  onChange={handleChange}
                  className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none resize-none"
                  placeholder="Describe your symptoms or treatment interest (e.g. routine checkup, orthodontic consultation...)"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 min-h-12 w-full rounded-lg bg-primary hover:bg-primary-dark font-bold text-white transition-all text-sm shadow-md disabled:bg-primary/50 disabled:cursor-not-allowed"
              >
                {loading ? "Scheduling Appointment..." : "Confirm & Request Appointment"}
              </button>
            </form>
          </div>

          {/* Guidelines/Info Panel */}
          <div className="flex flex-col gap-6">
            <div className="glass rounded-2xl p-6 border border-white/60">
              <h4 className="font-display text-base font-bold text-foreground">Booking Guidelines</h4>
              <ul className="mt-4 flex flex-col gap-3.5 text-sm text-muted">
                <li className="flex gap-2.5">
                  <svg className="h-5 w-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>We request bookings be made at least <strong>24 hours</strong> in advance.</span>
                </li>
                <li className="flex gap-2.5">
                  <svg className="h-5 w-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  <span>Your medical data is protected under HIPAA compliance.</span>
                </li>
                <li className="flex gap-2.5">
                  <svg className="h-5 w-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                  <span>Cancellations or modifications must be made <strong>12 hours</strong> prior.</span>
                </li>
              </ul>
            </div>
            <div className="soft-card rounded-2xl p-6">
              <h4 className="font-display text-base font-bold text-foreground">Need Urgent Care?</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                If you have an emergency like acute pain, a broken tooth, or swelling, please call our emergency hotline directly:
              </p>
              <p className="mt-4 text-lg font-black text-primary flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>+91 98765 43210</span>
              </p>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
