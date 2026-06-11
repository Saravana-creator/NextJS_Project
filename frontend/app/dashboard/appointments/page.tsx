import { DashboardPage } from "@/components/layout/dashboard-page";

export default function DashboardAppointmentsPage() {
  return (
    <DashboardPage
      mode="patient"
      eyebrow="Patient portal"
      title="Appointments"
      description="History, upcoming visits, and statuses are ready for patient appointment data."
    />
  );
}
