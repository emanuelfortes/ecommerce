"use client";

import { useState } from "react";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { useUI } from "@/components/providers/UIProvider";
import { aos } from "@/lib/aos";

/**
 * Captura de e-mail compacta para blog, manutenção e landings.
 * tone "nude": fundo de destaque; tone "ink": sobre fundo preto.
 */
export function NewsletterCallout({
  eyebrow = "Journal por e-mail",
  title = "Receba as edições do journal",
  text = "Um e-mail por semana com tendências, bastidores e dicas de styling. Sem excessos, como tudo o que fazemos.",
  cta = "Assinar",
  success = "Você receberá a próxima edição do journal.",
  tone = "nude",
  compact,
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
  cta?: string;
  success?: string;
  tone?: "nude" | "ink";
  compact?: boolean;
}) {
  const { toast } = useUI();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const dark = tone === "ink";

  const form = (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(email)) {
          setError("Informe um e-mail válido.");
          return;
        }
        setError("");
        setEmail("");
        toast("Inscrição confirmada", { message: success });
      }}
      className="w-full"
    >
      <div className={clsx("flex flex-col gap-3 sm:flex-row", dark && "sm:gap-0")}>
        <label className="sr-only" htmlFor={`nl-${tone}`}>
          E-mail
        </label>
        <input
          id={`nl-${tone}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu melhor e-mail"
          aria-invalid={!!error}
          className={clsx(
            "h-14 flex-1 px-5 text-sm focus:outline-none",
            dark
              ? "border border-white/20 bg-transparent text-white placeholder:text-champagne/60 focus:border-gold"
              : "border border-line bg-white text-graphite placeholder:text-taupe focus:border-ink"
          )}
        />
        <button className={clsx("h-14 px-8", dark ? "btn-gold" : "btn-primary")}>
          {cta} <ArrowRight className="size-4" strokeWidth={1.3} />
        </button>
      </div>
      {error && <p className={clsx("mt-2 text-xs", dark ? "text-[#e08a7e]" : "text-danger")}>{error}</p>}
    </form>
  );

  if (compact) return form;

  return (
    <div className={clsx("grid items-center gap-8 p-8 md:grid-cols-2 md:p-12", dark ? "bg-ink text-white" : "bg-nude")} {...aos.fadeUp()}>
      <div>
        <span className={clsx("eyebrow", dark ? "text-champagne/70" : "text-gold")}>{eyebrow}</span>
        <h2 className={clsx("mt-3 text-4xl leading-tight", dark && "text-white")}>{title}</h2>
        <span className="gold-rule mt-5" />
        <p className={clsx("mt-5 max-w-md text-[15px] leading-relaxed", dark ? "text-champagne" : "text-graphite")}>{text}</p>
      </div>
      {form}
    </div>
  );
}
