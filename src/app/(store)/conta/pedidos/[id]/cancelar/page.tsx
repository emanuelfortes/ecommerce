import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getOrder, orders } from "@/lib/data";
import { privateMeta } from "@/components/account/meta";
import { AccountHeading } from "@/components/account/AccountUI";
import { OrderStatusBadge, OrderThumbs } from "@/components/orders/OrderParts";
import { CancelOrderFlow } from "@/components/orders/OrderClient";
import { canCancel } from "@/components/orders/orderUtils";

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return privateMeta(`Cancelar pedido ${id}`);
}

/** Tela 57: Cancelar pedido */
export default async function CancelOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();
  return (
    <>
      <Link href={`/conta/pedidos/${order.id}`} className="mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-taupe hover:text-ink">
        <ArrowLeft className="size-3.5" strokeWidth={1.3} /> Pedido {order.id}
      </Link>
      <AccountHeading eyebrow={`Pedido ${order.id}`} title="Cancelar pedido" text="Sentimos que você queira cancelar. Conte o motivo para que possamos melhorar." />
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border border-line bg-white p-5">
        <OrderThumbs order={order} />
        <OrderStatusBadge status={order.status} />
      </div>
      <CancelOrderFlow order={order} allowed={canCancel(order.status)} />
    </>
  );
}
