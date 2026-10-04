import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Truck, CreditCard, QrCode, RefreshCcw } from "lucide-react";
import { discountPercent } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { aos } from "@/lib/aos";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs, SectionHeading } from "@/components/ui/Primitives";
import { ProductGrid } from "@/components/product/ProductCard";
import { Accordion } from "@/components/ui/Interactive";
import { Countdown } from "@/components/content/Countdown";
import { CouponHighlight } from "@/components/content/CouponHighlight";
import { getPromo, promos } from "@/components/content/landings";

export function generateStaticParams() {
  return promos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPromo(slug);
  if (!p) return { title: "Promoção não encontrada" };
  return {
    title: `${p.name} · ${p.headline}`,
    description: p.intro,
    alternates: { canonical: `/promo/${p.slug}` },
  };
}

const perks = [
  { icon: Truck, text: "Frete grátis acima de R$ 399" },
  { icon: CreditCard, text: "Até 6x sem juros" },
  { icon: QrCode, text: "+5% off no PIX" },
  { icon: RefreshCcw, text: "Primeira troca grátis" },
];

/** Tela 94: Landing promocional */
export default async function PromoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const promo = getPromo(slug);
  if (!promo) notFound();
  const deals = promo.products().sort((a, b) => discountPercent(b) - discountPercent(a));
  const maxOff = Math.max(...deals.map(discountPercent));
  const ends = promo.endsAt.slice(0, 10);

  return (
    <>
      {/* Hero com contagem regressiva */}
      <section className="relative overflow-hidden bg-ink text-white">
        <span className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full border border-gold/20" aria-hidden />
        <span className="pointer-events-none absolute -right-8 -top-8 size-[260px] rounded-full border border-gold/30" aria-hidden />
        <div className="container-km relative py-10 md:py-14">
          <div className="[&_a:hover]:text-gold [&_a]:text-champagne/70 [&_span.text-graphite]:text-white">
            <Breadcrumbs items={[{ label: "Ofertas", href: "/ofertas" }, { label: promo.name }]} />
          </div>
          <div className="grid items-end gap-12 pb-10 pt-8 md:pb-16 lg:grid-cols-12">
            <div className="lg:col-span-7" {...aos.fadeUp()}>
              <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-gold">
                <span className="size-1.5 rotate-45 bg-gold" /> Só até {formatDate(ends, { day: "2-digit", month: "long" })}
              </span>
              <h1 className="mt-6 text-[56px] font-light leading-[0.92] text-white sm:text-7xl xl:text-[96px]">
                {promo.name.split(" ").slice(0, -1).join(" ")} <em className="text-gold">{promo.name.split(" ").slice(-1)}</em>
              </h1>
              <p className="mt-6 font-serif text-3xl text-champagne">{promo.headline}</p>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-champagne/80">{promo.intro}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="#ofertas" variant="gold">
                  Ver ofertas <ArrowRight className="size-4" strokeWidth={1.3} />
                </Button>
                <Button href="#regulamento" variant="light">
                  Regulamento
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5" {...aos.fadeUp(120)}>
              <p className="eyebrow mb-4 text-champagne/70">A campanha termina em</p>
              <Countdown to={promo.endsAt} dark />
              <p className="mt-6 text-sm text-champagne/70">
                Até <strong className="font-serif text-2xl font-normal text-gold">{maxOff}%</strong> off em {deals.length} peças
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <ul className="container-km grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-champagne">
                <Icon className="size-5 shrink-0 text-gold" strokeWidth={1.1} /> {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cupom */}
      <section className="bg-offwhite py-16 md:py-20">
        <div className="container-km" {...aos.zoomIn()}>
          <CouponHighlight
            code={promo.coupon.code}
            title={promo.coupon.title}
            text={promo.coupon.text}
            expires={formatDate(ends)}
          />
        </div>
      </section>

      {/* Ofertas */}
      <section id="ofertas" className="scroll-mt-28 bg-offwhite pb-20 md:pb-28">
        <div className="container-km">
          <SectionHeading
            eyebrow={`${deals.length} peças participantes`}
            title="As ofertas da semana"
            text="Ordenadas do maior para o menor desconto. Corra, o estoque é limitado."
          />
          <ProductGrid products={deals} />
        </div>
      </section>

      {/* Regulamento */}
      <section id="regulamento" className="scroll-mt-28 bg-white py-20 md:py-28">
        <div className="container-km grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4" {...aos.fadeUp()}>
            <span className="eyebrow">Transparência</span>
            <h2 className="mt-4 text-5xl leading-[1.02]">Regulamento</h2>
            <span className="gold-rule mt-6" />
            <p className="mt-6 text-[15px] leading-relaxed text-taupe">
              Leia as condições da {promo.name}. Em caso de dúvidas, nosso atendimento está à disposição.
            </p>
          </div>
          <div className="lg:col-span-8" {...aos.fadeUp(100)}>
            <ol className="flex flex-col divide-y divide-line border-y border-line">
              {promo.rules.map((r, i) => (
                <li key={i} className="flex gap-5 py-5 text-[15px] leading-relaxed text-graphite/90">
                  <span className="font-serif text-2xl leading-none text-gold">{String(i + 1).padStart(2, "0")}</span>
                  {r}
                </li>
              ))}
            </ol>
            <Accordion
              className="mt-10"
              defaultOpen={null}
              items={[
                { title: "Posso usar outro cupom junto?", content: "Não. Durante a Semana Dourada é possível usar apenas o cupom da campanha, somado aos preços promocionais." },
                { title: "As peças em promoção podem ser trocadas?", content: "Sim. A política de trocas é a mesma de sempre: até 30 dias, com a primeira troca grátis." },
                { title: "E se a peça esgotar?", content: "Ative o aviso de reposição na página do produto. Se ela voltar durante a campanha, o preço promocional é mantido." },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
