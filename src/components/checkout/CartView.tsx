"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Gift, Loader2, Lock, ShoppingBag, Truck } from "lucide-react";
import { bestsellers, getProduct, relatedProducts, shippingOptions, similarProducts } from "@/lib/data";
import type { Product } from "@/lib/types";
import { aos } from "@/lib/aos";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs, SectionHeading, Skeleton } from "@/components/ui/Primitives";
import { EmptyState } from "@/components/ui/Feedback";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { CartLine, FREE_SHIPPING, FreeShippingBar, OrderSummary } from "@/components/checkout/Cart";
import { PaymentBadges, SecureBadges, maskCep, onlyDigits } from "@/components/checkout/CheckoutParts";

/** Estimativa de frete por CEP (simulada) */
function ShippingEstimate({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
  const { cep, setCep, hydrated, money, subtotal } = useStore();
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated || !cep) return;
    setInput(cep);
    if (onlyDigits(cep).length === 8) setState("done");
  }, [hydrated, cep]);

  const calc = (e: React.FormEvent) => {
    e.preventDefault();
    if (onlyDigits(input).length !== 8 || /^0+$/.test(onlyDigits(input))) {
      setError("Informe um CEP válido com 8 dígitos.");
      return;
    }
    setError("");
    setState("loading");
    window.setTimeout(() => {
      setCep(input);
      setState("done");
      if (!value) onChange(shippingOptions[0].id);
    }, 600);
  };

  return (
    <div className="border border-line bg-white p-6">
      <p className="flex items-center gap-3 text-[12px] uppercase tracking-[0.18em] text-ink">
        <Truck className="size-4 text-gold" strokeWidth={1.2} /> Calcular frete e prazo
      </p>
      <form onSubmit={calc} className="mt-4 flex">
        <input
          value={input}
          onChange={(e) => setInput(maskCep(e.target.value))}
          inputMode="numeric"
          placeholder="00000-000"
          aria-label="CEP"
          className={clsx("field flex-1", error && "field-error")}
        />
        <button className="flex min-w-24 items-center justify-center bg-ink px-5 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold hover:text-ink">
          {state === "loading" ? <Loader2 className="size-4 animate-spin" strokeWidth={1.3} /> : "Calcular"}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <a
        href="https://buscacepinter.correios.com.br"
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-xs text-taupe underline-offset-4 hover:text-ink hover:underline"
      >
        Não sei meu CEP
      </a>

      {state === "done" && (
        <ul className="mt-5 flex flex-col divide-y divide-line border-t border-line">
          {shippingOptions.map((s) => {
            const free = s.price === 0 || subtotal >= FREE_SHIPPING;
            return (
              <li key={s.id}>
                <label className="flex cursor-pointer items-center gap-3 py-3 text-sm">
                  <input
                    type="radio"
                    name="estimativa"
                    checked={value === s.id}
                    onChange={() => onChange(s.id)}
                    className="size-4 shrink-0 accent-ink"
                  />
                  <span className="flex-1">
                    <span className="block text-ink">{s.name}</span>
                    <span className="block text-xs text-taupe">{s.days}</span>
                  </span>
                  <span className={free ? "text-success" : "text-ink"}>{free ? "Grátis" : money(s.price)}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function crossSell(ids: string[]): Product[] {
  const inCart = new Set(ids);
  const pool: Product[] = [];
  ids.forEach((id) => {
    const p = getProduct(id);
    if (p) pool.push(...relatedProducts(p, 6), ...similarProducts(p, 6));
  });
  pool.push(...bestsellers());
  const seen = new Set<string>();
  return pool.filter((p) => !inCart.has(p.id) && p.stock === "disponivel" && !seen.has(p.id) && seen.add(p.id)).slice(0, 8);
}

/** Telas 23, 24, 25 e 101: Carrinho */
export function CartView() {
  const { cart, hydrated, cartCount, clearCart } = useStore();
  const { confirm, toast } = useUI();
  const [shipId, setShipId] = useState<string | null>(null);
  const ids = cart.map((i) => i.productId).join(",");
  const suggestions = useMemo(() => crossSell(ids ? ids.split(",") : []), [ids]);
  const ship = shippingOptions.find((s) => s.id === shipId)?.price ?? null;

  return (
    <>
      <section className="border-b border-line bg-offwhite">
        <div className="container-km py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Sacola" }]} />
          <div {...aos.fadeUp()} className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Sua seleção</span>
              <h1 className="text-4xl leading-tight md:text-6xl">Sacola</h1>
              <span className="gold-rule mt-1" />
            </div>
            {hydrated && cartCount > 0 && (
              <p className="text-sm text-taupe">
                {cartCount} {cartCount === 1 ? "peça selecionada" : "peças selecionadas"}
              </p>
            )}
          </div>
        </div>
      </section>

      {!hydrated ? (
        <div className="container-km grid gap-10 py-14 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="aspect-[3/4] w-24 md:w-28" />
                <div className="flex flex-1 flex-col gap-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-80 lg:col-span-4" />
        </div>
      ) : cart.length === 0 ? (
        <>
          {/* Telas 24 e 101: carrinho vazio */}
          <div className="container-km">
            <EmptyState
              icon={<ShoppingBag />}
              title="Sua sacola está vazia"
              text="Que tal começar pelas peças mais desejadas da estação? Tudo o que você adicionar fica guardado aqui."
              actions={
                <>
                  <Button href="/novidades">Explorar novidades</Button>
                  <Button href="/favoritos" variant="secondary">
                    Ver favoritos
                  </Button>
                </>
              }
            />
          </div>
          <section className="bg-white py-20 md:py-28">
            <div className="container-km">
              <SectionHeading eyebrow="Inspiração" title="As mais desejadas" text="Peças que conquistaram nossas clientes nesta temporada." />
              <ProductCarousel products={bestsellers().slice(0, 8)} />
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Tela 25: carrinho com produtos */}
          <div className="container-km grid gap-10 py-12 md:py-16 lg:grid-cols-12 xl:gap-16">
            <div className="lg:col-span-7 xl:col-span-8">
              <FreeShippingBar />
              <div className="mt-8 hidden justify-between border-b border-line pb-3 text-[11px] uppercase tracking-[0.2em] text-taupe md:flex">
                <span>Produto</span>
                <span>Total</span>
              </div>
              <div className="divide-y divide-line border-b border-line">
                {cart.map((item) => (
                  <CartLine key={item.key} item={item} />
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-ink hover:text-gold">
                  <ArrowLeft className="size-4" strokeWidth={1.2} /> Continuar comprando
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    confirm({
                      title: "Esvaziar a sacola?",
                      message: "Todas as peças serão removidas da sua sacola.",
                      confirmLabel: "Esvaziar",
                      tone: "danger",
                      onConfirm: () => {
                        clearCart();
                        toast("Sacola esvaziada", { variant: "info" });
                      },
                    })
                  }
                  className="text-xs text-taupe underline-offset-4 hover:text-danger hover:underline"
                >
                  Esvaziar sacola
                </button>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2">
                <ShippingEstimate value={shipId} onChange={setShipId} />
                <div className="flex flex-col gap-5 bg-nude/60 p-6">
                  <p className="flex items-center gap-3 text-[12px] uppercase tracking-[0.18em] text-ink">
                    <Gift className="size-4 text-gold" strokeWidth={1.2} /> Embalagem assinada
                  </p>
                  <p className="text-sm leading-relaxed text-graphite">
                    Todas as peças seguem em caixa Karen Michelly com papel de seda e fita de cetim. Para presentear, escolha a
                    opção na etapa de entrega e inclua uma mensagem.
                  </p>
                  <p className="text-xs text-taupe">Primeira troca grátis em até 30 dias.</p>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-28 flex flex-col gap-6">
                <div className="border border-line">
                  <OrderSummary shipping={ship}>
                    <div className="flex flex-col gap-3">
                      <Button href="/checkout/identificacao" full>
                        <Lock className="size-4" strokeWidth={1.3} /> Finalizar compra
                      </Button>
                      <Button href="/" variant="secondary" full>
                        Continuar comprando
                      </Button>
                    </div>
                  </OrderSummary>
                </div>
                <SecureBadges className="px-2" />
                <PaymentBadges className="px-2" />
              </div>
            </aside>
          </div>

          {suggestions.length > 0 && (
            <section className="border-t border-line bg-white py-20 md:py-28">
              <div className="container-km">
                <SectionHeading
                  align="left"
                  eyebrow="Complete o look"
                  title="Combina com"
                  text="Peças escolhidas pelo nosso ateliê para acompanhar a sua seleção."
                  action={
                    <Link href="/produtos" className="link-luxe flex items-center gap-2">
                      Ver todas <ArrowRight className="size-3.5" strokeWidth={1.3} />
                    </Link>
                  }
                />
                <ProductCarousel products={suggestions} />
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
