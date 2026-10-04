import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { stores } from "@/lib/data";
import { aos } from "@/lib/aos";
import { PageHeader } from "@/components/ui/Primitives";
import { SocialIcon } from "@/components/shared/Brand";
import { ContactForm } from "@/components/content/ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Karen Michelly por WhatsApp, e-mail ou telefone. Atendimento de segunda a sábado.",
};

const channels = [
  {
    key: "whatsapp",
    title: "WhatsApp",
    value: "(11) 99999-9999",
    text: "Resposta em minutos, de segunda a sábado.",
    href: "https://wa.me/5511999999999",
  },
  {
    key: "email",
    title: "E-mail",
    value: "atendimento@karenmichelly.com.br",
    text: "Resposta em até 1 dia útil.",
    href: "mailto:atendimento@karenmichelly.com.br",
  },
  {
    key: "phone",
    title: "Telefone",
    value: "(11) 3000-0000",
    text: "Seg a Sex, das 9h às 18h.",
    href: "tel:+551130000000",
  },
] as const;

/** Tela 79: Contato */
export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Atendimento"
        title="Fale conosco"
        text="Estamos aqui para ajudar com pedidos, tamanhos, trocas ou uma dica de estilo. Escolha o canal que preferir."
        crumbs={[{ label: "Contato" }]}
      />

      {/* Canais */}
      <section className="border-b border-line bg-white">
        <div className="container-km grid gap-px bg-line md:grid-cols-3">
          {channels.map((c, i) => (
            <a
              key={c.key}
              href={c.href}
              target={c.key === "whatsapp" ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex items-start gap-5 bg-white px-2 py-10 transition-colors hover:bg-offwhite md:px-8"
              {...aos.fadeUp(i * 80)}
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-champagne text-ink transition-colors group-hover:border-gold group-hover:text-gold">
                {c.key === "whatsapp" ? (
                  <SocialIcon name="whatsapp" className="size-5" />
                ) : c.key === "email" ? (
                  <Mail className="size-5" strokeWidth={1.2} />
                ) : (
                  <Phone className="size-5" strokeWidth={1.2} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="eyebrow">{c.title}</p>
                <p className="mt-2 break-words font-serif text-2xl text-ink">{c.value}</p>
                <p className="mt-1 text-sm text-taupe">{c.text}</p>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-taupe transition-colors group-hover:text-gold" strokeWidth={1.3} />
            </a>
          ))}
        </div>
      </section>

      {/* Formulário + lojas */}
      <section className="bg-offwhite py-20 md:py-28">
        <div className="container-km grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7" {...aos.fadeUp()}>
            <span className="eyebrow">Envie uma mensagem</span>
            <h2 className="mt-3 text-4xl md:text-5xl">Como podemos ajudar?</h2>
            <span className="gold-rule mb-10 mt-5" />
            <ContactForm />
            <p className="mt-8 text-sm text-taupe">
              Procurando uma resposta rápida? Veja a nossa{" "}
              <Link href="/faq" className="text-ink underline decoration-gold underline-offset-4">
                central de ajuda
              </Link>
              .
            </p>
          </div>

          <aside className="flex flex-col gap-6 lg:col-span-5" {...aos.fadeUp(120)}>
            <div>
              <span className="eyebrow">Lojas físicas</span>
              <h2 className="mt-3 text-4xl">Visite-nos</h2>
              <span className="gold-rule mt-5" />
            </div>
            {stores.map((s) => (
              <div key={s.name} className="border border-line bg-white p-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{s.city}</p>
                <p className="mt-1 font-serif text-2xl text-ink">{s.name}</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-graphite">
                  <MapPin className="size-4 text-taupe" strokeWidth={1.3} /> {s.address}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-graphite">
                  <Clock className="size-4 text-taupe" strokeWidth={1.3} /> {s.hours} · Dom, 14h às 20h
                </p>
              </div>
            ))}

            {/* Mapa (placeholder) */}
            <div className="relative aspect-[4/3] overflow-hidden border border-line bg-nude" role="img" aria-label="Mapa com a localização das lojas">
              <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" aria-hidden>
                <rect width="400" height="300" fill="#EFE5DD" />
                {[40, 95, 150, 205, 260].map((y) => (
                  <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y + 12} stroke="#F7F4EF" strokeWidth="9" />
                ))}
                {[60, 140, 230, 320].map((x) => (
                  <line key={`v${x}`} x1={x} y1="0" x2={x - 18} y2="300" stroke="#F7F4EF" strokeWidth="7" />
                ))}
                <path d="M0 220 Q120 180 210 205 T400 170" stroke="#D8C3A5" strokeWidth="14" fill="none" />
                <rect x="250" y="40" width="70" height="50" fill="#E3D3C3" />
                <rect x="80" y="110" width="45" height="35" fill="#E3D3C3" />
              </svg>
              <span className="absolute left-[58%] top-[38%] grid -translate-x-1/2 -translate-y-full place-items-center">
                <span className="grid size-10 place-items-center rounded-full bg-ink text-gold shadow-xl">
                  <MapPin className="size-4" strokeWidth={1.5} />
                </span>
                <span className="mt-2 whitespace-nowrap bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-ink shadow">
                  Atelier Jardins
                </span>
              </span>
              <span className="absolute bottom-3 right-3 bg-white/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-taupe">
                Mapa ilustrativo
              </span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
