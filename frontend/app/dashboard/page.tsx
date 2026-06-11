import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/ui/empty-state";

export default function PatientDashboardPage() {
  return (
    <DashboardShell mode="patient">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
          Patient portal
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold">
          Dashboard overview
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Patient modules are structured and waiting for your mock data.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Appointments" value="0" note="Awaiting data" />
          <StatCard label="Prescriptions" value="0" note="Awaiting data" />
          <StatCard label="Records" value="0" note="Awaiting data" />
          <StatCard label="Notifications" value="0" note="Awaiting data" />
        </div>
        <div className="mt-8">
          <EmptyState
            title="Patient activity will appear here"
            description="Upcoming appointments, prescriptions, medical summaries, and notifications are intentionally empty."
          />
        </div>
      </section>
    </DashboardShell>
  );
}
