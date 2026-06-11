import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";

export function GenericPage({
  eyebrow,
  title,
  description,
  emptyTitle = "Content will be added after data is provided",
}: {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle?: string;
}) {
  return (
    <PageShell>
      <Section eyebrow={eyebrow} title={title} description={description}>
        <EmptyState
          title={emptyTitle}
          description="This route is wired with production-ready layout, spacing, accessibility, and future data boundaries. No placeholder records are seeded yet."
        />
      </Section>
    </PageShell>
  );
}
