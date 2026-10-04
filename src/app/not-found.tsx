import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bestsellers, categories } from "@/lib/data";
import { aos } from "@/lib/aos";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Primitives";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { NotFoundSearch } from "@/components/content/NotFoundSearch";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/** Tela 95: 404 global (fora do grupo (store), por isso renderiza Header e Footer). */
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="conteudo" className="min-h-[60vh]">
        <section className="relative overflow-hidden bg-offwhite">
          <span className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full border border-champagne/40" aria-hidden />
          <span className="pointer-events-none absolute -right-20 bottom-10 h-48 w-px bg-gold/60" aria-hidden />
          <div className="container-km flex flex-col items-center pb-20 md:pb-24">
            <EmptyState
              code="404"
              className="!pb-10"
              title="Esta página saiu de cena"
              text="O endereço pode ter mudado ou a peça não está mais disponível. Que tal procurar outra coisa ou começar pelas novidades?"
              actions={
                <>
                  <Button href="/novidades">
                    Ver novidades <ArrowRight className="size-4" strokeWidth={1.3} />
                  </Button>
                  <Button href="/categorias" variant="secondary">
                    Todas as categorias
                  </Button>
                </>
              }
            />
            <div className="flex w-full justify-center" {...aos.fadeUp()}>
              <NotFoundSearch />
            </div>
            <nav aria-label="Categorias" className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3" {...aos.fadeUp(100)}>
              {categories.map((c) => (
                <Link key={c.slug} href={`/categoria/${c.slug}`} className="link-luxe">
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className="bg-white py-20 md:py-24">
          <div className="container-km">
            <SectionHeading
              align="left"
              eyebrow="Talvez você goste"
              title="Mais vendidos"
              action={
                <Link href="/mais-vendidos" className="link-luxe">
                  Ver todos
                </Link>
              }
            />
            <ProductCarousel products={bestsellers().slice(0, 8)} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
