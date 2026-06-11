import Link from "next/link";

export function AuthPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="glass w-full max-w-md rounded-lg p-7">
        <Link className="font-display text-xl font-extrabold text-primary" href="/">
          Dent-Ist
        </Link>
        <h1 className="mt-8 font-display text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
        {children}
      </section>
    </main>
  );
}
