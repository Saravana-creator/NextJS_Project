import { DoctorCard } from "@/components/healthcare/doctor-card";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/ui/section";
import { doctors } from "@/data/doctors";

export const metadata = {
  title: "Doctors",
  description: "Meet Dent-Ist dental specialists.",
};

export default function DoctorsPage() {
  return (
    <PageShell>
      <Section
        eyebrow="Clinical team"
        title="Dent-Ist specialists"
        description="This is the only seeded mock dataset for the first build."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
