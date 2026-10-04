"use client";

import clsx from "clsx";
import { useState } from "react";
import { Barcode, CreditCard, Lock, Plus, QrCode, Trash } from "lucide-react";
import { orders } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { aos } from "@/lib/aos";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Checkbox, Field } from "@/components/ui/Form";
import { Modal } from "@/components/ui/Overlay";
import { Badge } from "@/components/ui/Primitives";
import { useUI } from "@/components/providers/UIProvider";
import { Money } from "@/components/product/Price";
import { orderTotal } from "@/components/orders/orderUtils";
import { AccountHeading, Panel } from "./AccountUI";

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  holder: string;
  exp: string;
  isDefault?: boolean;
}

const initialCards: SavedCard[] = [
  { id: "c1", brand: "Visa", last4: "4821", holder: "KAREN MICHELLY", exp: "08/29", isDefault: true },
  { id: "c2", brand: "Mastercard", last4: "1934", holder: "KAREN M SOUZA", exp: "03/28" },
];

function detectBrand(num: string) {
  const d = num.replace(/\D/g, "");
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  if (/^(4011|4389|5041|5067|6277|6362|6363|650)/.test(d)) return "Elo";
  return d.length ? "Cartão" : "";
}

/** Cartão salvo: preto com chip dourado */
export function CardVisual({ card, className }: { card: Pick<SavedCard, "brand" | "last4" | "holder" | "exp">; className?: string }) {
  return (
    <div className={clsx("relative flex aspect-[1.586] w-full flex-col justify-between overflow-hidden bg-ink p-5 text-white shadow-xl md:p-6", className)}>
      <span className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full border border-white/5" aria-hidden />
      <span className="pointer-events-none absolute -right-6 -top-6 size-36 rounded-full border border-gold/15" aria-hidden />
      <div className="relative flex items-start justify-between">
        <span className="font-serif text-lg italic tracking-wide text-champagne">Karen Michelly</span>
        <span className="text-[11px] uppercase tracking-[0.24em] text-white/80">{card.brand || "Cartão"}</span>
      </div>
      <span
        className="relative block h-8 w-11 rounded-[5px] border border-gold/60"
        style={{ background: "linear-gradient(135deg, #E3C98F 0%, #C6A15B 45%, #9C7A3C 100%)" }}
        aria-hidden
      >
        <span className="absolute inset-x-0 top-1/2 h-px bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-ink/25" />
      </span>
      <div className="relative">
        <p className="font-mono text-[15px] tracking-[0.2em] text-white md:text-lg">
          •••• •••• •••• {card.last4 || "0000"}
        </p>
        <div className="mt-3 flex items-end justify-between gap-4 text-[10px] uppercase tracking-[0.2em]">
          <span className="truncate text-white/80">{card.holder || "NOME NO CARTÃO"}</span>
          <span className="shrink-0 text-white/60">
            Validade <span className="ml-1 text-white">{card.exp || "MM/AA"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function AddCardModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (c: SavedCard) => void }) {
  const [form, setForm] = useState({ number: "", holder: "", exp: "", cvv: "" });
  const [makeDefault, setMakeDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const digits = form.number.replace(/\D/g, "");

  const reset = () => {
    setForm({ number: "", holder: "", exp: "", cvv: "" });
    setErrors({});
    setMakeDefault(false);
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="grid md:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col justify-center gap-5 bg-nude p-8">
          <span className="eyebrow">Pré-visualização</span>
          <CardVisual card={{ brand: detectBrand(digits), last4: digits.slice(-4), holder: form.holder.toUpperCase(), exp: form.exp }} />
          <p className="flex items-center gap-2 text-xs text-graphite">
            <Lock className="size-3.5 text-gold" strokeWidth={1.3} /> Dados criptografados e tokenizados pelo gateway de pagamento.
          </p>
        </div>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const errs: Record<string, string> = {};
            if (digits.length < 13) errs.number = "Número de cartão inválido.";
            if (form.holder.trim().length < 3) errs.holder = "Informe o nome impresso no cartão.";
            const [mm, yy] = form.exp.split("/").map(Number);
            if (!mm || mm > 12 || !yy || yy < 26) errs.exp = "Validade inválida.";
            if (form.cvv.length < 3) errs.cvv = "CVV inválido.";
            setErrors(errs);
            if (Object.keys(errs).length) return;
            onAdd({ id: `c${Date.now()}`, brand: detectBrand(digits), last4: digits.slice(-4), holder: form.holder.toUpperCase(), exp: form.exp, isDefault: makeDefault });
            reset();
          }}
          className="flex flex-col gap-5 p-8"
        >
          <div>
            <p className="eyebrow">Novo cartão</p>
            <h2 className="mt-2 text-3xl">Adicionar cartão</h2>
          </div>
          <Field
            label="Número do cartão"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") })}
            error={errors.number}
          />
          <Field label="Nome impresso" autoComplete="cc-name" value={form.holder} onChange={(e) => setForm({ ...form, holder: e.target.value })} error={errors.holder} />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Validade"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              value={form.exp}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                setForm({ ...form, exp: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d });
              }}
              error={errors.exp}
            />
            <Field
              label="CVV"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="000"
              value={form.cvv}
              onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              error={errors.cvv}
            />
          </div>
          <Checkbox checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)} label="Definir como cartão principal" />
          <Button type="submit" full>
            Salvar cartão
          </Button>
        </form>
      </div>
    </Modal>
  );
}

/** Tela 61: Pagamentos */
export function PaymentsView() {
  const { confirm, toast } = useUI();
  const [cards, setCards] = useState<SavedCard[]>(initialCards);
  const [adding, setAdding] = useState(false);
  const history = orders
    .filter((o) => o.payment !== "cartao")
    .map((o) => ({
      order: o,
      status: o.status === "cancelado" ? (o.payment === "boleto" ? "Expirado" : "Cancelado") : "Pago",
    }));

  return (
    <>
      <AccountHeading
        eyebrow="Carteira"
        title="Pagamentos"
        text="Cartões salvos com segurança para compras em um clique. Nunca armazenamos o código de segurança."
        action={
          <Button size="sm" onClick={() => setAdding(true)}>
            <Plus className="size-4" strokeWidth={1.3} /> Adicionar cartão
          </Button>
        }
      />

      {cards.length ? (
        <div className="grid gap-8 md:grid-cols-2">
          {cards.map((c, i) => (
            <div key={c.id} {...aos.fadeUp(i * 80)} className="flex flex-col gap-4">
              <CardVisual card={c} />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-4 text-gold" strokeWidth={1.2} />
                  <span className="text-sm text-graphite">
                    {c.brand} final {c.last4}
                  </span>
                  {c.isDefault && <Badge tone="nude">Principal</Badge>}
                </div>
                <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.18em]">
                  {!c.isDefault && (
                    <button
                      type="button"
                      onClick={() => {
                        setCards((l) => l.map((x) => ({ ...x, isDefault: x.id === c.id })));
                        toast("Cartão principal atualizado", { message: `${c.brand} final ${c.last4}` });
                      }}
                      className="text-taupe hover:text-ink"
                    >
                      Tornar principal
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      confirm({
                        title: "Remover cartão?",
                        message: `O cartão ${c.brand} final ${c.last4} será removido da sua carteira.`,
                        confirmLabel: "Remover",
                        tone: "danger",
                        onConfirm: () => {
                          setCards((l) => {
                            const rest = l.filter((x) => x.id !== c.id);
                            if (c.isDefault && rest.length) rest[0] = { ...rest[0], isDefault: true };
                            return rest;
                          });
                          toast("Cartão removido", { variant: "info" });
                        },
                      })
                    }
                    className="flex items-center gap-1.5 text-taupe hover:text-danger"
                  >
                    <Trash className="size-3.5" strokeWidth={1.3} /> Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-line bg-white px-6">
          <EmptyState
            compact
            icon={<CreditCard />}
            title="Nenhum cartão salvo"
            text="Salve um cartão para finalizar suas próximas compras com mais rapidez."
            actions={<Button onClick={() => setAdding(true)}>Adicionar cartão</Button>}
          />
        </div>
      )}

      <Panel title="Histórico de PIX e boleto" className="mt-12">
        <ul className="divide-y divide-line">
          {history.map(({ order, status }) => (
            <li key={order.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink">
                {order.payment === "pix" ? <QrCode className="size-4" strokeWidth={1.2} /> : <Barcode className="size-4" strokeWidth={1.2} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink">
                  {order.payment === "pix" ? "PIX" : "Boleto bancário"} · Pedido {order.id}
                </p>
                <p className="text-xs text-taupe">{formatDate(order.date)}</p>
              </div>
              <Badge tone={status === "Pago" ? "success" : "danger"}>{status}</Badge>
              <Money value={orderTotal(order)} className="w-28 text-right font-serif text-xl text-ink" />
            </li>
          ))}
        </ul>
      </Panel>

      <AddCardModal
        open={adding}
        onClose={() => setAdding(false)}
        onAdd={(card) => {
          setCards((l) => [...(card.isDefault ? l.map((x) => ({ ...x, isDefault: false })) : l), { ...card, isDefault: card.isDefault || !l.length }]);
          setAdding(false);
          toast("Cartão adicionado", { message: `${card.brand} final ${card.last4}` });
        }}
      />
    </>
  );
}
