import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/ui/section";
import { DoctorCard } from "@/components/healthcare/doctor-card";
import { api } from "@/services/api";

export default async function AboutPage() {
  const doctorsList = await api.doctors.list();
  return (
    <PageShell>
      {/* Intro section */}
      <Section
        eyebrow="Our Story"
        title="Pioneering Modern Dental Care"
        description="Founded in 2018, Dent-Ist was born out of a desire to replace cold, scary dental visits with clinical excellence, transparent communication, and premium comfort."
      >
        <div className="grid gap-8 md:grid-cols-2 mt-10">
          <div className="glass rounded-2xl p-8 border border-white/60 flex flex-col justify-center">
            <h3 className="font-display text-xl font-bold text-foreground">Our Philosophy</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We believe a dental clinic should not feel clinical. We have designed our spaces to resemble high-end hospitality venues, reducing dental anxiety and creating a soothing environment. But beneath our premium comfort lies cutting-edge dental technology: 3D guided surgery, digital impression scanners, and zero-radiation cavity checks.
            </p>
          </div>
          <div className="soft-card rounded-2xl p-8 flex flex-col justify-center">
            <h3 className="font-display text-xl font-bold text-foreground">Accredited Standards</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Dent-Ist meets and exceeds all national dental board regulations, OSHA sanitation protocols, and HIPAA security guidelines. Every tool is triple-sterilized, and our specialists are continuously trained on state-of-the-art procedures to ensure patient safety first.
            </p>
          </div>
        </div>
      </Section>

      {/* Core Values Section */}
      <section className="bg-teal-light/40 py-20 border-y border-border/20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Values</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What Drives Dent-Ist</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="soft-card rounded-xl p-6 bg-white">
              <div className="h-10 w-10 rounded-lg bg-teal-light flex items-center justify-center text-primary font-bold text-lg mb-4">1</div>
              <h4 className="font-display text-lg font-bold text-foreground">Empathy First</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">We listen carefully to your fears, history, and goals, crafting personalized treatments that move at your own speed.</p>
            </div>
            <div className="soft-card rounded-xl p-6 bg-white">
              <div className="h-10 w-10 rounded-lg bg-teal-light flex items-center justify-center text-primary font-bold text-lg mb-4">2</div>
              <h4 className="font-display text-lg font-bold text-foreground">Absolute Clarity</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">No surprise billing. We display transparent estimates, explain procedural steps, and walk through x-rays with you.</p>
            </div>
            <div className="soft-card rounded-xl p-6 bg-white">
              <div className="h-10 w-10 rounded-lg bg-teal-light flex items-center justify-center text-primary font-bold text-lg mb-4">3</div>
              <h4 className="font-display text-lg font-bold text-foreground">Tech-Driven Progress</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">We invest in digital diagnostic tooling to provide higher accuracy, less invasiveness, and faster recovery times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <Section
        eyebrow="Our Specialists"
        title="Meet the Clinicians"
        description="Our board-certified dentists bring specialized experience from top dental institutions to deliver exceptional care."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {doctorsList.map((doctor: any) => (
            <DoctorCard key={doctor._id || doctor.id} doctor={doctor} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
