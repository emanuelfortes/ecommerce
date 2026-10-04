import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, Check } from "lucide-react";
import type { ReactNode } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Badge, orderStatusLabel } from "@/components/ui/Primitives";
import { ProductImage } from "@/components/product/ProductImage";
import { Money } from "@/components/product/Price";
import {
  delayedEstimate,
  orderCount,
  orderLines,
  orderSubtotal,
  orderTotal,
  progressIndex,
  progressSteps,
  shortDate,
  stepDate,
} from "./orderUtils";

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const s = orderStatusLabel[status];
  return (
    <Badge tone={s.tone} className={className}>
      {s.label}
    </Badge>
  );
}

/** Miniaturas das peças do pedido */
export function OrderThumbs({ order, max = 4, size = "w-14" }: { order: Order; max?: number; size?: string }) {
  const lines = orderLines(order);
  const rest = lines.length - max;
  return (
    <div className="flex items-center gap-2">
      {lines.slice(0, max).map((l) => (
        <div key={l.productId + l.size} className={clsx("shrink-0 border border-line", size)}>
          <ProductImage product={l.product} color={l.color} />
        </div>
      ))}
      {rest > 0 && (
        <span className={clsx("grid aspect-[3/4] shrink-0 place-items-center border border-line bg-white text-xs text-taupe", size)}>
          +{rest}
        </span>
      )}
    </div>
  );
}

/** Lista de itens com foto, variação, quantidade e preço */
export function OrderItemsList({ order, reviewLinks }: { order: Order; reviewLinks?: boolean }) {
  return (
    <ul className="divide-y divide-line">
      {orderLines(order).map((l) => (
        <li key={l.productId + l.size + l.color} className="flex gap-4 py-5 first:pt-0 last:pb-0">
          <Link href={`/produto/${l.product.slug}`} className="w-20 shrink-0 border border-line md:w-24">
            <ProductImage product={l.product} color={l.color} />
          </Link>
          <div className="flex flex-1 flex-col gap-1">
            <Link href={`/produto/${l.product.slug}`} className="font-serif text-xl leading-snug text-ink hover:text-gold">
              {l.product.name}
            </Link>
            <p className="text-xs uppercase tracking-[0.16em] text-taupe">
              Cor {l.color} · Tam. {l.size} · Qtd. {l.qty}
            </p>
            <Money value={l.price * l.qty} className="mt-1 text-sm text-graphite" />
            {reviewLinks && (
              <Link href={`/avaliar/produto/${l.product.slug}`} className="link-luxe mt-auto self-start pt-2">
                Avaliar peça
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function OrderTotals({ order }: { order: Order }) {
  const rows: [string, ReactNode][] = [
    [`Subtotal (${orderCount(order)} ${orderCount(order) > 1 ? "itens" : "item"})`, <Money key="s" value={orderSubtotal(order)} />],
    ["Frete", order.shipping ? <Money key="f" value={order.shipping} /> : <span key="f" className="text-success">Grátis</span>],
  ];
  if (order.discount) rows.push(["Descontos", <span key="d" className="text-gold">- <Money value={order.discount} /></span>]);
  return (
    <dl className="flex flex-col gap-3 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4">
          <dt className="text-taupe">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
      <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <dt className="text-[11px] uppercase tracking-[0.2em] text-ink">Total</dt>
        <dd className="font-serif text-3xl text-ink">
          <Money value={orderTotal(order)} />
        </dd>
      </div>
    </dl>
  );
}

/** Bloco de informação com título discreto */
export function InfoCard({
  title,
  icon,
  children,
  className,
  action,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={clsx("border border-line bg-white p-6 md:p-7", className)}>
      <header className="mb-5 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-graphite">
          {icon && <span className="text-gold [&>svg]:size-4">{icon}</span>}
          {title}
        </h2>
        {action}
      </header>
      {children}
    </section>
  );
}

/** Card de pedido usado nas listagens */
export function OrderCard({ order, className }: { order: Order; className?: string }) {
  const lines = orderLines(order);
  return (
    <article className={clsx("group border border-line bg-white transition-colors duration-500 hover:border-champagne", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <span className="font-serif text-xl text-ink">Pedido {order.id}</span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-taupe">{formatDate(order.date)}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>
      <div className="flex flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-5">
          <OrderThumbs order={order} />
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm text-graphite">{lines[0]?.product.name}</p>
            {lines.length > 1 && <p className="text-xs text-taupe">e mais {lines.length - 1} {lines.length - 1 > 1 ? "peças" : "peça"}</p>}
          </div>
        </div>
        <div className="flex items-center justify-between gap-8 md:justify-end">
          <div className="md:text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-taupe">Total</p>
            <Money value={orderTotal(order)} className="font-serif text-2xl text-ink" />
          </div>
          <Link href={`/conta/pedidos/${order.id}`} className="link-luxe flex items-center gap-2">
            Detalhes <ArrowRight className="size-3.5" strokeWidth={1.3} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Progresso horizontal (desktop) / vertical (mobile) do pedido */
export function OrderProgress({ order, dark }: { order: Order; dark?: boolean }) {
  const idx = progressIndex(order.status);
  const delivered = order.status === "entregue";
  const late = order.status === "atrasado";
  return (
    <ol className="grid gap-6 md:grid-cols-6 md:gap-0">
      {progressSteps.map((s, i) => {
        const done = i < idx || delivered;
        const current = i === idx && !delivered;
        const date = done
          ? shortDate(stepDate(order, i))
          : current
            ? late
              ? "Atrasado"
              : "Agora"
            : i === 5
              ? `Previsão ${shortDate(late ? delayedEstimate(order) : order.estimated)}`
              : "";
        return (
          <li key={s} className="relative flex items-center gap-4 md:flex-col md:gap-4 md:text-center">
            {i < progressSteps.length - 1 && (
              <>
                <span
                  aria-hidden
                  className={clsx(
                    "absolute left-1/2 top-4 hidden h-px w-full md:block",
                    i < idx || delivered ? "bg-gold" : dark ? "bg-white/15" : "bg-line"
                  )}
                />
                <span
                  aria-hidden
                  className={clsx(
                    "absolute -bottom-6 left-4 top-8 w-px md:hidden",
                    i < idx || delivered ? "bg-gold" : dark ? "bg-white/15" : "bg-line"
                  )}
                />
              </>
            )}
            <span
              className={clsx(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border text-[11px]",
                done && (dark ? "border-gold bg-ink text-gold" : "border-ink bg-ink text-gold"),
                current && !late && (dark ? "border-gold bg-ink" : "border-gold bg-offwhite"),
                current && late && "border-danger bg-danger/15",
                !done && !current && (dark ? "border-white/20 bg-ink text-white/40" : "border-line bg-offwhite text-taupe")
              )}
            >
              {done ? (
                <Check className="size-3.5" strokeWidth={1.8} />
              ) : current ? (
                <span className={clsx("size-2.5 rounded-full", late ? "bg-danger" : "bg-gold")} />
              ) : (
                i + 1
              )}
            </span>
            <div className="md:px-2">
              <p
                className={clsx(
                  "text-[11px] uppercase tracking-[0.18em]",
                  done || current ? (dark ? "text-white" : "text-ink") : dark ? "text-white/40" : "text-taupe"
                )}
              >
                {s}
              </p>
              {date && <p className={clsx("mt-1 text-xs", late && current ? "text-danger" : dark ? "text-champagne/70" : "text-taupe")}>{date}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Ilustração simples da rota origem → destino */
export function RouteIllustration({
  progress,
  from = "Atelier · Barueri, SP",
  to,
  late,
}: {
  progress: number;
  from?: string;
  to: string;
  late?: boolean;
}) {
  const p0 = { x: 40, y: 110 };
  const p1 = { x: 300, y: -10 };
  const p2 = { x: 560, y: 90 };
  const t = Math.min(1, Math.max(0, progress));
  const pt = {
    x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
    y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
  };
  const d = `M${p0.x} ${p0.y} Q${p1.x} ${p1.y} ${p2.x} ${p2.y}`;
  return (
    <figure className="border border-line bg-offwhite p-5 md:p-8">
      <svg viewBox="0 0 600 140" className="w-full" role="img" aria-label={`Rota de ${from} até ${to}`}>
        <path d={d} fill="none" stroke="#E6DFD5" strokeWidth="1.5" strokeDasharray="4 6" />
        <path d={d} fill="none" stroke="#C6A15B" strokeWidth="1.5" pathLength={1} strokeDasharray={`${t} 1`} />
        <circle cx={p0.x} cy={p0.y} r="6" fill="#0D0D0D" />
        <circle cx={p0.x} cy={p0.y} r="12" fill="none" stroke="#0D0D0D" strokeOpacity="0.15" />
        <g transform={`translate(${p2.x} ${p2.y})`}>
          <path d="M0 -22 C-9 -22 -14 -15 -14 -9 C-14 2 0 12 0 12 C0 12 14 2 14 -9 C14 -15 9 -22 0 -22 Z" fill={t >= 1 ? "#0D0D0D" : "#F7F4EF"} stroke="#0D0D0D" strokeWidth="1.2" />
          <circle cx="0" cy="-9" r="4" fill="#C6A15B" />
        </g>
        {t > 0 && t < 1 && (
          <g transform={`translate(${pt.x} ${pt.y})`}>
            <circle r="15" fill={late ? "#A24A3F" : "#0D0D0D"} fillOpacity="0.08" />
            <circle r="8" fill={late ? "#A24A3F" : "#0D0D0D"} stroke="#C6A15B" strokeWidth="1.5" />
          </g>
        )}
      </svg>
      <figcaption className="mt-4 flex justify-between gap-6 text-[11px] uppercase tracking-[0.16em] text-taupe">
        <span>{from}</span>
        <span className="text-right text-ink">{to}</span>
      </figcaption>
    </figure>
  );
}
