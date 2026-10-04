import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrder, orders } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { aos } from "@/lib/aos";
import { PageHeader } from "@/components/ui/Primitives";
import { OrderStatusBadge, OrderThumbs } from "@/components/orders/OrderParts";
import { OrderReviewForm } from "@/components/orders/ReviewForms";

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Avaliar compra ${id}`, robots: { index: false, follow: false } };
}

/** Tela 73: Avaliar compra */
export default async function ReviewOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();
  return (
    <>
      <PageHeader
        eyebrow={`Pedido ${order.id}`}
        title="Avaliar compra"
        text="Sua opinião ajuda o Atelier a cuidar de cada detalhe, da escolha do tecido à entrega."
        crumbs={[{ label: "Minha conta", href: "/conta" }, { label: "Pedidos", href: "/conta/pedidos" }, { label: "Avaliar compra" }]}
      />
      <section className="container-km grid gap-10 py-14 md:py-20 lg:grid-cols-[300px_1fr] lg:gap-16">
        <aside {...aos.fadeUp()} className="h-fit border border-line bg-white p-6 lg:sticky lg:top-40">
          <p className="eyebrow">Sua compra</p>
          <p className="mt-2 font-serif text-2xl text-ink">{order.id}</p>
          <p className="mb-5 text-xs uppercase tracking-[0.16em] text-taupe">{formatDate(order.date)}</p>
          <OrderThumbs order={order} size="w-16" />
          <div className="mt-5 border-t border-line pt-5">
            <OrderStatusBadge status={order.status} />
          </div>
        </aside>
        <div className="max-w-3xl">
          <OrderReviewForm order={order} />
        </div>
      </section>
    </>
  );
}
