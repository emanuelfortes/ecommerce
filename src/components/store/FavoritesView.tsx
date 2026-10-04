"use client";

import Link from "next/link";
import { Heart, ShoppingBag, X, Share2 } from "lucide-react";
import { bestsellers, getBrand, getProduct } from "@/lib/data";
import type { Product } from "@/lib/types";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { EmptyState } from "@/components/ui/Feedback";
import { Badge, SectionHeading } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductCardSkeleton } from "@/components/product/ProductCard";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { Price } from "@/components/product/Price";
import { aos } from "@/lib/aos";

/** Telas 15 (Lista de desejos) e 102 (Lista vazia) */
export function FavoritesView() {
  const { wishlist, hydrated, toggleWishlist, money } = useStore();
  const { open, toast, confirm } = useUI();
  const items = wishlist.map((id) => getProduct(id)).filter((p): p is Product => !!p);
  const total = items.reduce((s, p) => s + p.price, 0);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <EmptyState
          icon={<Heart />}
          title="Sua lista de desejos está vazia"
          text="Toque no coração das peças que você ama para guardá-las aqui e acompanhar preço e disponibilidade."
          actions={
            <>
              <Button href="/novidades">Descobrir novidades</Button>
              <Button href="/mais-vendidos" variant="secondary">
                Mais vendidos
              </Button>
            </>
          }
        />
        <div className="border-t border-line pt-20">
          <SectionHeading align="left" eyebrow="Inspiração" title="Peças que nossas clientes amam" />
          <ProductCarousel products={bestsellers().slice(0, 8)} />
        </div>
      </>
    );
  }

  const remove = (p: Product) => {
    toggleWishlist(p.id);
    toast("Removido dos favoritos", { message: p.name, variant: "info" });
  };

  const share = async () => {
    const text = `Minha lista Karen Michelly: ${items.map((p) => p.name).join(", ")}`;
    try {
      if (navigator.share) await navigator.share({ title: "Minha lista de desejos", text, url: window.location.href });
      else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        toast("Lista copiada", { message: "Cole onde quiser para compartilhar.", variant: "info" });
      }
    } catch {
      /* cancelado */
    }
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <p className="text-sm text-taupe">
          {items.length} {items.length === 1 ? "peça salva" : "peças salvas"} · <span className="text-ink">{money(total)}</span>
        </p>
        <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.18em]">
          <button onClick={share} className="flex items-center gap-2 text-graphite hover:text-gold">
            <Share2 className="size-4" strokeWidth={1.3} /> Compartilhar
          </button>
          <button
            onClick={() =>
              confirm({
                title: "Limpar lista de desejos?",
                message: "Todas as peças salvas serão removidas. Esta ação não pode ser desfeita.",
                confirmLabel: "Limpar lista",
                tone: "danger",
                onConfirm: () => {
                  items.forEach((p) => toggleWishlist(p.id));
                  toast("Lista de desejos limpa", { variant: "info" });
                },
              })
            }
            className="text-taupe underline underline-offset-4 hover:text-ink"
          >
            Limpar lista
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
        {items.map((p, i) => {
          const available = p.stock === "disponivel";
          return (
            <article key={p.id} {...aos.fadeUp((i % 4) * 80)} className="group relative flex flex-col border border-transparent bg-white transition-colors duration-500 hover:border-champagne">
              <div className="relative">
                <Link href={`/produto/${p.slug}`} aria-label={p.name}>
                  <ProductImage product={p} className={available ? undefined : "opacity-70"} />
                </Link>
                <button
                  onClick={() => remove(p)}
                  aria-label={`Remover ${p.name} dos favoritos`}
                  className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-ink backdrop-blur transition-colors hover:text-gold"
                >
                  <X className="size-4" strokeWidth={1.3} />
                </button>
                <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
                  {p.stock === "esgotado" && <Badge tone="ink">Esgotado</Badge>}
                  {p.stock === "indisponivel" && <Badge tone="white">Indisponível</Badge>}
                  {p.oldPrice && <Badge tone="gold">Baixou de preço</Badge>}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <span className="text-[10px] uppercase tracking-[0.22em] text-taupe">{getBrand(p.brand)?.name}</span>
                <Link href={`/produto/${p.slug}`} className="font-serif text-[19px] leading-snug text-graphite hover:text-ink">
                  {p.name}
                </Link>
                <div className="mt-auto pt-1">
                  <Price price={p.price} oldPrice={p.oldPrice} />
                </div>
                {available ? (
                  <Button size="sm" className="mt-3" onClick={() => open({ type: "quickview", productId: p.id })}>
                    <ShoppingBag className="size-3.5" strokeWidth={1.3} /> Mover para a sacola
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" className="mt-3" href={`/produto/${p.slug}`}>
                    {p.stock === "esgotado" ? "Avise-me" : "Ver similares"}
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
