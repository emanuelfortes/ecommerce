import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/Primitives";
import { FavoritesView } from "@/components/store/FavoritesView";

export const metadata: Metadata = {
  title: "Lista de desejos",
  description: "As peças Karen Michelly que você salvou.",
  robots: { index: false, follow: true },
};

/** Telas 15 e 102: Lista de desejos */
export default function FavoritesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Favoritos"
        title="Lista de desejos"
        text="Suas peças salvas ficam guardadas neste navegador. Entre na sua conta para acessá-las de qualquer lugar."
        crumbs={[{ label: "Lista de desejos" }]}
      />
      <section className="bg-offwhite py-12 md:py-20">
        <div className="container-km">
          <FavoritesView />
        </div>
      </section>
    </>
  );
}
