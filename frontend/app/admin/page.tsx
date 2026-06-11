import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { doctors } from "@/data/doctors";

export default function AdminDashboardPage() {
  return (
    <DashboardShell mode="admin">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
          Admin command center
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold">
          Hospital operations
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          SaaS dashboard routes are scaffolded. Only doctor records are seeded.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Patients" value="0" note="Awaiting data" />
          <StatCard label="Doctors" value={String(doctors.length)} note="Seeded now" />
          <StatCard label="Appointments" value="0" note="Awaiting data" />
          <StatCard label="Revenue" value="0" note="Awaiting data" />
        </div>
        <div className="mt-8">
          <EmptyState
            title="Admin activity feed is ready"
            description="Growth statistics, activities, charts, and conversion data will appear after your mock data is added."
          />
        </div>
      </section>
    </DashboardShell>
  );
}
