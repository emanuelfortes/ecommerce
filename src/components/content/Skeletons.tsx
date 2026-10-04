import { Skeleton } from "@/components/ui/Primitives";
import { ProductCardSkeleton } from "@/components/product/ProductCard";

/** Tela 109: blocos de carregamento reutilizáveis (sem animação de scroll, apenas pulso). */

export function PageHeaderSkeleton() {
  return (
    <div className="border-b border-line bg-offwhite">
      <div className="container-km flex flex-col gap-4 py-10 md:py-16">
        <Skeleton className="h-2.5 w-40" />
        <Skeleton className="mt-4 h-3 w-24" />
        <Skeleton className="h-12 w-3/4 max-w-xl md:h-16" />
        <span className="gold-rule opacity-40" />
        <Skeleton className="h-3.5 w-full max-w-lg" />
        <Skeleton className="h-3.5 w-2/3 max-w-sm" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ToolbarSkeleton() {
  return (
    <div className="mb-8 flex items-center justify-between border-b border-line pb-5">
      <Skeleton className="h-10 w-28" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-10 w-44" />
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="grid grid-cols-[72px_1fr] gap-3 lg:col-span-7">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
        <Skeleton className="aspect-[3/4] w-full" />
      </div>
      <div className="flex flex-col gap-4 lg:col-span-5">
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-2 h-9 w-40" />
        <Skeleton className="h-3 w-56" />
        <div className="mt-6 flex gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="size-9 rounded-full" />
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="size-11" />
          ))}
        </div>
        <Skeleton className="mt-6 h-12 w-full" />
        <Skeleton className="h-12 w-full opacity-60" />
        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function ListRowsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul className="divide-y divide-line border-y border-line bg-white">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex items-center gap-5 p-5">
          <Skeleton className="aspect-[3/4] w-16 shrink-0" />
          <div className="flex flex-1 flex-col gap-2.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-2/3 max-w-xs" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="hidden h-6 w-24 sm:block" />
          <Skeleton className="h-9 w-20" />
        </li>
      ))}
    </ul>
  );
}
