import Link from "next/link";
import clsx from "clsx";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, Gift, Mail, MapPin, MessageCircle, Package, PackageCheck, Scissors, Sparkles, Star, Truck } from "lucide-react";
import type { OrderStatus } from "@/lib/types";
import { getOrder, orders } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { aos } from "@/lib/aos";
import { Button } from "@/components/ui/Button";
import { Notice, Timeline } from "@/components/ui/Feedback";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { ProductImage } from "@/components/product/ProductImage";
import { InfoCard, OrderItemsList, OrderProgress, OrderStatusBadge, OrderTotals, RouteIllustration } from "@/components/orders/OrderParts";
import { CopyButton } from "@/components/orders/OrderClient";
import { delayedEstimate, orderAddress, orderLines, progressIndex, routeProgress, trackingEvents } from "@/components/orders/orderUtils";

const demoStates = [
  { id: "preparacao", label: "Em preparação" },
  { id: "enviado", label: "Enviado" },
  { id: "transporte", label: "Em transporte" },
  { id: "entregue", label: "Entregue" },
  { id: "atrasado", label: "Atrasado" },
] as const;

const hero: Record<OrderStatus, { eyebrow: string; title: string; text: string }> = {
  aguardando: { eyebrow: "Aguardando pagamento", title: "Quase lá", text: "Assim que o pagamento for confirmado, o Atelier começa a preparar suas peças." },
  aprovado: { eyebrow: "Pagamento aprovado", title: "Pedido confirmado", text: "Recebemos o seu pagamento. Em breve suas peças entram em preparação." },
  preparacao: {
    eyebrow: "Em preparação",
    title: "Suas peças estão sendo preparadas",
    text: "No Atelier, cada peça é revisada, passada a vapor e embalada em papel de seda com o nosso laço dourado.",
  },
  enviado: { eyebrow: "Enviado", title: "Seu pedido foi enviado", text: "O pacote já está com a transportadora e começa a viagem até você." },
  transporte: { eyebrow: "Em transporte", title: "Seu pedido está a caminho", text: "Acompanhe cada movimentação. Avisaremos por e-mail e WhatsApp quando sair para entrega." },
  entregue: { eyebrow: "Entregue", title: "Seu pedido chegou", text: "Esperamos que você ame cada detalhe. Conte para nós como foi a experiência." },
  atrasado: {
    eyebrow: "Entrega atrasada",
    title: "Pedimos desculpas pelo atraso",
    text: "Sabemos o quanto você esperava por este pedido. Estamos acompanhando de perto com a transportadora.",
  },
  cancelado: { eyebrow: "Cancelado", title: "Pedido cancelado", text: "Este pedido foi cancelado e nenhum valor foi cobrado." },
};

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Acompanhamento do pedido ${id}`,
    description: "Acompanhe o status e a entrega do seu pedido Karen Michelly.",
    robots: { index: false, follow: false },
  };
}

/** Telas 67 a 72: Acompanhamento do pedido (estado real ou ?estado=) */
export default async function OrderTrackingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ estado?: string }>;
}) {
  const { id } = await params;
  const { estado } = await searchParams;
  const base = getOrder(id);
  if (!base) notFound();

  const override = demoStates.find((s) => s.id === estado)?.id;
  const status: OrderStatus = override ?? base.status;
  const order = {
    ...base,
    status,
    tracking: base.tracking || (progressIndex(status) >= 3 && status !== "cancelado" ? `BR${base.id.replace(/\D/g, "")}KM` : ""),
  };
  const h = hero[status];
  const late = status === "atrasado";
  const delivered = status === "entregue";
  const cancelled = status === "cancelado";
  const shipped = progressIndex(status) >= 3 && !cancelled;
  const estimate = late ? delayedEstimate(order) : order.estimated;
  const address = orderAddress(order);
  const first = orderLines(order)[0];

  return (
    <>
      <section className="border-t border-white/10 bg-ink text-white">
        <div className="container-km py-12 md:py-20">
          <div className="[&_a:hover]:text-gold [&_nav]:text-champagne/60 [&_span]:text-champagne/90">
            <Breadcrumbs items={[{ label: "Acompanhamento" }, { label: order.id }]} />
          </div>
          <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div {...aos.fadeUp()}>
              <span className={clsx("eyebrow flex items-center gap-3", late ? "text-danger" : "text-champagne/80")}>
                <span className={clsx("h-px w-8", late ? "bg-danger" : "bg-gold")} /> {h.eyebrow}
              </span>
              <h1 className="mt-5 text-5xl leading-[1.02] text-white md:text-7xl">{h.title}</h1>
              <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-champagne/80">{h.text}</p>
              {!cancelled && (
                <dl className="mt-10 grid max-w-xl grid-cols-2 gap-6 border-t border-white/10 pt-6">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-champagne/60">{delivered ? "Entregue em" : late ? "Nova previsão" : "Previsão de entrega"}</dt>
                    <dd className="mt-2 font-serif text-3xl text-white">{formatDate(estimate, { day: "2-digit", month: "long" })}</dd>
                    {late && <dd className="mt-1 text-xs text-champagne/60 line-through">Antes: {formatDate(order.estimated, { day: "2-digit", month: "long" })}</dd>}
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-champagne/60">Pedido</dt>
                    <dd className="mt-2 font-serif text-3xl text-white">{order.id}</dd>
                    <dd className="mt-1 text-xs text-champagne/60">Realizado em {formatDate(order.date)}</dd>
                  </div>
                </dl>
              )}
            </div>
            {first && (
              <div className="relative mx-auto hidden w-full max-w-[320px] lg:block" {...aos.zoomIn(120)}>
                <div className="overflow-hidden rounded-t-full border border-champagne/40">
                  <ProductImage product={first.product} index={3} color={first.color} />
                </div>
                <span className="absolute -left-5 top-14 size-20 rounded-full border border-gold/50" aria-hidden />
              </div>
            )}
          </div>
          {!cancelled && (
            <div className="mt-14 border-t border-white/10 pt-10" {...aos.fadeUp(80)}>
              <OrderProgress order={order} dark />
            </div>
          )}
        </div>
      </section>

      <div className="border-b border-line bg-offwhite">
        <div className="container-km flex flex-wrap items-center gap-3 py-4">
          <span className="mr-2 text-[10px] uppercase tracking-[0.22em] text-taupe">Demonstração · ver estado</span>
          <Link
            href={`/acompanhamento/${order.id}`}
            className={clsx(
              "border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors",
              !override ? "border-ink bg-ink text-white" : "border-line bg-white text-graphite hover:border-ink"
            )}
          >
            Real
          </Link>
          {demoStates.map((s) => (
            <Link
              key={s.id}
              href={`/acompanhamento/${order.id}?estado=${s.id}`}
              className={clsx(
                "border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors",
                override === s.id ? "border-ink bg-ink text-white" : "border-line bg-white text-graphite hover:border-ink"
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="container-km grid gap-8 py-14 md:py-20 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
        <div className="flex flex-col gap-8">
          {status === "preparacao" && (
            <section {...aos.fadeUp()} className="border border-line bg-white p-6 md:p-8">
              <p className="eyebrow">O que acontece agora</p>
              <ol className="mt-6 grid gap-6 sm:grid-cols-3">
                {[
                  { icon: Scissors, title: "Revisão", text: "Conferimos costuras, botões e acabamentos peça por peça." },
                  { icon: Sparkles, title: "Passadoria", text: "Cada peça é passada a vapor para chegar pronta para usar." },
                  { icon: Gift, title: "Embalagem", text: "Papel de seda, caixa rígida e o nosso laço dourado." },
                ].map((s, i) => (
                  <li key={s.title} className="border-t border-gold/60 pt-4">
                    <s.icon className="size-5 text-ink" strokeWidth={1.2} />
                    <p className="mt-3 font-serif text-xl text-ink">
                      0{i + 1}. {s.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-taupe">{s.text}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <Notice tone="info" icon={<Clock strokeWidth={1.3} />} title="Envio em até 2 dias úteis">
                  O código de rastreio chega por e-mail e WhatsApp assim que o pacote for coletado.
                </Notice>
              </div>
            </section>
          )}

          {late && (
            <section {...aos.fadeUp()} className="flex flex-col gap-6">
              <Notice tone="warning" title="Sentimos muito pelo atraso">
                A transportadora registrou um volume acima do normal no centro de distribuição. Seu pacote está em segurança e a nova previsão de entrega é{" "}
                <strong className="font-medium text-ink">{formatDate(estimate)}</strong>. Se não chegar até lá, reenviamos as peças ou devolvemos o valor integral, como preferir.
              </Notice>
              <div className="grid gap-px border border-line bg-line sm:grid-cols-[1.2fr_1fr]">
                <div className="bg-ink p-6 text-white md:p-8">
                  <p className="eyebrow text-champagne/70">Um pedido de desculpas</p>
                  <p className="mt-3 font-serif text-3xl leading-tight">15% na sua próxima compra</p>
                  <p className="mt-2 text-sm text-champagne/80">Válido por 60 dias, em todo o site, sem valor mínimo.</p>
                  <div className="mt-6 flex items-center justify-between gap-4 border border-dashed border-gold/50 px-4 py-3">
                    <span className="tracking-[0.24em] text-gold">DESCULPA15</span>
                    <CopyButton value="DESCULPA15" className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-3 bg-white p-6 md:p-8">
                  <p className="font-serif text-2xl text-ink">Fale com a gente</p>
                  <p className="text-sm text-taupe">Atendimento prioritário para pedidos atrasados.</p>
                  <Button href="/contato" size="sm" full>
                    <MessageCircle className="size-4" strokeWidth={1.3} /> WhatsApp
                  </Button>
                  <Button href="/contato" size="sm" variant="secondary" full>
                    <Mail className="size-4" strokeWidth={1.3} /> E-mail
                  </Button>
                </div>
              </div>
            </section>
          )}

          {delivered && (
            <section {...aos.fadeUp()} className="grid items-center gap-8 bg-nude p-6 md:grid-cols-[1fr_auto] md:p-10">
              <div>
                <span className="eyebrow text-graphite">Sua opinião importa</span>
                <h2 className="mt-3 text-4xl leading-tight">Como foi a sua experiência?</h2>
                <span className="gold-rule mt-4" />
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-graphite">
                  Avalie a compra e as peças. Leva menos de um minuto e ajuda outras clientes a escolher.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button href={`/avaliar/pedido/${order.id}`}>
                  <Star className="size-4" strokeWidth={1.3} /> Avaliar compra
                </Button>
                <Button href={`/conta/pedidos/${order.id}/troca`} variant="secondary">
                  Trocar tamanho
                </Button>
              </div>
            </section>
          )}

          {shipped && !delivered && (
            <div {...aos.fadeUp()}>
              <RouteIllustration progress={routeProgress(status)} to={address ? `${address.district} · ${address.city}, ${address.state}` : "Destino"} late={late} />
            </div>
          )}

          {!cancelled && (
            <InfoCard title={shipped ? "Movimentação" : "Andamento"} icon={<Truck strokeWidth={1.2} />}>
              <Timeline items={trackingEvents(order)} />
            </InfoCard>
          )}

          {cancelled && (
            <Notice tone="error" title="Pedido cancelado">
              O prazo de pagamento terminou sem confirmação. As peças voltaram ao estoque e podem ser compradas novamente.
            </Notice>
          )}

          <InfoCard title="Peças" icon={<Package strokeWidth={1.2} />}>
            <OrderItemsList order={order} reviewLinks={delivered} />
          </InfoCard>
        </div>

        <aside className="flex flex-col gap-6">
          <InfoCard title="Entrega" icon={<MapPin strokeWidth={1.2} />} action={<OrderStatusBadge status={status} />}>
            {address && (
              <p className="text-sm leading-relaxed text-graphite">
                <span className="text-ink">{address.recipient}</span>
                <br />
                {address.street}, {address.number}
                {address.complement ? `, ${address.complement}` : ""}
                <br />
                {address.district} · {address.city}, {address.state}
              </p>
            )}
            <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-taupe">Transportadora</dt>
                <dd className="text-right text-ink">{order.carrier}</dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-taupe">Rastreio</dt>
                <dd className="flex items-center gap-3 text-ink">
                  {order.tracking ? (
                    <>
                      <span className="tracking-wider">{order.tracking}</span>
                      <CopyButton value={order.tracking} label="" />
                    </>
                  ) : (
                    <span className="text-taupe">Após o envio</span>
                  )}
                </dd>
              </div>
            </dl>
          </InfoCard>
          <InfoCard title="Resumo" icon={<PackageCheck strokeWidth={1.2} />}>
            <OrderTotals order={order} />
          </InfoCard>
          <section className="border border-line bg-white p-6 md:p-7">
            <p className="font-serif text-2xl text-ink">Precisa de ajuda?</p>
            <ul className="mt-4 flex flex-col divide-y divide-line text-sm">
              {[
                ["/faq", "Perguntas frequentes"],
                ["/politica-de-entrega", "Prazos e política de entrega"],
                ["/politica-de-troca-e-devolucao", "Trocas e devoluções"],
                ["/contato", "Falar com a consultoria"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="flex items-center justify-between py-3 text-graphite transition-colors hover:text-ink">
                    {label} <span className="text-gold">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <Button href={`/conta/pedidos/${order.id}`} variant="secondary" full>
            Ver pedido na minha conta
          </Button>
        </aside>
      </div>
    </>
  );
}
