import { DashboardPage } from "@/components/layout/dashboard-page";

export default function ProfilePage() {
  return (
    <DashboardPage
      mode="patient"
      eyebrow="Patient portal"
      title="Profile"
      description="Personal information, emergency contact, and preferences can be added later."
    />
  );
}
