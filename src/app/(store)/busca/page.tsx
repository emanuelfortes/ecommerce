import type { Metadata } from "next";
import Link from "next/link";
import { Search, SearchX, TrendingUp } from "lucide-react";
import { bestsellers, categories, popularSearches, products, searchProducts } from "@/lib/data";
import { aos } from "@/lib/aos";
import { PageHeader, SectionHeading } from "@/components/ui/Primitives";
import { EmptyState } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/shared/Photo";
import { ProductListing } from "@/components/product/ProductListing";
import { ProductCarousel } from "@/components/product/ProductCarousel";

type Props = { searchParams: Promise<{ q?: string | string[] }> };

const readQ = (q?: string | string[]) => (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = readQ((await searchParams).q);
  return {
    title: q ? `Busca por “${q}”` : "Busca",
    description: "Encontre vestidos, conjuntos, alfaiataria e macacões Karen Michelly.",
    robots: { index: false, follow: true },
  };
}

function SearchBox({ q }: { q: string }) {
  return (
    <form action="/busca" role="search" className="relative mt-6 max-w-2xl">
      <label htmlFor="busca-q" className="sr-only">
        Buscar produtos
      </label>
      <input
        id="busca-q"
        name="q"
        type="search"
        defaultValue={q}
        placeholder="O que você procura?"
        className="w-full border-0 border-b border-ink bg-transparent py-4 pl-0 pr-14 font-serif text-2xl text-ink placeholder:text-taupe/70 focus:border-gold focus:outline-none md:text-3xl"
      />
      <button type="submit" aria-label="Buscar" className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center text-ink hover:text-gold">
        <Search className="size-5" strokeWidth={1.2} />
      </button>
    </form>
  );
}

function Chips({ label }: { label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-taupe">
        <TrendingUp className="size-3.5 text-gold" strokeWidth={1.3} /> {label}
      </span>
      {popularSearches.map((s) => (
        <Link
          key={s}
          href={`/busca?q=${encodeURIComponent(s)}`}
          className="border border-line bg-white px-4 py-2 text-xs text-graphite transition-colors hover:border-ink hover:text-ink"
        >
          {s}
        </Link>
      ))}
    </div>
  );
}

/** Telas 2 (Busca), 3 (Resultados) e 97 (Sem resultados) */
export default async function SearchPage({ searchParams }: Props) {
  const q = readQ((await searchParams).q);
  const results = q ? searchProducts(q) : [];

  /* Tela 2: busca sem termo */
  if (!q) {
    return (
      <>
        <PageHeader eyebrow="Busca" title="O que você procura hoje?" crumbs={[{ label: "Busca" }]}>
          <SearchBox q="" />
          <div className="mt-8">
            <Chips label="Mais buscados" />
          </div>
        </PageHeader>
        <section className="bg-white py-20 md:py-24">
          <div className="container-km">
            <SectionHeading eyebrow="Explore" title="Navegue por categoria" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {categories.map((c, i) => (
                <Link key={c.slug} href={`/categoria/${c.slug}`} {...aos.fadeUp((i % 4) * 60)} className="group flex items-center gap-4 border border-line bg-offwhite p-3 transition-colors hover:border-champagne">
                  <div className="w-16 shrink-0 overflow-hidden rounded-t-full">
                    {c.image && <Photo src={c.image} alt={c.name} className="aspect-[3/4] w-full" />}
                  </div>
                  <div>
                    <p className="font-serif text-xl leading-tight text-ink transition-colors group-hover:text-gold">{c.name}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-taupe">
                      {products.filter((p) => p.category === c.slug).length} peças
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-offwhite py-20 md:py-28">
          <div className="container-km">
            <SectionHeading align="left" eyebrow="As queridinhas" title="Mais vendidos" action={<Link href="/mais-vendidos" className="link-luxe">Ver todos</Link>} />
            <ProductCarousel products={bestsellers().slice(0, 8)} />
          </div>
        </section>
      </>
    );
  }

  /* Tela 97: sem resultados */
  if (results.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Busca" title={<>Resultados para “{q}”</>} crumbs={[{ label: "Busca", href: "/busca" }, { label: q }]}>
          <SearchBox q={q} />
        </PageHeader>
        <section className="bg-offwhite">
          <div className="container-km">
            <EmptyState
              icon={<SearchX />}
              title="Nenhuma peça encontrada"
              text={
                <>
                  Não encontramos resultados para <strong className="font-medium text-ink">“{q}”</strong>. Confira a grafia, use
                  termos mais gerais ou experimente uma das buscas abaixo.
                </>
              }
              actions={
                <>
                  <Button href="/produtos">Ver todos os produtos</Button>
                  <Button href="/novidades" variant="secondary">
                    Novidades
                  </Button>
                </>
              }
            />
            <div className="-mt-6 flex justify-center pb-20">
              <Chips label="Sugestões" />
            </div>
          </div>
        </section>
        <section className="bg-white py-20 md:py-28">
          <div className="container-km">
            <SectionHeading align="left" eyebrow="Talvez você goste" title="Mais vendidos" />
            <ProductCarousel products={bestsellers().slice(0, 8)} />
          </div>
        </section>
      </>
    );
  }

  /* Tela 3: resultados */
  return (
    <>
      <PageHeader
        eyebrow="Busca"
        title={<>Resultados para “{q}”</>}
        text={`${results.length} ${results.length === 1 ? "peça encontrada" : "peças encontradas"}.`}
        crumbs={[{ label: "Busca", href: "/busca" }, { label: q }]}
      >
        <SearchBox q={q} />
      </PageHeader>
      <section className="bg-offwhite py-12 md:py-16">
        <div className="container-km">
          <ProductListing key={q} products={results} />
        </div>
      </section>
    </>
  );
}
