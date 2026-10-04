import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Banknote, CreditCard, QrCode } from "lucide-react";
import { getOrder, orders } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { aos } from "@/lib/aos";
import { Button } from "@/components/ui/Button";
import { Notice, Timeline } from "@/components/ui/Feedback";
import { Badge, PageHeader } from "@/components/ui/Primitives";
import { Money } from "@/components/product/Price";
import { InfoCard, OrderItemsList } from "@/components/orders/OrderParts";
import { DEMO_TODAY, addDays, orderTotal, protocolFor } from "@/components/orders/orderUtils";

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Reembolso do pedido ${id}`, robots: { index: false, follow: false } };
}

const methods = {
  cartao: { icon: CreditCard, label: "Estorno no cartão de crédito", detail: "Visa final 4821", eta: 10, note: "O estorno aparece em até 2 faturas, conforme o fechamento do seu cartão." },
  pix: { icon: QrCode, label: "Devolução via PIX", detail: "Para a conta de origem do pagamento", eta: 2, note: "O valor cai na mesma conta usada no pagamento, em até 2 dias úteis." },
  boleto: { icon: Banknote, label: "Transferência bancária", detail: "Para a conta informada na solicitação", eta: 5, note: "A transferência é feita para uma conta de mesma titularidade do CPF da compra." },
};

/** Tela 77: Reembolso */
export default async function RefundPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();
  const m = methods[order.payment];
  const unpaid = order.status === "cancelado" && order.payment === "boleto";
  const estimate = addDays(DEMO_TODAY, m.eta);
  const timeline = [
    { title: "Reembolso solicitado", text: `Protocolo ${protocolFor(order, "devolucao")}`, date: formatDate(addDays(DEMO_TODAY, -3)), state: "done" as const },
    { title: "Peças conferidas no Atelier", text: "Análise concluída e reembolso aprovado.", date: formatDate(addDays(DEMO_TODAY, -1)), state: "done" as const },
    { title: "Enviado à instituição financeira", text: m.detail, date: formatDate(DEMO_TODAY), state: "current" as const },
    { title: "Valor disponível", text: m.note, date: `Previsão: ${formatDate(estimate)}`, state: "todo" as const },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Reembolso"
        title={`Pedido ${order.id}`}
        text="Acompanhe a devolução do seu dinheiro. Você recebe uma confirmação por e-mail quando o valor for liberado."
        crumbs={[{ label: "Minha conta", href: "/conta" }, { label: "Pedidos", href: "/conta/pedidos" }, { label: "Reembolso" }]}
      />
      <section className="container-km py-14 md:py-20">
        {unpaid ? (
          <div className="mx-auto max-w-2xl">
            <Notice tone="info" title="Não há valor a reembolsar">
              O boleto deste pedido não foi pago, por isso nenhuma cobrança foi realizada e não há reembolso pendente.
            </Notice>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/conta/pedidos">Meus pedidos</Button>
              <Button href="/novidades" variant="secondary">
                Continuar comprando
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
            <div className="flex flex-col gap-6">
              <div {...aos.fadeUp()} className="bg-ink p-8 text-white md:p-10">
                <div className="flex items-center justify-between gap-4">
                  <span className="eyebrow text-champagne/70">Valor do reembolso</span>
                  <Badge tone="gold">Em processamento</Badge>
                </div>
                <p className="mt-6 font-serif text-6xl leading-none md:text-7xl">
                  <Money value={orderTotal(order)} />
                </p>
                <span className="mt-8 block h-px w-12 bg-gold" />
                <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-champagne/60">Forma</dt>
                    <dd className="mt-2 flex items-center gap-2 text-[15px]">
                      <m.icon className="size-4 text-gold" strokeWidth={1.2} /> {m.label}
                    </dd>
                    <dd className="mt-1 text-xs text-champagne/70">{m.detail}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-champagne/60">Previsão</dt>
                    <dd className="mt-2 font-serif text-2xl">{formatDate(estimate, { day: "2-digit", month: "long" })}</dd>
                  </div>
                </dl>
              </div>
              <Notice tone="info" title="Bom saber">
                {m.note} Se preferir, troque por vale-compras com 10% extra falando com o nosso atendimento.
              </Notice>
              <div className="flex flex-wrap gap-3">
                <Button href={`/conta/pedidos/${order.id}`}>Ver pedido</Button>
                <Button href="/contato" variant="secondary">
                  Falar com o atendimento
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <InfoCard title="Andamento">
                <Timeline items={timeline} />
              </InfoCard>
              <InfoCard
                title="Peças devolvidas"
                action={
                  <Link href={`/conta/devolucoes/${protocolFor(order, "devolucao")}`} className="link-luxe">
                    Ver devolução
                  </Link>
                }
              >
                <OrderItemsList order={order} />
              </InfoCard>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
