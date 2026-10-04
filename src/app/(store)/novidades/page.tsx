import type { Metadata } from "next";
import { newArrivals } from "@/lib/data";
import { aos } from "@/lib/aos";
import { PageHeader } from "@/components/ui/Primitives";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = {
  title: "Novidades",
  description: "As peças mais recentes do ateliê Karen Michelly, em tiragens limitadas.",
  alternates: { canonical: "/novidades" },
};

/** Tela 21: Novidades */
export default function NewArrivalsPage() {
  const list = newArrivals();
  return (
    <>
      <PageHeader
        eyebrow="Acabou de chegar"
        title="Novidades"
        text="As peças mais recentes do nosso ateliê. Tiragens limitadas, reposição incerta: quando acaba, acabou."
        crumbs={[{ label: "Novidades" }]}
      >
        <dl className="mt-6 flex flex-wrap gap-10 border-t border-line pt-6" {...aos.fadeUp(100)}>
          {[
            [String(list.length), "peças novas"],
            ["Semanal", "drops do ateliê"],
            ["Primavera 27", "coleção Aurora"],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="font-serif text-3xl text-ink">{n}</dt>
              <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-taupe">{l}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>
      <section className="bg-offwhite py-12 md:py-16">
        <div className="container-km">
          <ProductListing products={list} defaultSort="novidades" />
        </div>
      </section>
    </>
  );
}
