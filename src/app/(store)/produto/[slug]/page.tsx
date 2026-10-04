import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bestsellers, getBrand, getCategory, getProduct, products, questions, relatedProducts, similarProducts } from "@/lib/data";
import { aos } from "@/lib/aos";
import { Breadcrumbs, SectionHeading } from "@/components/ui/Primitives";
import { Accordion } from "@/components/ui/Interactive";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductGrid } from "@/components/product/ProductCard";
import { ProductHero } from "@/components/product/pdp/ProductHero";
import { Reviews } from "@/components/product/pdp/Reviews";
import { Questions } from "@/components/product/pdp/Questions";
import { reviewsFor, stockLabel } from "@/components/product/pdp/pdpData";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Produto não encontrado" };
  const brand = getBrand(p.brand);
  return {
    title: p.name,
    description: p.description,
    alternates: { canonical: `/produto/${p.slug}` },
    openGraph: {
      title: `${p.name} · ${brand?.name ?? "Karen Michelly"}`,
      description: p.description,
      url: `/produto/${p.slug}`,
    },
    robots: p.stock === "indisponivel" ? { index: false, follow: true } : undefined,
  };
}

/** Telas 9 a 14 · estados 99 (indisponível) e 100 (esgotado) */
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const sub = category?.subcategories.find((s) => s.slug === product.subcategory);
  const brand = getBrand(product.brand);
  const productReviews = reviewsFor(product);
  const productQuestions = questions.filter((q) => q.productId === product.id);
  const related = relatedProducts(product, 8);
  const relatedList = related.length >= 2 ? related : bestsellers().filter((p) => p.id !== product.id).slice(0, 8);
  const similar = similarProducts(product, 4);
  const unavailable = product.stock === "indisponivel";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: `KM${product.id.slice(1).padStart(4, "0")}`,
    image: product.images?.length ? product.images : ["https://www.karenmichelly.com.br/brand/karen-michelly-logo.jpg"],
    brand: { "@type": "Brand", name: brand?.name ?? "Karen Michelly" },
    category: category?.name,
    color: product.colors.map((c) => c.name).join(", "),
    material: product.composition,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
    review: productReviews.slice(0, 3).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.date,
      name: r.title,
      reviewBody: r.body,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    })),
    offers: {
      "@type": "Offer",
      url: `https://www.karenmichelly.com.br/produto/${product.slug}`,
      priceCurrency: "BRL",
      price: product.price.toFixed(2),
      availability: stockLabel[product.stock],
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Karen Michelly Woman Wear" },
    },
  };

  const similarSection = (
    <section id="similares" className={unavailable ? "scroll-mt-28 bg-nude py-20 md:py-28" : "scroll-mt-28 bg-white py-20 md:py-28"}>
      <div className="container-km">
        <SectionHeading
          eyebrow={unavailable ? "Sugestões para você" : "Você também pode gostar"}
          title={unavailable ? "Peças similares disponíveis" : "Produtos similares"}
          text={unavailable ? "Silhuetas e acabamentos parecidos, prontos para envio." : undefined}
        />
        <ProductGrid products={similar} />
      </div>
    </section>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section id="galeria" className="scroll-mt-28 bg-offwhite pb-20 pt-8 md:pb-28 md:pt-10">
        <div className="container-km">
          <Breadcrumbs
            items={[
              ...(category ? [{ label: category.name, href: `/categoria/${category.slug}` }] : []),
              ...(category && sub ? [{ label: sub.name, href: `/categoria/${category.slug}/${sub.slug}` }] : []),
              { label: product.name },
            ]}
          />
          <ProductHero product={product}>
            <Accordion
              defaultOpen={0}
              items={[
                {
                  title: "Descrição",
                  content: <p>{product.description}</p>,
                },
                {
                  title: "Detalhes",
                  content: (
                    <ul className="flex flex-col gap-2">
                      {product.details.map((d) => (
                        <li key={d} className="flex items-center gap-3">
                          <span className="size-1.5 shrink-0 rotate-45 bg-gold" /> {d}
                        </li>
                      ))}
                      <li className="flex items-center gap-3">
                        <span className="size-1.5 shrink-0 rotate-45 bg-gold" /> Tamanhos: {product.sizes.join(", ")}
                      </li>
                    </ul>
                  ),
                },
                {
                  title: "Composição",
                  content: (
                    <p>
                      {product.composition}. {brand ? `Produzido por ${brand.name}, ${brand.origin}.` : ""}
                    </p>
                  ),
                },
                {
                  title: "Cuidados",
                  content: (
                    <ul className="flex flex-col gap-2">
                      {product.care.map((c) => (
                        <li key={c} className="flex items-center gap-3">
                          <span className="size-1.5 shrink-0 rotate-45 bg-gold" /> {c}
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ]}
            />
          </ProductHero>
        </div>
      </section>

      {unavailable && similarSection}

      <section id="avaliacoes" className="scroll-mt-28 border-t border-line bg-white py-20 md:py-28">
        <div className="container-km">
          <SectionHeading align="left" eyebrow="Quem comprou, conta" title="Avaliações" />
          <div {...aos.fadeUp()}>
            <Reviews product={product} reviews={productReviews} />
          </div>
        </div>
      </section>

      <section id="perguntas" className="scroll-mt-28 bg-offwhite py-20 md:py-28">
        <div className="container-km">
          <SectionHeading align="left" eyebrow="Tire suas dúvidas" title="Perguntas e respostas" />
          <div {...aos.fadeUp()}>
            <Questions productId={product.id} initial={productQuestions} />
          </div>
        </div>
      </section>

      <section id="relacionados" className="scroll-mt-28 border-t border-line bg-offwhite py-20 md:py-28">
        <div className="container-km">
          <SectionHeading align="left" eyebrow="Complete o look" title="Produtos relacionados" />
          <ProductCarousel products={relatedList} />
        </div>
      </section>

      {!unavailable && similar.length > 0 && similarSection}
    </>
  );
}
