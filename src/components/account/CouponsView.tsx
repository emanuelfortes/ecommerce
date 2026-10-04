"use client";

import clsx from "clsx";
import { Ticket } from "lucide-react";
import type { Coupon } from "@/lib/types";
import { coupons } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { aos } from "@/lib/aos";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Tabs } from "@/components/ui/Interactive";
import { CopyButton } from "@/components/orders/OrderClient";
import { AccountHeading } from "./AccountUI";

const headline = (c: Coupon) =>
  c.type === "percent" ? `${c.value}%` : c.type === "fixed" ? formatMoney(c.value).replace(/,00$/, "") : "Frete";

function CouponCard({ coupon, index }: { coupon: Coupon; index: number }) {
  const active = coupon.status === "ativo";
  return (
    <article
      {...aos.fadeUp(index * 70)}
      className={clsx("relative grid grid-cols-[110px_1fr] border bg-white sm:grid-cols-[150px_1fr]", active ? "border-line" : "border-line/70")}
    >
      <div
        className={clsx(
          "relative flex flex-col items-center justify-center border-r border-dashed p-4 text-center",
          active ? "border-gold/60 bg-ink text-white" : "border-line bg-offwhite text-taupe"
        )}
      >
        <span className={clsx("font-serif text-4xl leading-none sm:text-5xl", active ? "text-gold" : "text-taupe")}>{headline(coupon)}</span>
        <span className="mt-2 text-[10px] uppercase tracking-[0.2em]">{coupon.type === "shipping" ? "grátis" : "off"}</span>
        <span className="absolute -right-2.5 -top-2.5 size-5 rounded-full border border-line bg-offwhite" aria-hidden />
        <span className="absolute -bottom-2.5 -right-2.5 size-5 rounded-full border border-line bg-offwhite" aria-hidden />
      </div>
      <div className={clsx("flex flex-col gap-2 p-5 md:p-6", !active && "opacity-70")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-serif text-2xl leading-tight text-ink">{coupon.title}</p>
          {!active && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-taupe">{coupon.status === "usado" ? "Utilizado" : "Expirado"}</span>
          )}
        </div>
        <p className="text-sm text-taupe">{coupon.description}</p>
        <p className="text-xs text-taupe">
          {coupon.minValue ? `Compras acima de ${formatMoney(coupon.minValue)} · ` : ""}
          {active ? "Válido até" : coupon.status === "usado" ? "Usado antes de" : "Expirou em"} {formatDate(coupon.expiresAt)}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <span className={clsx("text-sm tracking-[0.24em]", active ? "text-ink" : "text-taupe line-through")}>{coupon.code}</span>
          {active && <CopyButton value={coupon.code} label="Copiar código" />}
        </div>
      </div>
    </article>
  );
}

/** Tela 62: Cupons (Ativos / Usados / Expirados) */
export function CouponsView() {
  const groups = [
    { id: "ativo", label: "Ativos", empty: "Você não tem cupons ativos no momento." },
    { id: "usado", label: "Usados", empty: "Nenhum cupom utilizado ainda." },
    { id: "expirado", label: "Expirados", empty: "Nenhum cupom expirado." },
  ] as const;
  return (
    <>
      <AccountHeading
        eyebrow="Benefícios"
        title="Meus cupons"
        text="Copie o código e aplique no carrinho ou no checkout. Os cupons não são cumulativos."
        action={
          <Button href="/cupons" variant="secondary" size="sm">
            Ver cupons da loja
          </Button>
        }
      />
      <Tabs
        tabs={groups.map((g) => {
          const list = coupons.filter((c) => (c.status ?? "ativo") === g.id);
          return {
            label: `${g.label} (${list.length})`,
            content: list.length ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {list.map((c, i) => (
                  <CouponCard key={c.code} coupon={c} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState compact icon={<Ticket />} title="Nada por aqui" text={g.empty} />
            ),
          };
        })}
      />
    </>
  );
}
