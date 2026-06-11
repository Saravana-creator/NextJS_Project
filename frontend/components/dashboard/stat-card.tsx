export function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="soft-card rounded-lg p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold text-foreground">
        {value}
      </p>
      <p className="mt-2 text-xs font-semibold text-primary">{note}</p>
    </div>
  );
}
