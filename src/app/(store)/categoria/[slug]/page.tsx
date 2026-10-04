import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory, products } from "@/lib/data";
import { PageHeader } from "@/components/ui/Primitives";
import { ProductListing } from "@/components/product/ProductListing";
import { CategoryEmpty, SubcategoryNav } from "@/components/store/CategoryParts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return { title: "Categoria não encontrada" };
  return { title: c.name, description: c.description, alternates: { canonical: `/categoria/${c.slug}` } };
}

/** Tela 4: Categoria (listagem) */
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const list = products.filter((p) => p.category === category.slug);

  return (
    <>
      <PageHeader
        eyebrow="Categoria"
        title={category.name}
        text={category.description}
        crumbs={[{ label: "Categorias", href: "/categorias" }, { label: category.name }]}
      >
        <SubcategoryNav category={category} />
      </PageHeader>
      <section className="bg-offwhite py-12 md:py-16">
        <div className="container-km">
          <ProductListing products={list} hideCategoryFilter empty={<CategoryEmpty category={category} />} />
        </div>
      </section>
    </>
  );
}
