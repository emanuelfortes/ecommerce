"use client";

import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleCheck, Search, Store, Truck } from "lucide-react";
import type { Order } from "@/lib/types";
import { getOrder } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Notice, Stepper } from "@/components/ui/Feedback";
import { Field, RadioCard, TextArea } from "@/components/ui/Form";
import { ColorSelector, QuantityStepper, SizeSelector } from "@/components/ui/Interactive";
import { Ornament } from "@/components/ui/Primitives";
import { useUI } from "@/components/providers/UIProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { Money } from "@/components/product/Price";
import { DEMO_TODAY, addDays, orderLines, paymentLabel, protocolFor, returnReasons } from "./orderUtils";

type Mode = "troca" | "devolucao";
type Pick = { checked: boolean; qty: number; size: string; color: string };

const refundOptions = [
  { id: "original", title: "Mesma forma de pagamento", text: "Estorno no cartão em até 2 faturas ou devolução via PIX em até 2 dias úteis." },
  { id: "vale", title: "Vale-compras com 10% extra", text: "Crédito liberado em até 24h após a análise, válido por 12 meses." },
  { id: "pix", title: "PIX para outra conta", text: "Informe a chave PIX de uma conta de mesma titularidade." },
];

/** Telas 58, 59, 75 e 76: fluxo de troca ou devolução em etapas */
export function ReturnFlow({ order, mode, publicFlow }: { order: Order; mode: Mode; publicFlow?: boolean }) {
  const { toast } = useUI();
  const lines = orderLines(order);
  const steps = mode === "troca" ? ["Peças", "Motivo", "Envio", "Revisão"] : ["Peças", "Motivo", "Envio", "Reembolso"];
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Pick[]>(() =>
    lines.map((l) => ({ checked: lines.length === 1, qty: l.qty, size: l.size, color: l.color }))
  );
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [shipping, setShipping] = useState<"postagem" | "coleta">("postagem");
  const pickupDates = [1, 2, 3].map((n) => addDays(DEMO_TODAY, n + 1));
  const [pickup, setPickup] = useState(pickupDates[0]);
  const [refund, setRefund] = useState("original");
  const [pixKey, setPixKey] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const protocol = protocolFor(order, mode);
  const chosen = lines.map((l, i) => ({ line: l, pick: picks[i] })).filter((x) => x.pick.checked);
  const refundValue = chosen.reduce((s, x) => s + x.line.price * x.pick.qty, 0);
  const setPick = (i: number, p: Partial<Pick>) => setPicks((all) => all.map((x, j) => (j === i ? { ...x, ...p } : x)));

  const validate = () => {
    if (step === 0 && !chosen.length) return "Selecione ao menos uma peça.";
    if (step === 0 && mode === "troca" && chosen.some((x) => x.pick.size === x.line.size && x.pick.color === x.line.color))
      return "Escolha um novo tamanho ou uma nova cor para cada peça selecionada.";
    if (step === 1 && !reason) return "Selecione o motivo da solicitação.";
    if (step === 1 && reason === "outro" && comment.trim().length < 5) return "Conte o motivo nos comentários.";
    if (step === 3 && mode === "devolucao" && refund === "pix" && pixKey.trim().length < 5) return "Informe uma chave PIX válida.";
    return "";
  };

  const next = () => {
    const err = validate();
    setError(err);
    if (err) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setDone(true);
    toast(mode === "troca" ? "Troca solicitada" : "Devolução solicitada", { message: `Protocolo ${protocol}` });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <div className="border border-line bg-white px-6 py-14 text-center md:px-14 md:py-20">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-champagne text-ink">
          <CircleCheck className="size-7" strokeWidth={1.1} />
        </span>
        <p className="eyebrow mt-6">Solicitação registrada</p>
        <h2 className="mt-3 text-4xl md:text-5xl">{mode === "troca" ? "Sua troca está a caminho" : "Devolução solicitada"}</h2>
        <Ornament className="my-6" />
        <p className="text-[11px] uppercase tracking-[0.22em] text-taupe">Número do protocolo</p>
        <p className="mt-2 font-serif text-4xl tracking-wide text-ink">{protocol}</p>
        <ol className="mx-auto mt-10 grid max-w-2xl gap-6 text-left text-sm text-graphite sm:grid-cols-3">
          {[
            shipping === "postagem"
              ? "Enviamos o código de postagem para o seu e-mail. Leve o pacote a uma agência dos Correios em até 10 dias."
              : `A coleta foi agendada para ${formatDate(pickup, { weekday: "long", day: "2-digit", month: "long" })}, das 8h às 18h.`,
            "Ao chegar ao Atelier, as peças passam por uma análise de até 3 dias úteis.",
            mode === "troca"
              ? "Aprovada a análise, enviamos as novas peças sem custo de frete."
              : `Aprovada a análise, o reembolso de ${refund === "vale" ? "crédito com 10% extra" : "valor integral"} é liberado.`,
          ].map((t, i) => (
            <li key={i} className="border-t border-gold/60 pt-4">
              <span className="font-serif text-2xl text-ink">0{i + 1}</span>
              <p className="mt-2 leading-relaxed">{t}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Button href={`/conta/devolucoes/${protocol}`}>Acompanhar solicitação</Button>
          {mode === "devolucao" ? (
            <Button href={`/reembolso/${order.id}`} variant="secondary">
              Ver reembolso
            </Button>
          ) : (
            <Button href={publicFlow ? "/" : `/conta/pedidos/${order.id}`} variant="secondary">
              {publicFlow ? "Voltar à loja" : "Voltar ao pedido"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <Stepper steps={steps} current={step} />
      {order.status !== "entregue" && (
        <Notice tone="info" title="Pedido ainda não entregue">
          Você pode registrar a solicitação agora. Os prazos de troca e devolução começam a contar a partir do recebimento.
        </Notice>
      )}

      {step === 0 && (
        <section>
          <h2 className="text-3xl">{mode === "troca" ? "Quais peças você quer trocar?" : "Quais peças você quer devolver?"}</h2>
          <p className="mt-2 text-sm text-taupe">
            {mode === "troca"
              ? "Selecione as peças e escolha o novo tamanho ou a nova cor. A primeira troca é gratuita."
              : "Selecione as peças. A devolução é gratuita em até 30 dias após o recebimento."}
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {lines.map((l, i) => {
              const p = picks[i];
              return (
                <li key={l.productId + l.size} className={clsx("border bg-white transition-colors", p.checked ? "border-ink" : "border-line")}>
                  <label className="flex cursor-pointer gap-4 p-4 md:p-5">
                    <input
                      type="checkbox"
                      checked={p.checked}
                      onChange={(e) => setPick(i, { checked: e.target.checked })}
                      className="mt-1 size-4 shrink-0 accent-ink"
                    />
                    <div className="w-16 shrink-0 border border-line">
                      <ProductImage product={l.product} color={l.color} />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-xl leading-snug text-ink">{l.product.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-taupe">
                        Cor {l.color} · Tam. {l.size} · Qtd. {l.qty}
                      </p>
                      <Money value={l.price} className="mt-1 block text-sm" />
                    </div>
                  </label>
                  {p.checked && (mode === "troca" || l.qty > 1) && (
                    <div className="grid gap-6 border-t border-line p-4 md:grid-cols-2 md:p-5">
                      {mode === "troca" && (
                        <>
                          <div>
                            <p className="field-label">Novo tamanho</p>
                            <SizeSelector sizes={l.product.sizes} value={p.size} onChange={(size) => setPick(i, { size })} />
                          </div>
                          <div>
                            <p className="field-label">
                              Nova cor <span className="ml-1 normal-case tracking-normal text-taupe">{p.color}</span>
                            </p>
                            <ColorSelector colors={l.product.colors} value={p.color} onChange={(color) => setPick(i, { color })} />
                          </div>
                        </>
                      )}
                      {l.qty > 1 && (
                        <div>
                          <p className="field-label">Quantidade</p>
                          <QuantityStepper value={p.qty} max={l.qty} onChange={(qty) => setPick(i, { qty })} size="sm" />
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {step === 1 && (
        <section>
          <h2 className="text-3xl">Qual o motivo?</h2>
          <p className="mt-2 text-sm text-taupe">Sua resposta ajuda o Atelier a aprimorar modelagens e tecidos.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {returnReasons.map((r) => (
              <RadioCard key={r.id} name="motivo" checked={reason === r.id} onChange={() => setReason(r.id)} className="p-4">
                <p className="text-sm text-ink">{r.label}</p>
                <p className="mt-1 text-xs text-taupe">{r.text}</p>
              </RadioCard>
            ))}
          </div>
          <TextArea
            className="mt-6"
            label="Comentários"
            placeholder="Se quiser, descreva com mais detalhes."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </section>
      )}

      {step === 2 && (
        <section>
          <h2 className="text-3xl">Como você prefere enviar?</h2>
          <p className="mt-2 text-sm text-taupe">O frete de retorno é por nossa conta.</p>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <RadioCard name="envio" checked={shipping === "postagem"} onChange={() => setShipping("postagem")}>
              <p className="flex items-center gap-2 text-[15px] text-ink">
                <Store className="size-4 text-gold" strokeWidth={1.3} /> Postagem em agência
              </p>
              <p className="mt-1 text-sm text-taupe">Receba um código e leve o pacote a qualquer agência dos Correios.</p>
            </RadioCard>
            <RadioCard name="envio" checked={shipping === "coleta"} onChange={() => setShipping("coleta")}>
              <p className="flex items-center gap-2 text-[15px] text-ink">
                <Truck className="size-4 text-gold" strokeWidth={1.3} /> Coleta no endereço
              </p>
              <p className="mt-1 text-sm text-taupe">Um parceiro retira o pacote no endereço de entrega do pedido.</p>
            </RadioCard>
          </div>
          {shipping === "coleta" && (
            <div className="mt-6">
              <p className="field-label">Data da coleta</p>
              <div className="flex flex-wrap gap-2">
                {pickupDates.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPickup(d)}
                    className={clsx(
                      "border px-4 py-3 text-left text-sm transition-colors",
                      pickup === d ? "border-ink bg-ink text-white" : "border-line bg-white text-graphite hover:border-ink"
                    )}
                  >
                    {formatDate(d, { weekday: "short", day: "2-digit", month: "short" })}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-taupe">Período das 8h às 18h. Deixe o pacote fechado com a etiqueta que enviaremos por e-mail.</p>
            </div>
          )}
        </section>
      )}

      {step === 3 && (
        <section className="flex flex-col gap-8">
          {mode === "devolucao" && (
            <div>
              <h2 className="text-3xl">Como prefere receber o reembolso?</h2>
              <p className="mt-2 text-sm text-taupe">
                Valor das peças: <Money value={refundValue} className="text-ink" /> · pago com {paymentLabel[order.payment]}
              </p>
              <div className="mt-8 flex flex-col gap-3">
                {refundOptions.map((r) => (
                  <RadioCard key={r.id} name="reembolso" checked={refund === r.id} onChange={() => setRefund(r.id)}>
                    <p className="text-[15px] text-ink">{r.title}</p>
                    <p className="mt-1 text-sm text-taupe">{r.text}</p>
                  </RadioCard>
                ))}
              </div>
              {refund === "pix" && (
                <Field className="mt-5" label="Chave PIX" value={pixKey} onChange={(e) => setPixKey(e.target.value)} placeholder="CPF, e-mail ou celular" />
              )}
            </div>
          )}
          <div className="border border-line bg-white p-6 md:p-8">
            <p className="eyebrow">Resumo da solicitação</p>
            <ul className="mt-5 divide-y divide-line">
              {chosen.map(({ line, pick }) => (
                <li key={line.productId} className="flex items-center gap-4 py-4 first:pt-0">
                  <div className="w-12 shrink-0 border border-line">
                    <ProductImage product={line.product} color={pick.color} />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="text-ink">{line.product.name}</p>
                    <p className="text-xs text-taupe">
                      {mode === "troca" ? (
                        <>
                          {line.color} · {line.size} <ArrowRight className="inline size-3 text-gold" strokeWidth={1.4} /> {pick.color} · {pick.size}
                        </>
                      ) : (
                        <>
                          {line.color} · {line.size} · Qtd. {pick.qty}
                        </>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 grid gap-3 border-t border-line pt-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-taupe">Motivo</dt>
                <dd className="text-ink">{returnReasons.find((r) => r.id === reason)?.label}</dd>
              </div>
              <div>
                <dt className="text-taupe">Envio</dt>
                <dd className="text-ink">
                  {shipping === "postagem" ? "Postagem em agência" : `Coleta em ${formatDate(pickup, { day: "2-digit", month: "short" })}`}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-8">
        {step > 0 ? (
          <Button variant="secondary" onClick={() => {
              setError("");
              setStep(step - 1);
            }}>
            <ArrowLeft className="size-4" strokeWidth={1.3} /> Voltar
          </Button>
        ) : (
          <Link href={publicFlow ? "/politica-de-troca-e-devolucao" : `/conta/pedidos/${order.id}`} className="link-luxe">
            {publicFlow ? "Ver política" : "Voltar ao pedido"}
          </Link>
        )}
        <Button onClick={next}>
          {step < steps.length - 1 ? (
            <>
              Continuar <ArrowRight className="size-4" strokeWidth={1.3} />
            </>
          ) : (
            <>
              Confirmar solicitação <Check className="size-4" strokeWidth={1.3} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/** Telas 75 e 76: localizar pedido por número + e-mail (sem login) e seguir o fluxo */
export function PublicReturnRequest({ mode }: { mode: Mode }) {
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  if (order) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-line bg-white px-5 py-4">
          <p className="text-sm text-graphite">
            Pedido <strong className="font-medium text-ink">{order.id}</strong> · {formatDate(order.date)}
          </p>
          <button type="button" onClick={() => setOrder(null)} className="text-[11px] uppercase tracking-[0.18em] text-taupe hover:text-ink">
            Buscar outro pedido
          </button>
        </div>
        <ReturnFlow order={order} mode={mode} publicFlow />
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        const id = number.trim().toUpperCase().replace(/^(KM)?-?/, "KM-");
        if (!/^KM-\d{6}$/.test(id)) errs.number = "Informe o número no formato KM-000000.";
        if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Informe um e-mail válido.";
        const found = getOrder(id);
        if (!errs.number && !found) errs.number = "Não encontramos um pedido com esse número.";
        if (found?.status === "cancelado") errs.number = "Este pedido foi cancelado e não possui peças para " + (mode === "troca" ? "troca." : "devolução.");
        setErrors(errs);
        if (Object.keys(errs).length || !found) return;
        setLoading(true);
        window.setTimeout(() => {
          setLoading(false);
          setOrder(found);
        }, 600);
      }}
      className="flex flex-col gap-5 border border-line bg-white p-6 md:p-10"
    >
      <div>
        <p className="eyebrow">Etapa 1</p>
        <h2 className="mt-2 text-3xl">Localize o seu pedido</h2>
        <p className="mt-2 text-sm text-taupe">Use o número do pedido e o e-mail informado na compra.</p>
      </div>
      <Field label="Número do pedido" value={number} onChange={(e) => setNumber(e.target.value)} error={errors.number} placeholder="KM-000000" hint="Está no e-mail de confirmação. Para testar, use KM-240877." />
      <Field label="E-mail da compra" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="voce@email.com" autoComplete="email" />
      <Button type="submit" disabled={loading} full>
        <Search className="size-4" strokeWidth={1.3} /> {loading ? "Buscando..." : "Buscar pedido"}
      </Button>
      <p className="text-center text-sm text-taupe">
        Tem conta? <Link href="/conta/pedidos" className="text-ink underline decoration-gold underline-offset-4">Acesse seus pedidos</Link>
      </p>
    </form>
  );
}
