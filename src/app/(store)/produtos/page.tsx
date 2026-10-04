import type { Metadata } from "next";
import Link from "next/link";
import { categories, products } from "@/lib/data";
import { PageHeader } from "@/components/ui/Primitives";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = {
  title: "Todos os produtos",
  description: "Toda a coleção Karen Michelly: vestidos longos e midi, conjuntos de pantalona, alfaiataria, crochê e macacões.",
  alternates: { canonical: "/produtos" },
};

/** Telas 6 (listagem), 7 (filtros) e 8 (ordenação) */
export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="A coleção"
        title="Todos os produtos"
        text="Filtre por tamanho, cor, marca ou faixa de preço e ordene como preferir."
        crumbs={[{ label: "Produtos" }]}
      >
        <nav aria-label="Categorias" className="no-scrollbar -mx-4 mt-6 flex gap-x-6 gap-y-3 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
          {categories.map((c) => (
            <Link key={c.slug} href={`/categoria/${c.slug}`} className="link-luxe shrink-0">
              {c.name}
            </Link>
          ))}
        </nav>
      </PageHeader>
      <section className="bg-offwhite py-12 md:py-16">
        <div className="container-km">
          <ProductListing products={products} />
        </div>
      </section>
    </>
  );
}
