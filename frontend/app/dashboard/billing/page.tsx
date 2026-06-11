import { DashboardPage } from "@/components/layout/dashboard-page";

export default function BillingPage() {
  return (
    <DashboardPage
      mode="patient"
      eyebrow="Patient portal"
      title="Billing"
      description="Bills and payment history views are ready for financial data."
    />
  );
}
