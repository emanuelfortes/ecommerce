import { PageHeaderSkeleton, ProductGridSkeleton, ToolbarSkeleton } from "@/components/content/Skeletons";

/** Tela 109: carregamento padrão das páginas da loja. */
export default function StoreLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando conteúdo</span>
      <PageHeaderSkeleton />
      <section className="bg-offwhite py-12 md:py-16">
        <div className="container-km">
          <ToolbarSkeleton />
          <ProductGridSkeleton count={8} />
        </div>
      </section>
    </div>
  );
}
