import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/ui/section";

export default function AppointmentPage() {
  return (
    <PageShell>
      <Section
        eyebrow="Booking"
        title="Book an appointment"
        description="The booking UI is in place and ready to connect to availability APIs later."
      >
        <form className="soft-card grid max-w-3xl gap-4 rounded-lg p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-lg border border-border px-4 py-3" placeholder="Patient name" />
            <input className="rounded-lg border border-border px-4 py-3" placeholder="Phone number" />
            <input className="rounded-lg border border-border px-4 py-3" placeholder="Email address" type="email" />
            <select className="rounded-lg border border-border px-4 py-3" defaultValue="">
              <option value="" disabled>Select doctor</option>
              <option>Dr. Ananya Rao</option>
              <option>Dr. Vikram Menon</option>
              <option>Dr. Meera Iyer</option>
            </select>
          </div>
          <textarea className="min-h-32 rounded-lg border border-border px-4 py-3" placeholder="Reason for visit" />
          <button className="min-h-11 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white">
            Request appointment
          </button>
        </form>
      </Section>
    </PageShell>
  );
}
