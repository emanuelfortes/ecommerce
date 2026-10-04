import clsx from "clsx";
import type { ReactNode } from "react";
import { aos } from "@/lib/aos";

/** Cabeçalho das seções internas da conta */
export function AccountHeading({
  eyebrow,
  title,
  text,
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header {...aos.fadeUp()} className={clsx("mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between", className)}>
      <div className="flex flex-col gap-3">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="text-4xl leading-tight md:text-5xl">{title}</h2>
        <span className="gold-rule" />
        {text && <p className="max-w-xl text-[15px] leading-relaxed text-taupe">{text}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-3">{action}</div>}
    </header>
  );
}

/** Painel branco com borda fina */
export function Panel({ children, className, title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <section className={clsx("border border-line bg-white p-6 md:p-8", className)}>
      {(title || action) && (
        <header className="mb-6 flex items-center justify-between gap-4">
          {title && <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-graphite">{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
