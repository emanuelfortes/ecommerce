import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, products } from "@/lib/data";
import { aos } from "@/lib/aos";
import { PageHeader, Ornament } from "@/components/ui/Primitives";
import { ProductArt } from "@/components/product/ProductArt";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Categorias",
  description: "Explore todas as categorias Karen Michelly: vestidos, blusas, alfaiataria, casacos, acessórios e moda praia.",
};

const swatches = ["#D8C3A5", "#0D0D0D", "#F7F4EF", "#E8D8D2"];

/** Tela 4: Categorias */
export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Explore o ateliê"
        title="Categorias"
        text="Do vestido de cetim ao blazer estruturado, cada categoria reúne peças pensadas para vestir com intenção."
        crumbs={[{ label: "Categorias" }]}
      />

      <section className="bg-offwhite py-20 md:py-28">
        <div className="container-km grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <article key={c.slug} {...aos.fadeUp((i % 4) * 80)} className={i % 2 === 1 ? "lg:mt-16" : undefined}>
                <Link href={`/categoria/${c.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-full border border-line transition-colors duration-500 group-hover:border-gold">
                    <ProductArt
                      kind={c.art}
                      tone={i % 3}
                      color={swatches[i % 4]}
                      variant={i === 3 || i === 6 ? 3 : 0}
                      className="size-full transition-transform duration-700 group-hover:scale-105"
                      label={c.name}
                    />
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ink backdrop-blur">
                      {count} {count === 1 ? "peça" : "peças"}
                    </span>
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-3">
                    <h2 className="font-serif text-3xl text-ink transition-colors group-hover:text-gold">{c.name}</h2>
                    <span className="font-serif text-lg text-taupe">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                </Link>
                <span className="gold-rule mt-3" />
                <p className="mt-4 text-sm leading-relaxed text-taupe">{c.description}</p>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {c.subcategories.map((s) => {
                    const n = products.filter((p) => p.category === c.slug && p.subcategory === s.slug).length;
                    return (
                      <li key={s.slug}>
                        <Link
                          href={`/categoria/${c.slug}/${s.slug}`}
                          className="text-[12px] uppercase tracking-[0.16em] text-graphite transition-colors hover:text-gold"
                        >
                          {s.name} <span className="text-taupe">({n})</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-ink py-20 text-center md:py-24">
        <div className="container-km" {...aos.fadeUp()}>
          <Ornament className="mb-6" />
          <p className="eyebrow text-champagne/70">Não sabe por onde começar?</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl text-white md:text-5xl">Veja todas as peças em um só lugar</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/produtos" variant="light">
              Ver todos os produtos <ArrowRight className="size-4" strokeWidth={1.3} />
            </Button>
            <Button href="/novidades" variant="light">
              Novidades
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
