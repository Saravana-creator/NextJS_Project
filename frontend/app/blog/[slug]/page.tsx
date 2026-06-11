import { GenericPage } from "@/components/layout/generic-page";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <GenericPage
      eyebrow="Article"
      title={slug.split("-").join(" ")}
      description="This blog detail route is prepared for real article content, author details, and structured data."
    />
  );
}
