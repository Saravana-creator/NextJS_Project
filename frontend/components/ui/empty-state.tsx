import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: string;
}) {
  return (
    <div className="soft-card rounded-lg p-8 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Ready for content
      </p>
      <h2 className="mt-3 font-display text-2xl font-bold text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
        {description}
      </p>
      {action ? (
        <Button className="mt-6" href="/contact" variant="secondary">
          {action}
        </Button>
      ) : null}
    </div>
  );
}
