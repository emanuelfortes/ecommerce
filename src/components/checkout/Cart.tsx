"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2, Tag, X } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { getProduct } from "@/lib/data";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantityStepper } from "@/components/ui/Interactive";

export const FREE_SHIPPING = 399;

export function CartLine({ item, compact }: { item: CartItem; compact?: boolean }) {
  const { updateQty, removeFromCart, money } = useStore();
  const { confirm, toast } = useUI();
  const p = getProduct(item.productId);
  if (!p) return null;
  return (
    <div className="flex gap-4 py-5">
      <Link href={`/produto/${p.slug}`} className={compact ? "w-20 shrink-0" : "w-24 shrink-0 md:w-28"}>
        <ProductImage product={p} color={item.color} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/produto/${p.slug}`} className="font-serif text-lg leading-snug text-graphite hover:text-ink">
              {p.name}
            </Link>
            <p className="mt-1 text-xs text-taupe">
              {item.color} · Tam. {item.size}
            </p>
          </div>
          <button
            aria-label="Remover"
            onClick={() =>
              confirm({
                title: "Remover da sacola?",
                message: `Deseja remover "${p.name}" da sua sacola?`,
                confirmLabel: "Remover",
                tone: "danger",
                onConfirm: () => {
                  removeFromCart(item.key);
                  toast("Item removido", { message: p.name, variant: "info" });
                },
              })
            }
            className="-mr-1 grid size-8 shrink-0 place-items-center text-taupe hover:text-danger"
          >
            <Trash2 className="size-4" strokeWidth={1.2} />
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <QuantityStepper size="sm" value={item.qty} onChange={(q) => updateQty(item.key, q)} />
          <div className="text-right">
            {p.oldPrice && <p className="text-xs text-taupe line-through">{money(p.oldPrice * item.qty)}</p>}
            <p className="text-[15px] font-medium text-ink">{money(p.price * item.qty)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FreeShippingBar() {
  const { subtotal, money } = useStore();
  const missing = Math.max(0, FREE_SHIPPING - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
  return (
    <div className="bg-nude/60 px-5 py-4">
      <p className="text-xs text-graphite">
        {missing > 0 ? (
          <>
            Faltam <strong className="font-medium text-ink">{money(missing)}</strong> para o <strong className="font-medium text-ink">frete grátis</strong>
          </>
        ) : (
          <>
            <span className="text-gold">◆</span> Parabéns! Você ganhou <strong className="font-medium text-ink">frete grátis</strong>
          </>
        )}
      </p>
      <div className="mt-2.5 h-[3px] bg-white">
        <div className="h-full bg-gold transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Tela 32: Aplicação de cupom */
export function CouponInput() {
  const { applyCoupon, activeCoupon, removeCoupon } = useStore();
  const { toast, open } = useUI();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  if (activeCoupon) {
    return (
      <div className="flex items-center justify-between border border-dashed border-gold bg-gold/5 px-4 py-3 text-sm">
        <span className="flex items-center gap-2">
          <Tag className="size-4 text-gold" strokeWidth={1.3} />
          <strong className="font-medium tracking-wider">{activeCoupon.code}</strong>
          <span className="text-taupe">{activeCoupon.title}</span>
        </span>
        <button onClick={removeCoupon} aria-label="Remover cupom" className="text-taupe hover:text-ink">
          <X className="size-4" strokeWidth={1.3} />
        </button>
      </div>
    );
  }
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const r = applyCoupon(code);
          if (r.ok) {
            toast("Cupom aplicado", { message: r.message });
            setError("");
            setCode("");
          } else setError(r.message);
        }}
        className="flex"
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Cupom de desconto"
          aria-label="Cupom de desconto"
          className="field flex-1 uppercase tracking-wider"
        />
        <button className="bg-ink px-5 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold hover:text-ink">
          Aplicar
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <button onClick={() => open({ type: "coupon" })} className="mt-2 text-xs text-taupe underline underline-offset-4 hover:text-ink">
        Ver cupons disponíveis
      </button>
    </div>
  );
}

/** Tela 31: Resumo da compra */
export function OrderSummary({ shipping, showCoupon = true, children }: { shipping?: number | null; showCoupon?: boolean; children?: React.ReactNode }) {
  const { subtotal, discount, money, activeCoupon, cartCount } = useStore();
  const freeByCoupon = activeCoupon?.type === "shipping" && subtotal >= activeCoupon.minValue;
  const ship = shipping == null ? null : subtotal >= FREE_SHIPPING || freeByCoupon ? 0 : shipping;
  const total = Math.max(0, subtotal - discount + (ship ?? 0));
  return (
    <div className="bg-white p-6 md:p-8">
      <h2 className="font-serif text-2xl">Resumo do pedido</h2>
      <span className="gold-rule mt-3" />
      <dl className="mt-6 flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-taupe">Subtotal ({cartCount} {cartCount === 1 ? "item" : "itens"})</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <dt>Desconto ({activeCoupon?.code})</dt>
            <dd>-{money(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-taupe">Frete</dt>
          <dd>{ship == null ? <span className="text-taupe">Calcular na entrega</span> : ship === 0 ? <span className="text-success">Grátis</span> : money(ship)}</dd>
        </div>
      </dl>
      {showCoupon && (
        <div className="mt-6">
          <CouponInput />
        </div>
      )}
      <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
        <span className="text-[12px] uppercase tracking-[0.2em]">Total</span>
        <span className="font-serif text-3xl text-ink">{money(total)}</span>
      </div>
      <p className="mt-1 text-right text-xs text-taupe">ou {money(total * 0.95)} no PIX</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
