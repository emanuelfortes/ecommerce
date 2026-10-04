"use client";

import { useState } from "react";
import { Check, Copy, Ticket } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";

/** Cupom em destaque com ações de copiar e aplicar na sacola (tela 94). */
export function CouponHighlight({ code, title, text, expires }: { code: string; title: string; text: string; expires?: string }) {
  const { applyCoupon } = useStore();
  const { toast } = useUI();
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative grid gap-8 border border-gold/60 bg-ink p-8 text-white md:grid-cols-[auto_1fr_auto] md:items-center md:p-10">
      {/* recortes de "ticket" */}
      <span className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-offwhite" aria-hidden />
      <span className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-offwhite" aria-hidden />

      <Ticket className="hidden size-10 text-gold md:block" strokeWidth={1} />
      <div>
        <p className="eyebrow text-champagne/70">Cupom exclusivo</p>
        <p className="mt-2 font-serif text-5xl leading-none text-white">{title}</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-champagne">{text}</p>
        {expires && <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-taupe">Válido até {expires}</p>}
      </div>
      <div className="flex flex-col items-stretch gap-3 md:w-60">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
            } catch {
              /* sem permissão: segue exibindo o código */
            }
            setCopied(true);
            toast("Cupom copiado", { message: `Use ${code} no carrinho.`, variant: "info" });
            window.setTimeout(() => setCopied(false), 2500);
          }}
          className="flex h-14 items-center justify-between gap-3 border border-dashed border-gold px-5 transition-colors hover:bg-white/5"
          aria-label={`Copiar cupom ${code}`}
        >
          <span className="font-sans text-lg font-medium tracking-[0.24em] text-gold">{code}</span>
          {copied ? <Check className="size-4 text-gold" strokeWidth={1.5} /> : <Copy className="size-4 text-champagne" strokeWidth={1.3} />}
        </button>
        <button
          type="button"
          className="btn-gold"
          onClick={() => {
            const r = applyCoupon(code);
            toast(r.ok ? "Cupom aplicado" : "Cupom guardado para depois", {
              message: r.ok ? r.message : `${r.message} Adicione mais peças à sacola.`,
              variant: r.ok ? "success" : "info",
            });
          }}
        >
          Aplicar na sacola
        </button>
      </div>
    </div>
  );
}
