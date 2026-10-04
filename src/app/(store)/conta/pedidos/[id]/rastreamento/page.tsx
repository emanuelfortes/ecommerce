import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Truck } from "lucide-react";
import { getOrder, orders } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { privateMeta } from "@/components/account/meta";
import { AccountHeading } from "@/components/account/AccountUI";
import { Button } from "@/components/ui/Button";
import { Notice, Timeline } from "@/components/ui/Feedback";
import { InfoCard, OrderStatusBadge, RouteIllustration } from "@/components/orders/OrderParts";
import { CopyButton } from "@/components/orders/OrderClient";
import { delayedEstimate, orderAddress, routeProgress, trackingEvents } from "@/components/orders/orderUtils";

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return privateMeta(`Rastreamento ${id}`);
}

/** Tela 56: Rastreamento */
export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();
  const address = orderAddress(order);
  const late = order.status === "atrasado";
  const estimate = late ? delayedEstimate(order) : order.estimated;

  return (
    <>
      <Link href={`/conta/pedidos/${order.id}`} className="mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-taupe hover:text-ink">
        <ArrowLeft className="size-3.5" strokeWidth={1.3} /> Pedido {order.id}
      </Link>
      <AccountHeading eyebrow={`Pedido ${order.id}`} title="Rastreamento" text={<OrderStatusBadge status={order.status} />} />

      {order.status === "cancelado" ? (
        <Notice tone="error" title="Pedido cancelado">
          Este pedido foi cancelado antes do envio e não possui rastreamento.{" "}
          <Link href="/conta/pedidos" className="underline decoration-gold underline-offset-4">
            Voltar aos pedidos
          </Link>
        </Notice>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-6">
            {late && (
              <Notice tone="warning" title="Sua entrega atrasou">
                Pedimos desculpas. A transportadora informou nova previsão para {formatDate(estimate)}.{" "}
                <Link href={`/acompanhamento/${order.id}`} className="underline decoration-gold underline-offset-4">
                  Veja o que estamos fazendo
                </Link>
                .
              </Notice>
            )}
            <RouteIllustration progress={routeProgress(order.status)} to={address ? `${address.district} · ${address.city}, ${address.state}` : "Destino"} late={late} />
            <InfoCard title="Histórico de movimentação" icon={<Truck strokeWidth={1.2} />}>
              <Timeline items={trackingEvents(order)} />
            </InfoCard>
          </div>
          <div className="flex flex-col gap-6">
            <section className="bg-ink p-6 text-white md:p-8">
              <p className="eyebrow text-champagne/70">{order.status === "entregue" ? "Entregue em" : "Previsão de entrega"}</p>
              <p className="mt-3 font-serif text-4xl leading-tight">{formatDate(estimate, { weekday: "long", day: "2-digit", month: "long" })}</p>
              <span className="mt-5 block h-px w-12 bg-gold" />
              <p className="mt-5 text-sm text-champagne/80">Entregas de segunda a sábado, das 8h às 20h.</p>
            </section>
            <InfoCard title="Transportadora">
              <p className="text-[15px] text-ink">{order.carrier}</p>
              <div className="mt-5 border-t border-line pt-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-taupe">Código de rastreio</p>
                {order.tracking ? (
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-serif text-2xl tracking-wider text-ink">{order.tracking}</span>
                    <CopyButton value={order.tracking} />
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-taupe">O código fica disponível assim que o pedido for enviado.</p>
                )}
              </div>
            </InfoCard>
            <div className="flex flex-col gap-3">
              <Button href={`/acompanhamento/${order.id}`} full>
                Acompanhamento completo
              </Button>
              <Button href="/contato" variant="secondary" full>
                Falar com o atendimento
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
