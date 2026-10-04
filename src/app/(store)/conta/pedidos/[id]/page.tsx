import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CreditCard, MapPin, Package, Repeat2, RotateCcw, Star, Truck, X, CircleQuestionMark } from "lucide-react";
import { getOrder, orders } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { privateMeta } from "@/components/account/meta";
import { AccountHeading } from "@/components/account/AccountUI";
import { Button } from "@/components/ui/Button";
import { Timeline } from "@/components/ui/Feedback";
import { InfoCard, OrderItemsList, OrderStatusBadge, OrderTotals } from "@/components/orders/OrderParts";
import { CopyButton, InvoiceButton } from "@/components/orders/OrderClient";
import { canCancel, orderAddress, paymentDetail, paymentLabel, statusTimeline } from "@/components/orders/orderUtils";

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return privateMeta(`Pedido ${id}`);
}

/** Tela 55: Detalhes do pedido */
export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();
  const address = orderAddress(order);
  const cancelled = order.status === "cancelado";
  const delivered = order.status === "entregue";

  return (
    <>
      <Link href="/conta/pedidos" className="mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-taupe hover:text-ink">
        <ArrowLeft className="size-3.5" strokeWidth={1.3} /> Meus pedidos
      </Link>
      <AccountHeading
        eyebrow={`Realizado em ${formatDate(order.date)}`}
        title={`Pedido ${order.id}`}
        text={<OrderStatusBadge status={order.status} />}
      />

      <div className="mb-10 flex flex-wrap gap-3">
        {!cancelled && (
          <Button href={`/conta/pedidos/${order.id}/rastreamento`} size="sm">
            <Truck className="size-4" strokeWidth={1.3} /> Rastrear
          </Button>
        )}
        {delivered && (
          <Button href={`/avaliar/pedido/${order.id}`} size="sm" variant="secondary">
            <Star className="size-4" strokeWidth={1.3} /> Avaliar compra
          </Button>
        )}
        {canCancel(order.status) && (
          <Button href={`/conta/pedidos/${order.id}/cancelar`} size="sm" variant="secondary">
            <X className="size-4" strokeWidth={1.3} /> Cancelar pedido
          </Button>
        )}
        {!cancelled && (
          <>
            <Button href={`/conta/pedidos/${order.id}/troca`} size="sm" variant="secondary">
              <Repeat2 className="size-4" strokeWidth={1.3} /> Trocar
            </Button>
            <Button href={`/conta/pedidos/${order.id}/devolucao`} size="sm" variant="secondary">
              <RotateCcw className="size-4" strokeWidth={1.3} /> Devolver
            </Button>
          </>
        )}
        {!cancelled && <InvoiceButton orderId={order.id} />}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <InfoCard title="Peças do pedido" icon={<Package strokeWidth={1.2} />}>
            <OrderItemsList order={order} reviewLinks={delivered} />
          </InfoCard>
          <InfoCard
            title="Status"
            icon={<Truck strokeWidth={1.2} />}
            action={
              !cancelled ? (
                <Link href={`/acompanhamento/${order.id}`} className="link-luxe">
                  Acompanhamento
                </Link>
              ) : undefined
            }
          >
            <Timeline items={statusTimeline(order)} />
          </InfoCard>
        </div>

        <div className="flex flex-col gap-6">
          <InfoCard title="Resumo">
            <OrderTotals order={order} />
          </InfoCard>
          <InfoCard title="Pagamento" icon={<CreditCard strokeWidth={1.2} />}>
            <p className="text-[15px] text-ink">{paymentLabel[order.payment]}</p>
            <p className="mt-1 text-sm text-taupe">{paymentDetail[order.payment]}</p>
          </InfoCard>
          <InfoCard title="Entrega" icon={<MapPin strokeWidth={1.2} />}>
            {address && (
              <div className="text-sm leading-relaxed text-graphite">
                <p className="text-ink">
                  {address.recipient} · {address.label}
                </p>
                <p>
                  {address.street}, {address.number}
                  {address.complement ? `, ${address.complement}` : ""}
                </p>
                <p>
                  {address.district} · {address.city}, {address.state} · {address.zip}
                </p>
              </div>
            )}
            <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-taupe">Transportadora</dt>
                <dd className="text-right text-ink">{order.carrier}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-taupe">Previsão</dt>
                <dd className="text-right text-ink">{cancelled ? "Cancelado" : formatDate(order.estimated)}</dd>
              </div>
              {order.tracking && (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-taupe">Rastreio</dt>
                  <dd className="flex items-center gap-3 text-ink">
                    <span className="tracking-wider">{order.tracking}</span>
                    <CopyButton value={order.tracking} label="" />
                  </dd>
                </div>
              )}
            </dl>
          </InfoCard>
          <section className="bg-nude p-6 md:p-7">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-graphite">
              <CircleQuestionMark className="size-4 text-gold" strokeWidth={1.2} /> Precisa de ajuda?
            </p>
            <p className="mt-3 text-sm leading-relaxed text-graphite">Nossa consultoria pode ajudar com tamanhos, entregas, trocas e pagamentos.</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/contato" className="link-luxe">
                Fale conosco
              </Link>
              <Link href="/politica-de-troca-e-devolucao" className="link-luxe">
                Política de trocas
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
