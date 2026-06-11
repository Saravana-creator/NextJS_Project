import { DoctorCard } from "@/components/healthcare/doctor-card";
import { PageShell } from "@/components/layout/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { doctors } from "@/data/doctors";

export default function Home() {
  return (
    <PageShell>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="reveal">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Premium dental hospital platform
          </p>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-tight text-foreground sm:text-6xl">
            Dent-Ist
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            A commercial-ready dental care experience for patients, specialists,
            and hospital teams. Built now with clean frontend boundaries for
            backend integration later.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/appointment">Book appointment</Button>
            <Button href="/admin" variant="secondary">
              Admin preview
            </Button>
          </div>
        </div>
        <div className="glass slide-up rounded-lg p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Seeded doctors" value={String(doctors.length)} note="Only mock dataset included" />
            <StatCard label="Backend mode" value="Ready" note="API service boundary" />
            <StatCard label="Routes" value="40+" note="Website, auth, portals" />
            <StatCard label="Data policy" value="Empty" note="Awaiting your content" />
          </div>
        </div>
      </section>

      <section className="bg-sage/45">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Meet specialists
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">
              Doctor mock data is included
            </h2>
            <p className="mt-3 text-muted">
              Every other content module is intentionally empty until you provide
              the final mock data and images.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
        <EmptyState
          title="Services, testimonials, gallery, pricing, blogs, and analytics are ready for your data"
          description="The UI structure exists without invented records, keeping the next content pass clean and deliberate."
          action="Share content"
        />
      </section>
    </PageShell>
  );
}
