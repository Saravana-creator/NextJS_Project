import { DashboardPage } from "@/components/layout/dashboard-page";

export default function DashboardPrescriptionsPage() {
  return (
    <DashboardPage
      mode="patient"
      eyebrow="Patient portal"
      title="Prescriptions"
      description="Prescription cards and refill-ready structure can be populated later."
    />
  );
}
