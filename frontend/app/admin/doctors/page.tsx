import { DashboardShell } from "@/components/layout/dashboard-shell";
import { doctors } from "@/data/doctors";

export default function AdminDoctorsPage() {
  return (
    <DashboardShell mode="admin">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
          Management
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold">
          Doctors
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Search, filters, add, edit, and delete surfaces are represented without
          backend writes.
        </p>
        <div className="mt-8 soft-card rounded-lg p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              className="min-h-11 rounded-lg border border-border px-4 py-2"
              placeholder="Search doctors"
            />
            <button className="min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white">
              Add doctor
            </button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.15em] text-muted">
                <tr>
                  <th className="border-b border-border py-3">Doctor</th>
                  <th className="border-b border-border py-3">Specialty</th>
                  <th className="border-b border-border py-3">Experience</th>
                  <th className="border-b border-border py-3">Availability</th>
                  <th className="border-b border-border py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="border-b border-border py-4 font-semibold">
                      {doctor.name}
                    </td>
                    <td className="border-b border-border py-4 text-muted">
                      {doctor.specialty}
                    </td>
                    <td className="border-b border-border py-4">
                      {doctor.experience}
                    </td>
                    <td className="border-b border-border py-4">
                      {doctor.availability}
                    </td>
                    <td className="border-b border-border py-4">
                      <div className="flex gap-2">
                        <button className="rounded-lg border border-border px-3 py-2 font-semibold">
                          Edit
                        </button>
                        <button className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
