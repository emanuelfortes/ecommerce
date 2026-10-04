import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export function Field({
  label,
  error,
  hint,
  className,
  ...props
}: ComponentProps<"input"> & { label?: string; error?: string; hint?: ReactNode }) {
  return (
    <label className={clsx("block", className)}>
      {label && <span className="field-label">{label}</span>}
      <input className={clsx("field", error && "field-error")} {...props} />
      {error ? (
        <span className="mt-1.5 block text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-taupe">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextArea({ label, className, ...props }: ComponentProps<"textarea"> & { label?: string }) {
  return (
    <label className={clsx("block", className)}>
      {label && <span className="field-label">{label}</span>}
      <textarea className="field min-h-32 resize-y" {...props} />
    </label>
  );
}

export function Select({
  label,
  options,
  className,
  ...props
}: ComponentProps<"select"> & { label?: string; options: { value: string; label: string }[] }) {
  return (
    <label className={clsx("block", className)}>
      {label && <span className="field-label">{label}</span>}
      <span className="relative block">
        <select className="field appearance-none pr-10" {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-taupe" strokeWidth={1.2} />
      </span>
    </label>
  );
}

export function Checkbox({ label, className, ...props }: ComponentProps<"input"> & { label: ReactNode }) {
  return (
    <label className={clsx("flex cursor-pointer items-start gap-3 text-sm text-graphite", className)}>
      <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-ink" {...props} />
      <span>{label}</span>
    </label>
  );
}

/** Cartão selecionável (frete, endereço, pagamento) */
export function RadioCard({
  checked,
  onChange,
  name,
  children,
  className,
}: {
  checked: boolean;
  onChange: () => void;
  name: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={clsx(
        "flex cursor-pointer items-start gap-4 border bg-white p-5 transition-colors",
        checked ? "border-ink" : "border-line hover:border-champagne",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
        className
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={clsx(
          "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
          checked ? "border-ink" : "border-taupe/60"
        )}
      >
        {checked && <span className="size-2 rounded-full bg-ink" />}
      </span>
      <div className="flex-1">{children}</div>
    </label>
  );
}

export function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label?: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx("relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60", checked ? "bg-ink" : "bg-line")}
    >
      <span
        className={clsx(
          "absolute top-1 size-4 rounded-full transition-all duration-300",
          checked ? "left-6 bg-gold" : "left-1 bg-white"
        )}
      />
    </button>
  );
}
