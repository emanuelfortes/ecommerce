"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Gift, Loader2, MapPin, Plus, Trash2, Truck } from "lucide-react";
import { shippingOptions } from "@/lib/data";
import type { Address } from "@/lib/types";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Primitives";
import { Checkbox, Field, RadioCard, Select, TextArea } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Feedback";
import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { computeTotals, useCheckout } from "@/components/checkout/CheckoutState";
import { lookupCep, maskCep, maskPhone, onlyDigits, ufs } from "@/components/checkout/CheckoutParts";

type Form = Omit<Address, "id" | "isDefault">;

const emptyForm: Form = {
  label: "Casa",
  recipient: "",
  zip: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "SP",
  phone: "",
};

function AddressText({ a }: { a: Address }) {
  return (
    <>
      <p className="text-sm text-graphite">
        {a.street}, {a.number}
        {a.complement ? ` · ${a.complement}` : ""}
      </p>
      <p className="text-sm text-taupe">
        {a.district} · {a.city}/{a.state} · CEP {a.zip}
      </p>
      <p className="mt-1 text-xs text-taupe">
        {a.recipient} · {a.phone}
      </p>
    </>
  );
}

/** Novo endereço com máscara de CEP e preenchimento automático simulado */
function AddressForm({ initialName, onSave, onCancel }: { initialName: string; onSave: (f: Form) => void; onCancel?: () => void }) {
  const [form, setForm] = useState<Form>({ ...emptyForm, recipient: initialName });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [loading, setLoading] = useState(false);
  const [filled, setFilled] = useState(false);
  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onCep = async (raw: string) => {
    const zip = maskCep(raw);
    set("zip", zip);
    setFilled(false);
    if (onlyDigits(zip).length !== 8) return;
    setLoading(true);
    const r = await lookupCep(zip);
    setLoading(false);
    if (!r) {
      setErrors((e) => ({ ...e, zip: "CEP não encontrado. Confira os números ou preencha manualmente." }));
      return;
    }
    setErrors((e) => ({ ...e, zip: undefined }));
    setForm((f) => ({ ...f, ...r }));
    setFilled(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Partial<Record<keyof Form, string>> = {};
    if (onlyDigits(form.zip).length !== 8) errs.zip = "Informe um CEP válido.";
    if (form.recipient.trim().length < 3) errs.recipient = "Informe o nome de quem vai receber.";
    if (!form.street.trim()) errs.street = "Informe a rua.";
    if (!form.number.trim()) errs.number = "Informe o número ou S/N.";
    if (!form.district.trim()) errs.district = "Informe o bairro.";
    if (!form.city.trim()) errs.city = "Informe a cidade.";
    if (onlyDigits(form.phone).length < 10) errs.phone = "Informe um telefone com DDD.";
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    onSave(form);
  };

  return (
    <form noValidate onSubmit={submit} className="border border-line bg-white p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="text-2xl">Novo endereço</h3>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-xs text-taupe underline-offset-4 hover:text-ink hover:underline">
            Cancelar
          </button>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-6">
        <div className="relative sm:col-span-3">
          <Field
            label="CEP"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            value={form.zip}
            onChange={(e) => onCep(e.target.value)}
            error={errors.zip}
            hint={
              filled ? (
                <span className="text-success">Endereço encontrado. Confira e complete os dados.</span>
              ) : (
                <a href="https://buscacepinter.correios.com.br" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-ink">
                  Não sei meu CEP
                </a>
              )
            }
          />
          {loading && <Loader2 className="absolute right-4 top-[42px] size-4 animate-spin text-gold" strokeWidth={1.3} />}
        </div>
        <Select
          className="sm:col-span-3"
          label="Identificação"
          value={form.label}
          onChange={(e) => set("label", e.target.value)}
          options={["Casa", "Trabalho", "Presente", "Outro"].map((v) => ({ value: v, label: v }))}
        />
        <Field className="sm:col-span-4" label="Rua" autoComplete="address-line1" value={form.street} onChange={(e) => set("street", e.target.value)} error={errors.street} />
        <Field className="sm:col-span-2" label="Número" inputMode="numeric" value={form.number} onChange={(e) => set("number", e.target.value)} error={errors.number} />
        <Field className="sm:col-span-3" label="Complemento" placeholder="Apto, bloco, referência" value={form.complement} onChange={(e) => set("complement", e.target.value)} />
        <Field className="sm:col-span-3" label="Bairro" value={form.district} onChange={(e) => set("district", e.target.value)} error={errors.district} />
        <Field className="sm:col-span-4" label="Cidade" autoComplete="address-level2" value={form.city} onChange={(e) => set("city", e.target.value)} error={errors.city} />
        <Select className="sm:col-span-2" label="UF" value={form.state} onChange={(e) => set("state", e.target.value)} options={ufs.map((u) => ({ value: u, label: u }))} />
        <Field className="sm:col-span-3" label="Destinatária" autoComplete="name" value={form.recipient} onChange={(e) => set("recipient", e.target.value)} error={errors.recipient} />
        <Field
          className="sm:col-span-3"
          label="Telefone"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(00) 00000-0000"
          value={form.phone}
          onChange={(e) => set("phone", maskPhone(e.target.value))}
          error={errors.phone}
        />
      </div>
      <Button type="submit" variant="secondary" className="mt-8">
        Salvar e usar este endereço
      </Button>
    </form>
  );
}

/** Telas 28, 29 e 30: endereço, seleção de endereço e frete */
export function DeliveryStep() {
  const router = useRouter();
  const { user, hydrated: storeReady, subtotal, discount, activeCoupon, money } = useStore();
  const { toast } = useUI();
  const { data, hydrated, update, addressList } = useCheckout();
  const list = useMemo(() => addressList(!!user), [addressList, user]);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<{ address?: string; shipping?: string }>({});
  const { freeShipping } = computeTotals(subtotal, discount, activeCoupon, 0);

  // Exige identificação antes da entrega
  useEffect(() => {
    if (storeReady && hydrated && !user && !data.email) router.replace("/checkout/identificacao");
  }, [storeReady, hydrated, user, data.email, router]);

  // Pré-seleciona o endereço principal da cliente logada
  useEffect(() => {
    if (!hydrated || data.addressId) return;
    const def = list.find((a) => a.isDefault) ?? list[0];
    if (def) update({ addressId: def.id });
  }, [hydrated, data.addressId, list, update]);

  const showForm = adding || list.length === 0;

  const continueToPayment = () => {
    const errs: typeof error = {};
    if (!data.addressId || !list.some((a) => a.id === data.addressId)) errs.address = "Selecione ou cadastre um endereço de entrega.";
    if (!data.shippingId) errs.shipping = "Escolha uma forma de entrega.";
    if (data.gift && data.giftMessage.length > 200) errs.shipping = "A mensagem de presente deve ter até 200 caracteres.";
    setError(errs);
    if (Object.keys(errs).length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/checkout/pagamento");
  };

  return (
    <CheckoutShell step={1} title="Entrega" text="Onde e como você prefere receber suas peças. Todos os envios saem do nosso ateliê com embalagem assinada.">
      {/* Endereços */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="flex items-center gap-3 text-2xl md:text-3xl">
            <MapPin className="size-5 text-gold" strokeWidth={1.2} /> Endereço de entrega
          </h2>
          {!showForm && (
            <button type="button" onClick={() => setAdding(true)} className="link-luxe flex items-center gap-2">
              <Plus className="size-3.5" strokeWidth={1.4} /> Novo endereço
            </button>
          )}
        </div>
        {error.address && (
          <div className="mb-4">
            <Notice tone="error">{error.address}</Notice>
          </div>
        )}

        {list.length > 0 && (
          <div className="grid gap-3">
            {list.map((a) => {
              const custom = data.customAddresses.some((c) => c.id === a.id);
              return (
                <RadioCard
                  key={a.id}
                  name="endereco"
                  checked={data.addressId === a.id}
                  onChange={() => {
                    update({ addressId: a.id });
                    setError((e) => ({ ...e, address: undefined }));
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-ink">
                        {a.label}
                        {a.isDefault && <Badge tone="nude">Principal</Badge>}
                      </p>
                      <div className="mt-2">
                        <AddressText a={a} />
                      </div>
                    </div>
                    {custom ? (
                      <button
                        type="button"
                        aria-label="Remover endereço"
                        onClick={(e) => {
                          e.preventDefault();
                          update((d) => ({
                            customAddresses: d.customAddresses.filter((c) => c.id !== a.id),
                            addressId: d.addressId === a.id ? null : d.addressId,
                          }));
                        }}
                        className="grid size-8 shrink-0 place-items-center text-taupe hover:text-danger"
                      >
                        <Trash2 className="size-4" strokeWidth={1.2} />
                      </button>
                    ) : (
                      <Link
                        href={`/conta/enderecos/${a.id}/editar`}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 text-xs text-taupe underline-offset-4 hover:text-ink hover:underline"
                      >
                        Editar
                      </Link>
                    )}
                  </div>
                </RadioCard>
              );
            })}
          </div>
        )}

        {showForm && (
          <div className={clsx(list.length > 0 && "mt-6")}>
            <AddressForm
              initialName={user?.name ?? ""}
              onCancel={list.length > 0 ? () => setAdding(false) : undefined}
              onSave={(f) => {
                const id = `n${Date.now()}`;
                update((d) => ({ customAddresses: [...d.customAddresses, { ...f, id }], addressId: id }));
                setAdding(false);
                setError((e) => ({ ...e, address: undefined }));
                toast("Endereço salvo", { message: `${f.street}, ${f.number}` });
              }}
            />
          </div>
        )}
      </section>

      {/* Frete */}
      <section className="mt-14">
        <h2 className="mb-5 flex items-center gap-3 text-2xl md:text-3xl">
          <Truck className="size-5 text-gold" strokeWidth={1.2} /> Forma de entrega
        </h2>
        {error.shipping && (
          <div className="mb-4">
            <Notice tone="error">{error.shipping}</Notice>
          </div>
        )}
        {freeShipping && (
          <p className="mb-4 flex items-center gap-2 text-xs text-graphite">
            <span className="text-gold">◆</span> Seu pedido tem <strong className="font-medium text-ink">frete grátis</strong> em todas as modalidades.
          </p>
        )}
        <div className="grid gap-3">
          {shippingOptions.map((s) => {
            const free = s.price === 0 || freeShipping;
            return (
              <RadioCard
                key={s.id}
                name="frete"
                checked={data.shippingId === s.id}
                onChange={() => {
                  update({ shippingId: s.id });
                  setError((e) => ({ ...e, shipping: undefined }));
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[15px] text-ink">{s.name}</p>
                    <p className="mt-1 text-xs text-taupe">
                      {s.carrier} · {s.days}
                    </p>
                  </div>
                  <div className="text-right">
                    {free ? (
                      <>
                        {s.price > 0 && <p className="text-xs text-taupe line-through">{money(s.price)}</p>}
                        <p className="text-sm uppercase tracking-[0.14em] text-success">Grátis</p>
                      </>
                    ) : (
                      <p className="text-sm text-ink">{money(s.price)}</p>
                    )}
                  </div>
                </div>
              </RadioCard>
            );
          })}
        </div>
      </section>

      {/* Presente */}
      <section className="mt-14 border border-line bg-white p-6 md:p-8">
        <div className="flex items-start gap-4">
          <Gift className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.2} />
          <div className="flex-1">
            <Checkbox
              checked={data.gift}
              onChange={(e) => update({ gift: e.target.checked })}
              label={
                <>
                  <span className="text-[15px] text-ink">É para presente</span>
                  <span className="mt-1 block text-xs text-taupe">
                    Caixa assinada, fita de cetim e nota fiscal sem valores. Sem custo adicional.
                  </span>
                </>
              }
            />
            {data.gift && (
              <div className="mt-5">
                <TextArea
                  label="Mensagem no cartão (opcional)"
                  maxLength={200}
                  value={data.giftMessage}
                  onChange={(e) => update({ giftMessage: e.target.value })}
                  placeholder="Escreva uma mensagem especial"
                />
                <p className="mt-1.5 text-right text-xs text-taupe">{data.giftMessage.length}/200</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/checkout/identificacao" className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-taupe hover:text-ink">
          <ArrowLeft className="size-4" strokeWidth={1.2} /> Identificação
        </Link>
        <Button onClick={continueToPayment}>
          Continuar para pagamento <ArrowRight className="size-4" strokeWidth={1.3} />
        </Button>
      </div>
    </CheckoutShell>
  );
}
