import type { Metadata } from "next";
import Link from "next/link";
import { bestsellers, getBrand } from "@/lib/data";
import { aos } from "@/lib/aos";
import { PageHeader, Rating, SectionHeading } from "@/components/ui/Primitives";
import { ProductImage } from "@/components/product/ProductImage";
import { Price } from "@/components/product/Price";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = {
  title: "Mais vendidos",
  description: "As peças Karen Michelly que conquistaram nossas clientes.",
  alternates: { canonical: "/mais-vendidos" },
};

/** Tela 22: Mais vendidos */
export default function BestsellersPage() {
  const list = bestsellers();
  const [first, second, third] = list;
  // pódio: 2º, 1º, 3º
  const podium = [
    { p: second, rank: 2, lift: "md:mt-16" },
    { p: first, rank: 1, lift: "" },
    { p: third, rank: 3, lift: "md:mt-24" },
  ].filter((x) => x.p);

  return (
    <>
      <PageHeader
        eyebrow="As queridinhas"
        title="Mais vendidos"
        text="As peças mais desejadas da temporada, escolhidas por quem já veste Karen Michelly."
        crumbs={[{ label: "Mais vendidos" }]}
      />

      <section className="bg-white py-20 md:py-28">
        <div className="container-km">
          <SectionHeading eyebrow="Top 3 da estação" title="O pódio" />
          <div className="grid items-start gap-10 md:grid-cols-3 md:gap-8">
            {podium.map(({ p, rank, lift }, i) => (
              <Link
                key={p.id}
                href={`/produto/${p.slug}`}
                {...aos.fadeUp(i * 100)}
                className={`group flex flex-col ${lift} ${rank === 1 ? "order-first md:order-none" : ""}`}
              >
                <div className="relative">
                  <div className="overflow-hidden rounded-t-full border border-line transition-colors duration-500 group-hover:border-gold">
                    <ProductImage product={p} index={rank === 1 ? 3 : 0} className="transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <span
                    className={`absolute -bottom-7 left-1/2 grid size-14 -translate-x-1/2 place-items-center rounded-full border font-serif text-2xl ${
                      rank === 1 ? "border-gold bg-ink text-gold" : "border-line bg-offwhite text-ink"
                    }`}
                  >
                    {rank}º
                  </span>
                </div>
                <div className="mt-12 flex flex-col items-center gap-2 text-center">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-taupe">{getBrand(p.brand)?.name}</span>
                  <h3 className="font-serif text-2xl leading-snug text-ink transition-colors group-hover:text-gold">{p.name}</h3>
                  <Rating value={p.rating} count={p.reviewsCount} />
                  <Price price={p.price} oldPrice={p.oldPrice} />
                  <span className="text-[11px] uppercase tracking-[0.18em] text-taupe">{p.sold.toLocaleString("pt-BR")} vendidas</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-offwhite py-12 md:py-16">
        <div className="container-km">
          <ProductListing products={list} defaultSort="mais-vendidos" />
        </div>
      </section>
    </>
  );
}
