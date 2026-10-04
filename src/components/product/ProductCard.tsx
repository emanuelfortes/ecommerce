"use client";

import Link from "next/link";
import clsx from "clsx";
import { Heart, Eye, GitCompare } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent, getBrand } from "@/lib/data";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { Badge, Rating } from "@/components/ui/Primitives";
import { ProductImage } from "./ProductImage";
import { Price } from "./Price";
import { aos } from "@/lib/aos";

export function ProductCard({ product, index = 0, animate = true }: { product: Product; index?: number; animate?: boolean }) {
  const { isWished, toggleWishlist, toggleCompare, compare } = useStore();
  const { open, toast } = useUI();
  const wished = isWished(product.id);
  const off = discountPercent(product);
  const unavailable = product.stock !== "disponivel";
  const comparing = compare.includes(product.id);

  return (
    <article
      {...(animate ? aos.fadeUp((index % 4) * 80) : {})}
      className="group relative flex flex-col border border-transparent bg-white transition-colors duration-500 hover:border-champagne"
    >
      <div className="relative overflow-hidden">
        <Link href={`/produto/${product.slug}`} aria-label={product.name} className="block">
          <ProductImage product={product} className={clsx(unavailable && "opacity-70")} />
          {/* segunda imagem no hover */}
          {(product.images?.length ?? 0) !== 1 && (
            <ProductImage
              product={product}
              index={2}
              className="!absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.stock === "esgotado" && <Badge tone="ink">Esgotado</Badge>}
          {product.stock === "indisponivel" && <Badge tone="white">Indisponível</Badge>}
          {product.isNew && product.stock === "disponivel" && <Badge tone="white">Novo</Badge>}
          {off > 0 && <Badge tone="gold">-{off}%</Badge>}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={() => {
              const added = toggleWishlist(product.id);
              toast(added ? "Adicionado aos favoritos" : "Removido dos favoritos", {
                message: product.name,
                variant: added ? "success" : "info",
              });
            }}
            aria-label={wished ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            aria-pressed={wished}
            className="grid size-9 place-items-center rounded-full bg-white/90 text-ink backdrop-blur transition-colors hover:text-gold"
          >
            <Heart className={clsx("size-4", wished && "fill-gold text-gold")} strokeWidth={1.3} />
          </button>
          <button
            onClick={() => {
              const r = toggleCompare(product.id);
              if (r === "full") toast("Limite atingido", { message: "Compare até 4 produtos por vez.", variant: "error" });
              else toast(r === "added" ? "Adicionado à comparação" : "Removido da comparação", { variant: "info" });
            }}
            aria-label="Comparar"
            aria-pressed={comparing}
            className={clsx(
              "grid size-9 place-items-center rounded-full bg-white/90 backdrop-blur transition-all hover:text-gold md:opacity-0 md:group-hover:opacity-100",
              comparing ? "text-gold md:opacity-100" : "text-ink"
            )}
          >
            <GitCompare className="size-4" strokeWidth={1.3} />
          </button>
        </div>

        <button
          onClick={() => open({ type: "quickview", productId: product.id })}
          className="absolute inset-x-3 bottom-3 flex translate-y-0 items-center justify-center gap-2 bg-ink/90 py-3 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur transition-all duration-500 hover:bg-gold hover:text-ink md:translate-y-[140%] md:group-hover:translate-y-0"
        >
          <Eye className="size-4" strokeWidth={1.3} /> Espiar
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[10px] uppercase tracking-[0.22em] text-taupe">{getBrand(product.brand)?.name}</span>
        <Link href={`/produto/${product.slug}`} className="font-serif text-[19px] leading-snug text-graphite hover:text-ink">
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviewsCount} />
        <div className="mt-auto pt-1">
          <Price price={product.price} oldPrice={product.oldPrice} />
        </div>
        <div className="flex gap-1.5 pt-1">
          {product.colors.map((c) => (
            <span key={c.name} title={c.name} className="size-3 rounded-full border border-black/10" style={{ background: c.hex }} />
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, cols = 4 }: { products: Product[]; cols?: 3 | 4 }) {
  return (
    <div
      className={clsx(
        "grid grid-cols-2 gap-3 md:gap-6",
        cols === 4 ? "lg:grid-cols-4" : "md:grid-cols-3"
      )}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white">
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="flex flex-col gap-2 p-4">
        <div className="skeleton h-2.5 w-16" />
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton h-3 w-20" />
        <div className="skeleton mt-2 h-4 w-24" />
      </div>
    </div>
  );
}
