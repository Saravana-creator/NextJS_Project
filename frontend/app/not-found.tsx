import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageShell>
      <Section
        eyebrow="404"
        title="Page not found"
        description="The route does not exist or the content has not been connected yet."
      >
        <Button href="/">Return home</Button>
      </Section>
    </PageShell>
  );
}
