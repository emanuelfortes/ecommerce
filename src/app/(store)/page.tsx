import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bestsellers, blogPosts, categories, newArrivals, onSale, getProduct } from "@/lib/data";
import { aos } from "@/lib/aos";
import { Button } from "@/components/ui/Button";
import { SectionHeading, Ornament } from "@/components/ui/Primitives";
import { ProductImage } from "@/components/product/ProductImage";
import { Photo } from "@/components/shared/Photo";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductGrid } from "@/components/product/ProductCard";
import { Perks } from "@/components/layout/Footer";
import { PostCard } from "@/components/shared/PostCard";
import { SocialIcon } from "@/components/shared/Brand";
import { Price } from "@/components/product/Price";

/** Tela 1: Home */
export default function HomePage() {
  const hero = getProduct("p1")!;
  const cover = getProduct("p3")!;
  const insta = ["p3", "p9", "p12", "p7", "p10", "p2"].map((id) => getProduct(id)!);
  return (
    <>
      {/* HERO: fundo off-white, título preto, texto taupe, destaques dourados */}
      <section className="relative overflow-hidden bg-offwhite">
        <div className="container-km grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-6" {...aos.fadeUp()}>
            <span className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold" /> Coleção Aurora · Primavera Verão 2027
            </span>
            <h1 className="mt-6 text-[52px] leading-[0.95] text-ink sm:text-7xl xl:text-[96px]">
              Cores que
              <br />
              vestem <em className="font-light text-gold">presença</em>
            </h1>
            <p className="mt-7 max-w-md text-[16px] leading-relaxed text-taupe">
              Vestidos longos em camadas, conjuntos de pantalona e alfaiataria em cetim. Peças que abraçam as curvas e
              assinam cada chegada, do sol da tarde às noites de festa.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/campanha/aurora">
                Descobrir coleção <ArrowRight className="size-4" strokeWidth={1.3} />
              </Button>
              <Button href="/novidades" variant="secondary">
                Novidades
              </Button>
            </div>
            <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                ["15", "anos de ateliê"],
                ["40k", "clientes"],
                ["4.9", "avaliação média"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-serif text-4xl text-ink">{n}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-taupe">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative lg:col-span-6" {...aos.zoomIn(150)}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
              <div className="absolute inset-0 overflow-hidden rounded-t-full border border-champagne/60 bg-nude">
                <ProductImage product={cover} className="!absolute inset-0 !aspect-auto size-full" />
              </div>
              <span className="absolute -left-6 top-16 hidden size-28 rounded-full border border-gold/60 md:block" />
              <span className="absolute -right-3 bottom-24 hidden h-40 w-px bg-gold md:block" />
              <Link
                href={`/produto/${hero.slug}`}
                className="absolute -bottom-6 left-4 right-4 flex items-center gap-4 border border-line bg-white/95 p-4 shadow-xl backdrop-blur transition-colors hover:border-champagne sm:left-auto sm:right-[-12px] sm:w-72"
              >
                <div className="w-14 shrink-0 overflow-hidden">
                  <ProductImage product={hero} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-taupe">Destaque</p>
                  <p className="font-serif text-lg leading-tight text-ink">{hero.name}</p>
                  <Price price={hero.price} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="bg-white py-20 md:py-24">
        <div className="container-km">
          <SectionHeading eyebrow="Explore" title="Compre por categoria" />
          <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:px-0">
            {categories.map((c, i) => (
              <Link
                key={c.slug}
                href={`/categoria/${c.slug}`}
                {...aos.fadeUp(i * 60)}
                className="group flex w-40 shrink-0 snap-start flex-col items-center text-center md:w-auto"
              >
                <div className="aspect-[3/4] w-full overflow-hidden rounded-t-full border border-line transition-colors duration-500 group-hover:border-gold">
                  {c.image && <Photo src={c.image} alt={c.name} className="size-full transition-transform duration-700 group-hover:scale-105" />}
                </div>
                <span className="mt-4 font-serif text-lg text-ink transition-colors group-hover:text-gold">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NOVIDADES */}
      <section className="bg-offwhite py-20 md:py-28">
        <div className="container-km">
          <SectionHeading
            align="left"
            eyebrow="Acabou de chegar"
            title="Novidades"
            text="As peças mais recentes do nosso ateliê, em tiragens limitadas."
            action={
              <Link href="/novidades" className="link-luxe">
                Ver todas
              </Link>
            }
          />
          <ProductCarousel products={newArrivals().slice(0, 8)} />
        </div>
      </section>

      {/* SEÇÃO DE DESTAQUE: fundo nude, título preto, texto grafite, detalhes dourados */}
      <section className="bg-nude">
        <div className="container-km grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          <div className="relative order-2 md:order-1" {...aos.zoomIn()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden">
                <ProductImage product={getProduct("p5")!} className="h-full" />
              </div>
              <div className="mt-16 aspect-[3/4] overflow-hidden">
                <ProductImage product={getProduct("p6")!} className="h-full" />
              </div>
            </div>
            <span className="absolute -bottom-4 left-1/2 h-16 w-px -translate-x-1/2 bg-gold" />
          </div>
          <div className="order-1 md:order-2" {...aos.fadeUp()}>
            <span className="eyebrow text-gold">Edit · Alfaiataria</span>
            <h2 className="mt-4 text-5xl leading-[1.02] md:text-6xl">
              Estrutura que
              <br /> fala por você
            </h2>
            <span className="gold-rule mt-6" />
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-graphite">
              Blazers alongados, camisas de cetim e calças de cintura alta em azul marinho e off-white. A alfaiataria
              Karen Michelly é pensada para o corpo da mulher brasileira.
            </p>
            <ul className="mt-6 flex flex-col gap-2 text-sm text-graphite">
              <li className="flex items-center gap-3"><span className="size-1.5 rotate-45 bg-gold" /> Modelagem exclusiva do ateliê</li>
              <li className="flex items-center gap-3"><span className="size-1.5 rotate-45 bg-gold" /> Crepe de lã fria e cetim acetinado</li>
              <li className="flex items-center gap-3"><span className="size-1.5 rotate-45 bg-gold" /> Ajustes gratuitos na loja física</li>
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/colecao/alfaiataria">Explorar o edit</Button>
              <Button href="/categoria/alfaiataria/terninhos" variant="secondary">
                Terninhos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIS VENDIDOS */}
      <section className="bg-offwhite py-20 md:py-28">
        <div className="container-km">
          <SectionHeading eyebrow="As queridinhas" title="Mais vendidos" text="As peças que conquistaram nossas clientes." />
          <ProductGrid products={bestsellers().slice(0, 8)} />
          <div className="mt-14 text-center">
            <Button href="/mais-vendidos" variant="secondary">
              Ver todos os mais vendidos
            </Button>
          </div>
        </div>
      </section>

      {/* MANIFESTO com o logotipo original */}
      <section className="relative overflow-hidden bg-ink">
        <div className="container-km grid items-center gap-10 py-20 md:grid-cols-2 md:py-24">
          <div {...aos.zoomIn()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/karen-michelly-logo.webp" alt="Karen Michelly Woman Wear" className="w-full" />
          </div>
          <div {...aos.fadeUp()} className="text-center md:text-left">
            <span className="eyebrow text-champagne/70">Manifesto</span>
            <blockquote className="mt-5 font-serif text-3xl font-light italic leading-snug text-white md:text-4xl">
              “Vestir-se bem é uma forma silenciosa de cuidado consigo mesma.”
            </blockquote>
            <p className="mt-5 text-[11px] uppercase tracking-[0.24em] text-gold">Karen Michelly, fundadora</p>
            <div className="mt-10">
              <Button href="/sobre" variant="light">
                Nossa história
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* OFERTAS */}
      <section className="bg-white py-20 md:py-24">
        <div className="container-km grid gap-6 md:grid-cols-2">
          <Link href="/ofertas" {...aos.fadeUp()} className="group relative flex min-h-80 flex-col justify-end overflow-hidden bg-offwhite p-8 md:p-10">
            <div className="absolute inset-y-0 right-0 w-1/2 opacity-90 transition-transform duration-700 group-hover:scale-105">
              <ProductImage product={getProduct("p10")!} className="h-full" />
            </div>
            <div className="relative max-w-[55%]">
              <span className="eyebrow">Ofertas</span>
              <p className="mt-3 font-serif text-5xl leading-none text-ink">
                até <span className="text-gold">30%</span> off
              </p>
              <p className="mt-3 text-sm text-taupe">{onSale().length} peças selecionadas</p>
              <span className="link-luxe mt-6 inline-block">Aproveitar</span>
            </div>
          </Link>
          <Link href="/cupons" {...aos.fadeUp(120)} className="group relative flex min-h-80 flex-col justify-end overflow-hidden bg-ink p-8 text-white md:p-10">
            <div className="absolute inset-y-0 right-0 w-1/2 opacity-90 transition-transform duration-700 group-hover:scale-105">
              <ProductImage product={getProduct("p2")!} className="h-full" />
            </div>
            <div className="relative max-w-[55%]">
              <span className="eyebrow text-champagne/70">Primeira compra</span>
              <p className="mt-3 font-serif text-5xl leading-none text-white">10% off</p>
              <p className="mt-3 text-sm text-champagne">
                com o cupom <strong className="tracking-widest text-gold">BEMVINDA10</strong>
              </p>
              <span className="mt-6 inline-block border-b border-gold pb-1 text-[12px] uppercase tracking-[0.2em]">Ver cupons</span>
            </div>
          </Link>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="bg-offwhite py-20 md:py-28">
        <div className="container-km">
          <SectionHeading
            align="left"
            eyebrow="Journal"
            title="Inspiração & estilo"
            action={
              <Link href="/blog" className="link-luxe">
                Ler o journal
              </Link>
            }
          />
          <div className="grid gap-8 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((p, i) => (
              <PostCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="bg-white py-20">
        <div className="container-km">
          <div className="mb-10 text-center" {...aos.fadeUp()}>
            <Ornament className="mb-5" />
            <p className="font-serif text-4xl">@karenmichelly</p>
            <p className="mt-2 text-sm text-taupe">Marque nossas peças e apareça por aqui</p>
          </div>
          <div className="grid grid-cols-3 gap-1 md:grid-cols-6">
            {insta.map((p, i) => (
              <a key={p.id} href="https://instagram.com" target="_blank" rel="noreferrer" {...aos.zoomIn(i * 60)} className="group relative aspect-square overflow-hidden">
                <ProductImage product={p} className="h-full" />
                <span className="absolute inset-0 grid place-items-center bg-ink/0 text-white opacity-0 transition-all duration-500 group-hover:bg-ink/40 group-hover:opacity-100">
                  <SocialIcon name="instagram" className="size-6" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Perks />
    </>
  );
}
