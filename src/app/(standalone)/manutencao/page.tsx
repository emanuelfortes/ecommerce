import type { Metadata } from "next";
import { Clock, Mail } from "lucide-react";
import { SocialIcon, socialLinks } from "@/components/shared/Brand";
import { NewsletterCallout } from "@/components/content/NewsletterCallout";
import { aos } from "@/lib/aos";

export const metadata: Metadata = {
  title: "Em manutenção",
  description: "Estamos preparando novidades. A loja Karen Michelly volta em breve.",
  robots: { index: false, follow: false },
};

/** Tela 110: Manutenção (fora do grupo da loja: sem header e footer). */
export default function MaintenancePage() {
  return (
    <main id="conteudo" className="relative flex min-h-screen flex-col overflow-hidden bg-ink text-white">
      <span className="pointer-events-none absolute left-1/2 top-1/2 size-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" aria-hidden />
      <span className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10" aria-hidden />

      <div className="container-km relative flex flex-1 flex-col items-center justify-center py-16 text-center">
        <div {...aos.zoomIn()}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/karen-michelly-logo.webp"
            alt="Karen Michelly Woman Wear"
            className="mx-auto w-64 md:w-80"
          />
        </div>

        <div className="mt-6 flex max-w-xl flex-col items-center" {...aos.fadeUp(100)}>
          <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-champagne/70">
            <span className="h-px w-8 bg-gold" /> Em manutenção <span className="h-px w-8 bg-gold" />
          </span>
          <h1 className="mt-6 text-5xl font-light leading-[1.02] text-white md:text-6xl">
            Estamos ajustando <em className="text-gold">cada detalhe</em>
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-champagne">
            Nossa loja online está passando por melhorias para receber a nova coleção. Enquanto isso, as lojas físicas de
            São Paulo e do Rio de Janeiro seguem abertas.
          </p>

          <div className="mt-10 flex items-center gap-4 border border-white/15 px-6 py-4">
            <Clock className="size-5 text-gold" strokeWidth={1.2} />
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.24em] text-taupe">Previsão de retorno</p>
              <p className="font-serif text-2xl text-white">Hoje, às 14h</p>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full max-w-lg" {...aos.fadeUp(180)}>
          <p className="mb-4 text-sm text-champagne">Quer ser avisada assim que voltarmos? Deixe o seu e-mail.</p>
          <NewsletterCallout tone="ink" compact cta="Avise-me" success="Avisaremos você assim que a loja voltar ao ar." />
        </div>

        <div className="mt-14 flex flex-col items-center gap-5" {...aos.fadeUp(240)}>
          <div className="flex gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid size-11 place-items-center rounded-full border border-white/15 text-offwhite transition-colors hover:border-gold hover:text-gold"
              >
                <SocialIcon name={s.name} className="size-4" />
              </a>
            ))}
          </div>
          <a href="mailto:atendimento@karenmichelly.com.br" className="flex items-center gap-2 text-sm text-champagne hover:text-gold">
            <Mail className="size-4" strokeWidth={1.3} /> atendimento@karenmichelly.com.br
          </a>
        </div>
      </div>

      <p className="relative pb-8 text-center text-[11px] uppercase tracking-[0.2em] text-taupe">
        © {new Date().getFullYear()} Karen Michelly Woman Wear
      </p>
    </main>
  );
}
