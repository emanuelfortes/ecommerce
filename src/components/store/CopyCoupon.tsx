"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Copy } from "lucide-react";
import { useUI } from "@/components/providers/UIProvider";

/** Botão de copiar código de cupom. */
export function CopyCoupon({ code, disabled }: { code: string; disabled?: boolean }) {
  const { toast } = useUI();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* sem permissão de área de transferência: segue com o aviso */
    }
    setCopied(true);
    toast("Cupom copiado", { message: `Use ${code} na sua sacola.` });
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      disabled={disabled}
      aria-label={`Copiar cupom ${code}`}
      className={clsx(
        "flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        copied ? "text-gold" : "text-ink hover:text-gold"
      )}
    >
      {copied ? <Check className="size-4" strokeWidth={1.4} /> : <Copy className="size-4" strokeWidth={1.3} />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
