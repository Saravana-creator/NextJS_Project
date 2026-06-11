import { DashboardShell } from "@/components/layout/dashboard-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";

export function DashboardPage({
  mode,
  eyebrow,
  title,
  description,
}: {
  mode: "patient" | "admin";
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <DashboardShell mode={mode}>
      <Section eyebrow={eyebrow} title={title} description={description}>
        <EmptyState
          title="No records have been seeded yet"
          description="This page is connected to the dashboard shell and ready for real data or your next mock-data pass."
        />
      </Section>
    </DashboardShell>
  );
}
