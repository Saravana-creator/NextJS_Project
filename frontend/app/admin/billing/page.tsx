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
  status: string;
};

type Invoice = {
  _id: string;
  patientName: string;
  patientEmail: string;
  invoiceNumber: string;
  amount: number;
  status: "paid" | "unpaid" | "pending";
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  unpaid: "bg-red-50 text-red-600 border border-red-200/50",
  pending: "bg-amber-50 text-amber-700 border border-amber-200/50",
};

export default function AdminBillingPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Modal Form State
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"paid" | "unpaid" | "pending">("unpaid");

  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    try {
      await Promise.all([fetchInvoices(), fetchAppointments()]);
    } catch (err) {
      console.error("Error loading billing data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchInvoices() {
    const res = await fetch("/api/billing");
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        setInvoices(result.data.bills);
      }
    }
  }

  async function fetchAppointments() {
    const res = await fetch("/api/appointments");
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        setAppointments(result.data.appointments);
      }
    }
  }

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

  async function handleCreateInvoice() {
    if (!patientName || !patientEmail || !amount || !dueDate) {
      setError("Please fill out all required fields.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          patientEmail,
          amount: Number(amount),
          dueDate,
          appointmentId: selectedAppointmentId || null,
          status,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.error ?? "Failed to create invoice");
        return;
      }
      setShowModal(false);
      resetForm();
      await fetchInvoices();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setSelectedAppointmentId("");
    setPatientName("");
    setPatientEmail("");
    setAmount("");
    setDueDate("");
    setStatus("unpaid");
    setError(null);
  }

  async function handleMarkPaid(id: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/billing/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "paid",
          paymentMethod: "Cash / Card at Clinic",
          paidAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setInvoices((prev) =>
          prev.map((inv) => (inv._id === id ? { ...inv, status: "paid" } : inv))
        );
      } else {
        const result = await res.json();
        alert(result.error ?? "Failed to update invoice status");
      }
    } catch {
      alert("Network error.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteInvoice(id: string) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/billing/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      } else {
        const result = await res.json();
        alert(result.error ?? "Failed to delete invoice");
      }
    } catch {
      alert("Network error.");
    }
  }

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    return (
      !q ||
      inv.patientName.toLowerCase().includes(q) ||
      inv.patientEmail.toLowerCase().includes(q) ||
      inv.invoiceNumber.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardShell mode="admin">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Financial Operations</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Billing &amp; Invoices</h1>
        <p className="mt-2 text-sm text-muted">
          Manage clinic financial ledger statements. Issue new invoices, update transaction states, and track patient payments.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="min-h-11 w-full rounded-lg border border-border/60 bg-white/60 px-4 py-2 text-sm focus:border-primary focus:outline-none sm:max-w-xs"
            placeholder="Search patient, email, or invoice number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark transition"
          >
            + Create Invoice
          </button>
        </div>

        {loading ? (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading ledger log…
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-10 text-center">
            <p className="font-display text-lg font-bold text-foreground">No invoices generated</p>
            <p className="mt-1 text-sm text-muted">Create your first patient invoice to get started.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-teal-light/50 font-bold text-foreground">
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Patient details</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filtered.map((item) => (
                    <tr key={item._id} className="hover:bg-white/50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-primary">{item.invoiceNumber}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{item.patientName}</p>
                        <p className="text-xs text-muted">{item.patientEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {new Date(item.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground text-base">
                        ₹{item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLES[item.status] ?? ""}`}>
                          {item.status}
                        </span>
                        {item.status === "paid" && item.paymentMethod && (
                          <p className="text-[10px] text-muted-dark mt-0.5">{item.paymentMethod}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {updatingId === item._id ? (
                            <span className="text-xs text-muted italic">Updating…</span>
                          ) : (
                            <>
                              {item.status !== "paid" && (
                                <button
                                  onClick={() => void handleMarkPaid(item._id)}
                                  className="rounded bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark transition"
                                >
                                  Mark Paid
                                </button>
                              )}
                              {isAdmin && (
                                <button
                                  onClick={() => void handleDeleteInvoice(item._id)}
                                  className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <h2 className="font-display text-xl font-extrabold text-foreground">Create Patient Invoice</h2>
            
            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200">
                {error}
              </p>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Amount (₹ INR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="e.g. 5000.00"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Invoice Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="rounded-lg border border-border/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="unpaid">Unpaid / Open</option>
                  <option value="pending">Pending Review</option>
                  <option value="paid">Pre-paid / Closed</option>
                </select>
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
                onClick={() => void handleCreateInvoice()}
                disabled={saving}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition disabled:opacity-60"
              >
                {saving ? "Creating…" : "Create Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
