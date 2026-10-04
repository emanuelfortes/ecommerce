import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/Primitives";
import {
  ListRowsSkeleton,
  PageHeaderSkeleton,
  ProductGridSkeleton,
  ProductPageSkeleton,
  ToolbarSkeleton,
} from "@/components/content/Skeletons";

export const metadata: Metadata = {
  title: "Carregando",
  robots: { index: false, follow: false },
};

function Demo({ n, title, text, children }: { n: string; title: string; text: string; children: ReactNode }) {
  return (
    <section className="border-b border-line py-14 md:py-20">
      <div className="container-km">
        <div className="mb-8 flex items-baseline gap-4">
          <span className="font-serif text-3xl text-gold">{n}</span>
          <div>
            <h2 className="text-3xl">{title}</h2>
            <p className="mt-1 text-sm text-taupe">{text}</p>
          </div>
        </div>
        <div className="border border-dashed border-line" aria-hidden>
          {children}
        </div>
      </div>
    </section>
  );
}

/** Tela 109: vitrine dos estados de carregamento (pré-visualização). */
export default function LoadingShowcasePage() {
  return (
    <>
      <PageHeader
        eyebrow="Estados do sistema"
        title="Carregando"
        text="Esqueletos com pulso suave, nas mesmas proporções do conteúdo final, para evitar saltos de layout."
        crumbs={[{ label: "Mapa do site", href: "/mapa-do-site" }, { label: "Carregando" }]}
      />
      <div className="bg-offwhite">
        <Demo n="01" title="Cabeçalho de página" text="Usado em categorias, listagens e páginas institucionais.">
          <PageHeaderSkeleton />
        </Demo>
        <Demo n="02" title="Grade de produtos" text="Exibido por loading.tsx enquanto as listagens carregam.">
          <div className="bg-offwhite p-4 md:p-8">
            <ToolbarSkeleton />
            <ProductGridSkeleton count={4} />
          </div>
        </Demo>
        <Demo n="03" title="Página de produto" text="Galeria, preço, seletores e botão de compra.">
          <div className="bg-offwhite p-4 md:p-8">
            <ProductPageSkeleton />
          </div>
        </Demo>
        <Demo n="04" title="Linhas de lista" text="Pedidos, endereços, notificações e itens da sacola.">
          <div className="bg-offwhite p-4 md:p-8">
            <ListRowsSkeleton rows={4} />
          </div>
        </Demo>
      </div>
    </>
  );
}
