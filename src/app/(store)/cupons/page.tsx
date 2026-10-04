import type { Metadata } from "next";
import clsx from "clsx";
import { Info, Ticket } from "lucide-react";
import { coupons } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { aos } from "@/lib/aos";
import { Badge, PageHeader, Ornament } from "@/components/ui/Primitives";
import { Notice } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { CopyCoupon } from "@/components/store/CopyCoupon";
import type { Coupon } from "@/lib/types";

export const metadata: Metadata = {
  title: "Cupons",
  description: "Cupons de desconto Karen Michelly: primeira compra, frete grátis e condições especiais.",
};

const statusInfo = {
  ativo: { label: "Ativo", tone: "success" as const },
  usado: { label: "Utilizado", tone: "nude" as const },
  expirado: { label: "Expirado", tone: "danger" as const },
};

function headline(c: Coupon) {
  if (c.type === "percent") return { big: `${c.value}%`, small: "off" };
  if (c.type === "fixed") return { big: `R$ ${c.value}`, small: "off" };
  return { big: "Frete", small: "grátis" };
}

/** Tela 20: Cupons */
export default function CouponsPage() {
  const ordered = [...coupons].sort((a, b) => Number(a.status !== "ativo") - Number(b.status !== "ativo"));

  return (
    <>
      <PageHeader
        eyebrow="Vantagens"
        title="Cupons"
        text="Copie o código e aplique na sua sacola. Um cupom por pedido."
        crumbs={[{ label: "Cupons" }]}
      />

      <section className="bg-offwhite py-20 md:py-28">
        <div className="container-km grid gap-6 md:grid-cols-2">
          {ordered.map((c, i) => {
            const status = c.status ?? "ativo";
            const active = status === "ativo";
            const h = headline(c);
            return (
              <article
                key={c.code}
                {...aos.fadeUp((i % 2) * 100)}
                className={clsx(
                  "relative flex overflow-hidden border",
                  active ? "border-line bg-white" : "border-dashed border-line bg-offwhite"
                )}
              >
                {/* Canhoto */}
                <div
                  className={clsx(
                    "relative flex w-32 shrink-0 flex-col items-center justify-center gap-1 px-3 py-8 text-center sm:w-40",
                    active ? "bg-ink text-white" : "bg-nude/60 text-taupe"
                  )}
                >
                  <Ticket className={clsx("size-5", active ? "text-gold" : "text-taupe")} strokeWidth={1.1} />
                  <span className={clsx("font-serif text-4xl leading-none", !active && "line-through decoration-1")}>{h.big}</span>
                  <span className="text-[10px] uppercase tracking-[0.24em]">{h.small}</span>
                  {/* recortes */}
                  <span className="absolute -right-2.5 -top-2.5 size-5 rounded-full bg-offwhite" />
                  <span className="absolute -bottom-2.5 -right-2.5 size-5 rounded-full bg-offwhite" />
                </div>

                <div className={clsx("flex flex-1 flex-col gap-3 border-l border-dashed border-champagne p-6", !active && "opacity-70")}>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-serif text-2xl leading-tight text-ink">{c.title}</h2>
                    <Badge tone={statusInfo[status].tone}>{statusInfo[status].label}</Badge>
                  </div>
                  <p className="text-sm text-taupe">{c.description}</p>
                  <ul className="flex flex-col gap-1 text-xs text-graphite">
                    <li>{c.minValue > 0 ? `Pedido mínimo de ${formatMoney(c.minValue)}` : "Sem valor mínimo"}</li>
                    <li>
                      {status === "expirado" ? "Expirou em " : "Válido até "}
                      {formatDate(c.expiresAt)}
                    </li>
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4">
                    <span
                      className={clsx(
                        "border border-dashed px-3 py-1.5 font-medium tracking-[0.2em]",
                        active ? "border-gold text-ink" : "border-line text-taupe line-through"
                      )}
                    >
                      {c.code}
                    </span>
                    {active ? (
                      <CopyCoupon code={c.code} />
                    ) : (
                      <span className="text-[11px] uppercase tracking-[0.2em] text-taupe">
                        {status === "usado" ? "Já utilizado" : "Indisponível"}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="container-km mt-14 max-w-3xl" {...aos.fadeUp()}>
          <Notice tone="info" icon={<Info strokeWidth={1.3} />} title="Regras de uso">
            <ul className="mt-1 list-disc space-y-1 pl-4">
              <li>Apenas um cupom por pedido, não cumulativo com outras promoções.</li>
              <li>O desconto é aplicado sobre o valor dos produtos, sem incluir o frete.</li>
              <li>Cupons de primeira compra são válidos somente para novos cadastros.</li>
              <li>Em caso de troca ou devolução, o valor do desconto não é reembolsado.</li>
            </ul>
          </Notice>
        </div>
      </section>

      <section className="bg-ink py-20 text-center md:py-24">
        <div className="container-km" {...aos.fadeUp()}>
          <Ornament className="mb-6" />
          <p className="eyebrow text-champagne/70">Cupom em mãos?</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl text-white md:text-5xl">Escolha suas peças favoritas</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/ofertas" variant="gold">
              Ver ofertas
            </Button>
            <Button href="/novidades" variant="light">
              Novidades
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
