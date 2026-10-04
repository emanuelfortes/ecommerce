"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Barcode, CreditCard, Lock, QrCode as QrIcon, Timer, Zap } from "lucide-react";
import { installments } from "@/lib/format";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Primitives";
import { Checkbox, Field, RadioCard, Select } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Feedback";
import { CheckoutShell, ReviewBlock } from "@/components/checkout/CheckoutShell";
import {
  computeTotals,
  newOrderId,
  snapshotItems,
  useCheckout,
  type CheckoutOutcome,
  type PaymentMethod,
} from "@/components/checkout/CheckoutState";
import { CardPreview, brandLabel, detectBrand, expiryValid, maskCard, maskExpiry, onlyDigits } from "@/components/checkout/CheckoutParts";

const methods: { id: PaymentMethod; title: string; text: string; icon: typeof Zap; badge?: string }[] = [
  { id: "pix", title: "PIX", text: "Aprovação imediata e 5% de desconto", icon: QrIcon, badge: "5% off" },
  { id: "cartao", title: "Cartão de crédito", text: "Em até 6x sem juros", icon: CreditCard },
  { id: "boleto", title: "Boleto bancário", text: "Vencimento em 3 dias úteis", icon: Barcode },
];

interface CardForm {
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
  installments: string;
}

/** Telas 31 a 36: resumo, cupom, pagamento, PIX, cartão e boleto */
export function PaymentStep() {
  const router = useRouter();
  const { user, cart, hydrated: storeReady, subtotal, discount, activeCoupon, money } = useStore();
  const { data, hydrated, update, address, shipping } = useCheckout();
  const [method, setMethod] = useState<PaymentMethod | null>(data.payment);
  const [card, setCard] = useState<CardForm>({ number: "", holder: "", expiry: "", cvv: "", installments: "1" });
  const [flipped, setFlipped] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CardForm | "method" | "terms", string>>>({});
  const [sending, setSending] = useState(false);

  const { ship, total } = computeTotals(subtotal, discount, activeCoupon, shipping?.price ?? null);
  const pixTotal = total * 0.95;
  const brand = detectBrand(card.number);
  const maxInst = installments(total).n;
  const inst = Math.min(Number(card.installments) || 1, maxInst);
  const contact = user?.email ?? data.email;

  // Exige as etapas anteriores
  useEffect(() => {
    if (!storeReady || !hydrated || cart.length === 0) return;
    if (!user && !data.email) router.replace("/checkout/identificacao");
    else if (!address || !shipping) router.replace("/checkout/entrega");
  }, [storeReady, hydrated, cart.length, user, data.email, address, shipping, router]);

  useEffect(() => {
    if (hydrated && data.payment && !method) setMethod(data.payment);
  }, [hydrated, data.payment, method]);

  const setC = (k: keyof CardForm, v: string) => {
    setCard((c) => ({ ...c, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!method) errs.method = "Escolha uma forma de pagamento.";
    if (method === "cartao") {
      const len = onlyDigits(card.number).length;
      if (len !== (brand === "amex" ? 15 : 16)) errs.number = "Número de cartão incompleto.";
      else if (!brand) errs.number = "Bandeira não reconhecida. Aceitamos Visa, Mastercard, Elo, Amex e Hipercard.";
      if (card.holder.trim().split(/\s+/).length < 2) errs.holder = "Informe o nome como impresso no cartão.";
      if (!expiryValid(card.expiry)) errs.expiry = "Validade inválida ou vencida.";
      if (onlyDigits(card.cvv).length !== (brand === "amex" ? 4 : 3)) errs.cvv = "Código inválido.";
    }
    if (!terms) errs.terms = "Para continuar, aceite os termos de compra.";
    setErrors(errs);
    if (Object.values(errs).some(Boolean) || !method) return;

    setSending(true);
    const digits = onlyDigits(card.number);
    const outcome: CheckoutOutcome =
      method === "pix" ? "pedido-realizado" : method === "boleto" ? "pendente" : digits.endsWith("0000") ? "recusado" : "aprovado";
    const pixDiscount = method === "pix" ? total - pixTotal : 0;
    update({
      payment: method,
      card:
        method === "cartao"
          ? { brand: brand ? brandLabel[brand] : "Cartão", last4: digits.slice(-4), holder: card.holder.trim().toUpperCase(), installments: inst }
          : null,
      outcome,
      orderId: newOrderId(),
      order: {
        items: snapshotItems(cart),
        subtotal,
        discount,
        couponCode: activeCoupon?.code ?? null,
        shipping: ship ?? 0,
        pixDiscount,
        total: total - pixDiscount,
        createdAt: Date.now(),
      },
    });
    router.push("/checkout/processando");
  };

  const summaryExtra =
    method === "pix" ? (
      <div className="border border-dashed border-gold/70 bg-gold/5 px-4 py-3 text-sm">
        <div className="flex justify-between text-success">
          <span>Desconto PIX (5%)</span>
          <span>-{money(total - pixTotal)}</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink">Você paga</span>
          <span className="font-serif text-2xl text-ink">{money(pixTotal)}</span>
        </div>
      </div>
    ) : method === "cartao" ? (
      <p className="text-right text-xs text-taupe">
        {inst === 1 ? "À vista no cartão" : `${inst}x de ${money(total / inst)} sem juros`}
      </p>
    ) : null;

  return (
    <CheckoutShell
      step={2}
      title="Pagamento"
      text="Revise seu pedido e escolha como prefere pagar. Seus dados são criptografados de ponta a ponta."
      summaryExtra={summaryExtra}
    >
      {/* Tela 31: revisão */}
      <section className="border border-line bg-white px-6 md:px-8">
        <ReviewBlock title="Contato" href="/checkout/identificacao">
          {contact || <span className="text-taupe">Não informado</span>}
        </ReviewBlock>
        <ReviewBlock title="Entregar em" href="/checkout/entrega">
          {address ? (
            <>
              <p>
                {address.recipient} · {address.street}, {address.number}
                {address.complement ? ` · ${address.complement}` : ""}
              </p>
              <p className="text-taupe">
                {address.district} · {address.city}/{address.state} · CEP {address.zip}
              </p>
            </>
          ) : (
            <span className="text-taupe">Selecione um endereço</span>
          )}
        </ReviewBlock>
        <ReviewBlock title="Envio" href="/checkout/entrega">
          {shipping ? (
            <p>
              {shipping.name} · {shipping.days} ·{" "}
              {ship === 0 ? <span className="text-success">Grátis</span> : money(ship ?? shipping.price)}
            </p>
          ) : (
            <span className="text-taupe">Selecione o frete</span>
          )}
          {data.gift && <p className="mt-1 text-xs text-taupe">Embalagem para presente{data.giftMessage ? ` · “${data.giftMessage}”` : ""}</p>}
        </ReviewBlock>
      </section>

      <form noValidate onSubmit={submit} className="mt-14">
        <h2 className="mb-5 flex items-center gap-3 text-2xl md:text-3xl">
          <Lock className="size-5 text-gold" strokeWidth={1.2} /> Forma de pagamento
        </h2>
        {errors.method && (
          <div className="mb-4">
            <Notice tone="error">{errors.method}</Notice>
          </div>
        )}

        <div className="grid gap-3">
          {methods.map((m) => (
            <div key={m.id}>
              <RadioCard
                name="pagamento"
                checked={method === m.id}
                onChange={() => {
                  setMethod(m.id);
                  setErrors((e) => ({ ...e, method: undefined }));
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="flex flex-wrap items-center gap-2 text-[15px] text-ink">
                      {m.title}
                      {m.badge && <Badge tone="gold">{m.badge}</Badge>}
                    </p>
                    <p className="mt-1 text-xs text-taupe">{m.text}</p>
                  </div>
                  <m.icon className="size-5 shrink-0 text-taupe" strokeWidth={1.2} />
                </div>
              </RadioCard>

              {/* Tela 34: PIX */}
              {method === "pix" && m.id === "pix" && (
                <div className="border border-t-0 border-ink bg-white p-6 md:p-8">
                  <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                    <span className="grid size-16 place-items-center rounded-full border border-champagne">
                      <Zap className="size-6 text-gold" strokeWidth={1.1} />
                    </span>
                    <div>
                      <p className="font-serif text-2xl text-ink">
                        {money(pixTotal)} <span className="text-base text-taupe line-through">{money(total)}</span>
                      </p>
                      <p className="mt-1 text-sm text-taupe">
                        Ao finalizar, geramos um QR Code e um código copia e cola válidos por 30 minutos. A aprovação é imediata e
                        seu pedido segue para o ateliê na hora.
                      </p>
                    </div>
                  </div>
                  <ol className="mt-6 grid gap-3 border-t border-line pt-6 text-sm text-graphite sm:grid-cols-3">
                    {["Finalize o pedido", "Abra o app do seu banco", "Escaneie ou cole o código"].map((t, i) => (
                      <li key={t} className="flex items-center gap-3">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full border border-gold text-[11px] text-ink">{i + 1}</span>
                        {t}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Tela 35: Cartão */}
              {method === "cartao" && m.id === "cartao" && (
                <div className="grid gap-8 border border-t-0 border-ink bg-white p-6 md:p-8 xl:grid-cols-[1fr_300px] xl:items-start">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="relative sm:col-span-2">
                      <Field
                        label="Número do cartão"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="0000 0000 0000 0000"
                        value={card.number}
                        onChange={(e) => setC("number", maskCard(e.target.value))}
                        error={errors.number}
                        hint="Demonstração: cartões com final 0000 simulam recusa."
                      />
                      {brand && (
                        <span className="absolute right-3 top-[38px] border border-line bg-offwhite px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ink">
                          {brandLabel[brand]}
                        </span>
                      )}
                    </div>
                    <Field
                      className="sm:col-span-2"
                      label="Nome impresso no cartão"
                      autoComplete="cc-name"
                      value={card.holder}
                      onChange={(e) => setC("holder", e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))}
                      error={errors.holder}
                    />
                    <Field
                      label="Validade"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/AA"
                      value={card.expiry}
                      onChange={(e) => setC("expiry", maskExpiry(e.target.value))}
                      error={errors.expiry}
                    />
                    <Field
                      label="CVV"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder={brand === "amex" ? "0000" : "000"}
                      value={card.cvv}
                      onFocus={() => setFlipped(true)}
                      onBlur={() => setFlipped(false)}
                      onChange={(e) => setC("cvv", onlyDigits(e.target.value).slice(0, brand === "amex" ? 4 : 3))}
                      error={errors.cvv}
                    />
                    <Select
                      className="sm:col-span-2"
                      label="Parcelamento"
                      value={String(inst)}
                      onChange={(e) => setC("installments", e.target.value)}
                      options={Array.from({ length: maxInst }, (_, i) => i + 1).map((n) => ({
                        value: String(n),
                        label: n === 1 ? `À vista · ${money(total)}` : `${n}x de ${money(total / n)} sem juros`,
                      }))}
                    />
                  </div>
                  <div className="order-first xl:order-none">
                    <CardPreview number={card.number} holder={card.holder.toUpperCase()} expiry={card.expiry} brand={brand} flipped={flipped} />
                    <p className="mt-4 text-center text-xs text-taupe">Não armazenamos os dados do seu cartão.</p>
                  </div>
                </div>
              )}

              {/* Tela 36: Boleto */}
              {method === "boleto" && m.id === "boleto" && (
                <div className="border border-t-0 border-ink bg-white p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <Timer className="mt-1 size-5 shrink-0 text-gold" strokeWidth={1.2} />
                    <div className="text-sm leading-relaxed text-graphite">
                      <p>
                        O boleto de <strong className="font-medium text-ink">{money(total)}</strong> vence em{" "}
                        <strong className="font-medium text-ink">3 dias úteis</strong>. Você poderá copiar a linha digitável ou baixar o
                        PDF na próxima tela.
                      </p>
                      <p className="mt-2 text-taupe">
                        A compensação leva até 2 dias úteis após o pagamento. As peças ficam reservadas até o vencimento.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <Notice tone="warning">Pedidos com boleto não pago até o vencimento são cancelados automaticamente.</Notice>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2">
          <Checkbox
            checked={terms}
            onChange={(e) => {
              setTerms(e.target.checked);
              setErrors((er) => ({ ...er, terms: undefined }));
            }}
            label={
              <>
                Li e concordo com os{" "}
                <Link href="/termos-de-uso" className="underline decoration-gold underline-offset-4">
                  Termos de uso
                </Link>
                , a{" "}
                <Link href="/politica-de-troca-e-devolucao" className="underline decoration-gold underline-offset-4">
                  Política de trocas
                </Link>{" "}
                e a{" "}
                <Link href="/politica-de-privacidade" className="underline decoration-gold underline-offset-4">
                  Política de privacidade
                </Link>
                .
              </>
            }
          />
          {errors.terms && <span className="text-xs text-danger">{errors.terms}</span>}
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/checkout/entrega" className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-taupe hover:text-ink">
            <ArrowLeft className="size-4" strokeWidth={1.2} /> Entrega
          </Link>
          <Button type="submit" disabled={sending}>
            <Lock className="size-4" strokeWidth={1.3} />
            {sending ? "Enviando..." : `Finalizar pedido · ${money(method === "pix" ? pixTotal : total)}`}
          </Button>
        </div>
      </form>
    </CheckoutShell>
  );
}
