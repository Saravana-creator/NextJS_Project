"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/providers/auth-provider";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? "Failed to save profile.");
      } else {
        setSaved(true);
        setEditing(false);
        // Refresh auth context so header/sidebar reflects new name
        if (typeof refresh === "function") await refresh();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell mode="patient">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Patient Portal</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">My Profile</h1>
        <p className="mt-2 text-sm text-muted">Your personal details and account information.</p>

        {saved && (
          <div className="mt-4 rounded-xl border border-emerald-200/60 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
            ✓ Profile updated successfully.
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200/60 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 max-w-xl">
          <div className="soft-card rounded-2xl border border-white/60 p-8">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="clay-inset flex h-16 w-16 items-center justify-center rounded-full bg-teal-light text-2xl font-extrabold text-primary">
                {(user?.name?.[0] ?? "?").toUpperCase()}
              </div>
              <div>
                <p className="font-display text-xl font-extrabold text-foreground">{user?.name}</p>
                <p className="text-sm text-muted capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              {/* Name field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Full Name</label>
                {editing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="rounded-lg border border-border/60 bg-white/60 px-4 py-3 text-sm focus:border-primary focus:outline-none disabled:opacity-60"
                  />
                ) : (
                  <p className="rounded-lg border border-border/30 bg-white/40 px-4 py-3 text-sm text-foreground">
                    {user?.name}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Email Address</label>
                <p className="rounded-lg border border-border/30 bg-slate-50 px-4 py-3 text-sm text-slate-500 cursor-not-allowed">
                  {user?.email}
                </p>
                <p className="text-xs text-muted">Email address cannot be changed.</p>
              </div>

              {/* Role (read-only) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Account Role</label>
                <p className="rounded-lg border border-border/30 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-500">
                  {user?.role}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading || name.trim().length < 2}
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition disabled:opacity-60"
                  >
                    {loading ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setName(user?.name ?? ""); setError(""); }}
                    disabled={loading}
                    className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-semibold text-muted hover:border-primary hover:text-primary transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setEditing(true); setName(user?.name ?? ""); }}
                  className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-semibold text-muted hover:border-primary hover:text-primary transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
