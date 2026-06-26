"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type MedicineItem = {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
};

type Prescription = {
  _id: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  medicines: MedicineItem[];
  notes?: string;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  completed: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-red-50 text-red-600 border-red-100",
};

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyPrescriptions() {
      try {
        const res = await fetch("/api/prescriptions");
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            setPrescriptions(result.data.prescriptions);
          }
        }
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      } finally {
        setLoading(false);
      }
    }
    void fetchMyPrescriptions();
  }, []);

  return (
    <DashboardShell mode="patient">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Patient Portal</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">My Prescriptions</h1>
        <p className="mt-2 text-sm text-muted">
          Access active and past medication plans prescribed by your Dent-Ist specialists.
        </p>

        {loading ? (
          <div className="mt-10 flex h-48 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Fetching scripts log…
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-12 text-center">
            <div className="clay-inset flex h-14 w-14 items-center justify-center rounded-full text-primary mb-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="font-display text-lg font-bold text-foreground">No prescriptions active</h4>
            <p className="mt-1 text-sm text-muted max-w-sm">
              Any prescriptions generated during your clinic visits will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {prescriptions.map((item) => (
              <div
                key={item._id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/40 bg-white/70 p-6 shadow-sm transition hover:shadow-md hover:bg-white"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLES[item.status] ?? ""}`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-bold text-primary uppercase tracking-wider">Prescribing Doctor: {item.doctorName}</p>

                  {/* Medications List */}
                  <div className="mt-4 space-y-3">
                    {item.medicines?.map((med, idx) => (
                      <div key={idx} className="rounded-xl border border-border/20 bg-white/60 p-3 shadow-xs">
                        <h4 className="font-bold text-sm text-foreground">{med.medication}</h4>
                        <p className="text-xs text-primary font-semibold mt-0.5">{med.dosage}</p>
                        <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-muted border-t border-border/20 pt-1.5">
                          <div>
                            <span className="font-semibold text-muted-dark">Frequency:</span> {med.frequency}
                          </div>
                          <div>
                            <span className="font-semibold text-muted-dark">Duration:</span> {med.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {item.notes && (
                    <div className="mt-4 rounded-lg bg-teal-light/30 p-3 text-xs text-muted">
                      <p className="font-bold text-primary mb-1">Clinical Notes:</p>
                      <p className="italic">"{item.notes}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
