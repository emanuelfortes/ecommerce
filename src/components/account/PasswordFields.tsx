"use client";

import clsx from "clsx";
import { useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { Field } from "@/components/ui/Form";

export function PasswordInput({
  label,
  value,
  onChange,
  error,
  hint,
  autoComplete = "new-password",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Field
        label={label}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        hint={hint}
        autoComplete={autoComplete}
        className="[&_input]:pr-12"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        className="absolute right-3 top-[34px] grid size-9 place-items-center text-taupe hover:text-ink"
      >
        {show ? <EyeOff className="size-4" strokeWidth={1.3} /> : <Eye className="size-4" strokeWidth={1.3} />}
      </button>
    </div>
  );
}

export const passwordRules = [
  { id: "len", label: "Mínimo de 8 caracteres", test: (v: string) => v.length >= 8 },
  { id: "upper", label: "Uma letra maiúscula", test: (v: string) => /[A-Z]/.test(v) },
  { id: "num", label: "Um número", test: (v: string) => /\d/.test(v) },
  { id: "sym", label: "Um símbolo (!@#$...)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function passwordScore(v: string) {
  if (!v) return 0;
  return passwordRules.filter((r) => r.test(v)).length;
}

const levels = ["", "Fraca", "Razoável", "Boa", "Forte"];

/** Medidor de força da senha com checklist de requisitos */
export function StrengthMeter({ value }: { value: string }) {
  const score = passwordScore(value);
  return (
    <div aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={clsx(
              "h-[3px] flex-1 transition-colors duration-500",
              i > score ? "bg-line" : score <= 1 ? "bg-danger" : score === 2 ? "bg-warning" : score === 3 ? "bg-champagne" : "bg-gold"
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-taupe">
        Força da senha: <span className="text-ink">{value ? levels[score] || "Fraca" : "Não informada"}</span>
      </p>
      <ul className="mt-3 grid gap-1.5 text-xs sm:grid-cols-2">
        {passwordRules.map((r) => {
          const ok = r.test(value);
          return (
            <li key={r.id} className={clsx("flex items-center gap-2", ok ? "text-ink" : "text-taupe")}>
              <span className={clsx("grid size-4 place-items-center rounded-full border", ok ? "border-ink bg-ink text-gold" : "border-line")}>
                {ok && <Check className="size-2.5" strokeWidth={2} />}
              </span>
              {r.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
