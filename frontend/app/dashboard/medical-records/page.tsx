"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";

type RecordItem = {
  id: string;
  date: string;
  treatment: string;
  doctorName: string;
  clinic: string;
  summary: string;
  status: string;
  attachment?: string;
};

const SEEDED_RECORDS: RecordItem[] = [
  {
    id: "rec-001",
    date: "2026-06-10",
    treatment: "General Teeth Scaling & Prophylaxis",
    doctorName: "Dr. Ananya Rao",
    clinic: "City Care Clinic",
    summary: "Gingival health looks excellent, minor subgingival tartar scaling performed. Polished with fluoride paste. Patient advised to floss daily.",
    status: "Finalized",
    attachment: "scaling_report_june2026.pdf",
  },
  {
    id: "rec-002",
    date: "2026-05-22",
    treatment: "Dental Restorative Composite Filling",
    doctorName: "Dr. Vikram Menon",
    clinic: "City Care Clinic",
    summary: "Class II distal composite filling performed on upper left premolar (Tooth #14). High occlusion spots filed. Cavity cleared completely.",
    status: "Finalized",
    attachment: "premolar_restoration.pdf",
  },
  {
    id: "rec-003",
    date: "2026-05-22",
    treatment: "Panoramic X-Ray Digital Scans",
    doctorName: "Dr. Vikram Menon",
    clinic: "City Care Clinic",
    summary: "Panoramic jaw radiography compiled. Normal bone densities, erupting third molars (wisdom teeth) have sufficient space, no immediate impaction risks.",
    status: "Finalized",
    attachment: "panoramic_xray_522.jpg",
  },
];

export default function PatientMedicalRecordsPage() {
  return (
    <DashboardShell mode="patient">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Patient Portal</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Medical Records</h1>
        <p className="mt-2 text-sm text-muted">
          Access your digital health chart logs, treatment summaries, radiological scans, and doctor check-out sheets.
        </p>

        {/* Timeline style records */}
        <div className="mt-10 relative border-l-2 border-primary/20 pl-6 ml-4 space-y-8">
          {SEEDED_RECORDS.map((rec) => (
            <div key={rec.id} className="relative">
              {/* Marker pin */}
              <span className="absolute -left-[33px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary border-4 border-white shadow-xs" />

              <div className="group rounded-2xl border border-border/40 bg-white/70 p-6 shadow-sm transition hover:shadow-md hover:bg-white max-w-3xl">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs font-bold text-primary">
                      {new Date(rec.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                      {rec.treatment}
                    </h3>
                  </div>
                  <span className="self-start rounded bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 sm:self-center">
                    {rec.status}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted font-medium">
                  {rec.summary}
                </p>

                <div className="mt-4 border-t border-border/30 pt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[11px] text-muted-dark">
                  <div>
                    <span className="font-semibold text-muted">Attending Specialist:</span> {rec.doctorName}
                  </div>
                  {rec.attachment && (
                    <button
                      onClick={() => alert(`Downloading ${rec.attachment}...`)}
                      className="flex items-center gap-1 font-bold text-primary hover:text-primary-dark transition mt-1 sm:mt-0"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {rec.attachment}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
