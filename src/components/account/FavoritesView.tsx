"use client";

import { Heart } from "lucide-react";
import { getProduct } from "@/lib/data";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { AccountHeading } from "./AccountUI";

/** Tela 63: Favoritos dentro da conta */
export function FavoritesView() {
  const { wishlist, hydrated, toggleWishlist } = useStore();
  const { confirm, toast } = useUI();
  const items = wishlist.map((id) => getProduct(id)).filter((p): p is Product => Boolean(p));

  return (
    <>
      <AccountHeading
        eyebrow="Lista de desejos"
        title="Favoritos"
        text={hydrated && items.length ? `${items.length} ${items.length > 1 ? "peças salvas" : "peça salva"}. Avisamos quando houver queda de preço ou poucas unidades.` : "As peças que você ama, reunidas em um só lugar."}
        action={
          hydrated && items.length > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                confirm({
                  title: "Limpar favoritos?",
                  message: "Todas as peças serão removidas da sua lista de desejos.",
                  confirmLabel: "Limpar",
                  tone: "danger",
                  onConfirm: () => {
                    items.forEach((p) => toggleWishlist(p.id));
                    toast("Lista de desejos limpa", { variant: "info" });
                  },
                })
              }
            >
              Limpar lista
            </Button>
          ) : undefined
        }
      />
      {!hydrated ? (
        <div className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length ? (
        <div className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-3">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="border border-line bg-white px-6">
          <EmptyState
            icon={<Heart />}
            title="Sua lista está vazia"
            text="Toque no coração das peças que você ama para salvá-las aqui e acompanhar preço e disponibilidade."
            actions={
              <>
                <Button href="/novidades">Descobrir novidades</Button>
                <Button href="/mais-vendidos" variant="secondary">
                  Mais vendidos
                </Button>
              </>
            }
          />
        </div>
      )}
    </>
  );
}
