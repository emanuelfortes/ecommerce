"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Clock, ShoppingBag } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/Button";
import { EmptyState, Stepper } from "@/components/ui/Feedback";
import { Skeleton } from "@/components/ui/Primitives";
import { OrderSummary } from "@/components/checkout/Cart";
import { CHECKOUT_TTL, computeTotals, useCheckout } from "@/components/checkout/CheckoutState";
import { ItemMiniList, SecureBadges, useCountdown } from "@/components/checkout/CheckoutParts";

export const CHECKOUT_STEPS = ["Identificação", "Entrega", "Pagamento"];

/** Redireciona para /checkout/expirado quando a sessão passa de 30 minutos. */
export function useCheckoutExpiry(active = true) {
  const router = useRouter();
  const { hydrated, data, start } = useCheckout();
  useEffect(() => {
    if (!hydrated || !active) return;
    const check = () => {
      if (data.startedAt !== null && Date.now() - data.startedAt > CHECKOUT_TTL) {
        router.push("/checkout/expirado");
        return true;
      }
      return false;
    };
    if (check()) return;
    if (data.startedAt === null) start();
    const t = window.setInterval(check, 15000);
    return () => window.clearInterval(t);
  }, [hydrated, active, data.startedAt, router, start]);
}

function SessionClock() {
  const { data } = useCheckout();
  const { label, left } = useCountdown(data.startedAt ? data.startedAt + CHECKOUT_TTL : null);
  if (left == null) return null;
  return (
    <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-taupe">
      <Clock className="size-3.5 text-gold" strokeWidth={1.3} />
      Sacola reservada por <span className="tabular-nums text-ink">{label}</span>
    </p>
  );
}

/** Estrutura das etapas do checkout: stepper, conteúdo e resumo lateral fixo. */
export function CheckoutShell({
  step,
  title,
  text,
  children,
  summaryExtra,
}: {
  step: number;
  title: string;
  text?: ReactNode;
  children: ReactNode;
  summaryExtra?: ReactNode;
}) {
  const { cart, hydrated: storeReady, subtotal, discount, activeCoupon, money, cartCount } = useStore();
  const { hydrated, shipping } = useCheckout();
  const [openSummary, setOpenSummary] = useState(false);
  const ready = storeReady && hydrated;
  useCheckoutExpiry(ready && cart.length > 0);

  if (!ready) {
    return (
      <div className="container-km grid gap-10 py-12 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-96 w-full lg:col-span-5" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container-km">
        <EmptyState
          icon={<ShoppingBag />}
          title="Sua sacola está vazia"
          text="Para finalizar uma compra, escolha suas peças favoritas. Elas ficam guardadas aqui enquanto você navega."
          actions={
            <>
              <Button href="/novidades">Explorar novidades</Button>
              <Button href="/" variant="secondary">
                Voltar à loja
              </Button>
            </>
          }
        />
      </div>
    );
  }

  const { total } = computeTotals(subtotal, discount, activeCoupon, shipping?.price ?? null);

  const summary = (
    <>
      <div className="bg-white px-6 pt-6 md:px-8 md:pt-8">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">Sua sacola</span>
          <Link href="/carrinho" className="text-xs text-taupe underline-offset-4 hover:text-ink hover:underline">
            Editar
          </Link>
        </div>
        <ItemMiniList items={cart} className="mt-2 max-h-[300px] overflow-y-auto border-b border-line" />
      </div>
      <OrderSummary shipping={shipping?.price ?? null}>{summaryExtra}</OrderSummary>
    </>
  );

  return (
    <div className="container-km pb-20 pt-8 md:pb-28 md:pt-12">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Stepper steps={CHECKOUT_STEPS} current={step} />
          </div>
          <div className="hidden justify-end lg:col-span-5 lg:flex">
            <SessionClock />
          </div>
        </div>

        {/* Resumo recolhível (mobile) */}
        <div className="mt-8 border border-line bg-white lg:hidden">
          <button
            type="button"
            onClick={() => setOpenSummary((o) => !o)}
            aria-expanded={openSummary}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="flex items-center gap-3 text-[12px] uppercase tracking-[0.18em] text-ink">
              <ShoppingBag className="size-4 text-gold" strokeWidth={1.2} />
              {openSummary ? "Ocultar resumo" : "Ver resumo"} ({cartCount})
            </span>
            <span className="flex items-center gap-2 font-serif text-xl text-ink">
              {money(total)}
              <ChevronDown className={clsx("size-4 text-taupe transition-transform duration-500", openSummary && "rotate-180")} strokeWidth={1.2} />
            </span>
          </button>
          <div
            className={clsx(
              "grid transition-[grid-template-rows] duration-500 ease-[var(--ease-luxe)]",
              openSummary ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="overflow-hidden border-t border-line">{summary}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-12 xl:gap-16 [&>*]:min-w-0">
        <div className="mx-auto w-full max-w-2xl lg:col-span-7 lg:max-w-none">
          <header className="mb-8">
            <span className="eyebrow">
              Etapa {step + 1} de {CHECKOUT_STEPS.length}
            </span>
            <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{title}</h1>
            <span className="gold-rule mt-4" />
            {text && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-taupe">{text}</p>}
            <div className="mt-4 lg:hidden">
              <SessionClock />
            </div>
          </header>
          {children}
        </div>

        <aside className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-8 flex flex-col gap-6">
            <div className="border border-line">{summary}</div>
            <SecureBadges className="px-2" />
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Bloco de revisão com link "Alterar". */
export function ReviewBlock({ title, href, children }: { title: string; href: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-line py-5 last:border-b-0">
      <div className="min-w-0">
        <p className="eyebrow">{title}</p>
        <div className="mt-2 text-sm leading-relaxed text-graphite">{children}</div>
      </div>
      <Link href={href} className="link-luxe shrink-0">
        Alterar
      </Link>
    </div>
  );
}
