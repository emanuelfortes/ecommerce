import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getOrder, orders } from "@/lib/data";
import { privateMeta } from "@/components/account/meta";
import { AccountHeading } from "@/components/account/AccountUI";
import { Notice } from "@/components/ui/Feedback";
import { ReturnFlow } from "@/components/orders/ReturnFlow";

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return privateMeta(`Solicitar devolução · ${id}`);
}

/** Tela 59: Solicitar devolução */
export default async function ReturnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();
  return (
    <>
      <Link href={`/conta/pedidos/${order.id}`} className="mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-taupe hover:text-ink">
        <ArrowLeft className="size-3.5" strokeWidth={1.3} /> Pedido {order.id}
      </Link>
      <AccountHeading eyebrow={`Pedido ${order.id}`} title="Solicitar devolução" text="Devolução gratuita em até 30 dias após o recebimento, com reembolso integral." />
      {order.status === "cancelado" ? (
        <Notice tone="error" title="Pedido cancelado">
          Este pedido foi cancelado e não possui peças para devolução.
        </Notice>
      ) : (
        <ReturnFlow order={order} mode="devolucao" />
      )}
    </>
  );
}
