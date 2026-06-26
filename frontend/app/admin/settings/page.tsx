"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function AdminSettingsPage() {
  const [clinicName, setClinicName] = useState("Dent-Ist Dental Care");
  const [email, setEmail] = useState("support@dentist.com");
  const [phone, setPhone] = useState("(555) 019-2834");
  const [hours, setHours] = useState("Mon - Fri: 9:00 AM - 6:00 PM");
  
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  }

  return (
    <DashboardShell mode="admin">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">System Config</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Clinic Settings</h1>
        <p className="mt-2 text-sm text-muted">
          Configure operations, operating hours, active channels, and notification alerts.
        </p>

        {success && (
          <div className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 border border-emerald-200">
            ✓ Settings updated successfully. Changes are now live.
          </div>
        )}

        <form onSubmit={handleSave} className="mt-8 max-w-2xl rounded-2xl border border-border/40 bg-white/70 p-8 shadow-sm">
          <h3 className="font-display font-bold text-foreground text-lg mb-6">General Clinic Information</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Clinic Name</label>
              <input
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="rounded-lg border border-border/60 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-border/60 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Support Hotline</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-border/60 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Operational Hours</label>
              <input
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="rounded-lg border border-border/60 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <h3 className="font-display font-bold text-foreground text-lg mb-4 mt-8 border-t border-border/30 pt-6">Notifications &amp; Workflows</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="emailNotif"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-0.5"
              />
              <div>
                <label htmlFor="emailNotif" className="text-sm font-semibold text-foreground cursor-pointer">
                  Email Alerts
                </label>
                <p className="text-xs text-muted">Send dispatch alerts and script logs to patients via email.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="smsNotif"
                checked={smsNotif}
                onChange={(e) => setSmsNotif(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-0.5"
              />
              <div>
                <label htmlFor="smsNotif" className="text-sm font-semibold text-foreground cursor-pointer">
                  SMS / Mobile Alerts
                </label>
                <p className="text-xs text-muted">Send automated visit reminders and bill invoices notifications to mobile phones.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="autoConfirm"
                checked={autoConfirm}
                onChange={(e) => setAutoConfirm(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-0.5"
              />
              <div>
                <label htmlFor="autoConfirm" className="text-sm font-semibold text-foreground cursor-pointer">
                  Auto-Confirm Booking
                </label>
                <p className="text-xs text-muted">Instantly confirm general checkups if they match doctor availability ranges.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border/30 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="min-h-11 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition disabled:opacity-60"
            >
              {saving ? "Saving Changes…" : "Save Settings"}
            </button>
          </div>
        </form>
      </section>
    </DashboardShell>
  );
}
