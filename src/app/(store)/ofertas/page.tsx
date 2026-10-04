import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { onSale } from "@/lib/data";
import { aos } from "@/lib/aos";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { ProductArt } from "@/components/product/ProductArt";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = {
  title: "Ofertas",
  description: "Peças selecionadas com até 30% off. Vestidos, alfaiataria e acessórios Karen Michelly.",
  alternates: { canonical: "/ofertas" },
};

/** Tela 19: Ofertas */
export default function OffersPage() {
  const list = onSale();

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="container-km relative grid items-center gap-10 py-12 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7" {...aos.fadeUp()}>
            <div className="[&_a:hover]:text-white [&_nav]:text-champagne/70 [&_span]:text-champagne">
              <Breadcrumbs items={[{ label: "Ofertas" }]} />
            </div>
            <span className="eyebrow flex items-center gap-3 text-champagne/80">
              <span className="h-px w-8 bg-gold" /> Seleção especial
            </span>
            <h1 className="mt-6 text-[56px] leading-[0.95] text-white sm:text-7xl lg:text-[96px]">
              até <em className="font-light text-gold">30%</em> off
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-champagne">
              {list.length} peças da temporada com preço especial. Mesmo acabamento de ateliê, por tempo limitado.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#ofertas" variant="light">
                Ver ofertas
              </Button>
              <Button href="/cupons" variant="light">
                Cupons ativos
              </Button>
            </div>
          </div>
          <div className="relative hidden md:col-span-5 md:block" {...aos.zoomIn(150)}>
            <div className="mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-t-full border border-gold/40">
              <ProductArt kind="dress" tone={3} variant={3} color="#D8C3A5" className="size-full" label="Ofertas Karen Michelly" />
            </div>
            <span className="absolute -left-4 top-10 size-24 rounded-full border border-gold/50" />
          </div>
        </div>
      </section>

      {/* Banner de contagem (estático) */}
      <section className="border-b border-line bg-nude">
        <div className="container-km flex flex-col items-center justify-between gap-5 py-6 md:flex-row">
          <p className="flex items-center gap-3 text-[12px] uppercase tracking-[0.2em] text-ink">
            <Clock className="size-4 text-gold" strokeWidth={1.2} /> As ofertas terminam em
          </p>
          <div className="flex items-center gap-3" aria-label="Faltam 3 dias, 14 horas e 36 minutos">
            {[
              ["03", "dias"],
              ["14", "horas"],
              ["36", "min"],
              ["52", "seg"],
            ].map(([n, l], i) => (
              <div key={l} className="flex items-center gap-3">
                {i > 0 && <span className="font-serif text-2xl text-gold">:</span>}
                <div className="min-w-14 bg-offwhite px-3 py-2 text-center">
                  <span className="block font-serif text-3xl leading-none tabular-nums text-ink">{n}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-taupe">{l}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-graphite">Enquanto durarem os estoques. Não cumulativo com outros cupons.</p>
        </div>
      </section>

      <section id="ofertas" className="scroll-mt-28 bg-offwhite py-12 md:py-16">
        <div className="container-km">
          <ProductListing products={list} defaultSort="desconto" />
        </div>
      </section>
    </>
  );
}
