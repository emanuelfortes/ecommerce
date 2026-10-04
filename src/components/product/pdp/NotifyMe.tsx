"use client";

import { useState, type FormEvent } from "react";
import { BellRing, Check } from "lucide-react";
import { useUI } from "@/components/providers/UIProvider";
import { useStore } from "@/components/providers/StoreProvider";

/** Estado 100: produto esgotado. Formulário "Avise-me quando chegar". */
export function NotifyMe({ productName, size }: { productName: string; size?: string }) {
  const { toast } = useUI();
  const { user } = useStore();
  const [email, setEmail] = useState(user?.email ?? "");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Informe um e-mail válido.");
    setError("");
    setSent(true);
    toast("Avisaremos você", { message: `Assim que ${productName} voltar ao estoque.` });
  };

  if (sent) {
    return (
      <div className="flex items-start gap-3 border border-line bg-white p-5 text-sm">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-gold">
          <Check className="size-4" strokeWidth={1.6} />
        </span>
        <div>
          <p className="text-ink">Pronto, você está na lista.</p>
          <p className="mt-1 text-taupe">Enviaremos um e-mail para {email} assim que a peça voltar.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-line bg-white p-5" id="avise-me">
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink">
        <BellRing className="size-4 text-gold" strokeWidth={1.2} /> Avise-me quando chegar
      </p>
      <p className="mt-2 text-sm text-taupe">
        Esta peça esgotou{size ? ` no tamanho ${size}` : ""}. Deixe seu e-mail e seja a primeira a saber da reposição.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="notify-email" className="sr-only">
          E-mail
        </label>
        <input
          id="notify-email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field flex-1"
        />
        <button type="submit" className="btn-primary">
          Avise-me
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </form>
  );
}
