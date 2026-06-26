import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5",
    variant === "primary" &&
      "bg-primary text-white shadow-lg shadow-[rgba(11,126,161,0.22)] hover:bg-primary-dark",
    variant === "secondary" &&
      "border border-border bg-white text-foreground hover:border-primary hover:text-primary",
    variant === "ghost" && "text-muted hover:bg-white hover:text-foreground",
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
