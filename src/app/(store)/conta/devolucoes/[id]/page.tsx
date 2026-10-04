import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Package, RotateCcw } from "lucide-react";
import { getOrder, orders } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { privateMeta } from "@/components/account/meta";
import { AccountHeading } from "@/components/account/AccountUI";
import { Button } from "@/components/ui/Button";
import { Notice, Stepper, Timeline } from "@/components/ui/Feedback";
import { Badge } from "@/components/ui/Primitives";
import { Money } from "@/components/product/Price";
import { InfoCard, OrderItemsList } from "@/components/orders/OrderParts";
import { CopyButton } from "@/components/orders/OrderClient";
import { DEMO_TODAY, addDays, orderSubtotal, paymentLabel, protocolFor } from "@/components/orders/orderUtils";

export function generateStaticParams() {
  return orders.filter((o) => o.status !== "cancelado").map((o) => ({ id: protocolFor(o, "devolucao") }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return privateMeta(`Solicitação ${id.toUpperCase()}`);
}

/** Tela 60: Status da devolução (ou troca) */
export default async function ReturnStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const protocol = id.toUpperCase();
  const match = /^(DV|TR)-(\d{6})$/.exec(protocol);
  if (!match) notFound();
  const isExchange = match[1] === "TR";
  const order = getOrder(`KM-${match[2]}`) ?? orders.find((o) => o.status === "entregue");
  if (!order) notFound();

  const steps = ["Solicitada", "Postada", "Recebida", "Em análise", isExchange ? "Nova peça enviada" : "Reembolso"];
  const current = 3;
  const dates = [-6, -5, -2, -1, 2].map((n) => addDays(DEMO_TODAY, n));
  const texts = [
    `Protocolo ${protocol} aberto pelo site.`,
    "Pacote postado em agência dos Correios · São Paulo, SP.",
    "Recebido no Atelier Karen Michelly.",
    "Nossa equipe confere etiquetas, tecido e acabamento.",
    isExchange ? "As novas peças serão enviadas sem custo de frete." : `Reembolso via ${paymentLabel[order.payment]}.`,
  ];
  const timeline = steps.map((title, i) => ({
    title,
    text: i <= current ? texts[i] : undefined,
    date: i < current ? formatDate(dates[i]) : i === current ? "Em andamento" : `Previsão: ${formatDate(dates[i])}`,
    state: (i < current ? "done" : i === current ? "current" : "todo") as "done" | "current" | "todo",
  }));
  const value = orderSubtotal(order);

  return (
    <>
      <Link href={`/conta/pedidos/${order.id}`} className="mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-taupe hover:text-ink">
        <ArrowLeft className="size-3.5" strokeWidth={1.3} /> Pedido {order.id}
      </Link>
      <AccountHeading
        eyebrow={isExchange ? "Troca" : "Devolução"}
        title={isExchange ? "Status da troca" : "Status da devolução"}
        text={`Referente ao pedido ${order.id}. Atualizamos você por e-mail a cada etapa.`}
      />

      <section className="mb-8 border border-line bg-white p-6 md:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-taupe">Protocolo</p>
            <div className="mt-1 flex items-center gap-4">
              <span className="font-serif text-3xl tracking-wide text-ink">{protocol}</span>
              <CopyButton value={protocol} />
            </div>
          </div>
          <Badge tone="gold">{steps[current]}</Badge>
        </div>
        <Stepper steps={steps} current={current} />
        <p className="mt-4 text-sm text-taupe sm:hidden">Etapa atual: {steps[current]}</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <InfoCard title="Andamento" icon={<RotateCcw strokeWidth={1.2} />}>
            <Timeline items={timeline} />
          </InfoCard>
          <InfoCard title="Peças" icon={<Package strokeWidth={1.2} />}>
            <OrderItemsList order={order} />
          </InfoCard>
        </div>
        <div className="flex flex-col gap-6">
          <InfoCard title="Detalhes">
            <dl className="grid gap-4 text-sm">
              {[
                ["Motivo", "Tamanho não serviu"],
                ["Envio", "Postagem em agência"],
                ["Aberta em", formatDate(dates[0])],
                ["Prazo de análise", "Até 3 dias úteis"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-taupe">{k}</dt>
                  <dd className="text-right text-ink">{v}</dd>
                </div>
              ))}
              {!isExchange && (
                <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
                  <dt className="text-taupe">Valor a reembolsar</dt>
                  <dd className="font-serif text-2xl text-ink">
                    <Money value={value} />
                  </dd>
                </div>
              )}
            </dl>
          </InfoCard>
          <Notice tone="info" title="Análise em andamento">
            Assim que a conferência for concluída, {isExchange ? "despachamos as novas peças" : "liberamos o reembolso"} e você recebe a confirmação por e-mail e WhatsApp.
          </Notice>
          <div className="flex flex-col gap-3">
            {!isExchange && (
              <Button href={`/reembolso/${order.id}`} full>
                Acompanhar reembolso
              </Button>
            )}
            <Button href="/contato" variant="secondary" full>
              Falar com o atendimento
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
