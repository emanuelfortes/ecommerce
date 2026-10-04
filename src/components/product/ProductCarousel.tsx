"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductCarousel({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:gap-6 md:px-0">
        {products.map((p, i) => (
          <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
      <div className="mt-8 hidden justify-end gap-2 md:flex">
        <button onClick={() => scroll(-1)} aria-label="Anterior" className="grid size-11 place-items-center border border-ink text-ink transition-colors hover:bg-ink hover:text-white">
          <ArrowLeft className="size-4" strokeWidth={1.3} />
        </button>
        <button onClick={() => scroll(1)} aria-label="Próximo" className="grid size-11 place-items-center border border-ink text-ink transition-colors hover:bg-ink hover:text-white">
          <ArrowRight className="size-4" strokeWidth={1.3} />
        </button>
      </div>
    </div>
  );
}
