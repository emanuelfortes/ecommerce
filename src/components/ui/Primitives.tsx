import Link from "next/link";
import clsx from "clsx";
import { ChevronRight, Star } from "lucide-react";
import type { ReactNode } from "react";
import { aos } from "@/lib/aos";

/* ---------- SectionHeading: sobretítulo + título serifado + fio dourado ---------- */
export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
  action,
  dark,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "center" | "left";
  action?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      {...aos.fadeUp()}
      className={clsx(
        "mb-10 flex flex-col gap-4 md:mb-14",
        align === "center" ? "items-center text-center" : "items-start md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={clsx("flex flex-col gap-3", align === "center" && "items-center")}>
        {eyebrow && <span className={clsx("eyebrow", dark && "text-champagne")}>{eyebrow}</span>}
        <h2 className={clsx("text-4xl leading-[1.05] md:text-5xl", dark ? "text-white" : "text-ink")}>{title}</h2>
        <span className="gold-rule" />
        {text && (
          <p className={clsx("max-w-xl text-[15px] leading-relaxed", dark ? "text-champagne" : "text-taupe")}>{text}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ---------- Breadcrumbs ---------- */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Você está aqui" className="mb-6 text-[11px] uppercase tracking-[0.18em] text-taupe">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-ink">
            Início
          </Link>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="size-3" strokeWidth={1.2} />
            {it.href ? (
              <Link href={it.href} className="hover:text-ink">
                {it.label}
              </Link>
            ) : (
              <span className="text-graphite">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- PageHeader: cabeçalho das páginas internas ---------- */
export function PageHeader({
  eyebrow,
  title,
  text,
  crumbs,
  tone = "offwhite",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  tone?: "offwhite" | "nude" | "ink";
  children?: ReactNode;
}) {
  const dark = tone === "ink";
  return (
    <section
      className={clsx(
        "border-b",
        tone === "offwhite" && "border-line bg-offwhite",
        tone === "nude" && "border-champagne/40 bg-nude",
        dark && "border-ink bg-ink"
      )}
    >
      <div className="container-km py-10 md:py-16">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div {...aos.fadeUp()} className="flex flex-col gap-3">
          {eyebrow && <span className={clsx("eyebrow", dark && "text-champagne")}>{eyebrow}</span>}
          <h1 className={clsx("text-4xl leading-tight md:text-6xl", dark && "text-white")}>{title}</h1>
          <span className="gold-rule mt-1" />
          {text && <p className={clsx("max-w-2xl text-[15px] leading-relaxed", dark ? "text-champagne" : "text-taupe")}>{text}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

/* ---------- Rating ---------- */
export function Rating({ value, count, size = "sm" }: { value: number; count?: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "size-3" : "size-4";
  return (
    <div className="flex items-center gap-1.5" aria-label={`Nota ${value} de 5`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={clsx(s, i <= Math.round(value) ? "fill-gold text-gold" : "fill-transparent text-champagne")}
            strokeWidth={1.2}
          />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-taupe">({count})</span>}
    </div>
  );
}

/* ---------- Badge ---------- */
export function Badge({
  children,
  tone = "ink",
  className,
}: {
  children: ReactNode;
  tone?: "ink" | "gold" | "nude" | "white" | "success" | "danger" | "warning";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
        tone === "ink" && "bg-ink text-white",
        tone === "gold" && "bg-gold text-ink",
        tone === "nude" && "bg-nude text-graphite",
        tone === "white" && "bg-white text-ink",
        tone === "success" && "bg-success/10 text-success",
        tone === "danger" && "bg-danger/10 text-danger",
        tone === "warning" && "bg-warning/15 text-warning",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Ornamento: fio + losango dourado ---------- */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center justify-center gap-3", className)} aria-hidden>
      <span className="h-px w-16 bg-gold/70" />
      <span className="size-1.5 rotate-45 bg-gold" />
      <span className="h-px w-16 bg-gold/70" />
    </div>
  );
}

/* ---------- Skeleton ---------- */
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton", className)} />;
}

/* ---------- Status pill para pedidos ---------- */
export const orderStatusLabel: Record<string, { label: string; tone: "ink" | "gold" | "nude" | "success" | "danger" | "warning" }> = {
  aguardando: { label: "Aguardando pagamento", tone: "warning" },
  aprovado: { label: "Pagamento aprovado", tone: "success" },
  preparacao: { label: "Em preparação", tone: "nude" },
  enviado: { label: "Enviado", tone: "gold" },
  transporte: { label: "Em transporte", tone: "gold" },
  entregue: { label: "Entregue", tone: "success" },
  atrasado: { label: "Atrasado", tone: "danger" },
  cancelado: { label: "Cancelado", tone: "danger" },
};
