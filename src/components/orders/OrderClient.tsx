"use client";

import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { Check, Copy, FileText, PackageOpen, CircleCheck } from "lucide-react";
import type { Order } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { EmptyState, Notice } from "@/components/ui/Feedback";
import { RadioCard, TextArea } from "@/components/ui/Form";
import { useUI } from "@/components/providers/UIProvider";
import { Money } from "@/components/product/Price";
import { OrderCard } from "./OrderParts";
import { cancelReasons, orderGroup, orderTotal, paymentLabel, type OrderGroup } from "./orderUtils";

/** Copia um texto e mostra confirmação */
export function CopyButton({ value, label = "Copiar", className }: { value: string; label?: string; className?: string }) {
  const { toast } = useUI();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={label ? undefined : `Copiar ${value}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          /* área de transferência indisponível */
        }
        setDone(true);
        toast("Copiado", { message: value, variant: "info" });
        window.setTimeout(() => setDone(false), 1800);
      }}
      className={clsx(
        "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:text-gold",
        className
      )}
    >
      {done ? <Check className="size-3.5 text-gold" strokeWidth={1.6} /> : <Copy className="size-3.5" strokeWidth={1.3} />}
      {label && (done ? "Copiado" : label)}
    </button>
  );
}

/** Botão de nota fiscal (simulação de download) */
export function InvoiceButton({ orderId }: { orderId: string }) {
  const { toast } = useUI();
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => toast("Nota fiscal", { message: `O PDF da NF-e do pedido ${orderId} foi enviado para o seu e-mail.`, variant: "info" })}
    >
      <FileText className="size-4" strokeWidth={1.3} /> Nota fiscal
    </Button>
  );
}

const filters: { id: "todos" | OrderGroup; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "andamento", label: "Em andamento" },
  { id: "entregue", label: "Entregues" },
  { id: "cancelado", label: "Cancelados" },
];

/** Telas 54 e 103: lista de pedidos com filtros */
export function OrdersList({ orders, empty }: { orders: Order[]; empty?: boolean }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("todos");
  const list = empty ? [] : orders;
  if (!list.length) {
    return (
      <EmptyState
        icon={<PackageOpen />}
        title="Você ainda não fez pedidos"
        text="Quando você finalizar uma compra, ela aparece aqui com o status de cada etapa, do Atelier até a sua porta."
        actions={
          <>
            <Button href="/novidades">Ver novidades</Button>
            <Button href="/mais-vendidos" variant="secondary">
              Mais vendidos
            </Button>
          </>
        }
      />
    );
  }
  const visible = filter === "todos" ? list : list.filter((o) => orderGroup(o.status) === filter);
  return (
    <div>
      <div role="tablist" className="no-scrollbar -mx-4 mb-8 flex gap-8 overflow-x-auto border-b border-line px-4 md:mx-0 md:px-0">
        {filters.map((f) => {
          const count = f.id === "todos" ? list.length : list.filter((o) => orderGroup(o.status) === f.id).length;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.id)}
              className={clsx(
                "relative shrink-0 pb-4 text-[12px] uppercase tracking-[0.2em] transition-colors",
                active ? "text-ink" : "text-taupe hover:text-ink"
              )}
            >
              {f.label} <span className="ml-1 text-taupe">({count})</span>
              <span
                className={clsx(
                  "absolute inset-x-0 -bottom-px h-px bg-gold transition-transform duration-500",
                  active ? "scale-x-100" : "scale-x-0"
                )}
              />
            </button>
          );
        })}
      </div>
      {visible.length ? (
        <div className="flex flex-col gap-5">
          {visible.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      ) : (
        <EmptyState
          compact
          icon={<PackageOpen />}
          title="Nenhum pedido neste filtro"
          text="Experimente outro filtro para ver os demais pedidos."
          actions={
            <Button variant="secondary" size="sm" onClick={() => setFilter("todos")}>
              Ver todos
            </Button>
          }
        />
      )}
    </div>
  );
}

/** Tela 57: Cancelar pedido */
export function CancelOrderFlow({ order, allowed }: { order: Order; allowed: boolean }) {
  const { confirm, toast } = useUI();
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="border border-line bg-white px-6">
        <EmptyState
          compact
          icon={<CircleCheck />}
          title="Pedido cancelado"
          text={
            <>
              O pedido {order.id} foi cancelado. O reembolso de <Money value={orderTotal(order)} /> via {paymentLabel[order.payment]} será
              processado em até 7 dias úteis. Enviamos os detalhes para o seu e-mail.
            </>
          }
          actions={
            <>
              <Button href="/conta/pedidos">Meus pedidos</Button>
              <Button href={`/reembolso/${order.id}`} variant="secondary">
                Acompanhar reembolso
              </Button>
            </>
          }
        />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex flex-col gap-6">
        <Notice tone="warning" title="Este pedido não pode mais ser cancelado">
          O cancelamento está disponível apenas enquanto o pedido aguarda pagamento ou está em preparação. Depois do envio, você pode
          recusar a entrega ou solicitar a devolução gratuita em até 30 dias após o recebimento.
        </Notice>
        <div className="flex flex-wrap gap-3">
          <Button href={`/conta/pedidos/${order.id}/devolucao`}>Solicitar devolução</Button>
          <Button href={`/conta/pedidos/${order.id}`} variant="secondary">
            Voltar ao pedido
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!reason) {
          setError("Selecione um motivo para continuar.");
          return;
        }
        setError("");
        confirm({
          title: "Cancelar pedido?",
          message: `O pedido ${order.id} será cancelado e o valor estornado. Esta ação não pode ser desfeita.`,
          confirmLabel: "Sim, cancelar",
          tone: "danger",
          onConfirm: () => {
            setDone(true);
            toast("Pedido cancelado", { message: `Pedido ${order.id}` });
          },
        });
      }}
      className="flex flex-col gap-8"
    >
      <fieldset>
        <legend className="field-label mb-4">Por que você deseja cancelar?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {cancelReasons.map((r) => (
            <RadioCard key={r.id} name="motivo" checked={reason === r.id} onChange={() => setReason(r.id)} className="p-4">
              <span className="text-sm text-graphite">{r.label}</span>
            </RadioCard>
          ))}
        </div>
        {error && <p className="mt-3 text-xs text-danger">{error}</p>}
      </fieldset>
      <TextArea
        label="Comentários (opcional)"
        placeholder="Conte mais sobre o motivo. Sua resposta nos ajuda a melhorar."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Notice tone="info" title="Reembolso">
        O valor de <Money value={orderTotal(order)} /> será devolvido pela mesma forma de pagamento ({paymentLabel[order.payment]}).
      </Notice>
      <div className="flex flex-wrap gap-3">
        <Button type="submit">Cancelar pedido</Button>
        <Button href={`/conta/pedidos/${order.id}`} variant="secondary">
          Manter pedido
        </Button>
      </div>
      <p className="text-xs text-taupe">
        Prefere conversar antes? <Link href="/contato" className="underline decoration-gold underline-offset-4">Fale com a nossa equipe</Link>.
      </p>
    </form>
  );
}
