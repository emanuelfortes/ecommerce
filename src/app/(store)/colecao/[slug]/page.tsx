import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getBrand } from "@/lib/data";
import { aos } from "@/lib/aos";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs, SectionHeading } from "@/components/ui/Primitives";
import { Photo } from "@/components/shared/Photo";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductGrid } from "@/components/product/ProductCard";
import { Price } from "@/components/product/Price";
import { collections, getCollection } from "@/components/content/landings";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return { title: "Coleção não encontrada" };
  return {
    title: `${c.name} · ${c.headline}`,
    description: c.intro,
    alternates: { canonical: `/colecao/${c.slug}` },
  };
}

/** Tela 93: Landing de categoria (edit curado) */
export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const featured = c.featured();
  const all = c.all();
  const other = collections.find((x) => x.slug !== c.slug);

  return (
    <>
      {/* Introdução */}
      <section className="bg-offwhite">
        <div className="container-km pt-10 md:pt-14">
          <Breadcrumbs items={[{ label: "Coleções" }, { label: c.name }]} />
        </div>
        <div className="container-km grid items-center gap-12 pb-20 pt-6 md:pb-28 lg:grid-cols-12">
          <div className="lg:col-span-6" {...aos.fadeUp()}>
            <span className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold" /> {c.eyebrow}
            </span>
            <h1 className="mt-6 text-[52px] leading-[0.95] sm:text-7xl">{c.headline}</h1>
            <span className="gold-rule mt-8" />
            <p className="mt-7 max-w-lg text-[16px] leading-relaxed text-taupe">{c.intro}</p>
            <ul className="mt-8 flex flex-col gap-2 text-sm text-graphite">
              {c.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3">
                  <span className="size-1.5 rotate-45 bg-gold" /> {h}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#pecas">
                Ver as {all.length} peças <ArrowRight className="size-4" strokeWidth={1.3} />
              </Button>
              <Button href="#styling" variant="secondary">
                Dicas de styling
              </Button>
            </div>
          </div>
          <div className="relative lg:col-span-6" {...aos.zoomIn(120)}>
            <div className="relative mx-auto aspect-[4/5] max-w-[520px] overflow-hidden rounded-t-full border border-champagne/60">
              <Photo src={c.image} alt={c.name} className="size-full" />
            </div>
            <span className="absolute -left-4 top-16 hidden size-24 rounded-full border border-gold/60 md:block" />
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-km">
          <SectionHeading eyebrow="Escolhas da curadoria" title="As peças-chave" text="Três peças que resumem o espírito do edit, escolhidas pela nossa diretora criativa." />
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((p, i) => (
              <Link key={p.id} href={`/produto/${p.slug}`} className="group flex flex-col" {...aos.fadeUp(i * 100)}>
                <div className="relative overflow-hidden">
                  <ProductImage product={p} index={i === 1 ? 3 : 0} className="transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 font-serif text-5xl text-white mix-blend-difference">0{i + 1}</span>
                </div>
                <span className="mt-5 text-[10px] uppercase tracking-[0.22em] text-taupe">{getBrand(p.brand)?.name}</span>
                <span className="mt-2 font-serif text-2xl text-ink transition-colors group-hover:text-gold">{p.name}</span>
                <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-taupe">{p.description}</span>
                <span className="mt-3">
                  <Price price={p.price} oldPrice={p.oldPrice} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dicas de styling */}
      <section id="styling" className="scroll-mt-28 bg-nude py-20 md:py-28">
        <div className="container-km grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4" {...aos.fadeUp()}>
            <span className="eyebrow text-gold">Styling</span>
            <h2 className="mt-4 text-5xl leading-[1.02]">Como usar {c.name.toLowerCase()}</h2>
            <span className="gold-rule mt-6" />
            <p className="mt-6 text-[15px] leading-relaxed text-graphite">
              Conselhos das nossas consultoras de estilo para tirar o melhor de cada peça.
            </p>
            <Link href="/blog/categoria/styling" className="link-luxe mt-8 inline-block">
              Mais no journal
            </Link>
          </div>
          <ol className="grid gap-px bg-champagne/50 sm:grid-cols-2 lg:col-span-8">
            {c.tips.map((t, i) => (
              <li key={t.title} className="bg-nude p-8" {...aos.fadeUp(i * 80)}>
                <span className="font-serif text-4xl text-gold">0{i + 1}</span>
                <h3 className="mt-3 text-2xl">{t.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-graphite/85">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Todas as peças */}
      <section id="pecas" className="scroll-mt-28 bg-offwhite py-20 md:py-28">
        <div className="container-km">
          <SectionHeading
            align="left"
            eyebrow={c.eyebrow}
            title="Todas as peças"
            action={
              <div className="flex flex-wrap gap-2">
                {c.related.map((r) => (
                  <Link key={r.href} href={r.href} className="border border-line bg-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-graphite transition-colors hover:border-ink">
                    {r.label}
                  </Link>
                ))}
              </div>
            }
          />
          <ProductGrid products={all} />
        </div>
      </section>

      {/* Outro edit */}
      {other && (
        <section className="bg-ink text-white">
          <Link href={`/colecao/${other.slug}`} className="group container-km grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
            <div {...aos.fadeUp()}>
              <span className="eyebrow text-champagne/70">Próximo edit</span>
              <p className="mt-4 font-serif text-5xl leading-none text-white md:text-6xl">{other.name}</p>
              <p className="mt-4 max-w-md text-[15px] text-champagne">{other.headline}</p>
              <span className="mt-8 inline-flex items-center gap-2 border-b border-gold pb-1 text-[12px] uppercase tracking-[0.2em] group-hover:text-gold">
                Explorar <ArrowRight className="size-4" strokeWidth={1.3} />
              </span>
            </div>
            <div className="aspect-[16/10] overflow-hidden" {...aos.zoomIn()}>
              <Photo src={other.image} alt={other.name} className="size-full transition-transform duration-700 group-hover:scale-105" />
            </div>
          </Link>
        </section>
      )}
    </>
  );
}
