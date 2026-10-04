"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ShieldCheck, Truck, RefreshCcw, CreditCard } from "lucide-react";
import { Logo, SocialIcon, socialLinks } from "@/components/shared/Brand";
import { useUI } from "@/components/providers/UIProvider";
import { footerNav, legalNav } from "./navigation";
import { aos } from "@/lib/aos";

/** Newsletter: fundo preto, título branco, texto champagne, input off-white, botão dourado. */
export function Newsletter() {
  const { toast } = useUI();
  const [email, setEmail] = useState("");
  return (
    <section className="bg-ink text-white">
      <div className="container-km grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
        <div {...aos.fadeUp()}>
          <span className="eyebrow text-champagne/70">Lista Karen Michelly</span>
          <h2 className="mt-3 text-4xl leading-tight text-white md:text-5xl">
            Receba lançamentos <em className="text-champagne">em primeira mão</em>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-champagne">
            Inscreva-se e ganhe 10% de desconto na primeira compra, além de convites para pré-vendas exclusivas.
          </p>
        </div>
        <form
          {...aos.fadeUp(120)}
          onSubmit={(e) => {
            e.preventDefault();
            if (!/\S+@\S+\.\S+/.test(email)) {
              toast("E-mail inválido", { message: "Confira o endereço digitado.", variant: "error" });
              return;
            }
            toast("Inscrição confirmada", { message: "Seu cupom BEMVINDA10 foi enviado por e-mail." });
            setEmail("");
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label className="sr-only" htmlFor="newsletter-email">E-mail</label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            className="h-14 flex-1 bg-offwhite px-5 text-sm text-graphite placeholder:text-taupe focus:outline-none"
          />
          <button className="flex h-14 items-center justify-center gap-2 bg-gold px-8 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white">
            Quero 10% off <ArrowRight className="size-4" strokeWidth={1.3} />
          </button>
        </form>
      </div>
    </section>
  );
}

const perks = [
  { icon: Truck, title: "Frete grátis", text: "Acima de R$ 399" },
  { icon: RefreshCcw, title: "Troca fácil", text: "Primeira troca grátis" },
  { icon: CreditCard, title: "6x sem juros", text: "Ou 5% off no PIX" },
  { icon: ShieldCheck, title: "Compra segura", text: "Dados protegidos" },
];

export function Perks() {
  return (
    <section className="border-y border-line bg-white">
      <div className="container-km grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {perks.map(({ icon: Icon, title, text }, i) => (
          <div key={title} {...aos.fadeUp(i * 80)} className="flex items-center gap-4">
            <Icon className="size-6 shrink-0 text-gold" strokeWidth={1} />
            <div>
              <p className="text-[12px] uppercase tracking-[0.18em] text-ink">{title}</p>
              <p className="text-xs text-taupe">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Footer: fundo preto, títulos brancos, texto taupe, links off-white, hover dourado. */
export function Footer() {
  const { open } = useUI();
  return (
    <footer className="bg-ink text-taupe">
      <div className="container-km border-t border-white/10 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="dark" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed">
              Moda feminina contemporânea com alma de ateliê. Peças pensadas para mulheres que vestem a própria
              história com elegância.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center border border-white/15 text-offwhite transition-colors hover:border-gold hover:text-gold"
                >
                  <SocialIcon name={s.name} className="size-4" />
                </a>
              ))}
            </div>
          </div>
          {footerNav.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="mb-5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-white">{col.title}</h3>
              <ul className="flex flex-col gap-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-offwhite/85 transition-colors hover:text-gold">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-2">
            <h3 className="mb-5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-white">Atendimento</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>Seg a Sex, 9h às 18h</li>
              <li>
                <a href="https://wa.me/5511999999999" className="text-offwhite/85 hover:text-gold">
                  WhatsApp (11) 99999-9999
                </a>
              </li>
              <li>
                <a href="mailto:atendimento@karenmichelly.com.br" className="break-all text-offwhite/85 hover:text-gold">
                  atendimento@karenmichelly.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {["Visa", "Master", "Elo", "Amex", "PIX", "Boleto"].map((m) => (
              <span key={m} className="border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-offwhite/70">
                {m}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            {legalNav.map((l) => (
              <Link key={l.href} href={l.href} className="text-offwhite/85 hover:text-gold">
                {l.label}
              </Link>
            ))}
            <button onClick={() => open({ type: "locale" })} className="text-offwhite/85 hover:text-gold">
              Idioma e moeda
            </button>
          </div>
        </div>
        <p className="mt-8 text-[11px] leading-relaxed text-taupe/80">
          © {new Date().getFullYear()} Karen Michelly Woman Wear. Todos os direitos reservados. CNPJ 00.000.000/0001-00.
        </p>
      </div>
    </footer>
  );
}
