import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { brands, getBrand, products } from "@/lib/data";
import { aos } from "@/lib/aos";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { EmptyState } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { ProductListing } from "@/components/product/ProductListing";
import { getBrandImage } from "@/components/store/brandArt";
import { Photo } from "@/components/shared/Photo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = getBrand(slug);
  if (!b) return { title: "Marca não encontrada" };
  return { title: b.name, description: `${b.tagline}. ${b.description}`, alternates: { canonical: `/marcas/${b.slug}` } };
}

/** Tela 18: Página da marca */
export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();
  const list = products.filter((p) => p.brand === brand.slug);
  const avg = list.length ? list.reduce((s, p) => s + p.rating, 0) / list.length : 0;
  const others = brands.filter((b) => b.slug !== brand.slug);

  return (
    <>
      <section className="border-b border-line bg-nude">
        <div className="container-km grid items-center gap-12 py-10 md:grid-cols-12 md:py-16">
          <div className="md:col-span-7" {...aos.fadeUp()}>
            <Breadcrumbs items={[{ label: "Marcas", href: "/marcas" }, { label: brand.name }]} />
            <span className="eyebrow flex items-center gap-3 text-graphite">
              <span className="h-px w-8 bg-gold" /> {brand.tagline}
            </span>
            <h1 className="mt-6 text-6xl leading-[0.95] text-ink md:text-8xl">{brand.name}</h1>
            <p className="mt-8 max-w-lg text-[16px] leading-relaxed text-graphite">{brand.description}</p>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-champagne pt-6">
              <div>
                <dt className="font-serif text-3xl text-ink">{list.length}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-taupe">peças</dd>
              </div>
              <div>
                <dt className="font-serif text-3xl text-ink">{avg ? avg.toFixed(1) : "-"}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-taupe">avaliação</dd>
              </div>
              <div>
                <dt className="pt-2">
                  <MapPin className="size-5 text-gold" strokeWidth={1.2} />
                </dt>
                <dd className="mt-2 text-[11px] uppercase tracking-[0.18em] text-taupe">{brand.origin}</dd>
              </div>
            </dl>
          </div>
          <div className="relative md:col-span-5" {...aos.zoomIn(150)}>
            <div className="mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-t-full border border-champagne">
              <Photo src={getBrandImage(brand.slug)} alt={brand.name} className="size-full" />
            </div>
            <span className="absolute -bottom-6 left-1/2 hidden h-16 w-px -translate-x-1/2 bg-gold md:block" />
          </div>
        </div>
      </section>

      <section className="bg-offwhite py-12 md:py-16">
        <div className="container-km">
          <div className="mb-10" {...aos.fadeUp()}>
            <span className="eyebrow">A coleção</span>
            <h2 className="mt-3 text-4xl text-ink md:text-5xl">Peças {brand.name}</h2>
            <span className="gold-rule mt-4" />
          </div>
          <ProductListing
            products={list}
            empty={
              <EmptyState
                title="Nova coleção a caminho"
                text={`As próximas peças ${brand.name} chegam em breve.`}
                actions={<Button href="/produtos">Ver todos os produtos</Button>}
              />
            }
          />
        </div>
      </section>

      <section className="border-t border-line bg-white py-16">
        <div className="container-km flex flex-col items-center gap-6 text-center">
          <span className="eyebrow">Outras marcas da casa</span>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {others.map((b) => (
              <Link key={b.slug} href={`/marcas/${b.slug}`} className="font-serif text-3xl text-ink transition-colors hover:text-gold">
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
