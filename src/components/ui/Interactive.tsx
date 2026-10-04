"use client";

import clsx from "clsx";
import { Minus, Plus, ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

/* ---------- Accordion ---------- */
export function Accordion({
  items,
  defaultOpen = 0,
  className,
}: {
  items: { title: ReactNode; content: ReactNode }[];
  defaultOpen?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className={clsx("divide-y divide-line border-y border-line", className)}>
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
            aria-expanded={open === i}
          >
            <span className="text-[15px] text-ink">{it.title}</span>
            <ChevronDown
              className={clsx("size-4 shrink-0 text-taupe transition-transform duration-500", open === i && "rotate-180 text-gold")}
              strokeWidth={1.2}
            />
          </button>
          <div
            className={clsx(
              "grid transition-[grid-template-rows] duration-500 ease-[var(--ease-luxe)]",
              open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="overflow-hidden">
              <div className="pb-6 text-[15px] leading-relaxed text-graphite/80">{it.content}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Tabs ---------- */
export function Tabs({ tabs, className }: { tabs: { label: ReactNode; content: ReactNode }[]; className?: string }) {
  const [i, setI] = useState(0);
  return (
    <div className={className}>
      <div role="tablist" className="no-scrollbar flex gap-8 overflow-x-auto border-b border-line">
        {tabs.map((t, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={i === idx}
            onClick={() => setI(idx)}
            className={clsx(
              "relative shrink-0 pb-4 text-[12px] uppercase tracking-[0.2em] transition-colors",
              i === idx ? "text-ink" : "text-taupe hover:text-ink"
            )}
          >
            {t.label}
            <span
              className={clsx(
                "absolute inset-x-0 -bottom-px h-px bg-gold transition-transform duration-500",
                i === idx ? "scale-x-100" : "scale-x-0"
              )}
            />
          </button>
        ))}
      </div>
      <div className="pt-8">{tabs[i]?.content}</div>
    </div>
  );
}

/* ---------- Quantidade ---------- */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-9" : "h-12";
  return (
    <div className={clsx("inline-flex items-center border border-line bg-white", h)}>
      <button
        aria-label="Diminuir"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="grid h-full w-9 place-items-center text-graphite hover:text-gold disabled:opacity-30"
      >
        <Minus className="size-3.5" strokeWidth={1.4} />
      </button>
      <span className="w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        aria-label="Aumentar"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="grid h-full w-9 place-items-center text-graphite hover:text-gold disabled:opacity-30"
      >
        <Plus className="size-3.5" strokeWidth={1.4} />
      </button>
    </div>
  );
}

/* ---------- Seletor de tamanho ---------- */
export function SizeSelector({
  sizes,
  value,
  onChange,
  unavailable = [],
}: {
  sizes: string[];
  value: string;
  onChange: (s: string) => void;
  unavailable?: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const off = unavailable.includes(s);
        return (
          <button
            key={s}
            disabled={off}
            onClick={() => onChange(s)}
            className={clsx(
              "relative h-11 min-w-11 border px-3 text-[13px] transition-colors",
              value === s ? "border-ink bg-ink text-white" : "border-line bg-white text-graphite hover:border-ink",
              off && "cursor-not-allowed text-taupe/50 line-through"
            )}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Seletor de cor ---------- */
export function ColorSelector({
  colors,
  value,
  onChange,
}: {
  colors: { name: string; hex: string }[];
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((c) => (
        <button
          key={c.name}
          onClick={() => onChange(c.name)}
          title={c.name}
          aria-label={c.name}
          className={clsx(
            "grid size-9 place-items-center rounded-full border transition-colors",
            value === c.name ? "border-ink" : "border-transparent hover:border-champagne"
          )}
        >
          <span className="size-6 rounded-full border border-black/10" style={{ background: c.hex }} />
        </button>
      ))}
    </div>
  );
}
