"use client";

import Link from "next/link";
import { ArrowRight, Bell, CreditCard, Heart, Lock, MapPin, Package, Ticket, User } from "lucide-react";
import { addresses, coupons, orders } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { aos } from "@/lib/aos";
import { Button } from "@/components/ui/Button";
import { Timeline } from "@/components/ui/Feedback";
import { Badge } from "@/components/ui/Primitives";
import { useStore } from "@/components/providers/StoreProvider";
import { Money } from "@/components/product/Price";
import { OrderStatusBadge, OrderThumbs } from "@/components/orders/OrderParts";
import { CopyButton } from "@/components/orders/OrderClient";
import { orderTotal, statusTimeline } from "@/components/orders/orderUtils";
import { Panel } from "./AccountUI";

/** Tela 48: Minha conta (visão geral) */
export function AccountDashboard() {
  const { wishlist, hydrated } = useStore();
  const sorted = [...orders].sort((a, b) => b.date.localeCompare(a.date));
  const last = sorted[0];
  const timeline = statusTimeline(last);
  const currentIdx = Math.max(
    0,
    timeline.findIndex((t) => t.state === "current" || t.state === "error")
  );
  const mini = timeline.slice(Math.max(0, currentIdx - 1), currentIdx + 2);
  const activeCoupons = coupons.filter((c) => c.status === "ativo");
  const inProgress = orders.filter((o) => !["entregue", "cancelado"].includes(o.status)).length;
  const main = addresses.find((a) => a.isDefault) ?? addresses[0];

  const stats = [
    { label: "Pedidos em andamento", value: inProgress, href: "/conta/pedidos" },
    { label: "Cupons ativos", value: activeCoupons.length, href: "/conta/cupons" },
    { label: "Favoritos", value: hydrated ? wishlist.length : "·", href: "/conta/favoritos" },
    { label: "Endereços salvos", value: addresses.length, href: "/conta/enderecos" },
  ];

  const links = [
    { href: "/conta/pedidos", label: "Pedidos", text: "Acompanhe, troque ou devolva", icon: Package },
    { href: "/conta/perfil", label: "Meus dados", text: "Nome, contato e preferências", icon: User },
    { href: "/conta/enderecos", label: "Endereços", text: "Gerencie onde receber", icon: MapPin },
    { href: "/conta/pagamentos", label: "Pagamentos", text: "Cartões e histórico", icon: CreditCard },
    { href: "/conta/cupons", label: "Cupons", text: "Benefícios disponíveis", icon: Ticket },
    { href: "/conta/favoritos", label: "Favoritos", text: "Peças que você ama", icon: Heart },
    { href: "/conta/notificacoes", label: "Notificações", text: "Canais e alertas", icon: Bell },
    { href: "/conta/senha", label: "Segurança", text: "Altere sua senha", icon: Lock },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 border border-line bg-white md:grid-cols-4" {...aos.fadeUp()}>
        {stats.map((s, i) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group flex flex-col gap-1 p-5 transition-colors hover:bg-offwhite md:p-6 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
          >
            <span className="font-serif text-4xl text-ink md:text-5xl">{s.value}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-taupe group-hover:text-ink">{s.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="border border-line bg-white" {...aos.fadeUp(80)}>
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5 md:px-8">
            <div>
              <p className="eyebrow">Último pedido</p>
              <p className="mt-1 font-serif text-2xl text-ink">
                {last.id} <span className="text-base text-taupe">· {formatDate(last.date)}</span>
              </p>
            </div>
            <OrderStatusBadge status={last.status} />
          </header>
          <div className="grid gap-8 px-6 py-6 md:grid-cols-[auto_1fr] md:px-8 md:py-8">
            <div className="flex flex-col gap-4">
              <OrderThumbs order={last} size="w-16" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-taupe">Total</p>
                <Money value={orderTotal(last)} className="font-serif text-2xl text-ink" />
              </div>
            </div>
            <Timeline items={mini} />
          </div>
          <footer className="flex flex-wrap gap-3 border-t border-line px-6 py-5 md:px-8">
            <Button href={`/acompanhamento/${last.id}`} size="sm">
              Acompanhar entrega
            </Button>
            <Button href={`/conta/pedidos/${last.id}`} size="sm" variant="secondary">
              Ver detalhes
            </Button>
          </footer>
        </section>

        <div className="flex flex-col gap-6">
          <section className="relative overflow-hidden bg-ink p-6 text-white md:p-8" {...aos.fadeUp(140)}>
            <span className="eyebrow text-champagne/70">Cupom em destaque</span>
            <p className="mt-3 font-serif text-3xl leading-tight">{activeCoupons[0]?.title}</p>
            <p className="mt-2 text-sm text-champagne/80">{activeCoupons[0]?.description}</p>
            <div className="mt-6 flex items-center justify-between gap-4 border border-dashed border-gold/50 px-4 py-3">
              <span className="tracking-[0.24em] text-gold">{activeCoupons[0]?.code}</span>
              <CopyButton value={activeCoupons[0]?.code ?? ""} className="text-white" />
            </div>
            <Link href="/conta/cupons" className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-champagne hover:text-gold">
              Ver todos os {activeCoupons.length} cupons <ArrowRight className="size-3.5" strokeWidth={1.3} />
            </Link>
          </section>

          <Panel
            title="Endereço principal"
            action={
              <Link href="/conta/enderecos" className="link-luxe">
                Gerenciar
              </Link>
            }
          >
            <div className="flex items-center gap-2">
              <p className="font-serif text-xl text-ink">{main.label}</p>
              <Badge tone="nude">Padrão</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-graphite">
              {main.street}, {main.number}
              {main.complement ? `, ${main.complement}` : ""}
              <br />
              {main.district} · {main.city}, {main.state} · {main.zip}
            </p>
          </Panel>
        </div>
      </div>

      <section>
        <p className="eyebrow mb-5">Acesso rápido</p>
        <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          {links.map((l, i) => {
            const Icon = l.icon;
            return (
              <Link key={l.href} href={l.href} {...aos.fadeUp((i % 4) * 60)} className="group flex flex-col gap-4 bg-white p-5 transition-colors duration-500 hover:bg-offwhite md:p-6">
                <Icon className="size-5 text-ink transition-colors group-hover:text-gold" strokeWidth={1.2} />
                <div>
                  <p className="font-serif text-xl text-ink">{l.label}</p>
                  <p className="mt-1 text-xs text-taupe">{l.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
