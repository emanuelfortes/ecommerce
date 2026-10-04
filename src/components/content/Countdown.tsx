"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    ms,
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

/** Contagem regressiva (tela 94). Renderiza "--" no servidor para evitar divergência de hidratação. */
export function Countdown({ to, dark, className }: { to: string; dark?: boolean; className?: string }) {
  const target = new Date(to).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = window.setInterval(() => setT(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (t && t.ms === 0) {
    return (
      <p className={clsx("font-serif text-3xl", dark ? "text-champagne" : "text-ink", className)} role="status">
        Esta campanha foi encerrada.
      </p>
    );
  }

  const units: [string, number | undefined][] = [
    ["dias", t?.days],
    ["horas", t?.hours],
    ["min", t?.minutes],
    ["seg", t?.seconds],
  ];

  return (
    <div className={clsx("flex items-stretch gap-2 sm:gap-3", className)} role="timer" aria-label="Tempo restante da campanha">
      {units.map(([label, v], i) => (
        <div key={label} className="flex items-stretch gap-2 sm:gap-3">
          <div
            className={clsx(
              "flex w-16 flex-col items-center justify-center border py-3 sm:w-20 sm:py-4",
              dark ? "border-white/15 bg-white/5" : "border-line bg-white"
            )}
          >
            <span className={clsx("font-serif text-4xl tabular-nums leading-none sm:text-5xl", dark ? "text-white" : "text-ink")}>
              {v === undefined ? "--" : String(v).padStart(2, "0")}
            </span>
            <span className={clsx("mt-2 text-[9px] uppercase tracking-[0.24em]", dark ? "text-champagne/70" : "text-taupe")}>{label}</span>
          </div>
          {i < units.length - 1 && <span className="self-center font-serif text-2xl text-gold" aria-hidden>:</span>}
        </div>
      ))}
    </div>
  );
}
