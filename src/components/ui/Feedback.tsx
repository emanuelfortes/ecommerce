import clsx from "clsx";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { aos } from "@/lib/aos";

/** Estado vazio / erro reutilizado em todas as telas de "nada por aqui". */
export function EmptyState({
  icon,
  code,
  title,
  text,
  actions,
  className,
  compact,
}: {
  icon?: ReactNode;
  code?: string;
  title: ReactNode;
  text?: ReactNode;
  actions?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      {...aos.zoomIn()}
      className={clsx("mx-auto flex max-w-lg flex-col items-center text-center", compact ? "py-10" : "py-20 md:py-28", className)}
    >
      {code && <span className="font-serif text-[110px] leading-none text-ink/90 md:text-[150px]">{code}</span>}
      {icon && (
        <span className="mb-6 grid size-20 place-items-center rounded-full border border-champagne text-ink [&>svg]:size-7 [&>svg]:stroke-[1.1]">
          {icon}
        </span>
      )}
      <span className="gold-rule mb-5" />
      <h2 className="text-3xl md:text-4xl">{title}</h2>
      {text && <p className="mt-3 text-[15px] leading-relaxed text-taupe">{text}</p>}
      {actions && <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}

/** Stepper horizontal (checkout) */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 md:gap-4">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex flex-1 items-center gap-2 md:gap-4 last:flex-none">
            <span className="flex items-center gap-2">
              <span
                className={clsx(
                  "grid size-7 shrink-0 place-items-center rounded-full border text-[11px]",
                  done && "border-ink bg-ink text-gold",
                  active && "border-ink text-ink",
                  !done && !active && "border-line text-taupe"
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={1.6} /> : i + 1}
              </span>
              <span
                className={clsx(
                  "hidden text-[11px] uppercase tracking-[0.18em] sm:inline",
                  active || done ? "text-ink" : "text-taupe"
                )}
              >
                {s}
              </span>
            </span>
            {i < steps.length - 1 && <span className={clsx("h-px flex-1", done ? "bg-gold" : "bg-line")} />}
          </li>
        );
      })}
    </ol>
  );
}

/** Linha do tempo vertical (rastreamento / status) */
export function Timeline({
  items,
}: {
  items: { title: string; text?: string; date?: string; state: "done" | "current" | "todo" | "error" }[];
}) {
  return (
    <ol className="relative">
      {items.map((it, i) => (
        <li key={i} className="relative flex gap-5 pb-8 last:pb-0">
          {i < items.length - 1 && (
            <span
              className={clsx("absolute left-[11px] top-7 h-[calc(100%-1.5rem)] w-px", it.state === "done" ? "bg-gold" : "bg-line")}
            />
          )}
          <span
            className={clsx(
              "relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border",
              it.state === "done" && "border-ink bg-ink text-gold",
              it.state === "current" && "border-gold bg-offwhite",
              it.state === "todo" && "border-line bg-offwhite",
              it.state === "error" && "border-danger bg-danger/10"
            )}
          >
            {it.state === "done" && <Check className="size-3" strokeWidth={2} />}
            {it.state === "current" && <span className="size-2 rounded-full bg-gold" />}
            {it.state === "error" && <span className="size-2 rounded-full bg-danger" />}
          </span>
          <div>
            <p className={clsx("text-[15px]", it.state === "todo" ? "text-taupe" : "text-ink")}>{it.title}</p>
            {it.text && <p className="mt-1 text-sm text-taupe">{it.text}</p>}
            {it.date && <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-taupe">{it.date}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Aviso inline */
export function Notice({
  tone = "info",
  title,
  children,
  icon,
}: {
  tone?: "info" | "success" | "error" | "warning";
  title?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "flex gap-3 border-l-2 p-4 text-sm",
        tone === "info" && "border-champagne bg-white text-graphite",
        tone === "success" && "border-success bg-success/5 text-graphite",
        tone === "error" && "border-danger bg-danger/5 text-graphite",
        tone === "warning" && "border-gold bg-gold/10 text-graphite"
      )}
    >
      {icon && <span className="mt-0.5 shrink-0 [&>svg]:size-4">{icon}</span>}
      <div>
        {title && <p className="font-medium text-ink">{title}</p>}
        {children && <div className={clsx(title && "mt-1", "text-graphite/80")}>{children}</div>}
      </div>
    </div>
  );
}
