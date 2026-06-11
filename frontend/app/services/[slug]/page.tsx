import { GenericPage } from "@/components/layout/generic-page";

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <GenericPage
      eyebrow="Service detail"
      title={slug.split("-").join(" ")}
      description="This dynamic service route is ready for real treatment content, pricing, FAQs, and images."
    />
  );
}
