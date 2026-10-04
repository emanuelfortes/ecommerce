"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { Heart, Share2, Truck, RefreshCcw, ShieldCheck, Gift, AlertCircle, ArrowDown } from "lucide-react";
import type { Product } from "@/lib/types";
import { getBrand } from "@/lib/data";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { Price } from "@/components/product/Price";
import { Badge, Rating } from "@/components/ui/Primitives";
import { ColorSelector, QuantityStepper, SizeSelector } from "@/components/ui/Interactive";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Feedback";
import { Gallery } from "./Gallery";
import { SizeGuide } from "./SizeGuide";
import { ShippingCalc } from "./ShippingCalc";
import { NotifyMe } from "./NotifyMe";

const perks = [
  { icon: Truck, text: "Frete grátis acima de R$ 399" },
  { icon: RefreshCcw, text: "Primeira troca grátis em até 30 dias" },
  { icon: ShieldCheck, text: "Compra 100% segura" },
  { icon: Gift, text: "Embalagem presente assinada" },
];

/** Tela 9: bloco principal da página de produto (galeria + informações + compra). */
export function ProductHero({ product, children }: { product: Product; children?: ReactNode }) {
  const { addToCart, isWished, toggleWishlist, money, hydrated } = useStore();
  const { open, toast } = useUI();
  const brand = getBrand(product.brand);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [showBar, setShowBar] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const available = product.stock === "disponivel";
  const wished = hydrated && isWished(product.id);

  // Barra fixa no mobile aparece quando o botão principal sai da tela
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = () => {
    if (!size) {
      setError("Selecione um tamanho para continuar.");
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addToCart(product.id, size, color, qty);
    toast("Adicionado à sacola", { message: `${product.name} · ${color} · ${size}` });
    open({ type: "cart" });
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast("Link copiado", { message: "Compartilhe com quem você quiser.", variant: "info" });
    } catch {
      /* compartilhamento cancelado */
    }
  };

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-28">
            <Gallery product={product} color={color} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-col gap-7">
            <div>
              {brand && (
                <Link href={`/marcas/${brand.slug}`} className="eyebrow transition-colors hover:text-gold">
                  {brand.name}
                </Link>
              )}
              <h1 className="mt-3 text-4xl leading-[1.05] text-ink md:text-5xl">{product.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <a href="#avaliacoes" className="flex items-center gap-2 hover:text-ink">
                  <Rating value={product.rating} size="md" />
                  <span className="text-xs text-taupe underline underline-offset-4">
                    {product.rating.toFixed(1)} · {product.reviewsCount} avaliações
                  </span>
                </a>
                <span className="text-[10px] uppercase tracking-[0.2em] text-taupe">Ref. KM{product.id.slice(1).padStart(4, "0")}</span>
              </div>
            </div>

            <div className="border-y border-line py-6">
              <Price price={product.price} oldPrice={product.oldPrice} size="lg" showInstallments showPix />
            </div>

            {product.stock === "indisponivel" ? (
              <div className="flex flex-col gap-4">
                <Notice tone="warning" icon={<AlertCircle strokeWidth={1.3} />} title="Produto indisponível">
                  Esta peça saiu de linha e não está mais à venda. Separamos sugestões parecidas para você logo abaixo.
                </Notice>
                <Button href="#similares" variant="secondary">
                  Ver peças similares <ArrowDown className="size-4" strokeWidth={1.3} />
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <p className="field-label">
                    Cor: <span className="normal-case tracking-normal text-taupe">{color}</span>
                  </p>
                  <ColorSelector colors={product.colors} value={color} onChange={setColor} />
                </div>

                <div ref={sizeRef}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="field-label mb-0">
                      Tamanho{size && <span className="normal-case tracking-normal text-taupe">: {size}</span>}
                    </p>
                    <SizeGuide product={product} />
                  </div>
                  <SizeSelector
                    sizes={product.sizes}
                    value={size}
                    unavailable={available ? [] : product.sizes}
                    onChange={(s) => {
                      setSize(s);
                      setError("");
                    }}
                  />
                  {error && <p className="mt-2 text-xs text-danger">{error}</p>}
                </div>

                <div ref={buyRef}>
                  {available ? (
                    <div className="flex gap-3">
                      <QuantityStepper value={qty} onChange={setQty} />
                      <Button className="flex-1" onClick={add}>
                        Adicionar à sacola
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <Badge tone="ink">Esgotado</Badge>
                        <span className="text-sm text-taupe">Todos os tamanhos esgotados no momento.</span>
                      </div>
                      <Button disabled full>
                        Esgotado
                      </Button>
                      <NotifyMe productName={product.name} />
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.18em]">
              <button
                onClick={() => {
                  const added = toggleWishlist(product.id);
                  toast(added ? "Adicionado aos favoritos" : "Removido dos favoritos", {
                    message: product.name,
                    variant: added ? "success" : "info",
                  });
                }}
                aria-pressed={wished}
                className="flex items-center gap-2 text-graphite transition-colors hover:text-gold"
              >
                <Heart className={clsx("size-4", wished && "fill-gold text-gold")} strokeWidth={1.3} />
                {wished ? "Nos favoritos" : "Favoritar"}
              </button>
              <button onClick={share} className="flex items-center gap-2 text-graphite transition-colors hover:text-gold">
                <Share2 className="size-4" strokeWidth={1.3} /> Compartilhar
              </button>
            </div>

            {product.stock !== "indisponivel" && <ShippingCalc price={product.price} />}

            <ul className="grid grid-cols-2 gap-4 border-t border-line pt-6">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-xs leading-relaxed text-graphite">
                  <Icon className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.1} />
                  {text}
                </li>
              ))}
            </ul>

            {children}
          </div>
        </div>
      </div>

      {/* Barra fixa de compra no mobile */}
      {product.stock !== "indisponivel" && (
        <div
          className={clsx(
            "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-offwhite/95 px-4 py-3 backdrop-blur transition-transform duration-500 ease-[var(--ease-luxe)] lg:hidden",
            showBar ? "translate-y-0" : "translate-y-full"
          )}
          aria-hidden={!showBar}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-lg leading-tight text-ink">{product.name}</p>
              <p className="text-xs text-taupe">
                <span className="tabular-nums text-ink">{money(product.price)}</span>
                {size ? ` · Tam. ${size}` : " · Escolha o tamanho"}
              </p>
            </div>
            {available ? (
              <Button size="sm" onClick={add} tabIndex={showBar ? 0 : -1}>
                Adicionar
              </Button>
            ) : (
              <Button size="sm" href="#avise-me" variant="secondary" tabIndex={showBar ? 0 : -1}>
                Avise-me
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
