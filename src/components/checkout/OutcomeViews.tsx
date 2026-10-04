"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  Download,
  Mail,
  MessageCircle,
  QrCode as QrIcon,
  RefreshCcw,
  ShoppingBag,
  X,
} from "lucide-react";
import { addresses, shippingOptions } from "@/lib/data";
import { aos } from "@/lib/aos";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { Button } from "@/components/ui/Button";
import { Badge, Ornament, Skeleton } from "@/components/ui/Primitives";
import { Notice, Timeline } from "@/components/ui/Feedback";
import { demoSnapshot, useCheckout, type OrderSnapshot, type PaymentMethod } from "@/components/checkout/CheckoutState";
import { CopyField, ItemMiniList, QrCode, boletoLine, onlyDigits, pixCode, useCountdown } from "@/components/checkout/CheckoutParts";

const DEMO_ORDER = "KM-240918";
const TRACK_HREF = `/acompanhamento/${DEMO_ORDER}`;
const PIX_TTL = 30 * 60 * 1000;

/* =========================================================
   Peças compartilhadas
   ========================================================= */
function useReady() {
  const { hydrated: a } = useStore();
  const { hydrated: b } = useCheckout();
  return a && b;
}

function Loading() {
  return (
    <div className="container-km flex max-w-3xl flex-col items-center gap-5 py-24">
      <Skeleton className="size-20 rounded-full" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="mt-6 h-64 w-full" />
    </div>
  );
}

/** Esvazia a sacola e encerra a sessão de checkout uma única vez. */
function useFinalizeOrder() {
  const { hydrated: storeReady, cart, clearCart } = useStore();
  const { hydrated, update } = useCheckout();
  const done = useRef(false);
  useEffect(() => {
    if (!storeReady || !hydrated || done.current) return;
    done.current = true;
    if (cart.length) clearCart();
    update({ startedAt: null });
  }, [storeReady, hydrated, cart.length, clearCart, update]);
}

function useOrder() {
  const { data, address, shipping } = useCheckout();
  const fallback = useMemo(() => demoSnapshot(), []);
  const order: OrderSnapshot = data.order ?? fallback;
  return {
    order,
    orderId: data.orderId ?? DEMO_ORDER,
    address: address ?? addresses[0],
    shipping: shipping ?? shippingOptions[0],
    payment: data.payment,
    card: data.card,
    email: data.email,
    guest: data.guest,
  };
}

function OutcomeHero({
  icon,
  tone = "ink",
  eyebrow,
  title,
  children,
}: {
  icon: ReactNode;
  tone?: "ink" | "success" | "danger" | "warning";
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div {...aos.zoomIn()} className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <span
        className={clsx(
          "grid size-20 place-items-center rounded-full border [&>svg]:size-8 [&>svg]:stroke-[1.1]",
          tone === "ink" && "border-champagne text-ink",
          tone === "success" && "border-gold bg-ink text-gold",
          tone === "danger" && "border-danger/40 text-danger",
          tone === "warning" && "border-gold text-gold"
        )}
      >
        {icon}
      </span>
      <span className="eyebrow mt-8">{eyebrow}</span>
      <h1 className="mt-4 text-4xl leading-tight md:text-6xl">{title}</h1>
      <span className="gold-rule mt-5" />
      {children && <div className="mt-5 text-[15px] leading-relaxed text-taupe">{children}</div>}
    </div>
  );
}

function OrderRecap({ order, address, shippingName }: { order: OrderSnapshot; address: (typeof addresses)[number]; shippingName: string }) {
  const { money } = useStore();
  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-5">
      <div className="bg-white p-6 md:col-span-3 md:p-8">
        <h2 className="text-2xl">Itens do pedido</h2>
        <ItemMiniList items={order.items} className="mt-3" />
        <dl className="mt-4 flex flex-col gap-2 border-t border-line pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-taupe">Subtotal</dt>
            <dd>{money(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-success">
              <dt>Desconto{order.couponCode ? ` (${order.couponCode})` : ""}</dt>
              <dd>-{money(order.discount)}</dd>
            </div>
          )}
          {order.pixDiscount > 0 && (
            <div className="flex justify-between text-success">
              <dt>Desconto PIX (5%)</dt>
              <dd>-{money(order.pixDiscount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-taupe">Frete</dt>
            <dd>{order.shipping === 0 ? <span className="text-success">Grátis</span> : money(order.shipping)}</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-line pt-4">
            <dt className="text-[12px] uppercase tracking-[0.2em] text-ink">Total</dt>
            <dd className="font-serif text-3xl text-ink">{money(order.total)}</dd>
          </div>
        </dl>
      </div>
      <div className="flex flex-col gap-8 bg-white p-6 md:col-span-2 md:p-8">
        <div>
          <p className="eyebrow">Entrega</p>
          <p className="mt-3 text-sm text-graphite">{address.recipient}</p>
          <p className="text-sm text-graphite">
            {address.street}, {address.number}
            {address.complement ? ` · ${address.complement}` : ""}
          </p>
          <p className="text-sm text-taupe">
            {address.district} · {address.city}/{address.state}
          </p>
          <p className="text-sm text-taupe">CEP {address.zip}</p>
        </div>
        <div>
          <p className="eyebrow">Envio</p>
          <p className="mt-3 text-sm text-graphite">{shippingName}</p>
        </div>
      </div>
    </div>
  );
}

function OrderNumber({ id, status }: { id: string; status?: ReactNode }) {
  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-2 border-y border-line py-5 text-center">
      <span className="eyebrow">Número do pedido</span>
      <span className="font-serif text-3xl tracking-wide text-ink">{id}</span>
      {status}
    </div>
  );
}

function HelpLinks() {
  return (
    <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
      {[
        { icon: MessageCircle, title: "WhatsApp", text: "(11) 99999-9999", href: "https://wa.me/5511999999999" },
        { icon: Mail, title: "E-mail", text: "atendimento@karenmichelly.com.br", href: "mailto:atendimento@karenmichelly.com.br" },
        { icon: QrIcon, title: "Central de ajuda", text: "Perguntas frequentes", href: "/faq" },
      ].map(({ icon: Icon, title, text, href }) => (
        <a key={title} href={href} className="group flex items-start gap-4 bg-white p-6 transition-colors hover:bg-offwhite">
          <Icon className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.2} />
          <span className="min-w-0">
            <span className="block text-[12px] uppercase tracking-[0.18em] text-ink group-hover:text-gold">{title}</span>
            <span className="mt-1 block break-all text-xs text-taupe">{text}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

function addBusinessDays(from: Date, n: number) {
  const d = new Date(from);
  while (n > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) n--;
  }
  return d;
}

/* =========================================================
   Tela 37: Processando pagamento
   ========================================================= */
const processingSteps = [
  "Validando seus dados",
  "Conectando com a instituição de pagamento",
  "Confirmando o pagamento",
  "Reservando suas peças no ateliê",
];

export function ProcessingView() {
  const router = useRouter();
  const { data, hydrated } = useCheckout();
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setI((x) => Math.min(x + 1, processingSteps.length - 1)), 650);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => router.replace(`/checkout/${data.outcome ?? "nao-concluido"}`), 2600);
    return () => window.clearTimeout(t);
  }, [hydrated, data.outcome, router]);

  return (
    <div className="container-km flex min-h-[70vh] flex-col items-center justify-center py-20 text-center" aria-live="polite">
      <div className="relative grid size-32 place-items-center">
        <span className="absolute inset-0 rounded-full border border-line" />
        <span className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-gold [animation-duration:1.4s]" />
        <span className="absolute inset-3 rounded-full border border-champagne/40" />
        <span className="font-serif text-2xl tracking-[0.2em] text-ink">KM</span>
      </div>
      <span className="eyebrow mt-10">Processando</span>
      <h1 className="mt-4 text-4xl md:text-5xl">Estamos finalizando seu pedido</h1>
      <span className="gold-rule mt-5" />
      <p key={i} className="mt-6 h-6 text-[15px] text-taupe">
        {processingSteps[i]}...
      </p>
      <ol className="mt-6 flex gap-2" aria-hidden>
        {processingSteps.map((s, idx) => (
          <li key={s} className={clsx("h-px w-8 transition-colors duration-500", idx <= i ? "bg-gold" : "bg-line")} />
        ))}
      </ol>
      <p className="mt-10 max-w-sm text-xs text-taupe">Por favor, não feche nem atualize esta página.</p>
    </div>
  );
}

/* =========================================================
   Tela 38: Pagamento aprovado
   ========================================================= */
export function ApprovedView() {
  const ready = useReady();
  useFinalizeOrder();
  const { order, orderId, address, shipping, card, email } = useOrder();
  const { user, money } = useStore();
  if (!ready) return <Loading />;
  const name = user?.name.split(" ")[0];
  return (
    <div className="container-km max-w-5xl py-16 md:py-24">
      <OutcomeHero icon={<Check />} tone="success" eyebrow="Pagamento aprovado" title={name ? `Obrigada, ${name}` : "Pagamento aprovado"}>
        <p>
          Recebemos a confirmação do seu pagamento
          {card ? ` no cartão ${card.brand} final ${card.last4}` : ""}
          {card && card.installments > 1 ? ` em ${card.installments}x de ${money(order.total / card.installments)}` : ""}. Enviamos todos
          os detalhes para {user?.email ?? (email || "o seu e-mail")}.
        </p>
      </OutcomeHero>
      <OrderNumber id={orderId} status={<Badge tone="success">Pagamento aprovado</Badge>} />

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <OrderRecap order={order} address={address} shippingName={`${shipping.name} · ${shipping.days}`} />
        </div>
        <div className="lg:col-span-4">
          <h2 className="text-2xl">Próximos passos</h2>
          <span className="gold-rule mb-6 mt-3" />
          <Timeline
            items={[
              { title: "Pagamento aprovado", text: "Seu pedido foi confirmado.", state: "done" },
              { title: "Preparação no ateliê", text: "Conferência e embalagem assinada.", state: "current" },
              { title: "Envio", text: "Você recebe o código de rastreio.", state: "todo" },
              { title: "Entrega", text: shipping.days, state: "todo" },
            ]}
          />
        </div>
      </div>

      <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href={TRACK_HREF}>
          Acompanhar pedido <ArrowRight className="size-4" strokeWidth={1.3} />
        </Button>
        <Button href="/" variant="secondary">
          Continuar comprando
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   Tela 39: Pagamento recusado
   ========================================================= */
const declineReasons = [
  "Limite ou saldo insuficiente para o valor da compra.",
  "Dados do cartão digitados incorretamente (número, validade ou CVV).",
  "Bloqueio preventivo do banco emissor para compras online.",
  "Cartão vencido, cancelado ou não habilitado para e-commerce.",
];

export function DeclinedView() {
  const ready = useReady();
  const router = useRouter();
  const { data, update } = useCheckout();
  const { money } = useStore();
  if (!ready) return <Loading />;
  const order = data.order;
  const retry = (payment: PaymentMethod) => {
    update({ payment, outcome: null });
    router.push("/checkout/pagamento");
  };
  return (
    <div className="container-km max-w-4xl py-16 md:py-24">
      <OutcomeHero icon={<X />} tone="danger" eyebrow="Pagamento recusado" title="Não conseguimos aprovar seu pagamento">
        <p>
          A operadora {data.card ? `do cartão ${data.card.brand} final ${data.card.last4} ` : ""}não autorizou a transação.
          Nenhum valor foi cobrado e suas peças continuam reservadas na sacola.
        </p>
      </OutcomeHero>

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        <div className="border border-line bg-white p-6 md:p-8">
          <h2 className="text-2xl">Possíveis motivos</h2>
          <span className="gold-rule mb-6 mt-3" />
          <ul className="flex flex-col gap-4 text-sm text-graphite">
            {declineReasons.map((r) => (
              <li key={r} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold" />
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-taupe">
            Se preferir, entre em contato com o seu banco para liberar a compra e tente novamente.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-2xl">Tente outra forma</h2>
          <span className="gold-rule mb-3 mt-0" />
          {[
            { id: "pix" as const, title: "Pagar com PIX", text: order ? `${money(order.total * 0.95)} com 5% de desconto` : "Aprovação imediata e 5% off", icon: QrIcon },
            { id: "cartao" as const, title: "Usar outro cartão", text: "Em até 6x sem juros", icon: CreditCard },
            { id: "boleto" as const, title: "Boleto bancário", text: "Vencimento em 3 dias úteis", icon: Clock },
          ].map(({ id, title, text, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => retry(id)}
              className="group flex items-center gap-4 border border-line bg-white p-5 text-left transition-colors hover:border-ink"
            >
              <Icon className="size-5 shrink-0 text-gold" strokeWidth={1.2} />
              <span className="flex-1">
                <span className="block text-[15px] text-ink">{title}</span>
                <span className="block text-xs text-taupe">{text}</span>
              </span>
              <ArrowRight className="size-4 text-taupe transition-transform group-hover:translate-x-1 group-hover:text-ink" strokeWidth={1.2} />
            </button>
          ))}
          <Button onClick={() => retry(data.payment ?? "cartao")} className="mt-3">
            <RefreshCcw className="size-4" strokeWidth={1.3} /> Tentar novamente
          </Button>
        </div>
      </div>

      <div className="mt-14">
        <p className="eyebrow mb-4 text-center">Precisa de ajuda?</p>
        <HelpLinks />
      </div>
    </div>
  );
}

/* =========================================================
   Tela 40: Pagamento pendente (boleto ou PIX)
   ========================================================= */
function Barcode({ code }: { code: string }) {
  const bars = useMemo(() => {
    const d = onlyDigits(code);
    let x = 0;
    const out: { x: number; w: number }[] = [];
    for (let i = 0; i < d.length * 2; i++) {
      const n = Number(d[i % d.length]);
      const w = (n % 3) + 1;
      if (i % 2 === 0) out.push({ x, w });
      x += w + ((n + i) % 2) + 1;
    }
    return { out, width: x };
  }, [code]);
  return (
    <svg viewBox={`0 0 ${bars.width} 40`} preserveAspectRatio="none" className="h-16 w-full text-ink" aria-label="Código de barras do boleto" role="img">
      {bars.out.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={40} fill="currentColor" />
      ))}
    </svg>
  );
}

function PixPanel({ orderId, total, createdAt, onRenew }: { orderId: string; total: number; createdAt: number; onRenew: () => void }) {
  const { money } = useStore();
  const { label, expired } = useCountdown(createdAt + PIX_TTL);
  return (
    <div className="grid gap-8 border border-line bg-white p-6 md:grid-cols-[240px_1fr] md:p-10">
      <div className="relative mx-auto w-full max-w-[240px]">
        <div className="border border-line p-3">
          <QrCode seed={`${orderId}-${createdAt}`} faded={expired} />
        </div>
        {expired && (
          <div className="absolute inset-0 grid place-items-center">
            <Button size="sm" onClick={onRenew}>
              <RefreshCcw className="size-3.5" strokeWidth={1.3} /> Gerar novo
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-serif text-3xl text-ink">{money(total)}</p>
          <span
            className={clsx(
              "flex items-center gap-2 border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]",
              expired ? "border-danger/40 text-danger" : "border-gold/60 text-ink"
            )}
          >
            <Clock className="size-3.5 text-gold" strokeWidth={1.3} />
            {expired ? "Código expirado" : <>Expira em <span className="tabular-nums">{label}</span></>}
          </span>
        </div>
        <ol className="flex flex-col gap-2 text-sm text-graphite">
          {["Abra o app do seu banco e escolha pagar com PIX.", "Escaneie o QR Code ou cole o código abaixo.", "Confirme o pagamento. A aprovação é imediata."].map(
            (t, i) => (
              <li key={t} className="flex gap-3">
                <span className="grid size-5 shrink-0 place-items-center rounded-full border border-gold text-[10px] text-ink">{i + 1}</span>
                {t}
              </li>
            )
          )}
        </ol>
        <CopyField label="PIX copia e cola" value={pixCode(orderId, total)} mono />
      </div>
    </div>
  );
}

export function PendingView({ metodo }: { metodo?: "pix" | "boleto" }) {
  const ready = useReady();
  useFinalizeOrder();
  const { toast } = useUI();
  const { money } = useStore();
  const { update } = useCheckout();
  const { order, orderId, address, shipping, payment } = useOrder();
  const method = metodo ?? (payment === "pix" ? "pix" : "boleto");
  const [due] = useState(() => addBusinessDays(new Date(), 3));
  if (!ready) return <Loading />;
  const line = boletoLine(orderId);

  return (
    <div className="container-km max-w-5xl py-16 md:py-24">
      <OutcomeHero
        icon={method === "pix" ? <QrIcon /> : <Clock />}
        tone="warning"
        eyebrow="Aguardando pagamento"
        title={method === "pix" ? "Falta só o PIX" : "Seu boleto está pronto"}
      >
        <p>
          {method === "pix"
            ? "Seu pedido está reservado. Assim que o PIX for confirmado, ele segue imediatamente para o nosso ateliê."
            : "Seu pedido está reservado até o vencimento. Após o pagamento, a confirmação leva até 2 dias úteis."}
        </p>
      </OutcomeHero>
      <OrderNumber id={orderId} status={<Badge tone="warning">Aguardando pagamento</Badge>} />

      <div className="mt-14">
        {method === "pix" ? (
          <PixPanel
            orderId={orderId}
            total={order.total}
            createdAt={order.createdAt}
            onRenew={() => update((d) => ({ order: { ...(d.order ?? order), createdAt: Date.now() } }))}
          />
        ) : (
          <div className="border border-line bg-white p-6 md:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
              <div>
                <p className="eyebrow">Valor</p>
                <p className="mt-2 font-serif text-3xl text-ink">{money(order.total)}</p>
              </div>
              <div className="text-right">
                <p className="eyebrow">Vencimento</p>
                <p className="mt-2 text-[15px] text-ink">
                  {due.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
                </p>
              </div>
            </div>
            <div className="mt-8">
              <Barcode code={line} />
            </div>
            <div className="mt-6">
              <CopyField label="Linha digitável" value={line} mono />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                onClick={() => toast("Boleto gerado", { message: "Em produção, o PDF do boleto seria baixado agora.", variant: "info" })}
              >
                <Download className="size-4" strokeWidth={1.3} /> Baixar boleto (PDF)
              </Button>
            </div>
            <div className="mt-8">
              <Notice tone="warning" icon={<AlertTriangle strokeWidth={1.3} />} title="Atenção">
                Pague até a data de vencimento. Boletos não pagos são cancelados automaticamente e as peças voltam ao estoque.
              </Notice>
            </div>
          </div>
        )}
      </div>

      <div className="mt-14">
        <OrderRecap order={order} address={address} shippingName={`${shipping.name} · ${shipping.days}`} />
      </div>

      <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href={TRACK_HREF}>
          Acompanhar pedido <ArrowRight className="size-4" strokeWidth={1.3} />
        </Button>
        <Button href="/" variant="secondary">
          Continuar comprando
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   Tela 41: Pedido realizado
   ========================================================= */
export function OrderPlacedView() {
  const ready = useReady();
  useFinalizeOrder();
  const { user } = useStore();
  const { update } = useCheckout();
  const { order, orderId, address, shipping, payment, email, guest } = useOrder();
  if (!ready) return <Loading />;
  const name = user?.name.split(" ")[0];
  const isPix = payment === "pix";

  return (
    <div className="container-km max-w-5xl py-16 md:py-24">
      <OutcomeHero icon={<ShoppingBag />} tone="success" eyebrow="Pedido realizado" title={name ? `Obrigada, ${name}` : "Obrigada pela sua compra"}>
        <p>
          Seu pedido foi recebido com carinho pelo nosso ateliê. Enviamos a confirmação para{" "}
          <span className="text-ink">{user?.email ?? (email || "o seu e-mail")}</span>.
        </p>
      </OutcomeHero>
      <OrderNumber id={orderId} />

      {isPix && (
        <section className="mt-14">
          <div className="mb-6 text-center">
            <h2 className="text-3xl">Pague com PIX para confirmar</h2>
            <p className="mt-2 text-sm text-taupe">Use o QR Code ou o código copia e cola. Você já garantiu 5% de desconto.</p>
          </div>
          <PixPanel
            orderId={orderId}
            total={order.total}
            createdAt={order.createdAt}
            onRenew={() => update((d) => ({ order: { ...(d.order ?? order), createdAt: Date.now() } }))}
          />
        </section>
      )}

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <OrderRecap order={order} address={address} shippingName={`${shipping.name} · ${shipping.days}`} />
        </div>
        <div className="lg:col-span-4">
          <h2 className="text-2xl">Próximos passos</h2>
          <span className="gold-rule mb-6 mt-3" />
          <Timeline
            items={[
              { title: "Pedido recebido", text: "Confirmação enviada por e-mail.", state: "done" },
              {
                title: isPix ? "Aguardando PIX" : "Pagamento confirmado",
                text: isPix ? "Aprovação imediata após o pagamento." : "Tudo certo com o pagamento.",
                state: isPix ? "current" : "done",
              },
              { title: "Preparação no ateliê", text: "Conferência peça a peça e embalagem assinada.", state: isPix ? "todo" : "current" },
              { title: "Envio e rastreio", text: "Você recebe o código por e-mail e WhatsApp.", state: "todo" },
              { title: "Entrega", text: shipping.days, state: "todo" },
            ]}
          />
        </div>
      </div>

      {guest && !user && (
        <div className="mt-14 flex flex-col items-center gap-4 bg-nude px-6 py-10 text-center">
          <Ornament />
          <h2 className="text-3xl">Crie sua conta em um clique</h2>
          <p className="max-w-md text-sm text-graphite">Acompanhe este pedido, salve endereços e receba benefícios exclusivos do Clube KM.</p>
          <Button href="/cadastro" variant="secondary" size="sm">
            Criar conta
          </Button>
        </div>
      )}

      <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href={TRACK_HREF}>
          Acompanhar pedido <ArrowRight className="size-4" strokeWidth={1.3} />
        </Button>
        <Button href="/" variant="secondary">
          Continuar comprando
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   Tela 42: Pedido não concluído
   ========================================================= */
export function NotCompletedView() {
  const ready = useReady();
  const { cart } = useStore();
  const { data } = useCheckout();
  if (!ready) return <Loading />;
  const retryHref = data.addressId && data.shippingId ? "/checkout/pagamento" : "/checkout/identificacao";
  return (
    <div className="container-km max-w-4xl py-16 md:py-24">
      <OutcomeHero icon={<AlertTriangle />} eyebrow="Pedido não concluído" title="Sua compra não foi finalizada">
        <p>
          Algo interrompeu a finalização do pedido, como uma queda de conexão ou o fechamento da página. Nenhum valor foi cobrado e
          suas peças continuam guardadas na sacola.
        </p>
      </OutcomeHero>

      {cart.length > 0 && (
        <div className="mx-auto mt-14 max-w-xl border border-line bg-white p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Ainda na sua sacola</h2>
            <Link href="/carrinho" className="link-luxe">
              Ver sacola
            </Link>
          </div>
          <ItemMiniList items={cart} className="mt-3" />
        </div>
      )}

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        {cart.length > 0 ? (
          <Button href={retryHref}>
            <RefreshCcw className="size-4" strokeWidth={1.3} /> Tentar novamente
          </Button>
        ) : (
          <Button href="/novidades">Explorar novidades</Button>
        )}
        <Button href="/carrinho" variant="secondary">
          Ir para a sacola
        </Button>
      </div>

      <div className="mt-16">
        <p className="eyebrow mb-4 text-center">Precisa de ajuda para finalizar?</p>
        <HelpLinks />
      </div>
    </div>
  );
}

/* =========================================================
   Tela 107: Checkout expirado
   ========================================================= */
export function ExpiredView() {
  const ready = useReady();
  const { cart } = useStore();
  const { hydrated, update } = useCheckout();
  const done = useRef(false);

  // Encerra a sessão antiga para que o reinício comece do zero
  useEffect(() => {
    if (!hydrated || done.current) return;
    done.current = true;
    update({ startedAt: null, outcome: null, payment: null, card: null });
  }, [hydrated, update]);

  if (!ready) return <Loading />;
  return (
    <div className="container-km max-w-4xl py-16 md:py-24">
      <OutcomeHero icon={<Clock />} tone="warning" eyebrow="Sessão expirada" title="Seu checkout expirou">
        <p>
          Por segurança, a finalização da compra fica ativa por 30 minutos. Como esse tempo passou, os preços, o frete e a
          disponibilidade das peças podem ter mudado. Reinicie para conferir tudo atualizado.
        </p>
      </OutcomeHero>

      {cart.length > 0 && (
        <div className="mx-auto mt-14 max-w-xl border border-line bg-white p-6 md:p-8">
          <h2 className="text-2xl">Suas peças continuam na sacola</h2>
          <ItemMiniList items={cart} className="mt-3" />
        </div>
      )}

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href={cart.length > 0 ? "/checkout/identificacao" : "/"}>
          <RefreshCcw className="size-4" strokeWidth={1.3} /> {cart.length > 0 ? "Reiniciar checkout" : "Voltar à loja"}
        </Button>
        <Button href="/carrinho" variant="secondary">
          Revisar sacola
        </Button>
      </div>
      <p className="mt-8 text-center text-xs text-taupe">
        Seus dados de pagamento não foram armazenados. Nenhum valor foi cobrado.
      </p>
    </div>
  );
}
