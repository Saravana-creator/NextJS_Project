import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}
