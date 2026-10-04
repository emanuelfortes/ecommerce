import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory, products } from "@/lib/data";
import { PageHeader } from "@/components/ui/Primitives";
import { ProductListing } from "@/components/product/ProductListing";
import { CategoryEmpty, SubcategoryNav } from "@/components/store/CategoryParts";

type Props = { params: Promise<{ slug: string; sub: string }> };

export function generateStaticParams() {
  return categories.flatMap((c) => c.subcategories.map((s) => ({ slug: c.slug, sub: s.slug })));
}

async function resolve(params: Props["params"]) {
  const { slug, sub } = await params;
  const category = getCategory(slug);
  const subcategory = category?.subcategories.find((s) => s.slug === sub);
  return { category, subcategory };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await resolve(params);
  if (!category || !subcategory) return { title: "Categoria não encontrada" };
  return {
    title: `${subcategory.name} · ${category.name}`,
    description: `${category.name} ${subcategory.name.toLowerCase()} Karen Michelly. ${category.description}`,
    alternates: { canonical: `/categoria/${category.slug}/${subcategory.slug}` },
  };
}

/** Tela 5: Subcategoria · estado 98 quando não há produtos */
export default async function SubcategoryPage({ params }: Props) {
  const { category, subcategory } = await resolve(params);
  if (!category || !subcategory) notFound();
  const list = products.filter((p) => p.category === category.slug && p.subcategory === subcategory.slug);

  return (
    <>
      <PageHeader
        eyebrow={category.name}
        title={subcategory.name}
        text={category.description}
        crumbs={[
          { label: "Categorias", href: "/categorias" },
          { label: category.name, href: `/categoria/${category.slug}` },
          { label: subcategory.name },
        ]}
      >
        <SubcategoryNav category={category} active={subcategory.slug} />
      </PageHeader>
      <section className="bg-offwhite py-12 md:py-16">
        <div className="container-km">
          <ProductListing
            products={list}
            hideCategoryFilter
            empty={<CategoryEmpty category={category} subName={subcategory.name} />}
          />
        </div>
      </section>
    </>
  );
}
