export function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-lg leading-8 text-muted">{description}</p>
        ) : null}
      </div>
      {children ? <div className="mt-10">{children}</div> : null}
    </section>
  );
}
