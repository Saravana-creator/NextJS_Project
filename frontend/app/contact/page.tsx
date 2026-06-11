import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/ui/section";

export default function ContactPage() {
  return (
    <PageShell>
      <Section
        eyebrow="Contact"
        title="Talk to Dent-Ist"
        description="A clean contact surface is ready for messages, clinic details, maps, and CRM integration."
      >
        <form className="soft-card grid max-w-3xl gap-4 rounded-lg p-6">
          <input className="rounded-lg border border-border px-4 py-3" placeholder="Full name" />
          <input className="rounded-lg border border-border px-4 py-3" placeholder="Email address" type="email" />
          <textarea className="min-h-32 rounded-lg border border-border px-4 py-3" placeholder="Message" />
          <button className="min-h-11 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white">
            Send message
          </button>
        </form>
      </Section>
    </PageShell>
  );
}
