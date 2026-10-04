"use client";

import { useState, type FormEvent } from "react";
import { Truck, Loader2 } from "lucide-react";
import { shippingOptions } from "@/lib/data";
import { useStore } from "@/components/providers/StoreProvider";

const FREE_FROM = 399;
const mask = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

/** Cálculo de frete por CEP na página de produto. */
export function ShippingCalc({ price }: { price: number }) {
  const { cep, setCep, money } = useStore();
  const [value, setValue] = useState(cep);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.replace(/\D/g, "").length !== 8) {
      setError("Informe um CEP válido com 8 dígitos.");
      setDone(false);
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setCep(value);
      setLoading(false);
      setDone(true);
    }, 600);
  };

  const free = price >= FREE_FROM;

  return (
    <div className="border border-line bg-white p-5">
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink">
        <Truck className="size-4 text-gold" strokeWidth={1.2} /> Calcular frete e prazo
      </p>
      <form onSubmit={submit} className="mt-4 flex gap-2">
        <label className="sr-only" htmlFor="pdp-cep">
          CEP
        </label>
        <input
          id="pdp-cep"
          inputMode="numeric"
          placeholder="00000-000"
          value={mask(value)}
          onChange={(e) => setValue(e.target.value)}
          className="field flex-1 py-3"
        />
        <button type="submit" className="btn-secondary btn-sm" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" strokeWidth={1.3} /> : "Calcular"}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <a
        href="https://buscacepinter.correios.com.br"
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-xs text-taupe underline underline-offset-4 hover:text-ink"
      >
        Não sei meu CEP
      </a>
      {done && !error && (
        <ul className="mt-4 divide-y divide-line border-t border-line text-sm" aria-live="polite">
          {shippingOptions.map((o) => {
            const isFree = o.price === 0 || (free && o.id === "economico");
            return (
              <li key={o.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-ink">{o.name}</p>
                  <p className="text-xs text-taupe">
                    {o.carrier} · {o.days}
                  </p>
                </div>
                <span className={isFree ? "text-[11px] uppercase tracking-[0.18em] text-gold" : "tabular-nums text-ink"}>
                  {isFree ? "Grátis" : money(o.price)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
