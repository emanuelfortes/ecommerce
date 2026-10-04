"use client";

import clsx from "clsx";
import { useState } from "react";
import { BellOff, Gift, Heart, Mail, MessageCircle, Package, Smartphone, Sparkles, BellRing, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Toggle } from "@/components/ui/Form";
import { useUI } from "@/components/providers/UIProvider";
import { AccountHeading, Panel } from "./AccountUI";

const channels = [
  { id: "email", label: "E-mail", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "sms", label: "SMS", icon: Smartphone },
  { id: "push", label: "Push", icon: BellRing },
] as const;
type Channel = (typeof channels)[number]["id"];

const topics = [
  { id: "pedidos", label: "Pedidos e entregas", text: "Confirmação, envio, atrasos e entrega." },
  { id: "ofertas", label: "Ofertas e cupons", text: "Promoções exclusivas e cupons de aniversário." },
  { id: "novidades", label: "Novidades e lançamentos", text: "Coleções novas e pré-venda do Atelier." },
  { id: "desejos", label: "Lista de desejos", text: "Queda de preço e últimas unidades dos seus favoritos." },
  { id: "journal", label: "Journal", text: "Conteúdo de estilo e bastidores." },
] as const;
type Topic = (typeof topics)[number]["id"];

const initialNotifications = [
  { id: 1, icon: Truck, title: "Pedido KM-240918 em transporte", text: "Seu pedido saiu do centro de distribuição e chega até 07 de outubro.", time: "Hoje, 06h48", unread: true },
  { id: 2, icon: Heart, title: "Um favorito baixou de preço", text: "Vestido Midi Cetim Aurora agora por R$ 689,90.", time: "Ontem, 18h20", unread: true },
  { id: 3, icon: Gift, title: "Cupom GOLD150 disponível", text: "R$ 150 OFF em compras acima de R$ 1.200 até 31 de outubro.", time: "02 out", unread: false },
  { id: 4, icon: Package, title: "Pedido KM-240850 em preparação", text: "Suas peças estão sendo embaladas com carinho no Atelier.", time: "30 set", unread: false },
  { id: 5, icon: Sparkles, title: "Coleção Aurora chegou", text: "Vestidos de cetim, conjuntos de pantalona e alfaiataria.", time: "28 set", unread: false },
];

/** Telas 65 e 105: preferências e central de notificações */
export function NotificationsView({ empty }: { empty?: boolean }) {
  const { toast } = useUI();
  const [enabled, setEnabled] = useState<Record<Channel, boolean>>({ email: true, whatsapp: true, sms: false, push: true });
  const [matrix, setMatrix] = useState<Record<Topic, Record<Channel, boolean>>>({
    pedidos: { email: true, whatsapp: true, sms: true, push: true },
    ofertas: { email: true, whatsapp: false, sms: false, push: true },
    novidades: { email: true, whatsapp: false, sms: false, push: false },
    desejos: { email: true, whatsapp: true, sms: false, push: true },
    journal: { email: false, whatsapp: false, sms: false, push: false },
  });
  const [items, setItems] = useState(empty ? [] : initialNotifications);
  const unread = items.filter((n) => n.unread).length;

  return (
    <>
      <AccountHeading eyebrow="Comunicação" title="Notificações" text="Escolha como e sobre o que deseja ser avisada. Avisos de segurança são sempre enviados por e-mail." />

      <div className="flex flex-col gap-8">
        <Panel
          title={`Central de notificações${unread ? ` · ${unread} não lidas` : ""}`}
          action={
            items.length ? (
              <div className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.18em]">
                {unread > 0 && (
                  <button type="button" onClick={() => setItems((l) => l.map((n) => ({ ...n, unread: false })))} className="text-taupe hover:text-ink">
                    Marcar como lidas
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setItems([]);
                    toast("Central limpa", { message: "Todas as notificações foram lidas e removidas.", variant: "info" });
                  }}
                  className="text-ink underline decoration-gold underline-offset-4 hover:text-gold"
                >
                  Marcar todas como lidas e limpar
                </button>
              </div>
            ) : undefined
          }
        >
          {items.length ? (
            <ul className="-mx-6 divide-y divide-line border-t border-line md:-mx-8">
              {items.map((n) => {
                const Icon = n.icon;
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => setItems((l) => l.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
                      className={clsx("flex w-full gap-4 px-6 py-5 text-left transition-colors hover:bg-offwhite md:px-8", n.unread && "bg-offwhite/60")}
                    >
                      <span className={clsx("grid size-10 shrink-0 place-items-center rounded-full border", n.unread ? "border-champagne text-ink" : "border-line text-taupe")}>
                        <Icon className="size-4" strokeWidth={1.2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={clsx("block text-sm", n.unread ? "text-ink" : "text-graphite")}>{n.title}</span>
                        <span className="mt-0.5 block text-sm text-taupe">{n.text}</span>
                        <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-taupe">{n.time}</span>
                      </span>
                      {n.unread && <span className="mt-2 size-2 shrink-0 rounded-full bg-gold" aria-label="Não lida" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              compact
              icon={<BellOff />}
              title="Nenhuma notificação"
              text="Você está em dia. Avisaremos aqui sobre seus pedidos, favoritos e benefícios exclusivos."
              actions={
                <Button href="/novidades" variant="secondary" size="sm">
                  Ver novidades
                </Button>
              }
            />
          )}
        </Panel>

        <Panel title="Canais">
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.id} className="flex items-center justify-between gap-4 bg-white p-5">
                  <span className="flex items-center gap-3 text-sm text-ink">
                    <Icon className="size-4 text-gold" strokeWidth={1.2} /> {c.label}
                  </span>
                  <Toggle checked={enabled[c.id]} onChange={(v) => setEnabled({ ...enabled, [c.id]: v })} label={`Receber por ${c.label}`} />
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Assuntos">
          <div className="-mx-6 overflow-x-auto md:mx-0">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-[0.2em] text-taupe">
                  <th className="px-6 pb-4 font-normal md:px-0">Assunto</th>
                  {channels.map((c) => (
                    <th key={c.id} className={clsx("w-24 pb-4 text-center font-normal", !enabled[c.id] && "opacity-40")}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {topics.map((t) => (
                  <tr key={t.id}>
                    <td className="px-6 py-5 md:px-0">
                      <p className="text-ink">{t.label}</p>
                      <p className="mt-0.5 text-xs text-taupe">{t.text}</p>
                    </td>
                    {channels.map((c) => (
                      <td key={c.id} className={clsx("py-5 text-center", !enabled[c.id] && "pointer-events-none opacity-30")}>
                        <span className="inline-flex">
                          <Toggle
                            checked={enabled[c.id] && matrix[t.id][c.id]}
                            onChange={(v) => setMatrix({ ...matrix, [t.id]: { ...matrix[t.id], [c.id]: v } })}
                            label={`${t.label} por ${c.label}`}
                          />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
            <Button onClick={() => toast("Preferências salvas", { message: "Suas escolhas de notificação foram atualizadas." })}>Salvar preferências</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setEnabled({ email: true, whatsapp: false, sms: false, push: false });
                toast("Apenas o essencial", { message: "Você receberá só avisos de pedidos por e-mail.", variant: "info" });
              }}
            >
              Receber só o essencial
            </Button>
          </div>
        </Panel>
      </div>
    </>
  );
}
