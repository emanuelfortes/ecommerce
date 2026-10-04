import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { ArrowRight, ArrowDown } from "lucide-react";
import { getProduct } from "@/lib/data";
import { aos } from "@/lib/aos";
import { Button } from "@/components/ui/Button";
import { Ornament, SectionHeading } from "@/components/ui/Primitives";
import { Photo } from "@/components/shared/Photo";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { Price } from "@/components/product/Price";
import { campaigns, getCampaign } from "@/components/content/landings";

export function generateStaticParams() {
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCampaign(slug);
  if (!c) return { title: "Campanha não encontrada" };
  return {
    title: `Coleção ${c.name} · ${c.season}`,
    description: c.intro,
    alternates: { canonical: `/campanha/${c.slug}` },
    openGraph: { title: `Coleção ${c.name}`, description: c.intro, images: ["/brand/karen-michelly-logo.jpg"] },
  };
}

/** Tela 92: Landing de campanha */
export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign) notFound();
  const items = campaign.products();

  return (
    <>
      {/* Hero full-bleed preto com o logotipo */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 opacity-60 lg:block">
          <Photo src={campaign.image} alt={`Coleção ${campaign.name}`} className="size-full" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/30" aria-hidden />
        <div className="container-km flex min-h-[86vh] flex-col justify-center py-20 md:py-28">
          <div className="max-w-2xl" {...aos.fadeUp()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/karen-michelly-logo.webp"
              alt="Karen Michelly Woman Wear"
              className="w-56 md:w-72"
            />
            <span className="mt-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-champagne/80">
              <span className="h-px w-10 bg-gold" /> Coleção {campaign.name} · {campaign.season}
            </span>
            <h1 className="mt-6 text-[56px] font-light leading-[0.92] text-white sm:text-7xl xl:text-[104px]">
              {campaign.headline.split(" ").slice(0, -1).join(" ")}{" "}
              <em className="text-gold">{campaign.headline.split(" ").slice(-1)}</em>
            </h1>
            <p className="mt-8 max-w-lg text-[16px] leading-relaxed text-champagne">{campaign.intro}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#produtos" variant="gold">
                Comprar a coleção <ArrowRight className="size-4" strokeWidth={1.3} />
              </Button>
              <Button href="#lookbook" variant="light">
                Ver lookbook
              </Button>
            </div>
          </div>
          <a href="#manifesto" className="mt-16 flex items-center gap-3 self-start text-[10px] uppercase tracking-[0.3em] text-champagne/70 hover:text-gold">
            <ArrowDown className="size-4" strokeWidth={1.2} /> Role para descobrir
          </a>
        </div>
      </section>

      {/* Manifesto */}
      <section id="manifesto" className="bg-offwhite py-20 md:py-28">
        <div className="container-km mx-auto max-w-3xl text-center" {...aos.fadeUp()}>
          <Ornament className="mb-8" />
          <p className="font-serif text-3xl font-light leading-snug text-ink md:text-[42px]">
            “Quis desenhar a sensação de abrir a janela bem cedo, quando o céu ainda está entre o rosa e o dourado.”
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-gold">Karen Michelly, diretora criativa</p>
        </div>
      </section>

      {/* Blocos editoriais alternados */}
      {campaign.blocks.map((b, i) => (
        <section key={b.title} className={clsx(i % 2 === 0 ? "bg-white" : "bg-nude")}>
          <div className="container-km grid items-center gap-12 py-20 md:grid-cols-2 md:gap-20 md:py-28">
            <div className={clsx("relative", i % 2 === 1 && "md:order-2")} {...aos.zoomIn()}>
              <div className="aspect-[4/5] overflow-hidden">
                <Photo src={b.image} alt={b.title} className="size-full" />
              </div>
              <span className={clsx("absolute -bottom-5 h-20 w-px bg-gold", i % 2 === 0 ? "right-10" : "left-10")} aria-hidden />
              <span className="absolute left-5 top-5 font-serif text-7xl leading-none text-white/80 mix-blend-difference">
                0{i + 1}
              </span>
            </div>
            <div {...aos.fadeUp(100)}>
              <span className="eyebrow text-gold">{b.eyebrow}</span>
              <h2 className="mt-4 text-5xl leading-[1.02] md:text-6xl">{b.title}</h2>
              <span className="gold-rule mt-6" />
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-graphite">{b.text}</p>
              {b.cta && (
                <Link href={b.cta.href} className="link-luxe mt-10 inline-flex items-center gap-2">
                  {b.cta.label} <ArrowRight className="size-3.5" strokeWidth={1.3} />
                </Link>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Lookbook */}
      <section id="lookbook" className="scroll-mt-28 bg-ink py-20 text-white md:py-28">
        <div className="container-km">
          <SectionHeading dark eyebrow={`Lookbook ${campaign.name}`} title="Seis looks, uma manhã" text="Toque em um look para conhecer a peça principal." />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {campaign.looks.map((l, i) => {
              const p = getProduct(l.productId);
              return (
                <Link
                  key={l.name}
                  href={p ? `/produto/${p.slug}` : "#produtos"}
                  {...aos.zoomIn((i % 3) * 80)}
                  className={clsx("group relative block self-start overflow-hidden", i % 3 === 1 && "md:mt-16")}
                >
                  {p && <ProductImage product={p} className="transition-transform duration-700 group-hover:scale-105" />}
                  <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-ink/90 to-transparent p-5 pt-16">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-gold">{l.name}</span>
                    {p && <span className="font-serif text-xl leading-tight text-white">{p.name}</span>}
                    {p && (
                      <span className="text-champagne [&_span]:text-champagne!">
                        <Price price={p.price} />
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="scroll-mt-28 bg-offwhite py-20 md:py-28">
        <div className="container-km">
          <SectionHeading
            align="left"
            eyebrow={`Coleção ${campaign.name}`}
            title="Compre a coleção"
            text={`${items.length} peças em tiragem limitada, produzidas no nosso ateliê.`}
            action={
              <Link href="/novidades" className="link-luxe">
                Ver todas as novidades
              </Link>
            }
          />
          <ProductCarousel products={items} />
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-nude">
        <div className="container-km flex flex-col items-center py-20 text-center md:py-28" {...aos.fadeUp()}>
          <span className="eyebrow text-gold">Atendimento exclusivo</span>
          <h2 className="mt-4 max-w-2xl text-5xl leading-[1.02] md:text-6xl">Prove a coleção {campaign.name} no ateliê</h2>
          <span className="gold-rule mt-6" />
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-graphite">
            Agende uma sessão com a nossa consultora de estilo e receba ajustes gratuitos nas peças de alfaiataria.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/contato">Agendar visita</Button>
            <Button href="/sobre#lojas" variant="secondary">
              Nossas lojas
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
