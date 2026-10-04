import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/Primitives";
import { CompareView } from "@/components/store/CompareView";

export const metadata: Metadata = {
  title: "Comparar produtos",
  description: "Compare preço, tamanhos, cores e composição das peças Karen Michelly lado a lado.",
  robots: { index: false, follow: true },
};

/** Tela 16: Comparar produtos */
export default function ComparePage() {
  return (
    <>
      <PageHeader
        eyebrow="Decida com calma"
        title="Comparar produtos"
        text="Veja até quatro peças lado a lado: preço, tamanhos, cores, composição e disponibilidade."
        crumbs={[{ label: "Comparar" }]}
      />
      <section className="bg-offwhite py-12 md:py-20">
        <div className="container-km">
          <CompareView />
        </div>
      </section>
    </>
  );
}
