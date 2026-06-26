"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/providers/auth-provider";

type Appointment = {
  _id: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  date: string;
  reason: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

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
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  completed: "bg-primary/10 text-primary border border-primary/20",
  cancelled: "bg-red-50 text-red-600 border border-red-200/50",
};

export default function DoctorPrescriptionsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Modal Form State
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    { medication: "", dosage: "", frequency: "", duration: "" }
  ]);
  const [notes, setNotes] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    try {
      await Promise.all([fetchPrescriptions(), fetchAppointments()]);
    } catch (err) {
      console.error("Error loading prescription view data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPrescriptions() {
    const res = await fetch("/api/prescriptions");
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        setPrescriptions(result.data.prescriptions);
      }
    }
  }

  async function fetchAppointments() {
    const res = await fetch("/api/appointments");
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        // Only get active/pending/confirmed appointments to display in selector
        const activeAppts = result.data.appointments.filter(
          (appt: Appointment) => appt.status === "pending" || appt.status === "confirmed"
        );
        setAppointments(activeAppts);
      }
    }
  }

  // Handle appointment selection in dropdown
  function handleAppointmentChange(apptId: string) {
    setSelectedAppointmentId(apptId);
    if (!apptId) {
      setPatientName("");
      setPatientEmail("");
      return;
    }
    const appt = appointments.find((a) => a._id === apptId);
    if (appt) {
      setPatientName(appt.patientName);
      setPatientEmail(appt.patientEmail);
    }
  }

  // Medicines List Modifiers
  function addMedicine() {
    setMedicines((prev) => [
      ...prev,
      { medication: "", dosage: "", frequency: "", duration: "" }
    ]);
  }

  function removeMedicine(index: number) {
    if (medicines.length === 1) return;
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  }

  function handleMedicineChange(index: number, field: keyof MedicineItem, value: string) {
    setMedicines((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );
  }

  async function handleCreatePrescription() {
    if (!patientName || !patientEmail) {
      setError("Patient details are required.");
      return;
    }

    // Filter empty entries
    const validMedicines = medicines.filter(
      (m) => m.medication && m.dosage && m.frequency && m.duration
    );
    if (validMedicines.length === 0) {
      setError("Please add at least one complete medicine entry.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          patientEmail,
          medicines: validMedicines,
          notes,
          appointmentId: selectedAppointmentId || undefined,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.error ?? "Failed to create prescription");
        return;
      }
      setShowModal(false);
      resetForm();
      await loadInitialData();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setSelectedAppointmentId("");
    setPatientName("");
    setPatientEmail("");
    setMedicines([{ medication: "", dosage: "", frequency: "", duration: "" }]);
    setNotes("");
    setError(null);
  }

  async function handleUpdateStatus(id: string, status: "completed" | "cancelled") {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/prescriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setPrescriptions((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status } : p)),
        );
      } else {
        const result = await res.json();
        alert(result.error ?? "Failed to update prescription status");
      }
    } catch {
      alert("Network error.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this prescription?")) return;
    try {
      const res = await fetch(`/api/prescriptions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPrescriptions((prev) => prev.filter((p) => p._id !== id));
      } else {
        const result = await res.json();
        alert(result.error ?? "Failed to delete prescription");
      }
    } catch {
      alert("Network error.");
    }
  }

  const filtered = prescriptions.filter((p) => {
    const q = search.toLowerCase();
    const matchesMedication = p.medicines?.some((m) =>
      m.medication.toLowerCase().includes(q)
    );
    return (
      !q ||
      p.patientName.toLowerCase().includes(q) ||
      p.patientEmail.toLowerCase().includes(q) ||
      p.doctorName.toLowerCase().includes(q) ||
      matchesMedication
    );
  });

  return (
    <DashboardShell mode="admin">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Patient Care</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Prescriptions</h1>
        <p className="mt-2 text-sm text-muted">
          {isDoctor
            ? "Create and manage prescriptions written for your patients. Select from scheduled appointments to auto-complete bookings."
            : "Review clinic prescriptions log."}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="min-h-11 w-full rounded-lg border border-border/60 bg-white/60 px-4 py-2 text-sm focus:border-primary focus:outline-none sm:max-w-xs"
            placeholder="Search patient, medication or doctor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {isDoctor && (
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark transition"
            >
              + Add Prescription
            </button>
          )}
        </div>

        {loading ? (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading prescriptions…
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-10 text-center">
            <p className="font-display text-lg font-bold text-foreground">No prescriptions found</p>
            <p className="mt-1 text-sm text-muted">Get started by creating a new prescription.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-teal-light/50 font-bold text-foreground">
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Medications</th>
                    <th className="px-6 py-4">Prescribed By</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filtered.map((item) => (
                    <tr key={item._id} className="hover:bg-white/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{item.patientName}</p>
                        <p className="text-xs text-muted">{item.patientEmail}</p>
                        <p className="text-[10px] text-muted-dark mt-1">
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {item.medicines?.map((med, idx) => (
                            <div key={idx} className="rounded-lg bg-white/40 p-2 text-xs border border-border/20">
                              <p className="font-bold text-foreground">{med.medication}</p>
                              <p className="text-muted mt-0.5">
                                {med.dosage} — {med.frequency} ({med.duration})
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-muted">{item.doctorName}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLES[item.status] ?? ""}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {updatingId === item._id ? (
                            <span className="text-xs text-muted italic">Updating…</span>
                          ) : (
                            <>
                              {item.status === "active" && isDoctor && (
                                <>
                                  <button
                                    onClick={() => void handleUpdateStatus(item._id, "completed")}
                                    className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                                  >
                                    Mark Completed
                                  </button>
                                  <button
                                    onClick={() => void handleUpdateStatus(item._id, "cancelled")}
                                    className="rounded bg-red-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-600 transition"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {(isAdmin || (isDoctor && item.doctorName === user?.name)) && (
                                <button
                                  onClick={() => void handleDelete(item._id)}
                                  className="rounded border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                                >
                                  Delete
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Dynamic Slide-in Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-8">
            <h2 className="font-display text-xl font-extrabold text-foreground">Add New Prescription</h2>
            
            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200">
                {error}
              </p>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* Linked Appointment Select Dropdown */}
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Link to Patient Appointment</label>
                <select
                  value={selectedAppointmentId}
                  onChange={(e) => handleAppointmentChange(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">-- Write Custom Patient Details --</option>
                  {appointments.map((appt) => (
                    <option key={appt._id} value={appt._id}>
                      {appt.patientName} - {appt.reason} ({new Date(appt.date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Patient Name</label>
                <input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="e.g. John Doe"
                  disabled={!!selectedAppointmentId}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Patient Email</label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="e.g. john@example.com"
                  disabled={!!selectedAppointmentId}
                  required
                />
              </div>

              {/* Dynamic Medications List */}
              <div className="col-span-2 border-t border-border/30 pt-4 mt-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Medications List</h3>
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="text-xs bg-teal-light text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg font-bold transition"
                  >
                    + Add Medication
                  </button>
                </div>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {medicines.map((med, index) => (
                    <div key={index} className="p-4 rounded-xl border border-border/40 bg-slate-50/50 relative">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Medication</label>
                          <input
                            value={med.medication}
                            onChange={(e) => handleMedicineChange(index, "medication", e.target.value)}
                            className="rounded-lg border border-border/60 bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                            placeholder="e.g. Amoxicillin"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Dosage</label>
                          <input
                            value={med.dosage}
                            onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                            className="rounded-lg border border-border/60 bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                            placeholder="e.g. 500mg"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Frequency</label>
                          <input
                            value={med.frequency}
                            onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)}
                            className="rounded-lg border border-border/60 bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                            placeholder="e.g. Twice a day"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Duration</label>
                          <input
                            value={med.duration}
                            onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                            className="rounded-lg border border-border/60 bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                            placeholder="e.g. 7 days"
                            required
                          />
                        </div>
                      </div>

                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-semibold text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2 flex flex-col gap-1 border-t border-border/30 pt-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
                  placeholder="Additional directions for patient care..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-semibold text-muted hover:border-primary hover:text-primary transition"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleCreatePrescription()}
                disabled={saving}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition disabled:opacity-60"
              >
                {saving ? "Saving…" : "Add Prescription"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
