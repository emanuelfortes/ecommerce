import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { brands, products } from "@/lib/data";
import { getBrandArt } from "@/components/store/brandArt";
import { aos } from "@/lib/aos";
import { PageHeader } from "@/components/ui/Primitives";
import { ProductArt } from "@/components/product/ProductArt";

export const metadata: Metadata = {
  title: "Marcas",
  description: "Conheça as marcas da casa Karen Michelly: KM Atelier, KM Essentials, KM Noir e Maison Doré.",
};

/** Tela 17: Marcas */
export default function BrandsPage() {
  return (
    <>
      <PageHeader
        eyebrow="A casa"
        title="Nossas marcas"
        text="Quatro assinaturas, um mesmo cuidado. Cada linha nasce com um propósito e é produzida no Brasil."
        crumbs={[{ label: "Marcas" }]}
      />
      <section className="bg-offwhite py-20 md:py-28">
        <div className="container-km flex flex-col gap-20 md:gap-28">
          {brands.map((b, i) => {
            const count = products.filter((p) => p.brand === b.slug).length;
            const a = getBrandArt(b.slug);
            const reverse = i % 2 === 1;
            return (
              <article key={b.slug} className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
                <Link
                  href={`/marcas/${b.slug}`}
                  {...aos.zoomIn()}
                  className={`group block md:col-span-5 ${reverse ? "md:order-2 md:col-start-8" : ""}`}
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-t-full border border-line transition-colors duration-500 group-hover:border-gold">
                    <ProductArt kind={a.art} tone={a.tone} color={a.color} variant={a.variant} className="size-full transition-transform duration-700 group-hover:scale-105" label={b.name} />
                  </div>
                </Link>
                <div {...aos.fadeUp(100)} className={`md:col-span-6 ${reverse ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
                  <span className="font-serif text-lg text-taupe">{String(i + 1).padStart(2, "0")}</span>
                  <p className="eyebrow mt-4">{b.tagline}</p>
                  <h2 className="mt-3 text-5xl leading-none text-ink md:text-6xl">{b.name}</h2>
                  <span className="gold-rule mt-6" />
                  <p className="mt-6 max-w-md text-[15px] leading-relaxed text-graphite">{b.description}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-taupe">
                    <span className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-gold" strokeWidth={1.3} /> {b.origin}
                    </span>
                    <span>{count} {count === 1 ? "peça" : "peças"}</span>
                  </div>
                  <Link href={`/marcas/${b.slug}`} className="link-luxe mt-10">
                    Conhecer a marca
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
