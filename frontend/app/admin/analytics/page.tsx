"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";

export default function AdminAnalyticsPage() {
  const popularServices = [
    { name: "Teeth Cleaning & Scaling", count: 184, share: "34%" },
    { name: "Root Canal Therapy", count: 98, share: "18%" },
    { name: "Invisalign Clear Aligners", count: 72, share: "13%" },
    { name: "Cosmetic Teeth Whitening", count: 65, share: "12%" },
    { name: "Dental Implants Surgery", count: 54, share: "10%" },
  ];

  return (
    <DashboardShell mode="admin">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Performance Logs</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Clinic Analytics</h1>
        <p className="mt-2 text-sm text-muted">
          Monitor operational scheduling, patient intake efficiency, service breakdown ratios, and billing throughput.
        </p>

        {/* Top metrics row */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Monthly Intake" value="342" note="+14.2% from last month" />
          <StatCard label="Average Rating" value="4.89/5" note="Based on 210 testimonials" />
          <StatCard label="Appointment Completion" value="94.5%" note="Only 2.1% cancellation rate" />
          <StatCard label="Gross Revenue (June)" value="₹4,82,500" note="+8.9% target growth rate" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Revenue chart SVG */}
          <div className="lg:col-span-2 rounded-2xl border border-border/40 bg-white/70 p-6 shadow-sm">
            <h3 className="font-display font-bold text-foreground text-lg">Weekly Operations Throughput</h3>
            <p className="text-xs text-muted mt-0.5">Number of checked-in patient sessions per week</p>

            <div className="mt-6 flex h-64 items-end gap-3 px-2">
              {[
                { label: "Wk 21", value: 45 },
                { label: "Wk 22", value: 60 },
                { label: "Wk 23", value: 52 },
                { label: "Wk 24", value: 75 },
                { label: "Wk 25", value: 90 },
                { label: "Wk 26", value: 110 },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="text-[10px] font-bold text-primary">{bar.value}</div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/80 to-primary transition-all hover:opacity-80"
                    style={{ height: `${(bar.value / 120) * 100}%` }}
                  />
                  <div className="text-[10px] font-bold text-muted mt-1">{bar.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular services checklist */}
          <div className="rounded-2xl border border-border/40 bg-white/70 p-6 shadow-sm">
            <h3 className="font-display font-bold text-foreground text-lg">Top Clinical Services</h3>
            <p className="text-xs text-muted mt-0.5">Breakdown by bookings share ratio</p>

            <div className="mt-6 space-y-4">
              {popularServices.map((service, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-foreground">
                    <span className="truncate pr-2">{service.name}</span>
                    <span className="text-primary font-bold">{service.count} ({service.share})</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: service.share }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
