import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrand, getProduct, products } from "@/lib/data";
import { aos } from "@/lib/aos";
import { PageHeader, Rating } from "@/components/ui/Primitives";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductReviewForm } from "@/components/orders/ReviewForms";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return { title: p ? `Avaliar ${p.name}` : "Avaliar produto", robots: { index: false, follow: false } };
}

/** Tela 74: Avaliar produto */
export default async function ReviewProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return (
    <>
      <PageHeader
        eyebrow="Avaliação"
        title="Avaliar produto"
        text="Conte como a peça ficou em você. Avaliações sinceras ajudam outras mulheres a escolher com segurança."
        crumbs={[{ label: "Minha conta", href: "/conta" }, { label: "Pedidos", href: "/conta/pedidos" }, { label: "Avaliar produto" }]}
      />
      <section className="container-km grid gap-10 py-14 md:py-20 lg:grid-cols-[360px_1fr] lg:gap-16">
        <aside {...aos.fadeUp()} className="h-fit lg:sticky lg:top-40">
          <Link href={`/produto/${product.slug}`} className="block border border-line">
            <ProductImage product={product} />
          </Link>
          <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-taupe">{getBrand(product.brand)?.name}</p>
          <Link href={`/produto/${product.slug}`} className="mt-1 block font-serif text-2xl text-ink hover:text-gold">
            {product.name}
          </Link>
          <div className="mt-2">
            <Rating value={product.rating} count={product.reviewsCount} />
          </div>
        </aside>
        <div className="max-w-3xl">
          <ProductReviewForm product={product} />
        </div>
      </section>
    </>
  );
}
