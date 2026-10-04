"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { ShoppingBag, HeartOff, Copy, Check, Ticket, ArrowRight } from "lucide-react";
import { coupons, getBrand, getProduct, products } from "@/lib/data";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Rating, Badge } from "@/components/ui/Primitives";
import { SizeSelector, ColorSelector, QuantityStepper } from "@/components/ui/Interactive";
import { ProductImage } from "@/components/product/ProductImage";
import { Price } from "@/components/product/Price";
import { CartLine, FreeShippingBar } from "@/components/checkout/Cart";
import { formatDate } from "@/lib/format";

/** Tela 115: Mini-cart / Cart Drawer */
export function CartDrawer() {
  const { is, close } = useUI();
  const { cart, subtotal, money, cartCount } = useStore();
  return (
    <Drawer
      open={is("cart")}
      onClose={close}
      title={
        <span>
          Sacola <span className="text-base text-taupe">({cartCount})</span>
        </span>
      }
      footer={
        cart.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[12px] uppercase tracking-[0.2em]">Subtotal</span>
              <span className="font-serif text-2xl text-ink">{money(subtotal)}</span>
            </div>
            <p className="text-xs text-taupe">Frete e cupons calculados no checkout.</p>
            <Button href="/checkout" full>
              Finalizar compra
            </Button>
            <Button href="/carrinho" variant="secondary" full>
              Ver sacola
            </Button>
          </div>
        )
      }
    >
      {cart.length === 0 ? (
        <EmptyState
          compact
          icon={<ShoppingBag />}
          title="Sua sacola está vazia"
          text="Descubra peças pensadas para você."
          actions={
            <Button href="/novidades" onClick={close}>
              Ver novidades
            </Button>
          }
        />
      ) : (
        <>
          <FreeShippingBar />
          <div className="divide-y divide-line px-6">
            {cart.map((i) => (
              <CartLine key={i.key} item={i} compact />
            ))}
          </div>
        </>
      )}
    </Drawer>
  );
}

/** Tela 116: Wishlist Drawer */
export function WishlistDrawer() {
  const { is, close, open, toast } = useUI();
  const { wishlist, toggleWishlist, money } = useStore();
  const items = wishlist.map((id) => getProduct(id)).filter(Boolean) as typeof products;
  return (
    <Drawer
      open={is("wishlist")}
      onClose={close}
      title={
        <span>
          Favoritos <span className="text-base text-taupe">({items.length})</span>
        </span>
      }
      footer={
        items.length > 0 && (
          <Button href="/favoritos" variant="secondary" full>
            Ver todos os favoritos
          </Button>
        )
      }
    >
      {items.length === 0 ? (
        <EmptyState
          compact
          icon={<HeartOff />}
          title="Nenhum favorito ainda"
          text="Toque no coração das peças que você ama para salvá-las aqui."
          actions={
            <Button href="/mais-vendidos" onClick={close}>
              Explorar
            </Button>
          }
        />
      ) : (
        <div className="divide-y divide-line px-6">
          {items.map((p) => (
            <div key={p.id} className="flex gap-4 py-5">
              <Link href={`/produto/${p.slug}`} className="w-20 shrink-0">
                <ProductImage product={p} />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link href={`/produto/${p.slug}`} className="font-serif text-lg leading-snug">
                  {p.name}
                </Link>
                <p className="text-sm text-ink">{money(p.price)}</p>
                <div className="mt-auto flex gap-4 pt-2 text-[11px] uppercase tracking-[0.18em]">
                  <button onClick={() => open({ type: "quickview", productId: p.id })} className="text-ink hover:text-gold">
                    Comprar
                  </button>
                  <button
                    onClick={() => {
                      toggleWishlist(p.id);
                      toast("Removido dos favoritos", { variant: "info" });
                    }}
                    className="text-taupe hover:text-danger"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
}

/** Tela 119: Quick View do produto */
export function QuickView() {
  const { overlay, close, open, toast } = useUI();
  const { addToCart, isWished, toggleWishlist } = useStore();
  const p = overlay?.type === "quickview" ? getProduct(overlay.productId) : undefined;
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (p) {
      setSize(p.sizes.length === 1 ? p.sizes[0] : "");
      setColor(p.colors[0].name);
      setQty(1);
      setImg(0);
      setErr("");
    }
  }, [p]);

  return (
    <Modal open={!!p} onClose={close} size="xl">
      {p && (
        <div className="grid md:grid-cols-2">
          <div className="bg-nude">
            <ProductImage product={p} index={img} color={color} />
            <div className={clsx("grid grid-cols-4 gap-1 p-1", p.images?.length === 1 && "hidden")}>
              {(p.images?.length ? p.images.map((_, i) => i) : [0, 1, 2, 3]).map((i) => (
                <button key={i} onClick={() => setImg(i)} className={img === i ? "ring-1 ring-ink" : "opacity-70 hover:opacity-100"} aria-label={`Imagem ${i + 1}`}>
                  <ProductImage product={p} index={i} color={color} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5 p-6 md:p-10">
            <div>
              <span className="eyebrow">{getBrand(p.brand)?.name}</span>
              <h2 className="mt-2 text-3xl leading-tight md:text-4xl">{p.name}</h2>
              <div className="mt-3">
                <Rating value={p.rating} count={p.reviewsCount} />
              </div>
            </div>
            <Price price={p.price} oldPrice={p.oldPrice} size="lg" showInstallments showPix />
            <p className="text-sm leading-relaxed text-graphite/80">{p.description}</p>
            <div>
              <p className="field-label">Cor: <span className="normal-case tracking-normal text-taupe">{color}</span></p>
              <ColorSelector colors={p.colors} value={color} onChange={setColor} />
            </div>
            <div>
              <p className="field-label">Tamanho</p>
              <SizeSelector sizes={p.sizes} value={size} onChange={(s) => { setSize(s); setErr(""); }} />
              {err && <p className="mt-2 text-xs text-danger">{err}</p>}
            </div>
            {p.stock === "disponivel" ? (
              <div className="flex gap-3">
                <QuantityStepper value={qty} onChange={setQty} />
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (!size) return setErr("Selecione um tamanho.");
                    addToCart(p.id, size, color, qty);
                    toast("Adicionado à sacola", { message: `${p.name} · ${color} · ${size}` });
                    open({ type: "cart" });
                  }}
                >
                  Adicionar à sacola
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Badge tone="ink" className="self-start">{p.stock === "esgotado" ? "Esgotado" : "Indisponível"}</Badge>
                <Button variant="secondary" onClick={() => toast("Avisaremos você", { message: "Assim que a peça voltar ao estoque." })}>
                  Avise-me quando chegar
                </Button>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-line pt-5 text-[11px] uppercase tracking-[0.18em]">
              <button
                onClick={() => {
                  const added = toggleWishlist(p.id);
                  toast(added ? "Adicionado aos favoritos" : "Removido dos favoritos", { variant: added ? "success" : "info" });
                }}
                className="hover:text-gold"
              >
                {isWished(p.id) ? "♥ Nos favoritos" : "♡ Favoritar"}
              </button>
              <Link href={`/produto/${p.slug}`} onClick={close} className="flex items-center gap-2 hover:text-gold">
                Ver detalhes <ArrowRight className="size-3.5" strokeWidth={1.3} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

/** Tela 124: Modal de cupom */
export function CouponModal() {
  const { is, close, toast } = useUI();
  const { applyCoupon, cart } = useStore();
  const [copied, setCopied] = useState<string | null>(null);
  const active = coupons.filter((c) => c.status === "ativo");
  return (
    <Modal open={is("coupon")} onClose={close} size="md">
      <div className="bg-ink px-8 pb-8 pt-10 text-center text-white">
        <Ticket className="mx-auto size-8 text-gold" strokeWidth={1} />
        <p className="eyebrow mt-4 text-champagne/80">Presente para você</p>
        <h2 className="mt-2 text-4xl text-white">Cupons exclusivos</h2>
        <p className="mt-2 text-sm text-champagne">Copie o código ou aplique direto na sua sacola.</p>
      </div>
      <div className="flex flex-col gap-3 p-6">
        {active.map((c) => (
          <div key={c.code} className="flex items-center gap-4 border border-dashed border-champagne bg-white p-4">
            <div className="flex-1">
              <p className="font-serif text-xl text-ink">{c.title}</p>
              <p className="text-xs text-taupe">{c.description} Válido até {formatDate(c.expiresAt, { day: "2-digit", month: "2-digit" })}.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(c.code).catch(() => {});
                  setCopied(c.code);
                  window.setTimeout(() => setCopied(null), 1500);
                }}
                className="flex items-center gap-1.5 border border-ink px-3 py-1.5 text-xs tracking-widest"
              >
                {c.code} {copied === c.code ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" strokeWidth={1.3} />}
              </button>
              {cart.length > 0 && (
                <button
                  onClick={() => {
                    const r = applyCoupon(c.code);
                    toast(r.ok ? "Cupom aplicado" : "Não foi possível aplicar", { message: r.message, variant: r.ok ? "success" : "error" });
                    if (r.ok) close();
                  }}
                  className="text-[11px] uppercase tracking-[0.18em] text-ink underline decoration-gold underline-offset-4"
                >
                  Aplicar
                </button>
              )}
            </div>
          </div>
        ))}
        <Link href="/cupons" onClick={close} className="link-luxe mx-auto mt-3">
          Ver todos os cupons
        </Link>
      </div>
    </Modal>
  );
}
