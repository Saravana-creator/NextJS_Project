import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

export default async function DoctorDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await api.doctors.getBySlug(slug);

  if (!doctor) {
    notFound();
  }

  return (
    <PageShell>
      <Section
        eyebrow={doctor.specialty}
        title={doctor.name}
        description={doctor.bio}
      >
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] mt-10">
          <div className="soft-card rounded-2xl p-8 border border-white/60">
            <div className="clay-inset flex h-24 w-24 items-center justify-center rounded-2xl text-3xl font-extrabold text-primary">
              {(doctor.name
                .replace(/^Dr\.\s+/i, "")
                .split(" ")
                .slice(0, 2)
                .map((part: string) => part[0])
                .join("")
                .toUpperCase()) || "DR"}
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground">{doctor.role}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{doctor.credentials}</p>
            <Button className="mt-6 w-full" href="/appointment">
              Book Appointment
            </Button>
          </div>
          <div className="glass rounded-2xl p-8 border border-white/60">
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-muted">Experience</dt>
                <dd className="mt-1.5 text-base font-bold text-foreground">{doctor.experience}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-muted">Availability</dt>
                <dd className="mt-1.5 text-base font-bold text-foreground">{doctor.availability}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-bold uppercase tracking-wider text-muted">Languages Spoken</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {doctor.languages.map((language: string) => (
                    <span
                      className="rounded-lg border border-border/40 bg-teal-light px-3 py-1 text-xs font-bold text-primary"
                      key={language}
                    >
                      {language}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
