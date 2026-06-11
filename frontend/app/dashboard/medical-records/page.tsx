import { DashboardPage } from "@/components/layout/dashboard-page";

export default function MedicalRecordsPage() {
  return (
    <DashboardPage
      mode="patient"
      eyebrow="Patient portal"
      title="Medical records"
      description="Treatment timelines, reports, and clinical notes are prepared for real records."
    />
  );
}
