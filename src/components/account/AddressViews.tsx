"use client";

import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building, House, LoaderCircle, MapPin, Pencil, Plus, Trash } from "lucide-react";
import type { Address } from "@/lib/types";
import { addresses as initialAddresses } from "@/lib/data";
import { aos } from "@/lib/aos";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Checkbox, Field, Select } from "@/components/ui/Form";
import { Badge } from "@/components/ui/Primitives";
import { useUI } from "@/components/providers/UIProvider";
import { AccountHeading, Panel } from "./AccountUI";

const labelIcon = (label: string) => (label === "Casa" ? House : label === "Trabalho" ? Building : MapPin);

/** Telas 51 e 104: endereços (estado local da demonstração) */
export function AddressList({ empty }: { empty?: boolean }) {
  const { confirm, toast } = useUI();
  const [list, setList] = useState<Address[]>(empty ? [] : initialAddresses);

  const add = (
    <Button href="/conta/enderecos/novo" size="sm">
      <Plus className="size-4" strokeWidth={1.3} /> Novo endereço
    </Button>
  );

  return (
    <>
      <AccountHeading eyebrow="Entrega" title="Endereços" text="Escolha onde prefere receber suas peças. O endereço padrão é sugerido no checkout." action={list.length ? add : undefined} />
      {list.length === 0 ? (
        <div className="border border-line bg-white px-6">
          <EmptyState
            icon={<MapPin />}
            title="Nenhum endereço cadastrado"
            text="Cadastre um endereço para agilizar suas próximas compras e calcular o frete com precisão."
            actions={
              <>
                {add}
                <Button href="/novidades" variant="secondary" size="sm">
                  Continuar comprando
                </Button>
              </>
            }
          />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {list.map((a, i) => {
            const Icon = labelIcon(a.label);
            return (
              <article
                key={a.id}
                {...aos.fadeUp(i * 80)}
                className={clsx("flex flex-col border bg-white p-6 transition-colors duration-500 md:p-7", a.isDefault ? "border-ink" : "border-line hover:border-champagne")}
              >
                <header className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 text-gold" strokeWidth={1.2} />
                    <p className="font-serif text-2xl text-ink">{a.label}</p>
                  </div>
                  {a.isDefault && <Badge tone="ink">Padrão</Badge>}
                </header>
                <div className="mt-5 flex-1 text-sm leading-relaxed text-graphite">
                  <p className="text-ink">{a.recipient}</p>
                  <p>
                    {a.street}, {a.number}
                    {a.complement ? `, ${a.complement}` : ""}
                  </p>
                  <p>
                    {a.district} · {a.city}, {a.state}
                  </p>
                  <p>CEP {a.zip}</p>
                  <p className="mt-2 text-taupe">{a.phone}</p>
                </div>
                <footer className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5 text-[11px] uppercase tracking-[0.18em]">
                  <Link href={`/conta/enderecos/${a.id}/editar`} className="flex items-center gap-2 text-ink hover:text-gold">
                    <Pencil className="size-3.5" strokeWidth={1.3} /> Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      confirm({
                        title: "Remover endereço?",
                        message: `O endereço "${a.label}" será excluído da sua conta.`,
                        confirmLabel: "Remover",
                        tone: "danger",
                        onConfirm: () => {
                          setList((l) => {
                            const rest = l.filter((x) => x.id !== a.id);
                            if (a.isDefault && rest.length) rest[0] = { ...rest[0], isDefault: true };
                            return rest;
                          });
                          toast("Endereço removido", { message: a.label, variant: "info" });
                        },
                      })
                    }
                    className="flex items-center gap-2 text-taupe hover:text-danger"
                  >
                    <Trash className="size-3.5" strokeWidth={1.3} /> Remover
                  </button>
                  {!a.isDefault && (
                    <button
                      type="button"
                      onClick={() => {
                        setList((l) => l.map((x) => ({ ...x, isDefault: x.id === a.id })));
                        toast("Endereço padrão atualizado", { message: a.label });
                      }}
                      className="ml-auto text-taupe hover:text-ink"
                    >
                      Tornar padrão
                    </button>
                  )}
                </footer>
              </article>
            );
          })}
          <Link
            href="/conta/enderecos/novo"
            className="group flex min-h-56 flex-col items-center justify-center gap-3 border border-dashed border-taupe/50 p-6 text-taupe transition-colors hover:border-ink hover:text-ink"
          >
            <span className="grid size-12 place-items-center rounded-full border border-current">
              <Plus className="size-5" strokeWidth={1.2} />
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em]">Adicionar endereço</span>
          </Link>
        </div>
      )}
    </>
  );
}

const maskCep = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

/** Simulação de consulta de CEP (em produção, use ViaCEP ou similar). */
function lookupCep(cep: string): Pick<Address, "street" | "district" | "city" | "state"> | null {
  const known: Record<string, Pick<Address, "street" | "district" | "city" | "state">> = {
    "01310100": { street: "Avenida Paulista", district: "Bela Vista", city: "São Paulo", state: "SP" },
    "04538133": { street: "Avenida Brigadeiro Faria Lima", district: "Itaim Bibi", city: "São Paulo", state: "SP" },
    "01426001": { street: "Rua Oscar Freire", district: "Jardins", city: "São Paulo", state: "SP" },
    "22440032": { street: "Rua Dias Ferreira", district: "Leblon", city: "Rio de Janeiro", state: "RJ" },
  };
  if (known[cep]) return known[cep];
  if (/^0+$/.test(cep)) return null;
  const first = cep[0];
  if (first === "0" || first === "1") return { street: "Rua Haddock Lobo", district: "Cerqueira César", city: "São Paulo", state: "SP" };
  if (first === "2") return { street: "Rua Visconde de Pirajá", district: "Ipanema", city: "Rio de Janeiro", state: "RJ" };
  if (first === "3") return { street: "Rua da Bahia", district: "Lourdes", city: "Belo Horizonte", state: "MG" };
  if (first === "8") return { street: "Rua Comendador Araújo", district: "Batel", city: "Curitiba", state: "PR" };
  return { street: "Avenida Beira Mar", district: "Meireles", city: "Fortaleza", state: "CE" };
}

const states = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

/** Telas 52 e 53: formulário de endereço (novo e edição) */
export function AddressForm({ address }: { address?: Address }) {
  const router = useRouter();
  const { toast } = useUI();
  const editing = Boolean(address);
  const [form, setForm] = useState({
    label: address?.label ?? "Casa",
    recipient: address?.recipient ?? "",
    phone: address?.phone ?? "",
    zip: address?.zip ?? "",
    street: address?.street ?? "",
    number: address?.number ?? "",
    complement: address?.complement ?? "",
    district: address?.district ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "SP",
  });
  const [isDefault, setIsDefault] = useState(address?.isDefault ?? false);
  const [noNumber, setNoNumber] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  type Key = keyof typeof form;
  const set = (k: Key) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onCep = (value: string) => {
    const zip = maskCep(value);
    setForm((f) => ({ ...f, zip }));
    const digits = zip.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setLoadingCep(true);
    setErrors((e) => ({ ...e, zip: "" }));
    window.setTimeout(() => {
      const found = lookupCep(digits);
      setLoadingCep(false);
      if (!found) {
        setErrors((e) => ({ ...e, zip: "CEP não encontrado. Preencha o endereço manualmente." }));
        return;
      }
      setForm((f) => ({ ...f, ...found }));
    }, 650);
  };

  return (
    <>
      <AccountHeading
        eyebrow="Entrega"
        title={editing ? "Editar endereço" : "Novo endereço"}
        text={editing ? `Atualize os dados do endereço "${address?.label}".` : "Digite o CEP e completaremos o restante para você."}
      />
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const errs: Record<string, string> = {};
          if (form.recipient.trim().length < 3) errs.recipient = "Informe quem vai receber.";
          if (form.phone.replace(/\D/g, "").length < 10) errs.phone = "Informe um telefone com DDD.";
          if (form.zip.replace(/\D/g, "").length !== 8) errs.zip = "Informe um CEP válido.";
          if (!form.street.trim()) errs.street = "Informe a rua.";
          if (!noNumber && !form.number.trim()) errs.number = "Informe o número.";
          if (!form.district.trim()) errs.district = "Informe o bairro.";
          if (!form.city.trim()) errs.city = "Informe a cidade.";
          setErrors(errs);
          if (Object.keys(errs).length) return;
          setSaving(true);
          window.setTimeout(() => {
            toast(editing ? "Endereço atualizado" : "Endereço salvo", { message: `${form.label} · ${form.street}, ${noNumber ? "s/n" : form.number}` });
            router.push("/conta/enderecos");
          }, 600);
        }}
        className="flex flex-col gap-8"
      >
        <Panel title="Identificação">
          <p className="field-label">Tipo de endereço</p>
          <div className="mb-6 flex flex-wrap gap-2">
            {["Casa", "Trabalho", "Outro"].map((l) => {
              const Icon = labelIcon(l);
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, label: l }))}
                  aria-pressed={form.label === l}
                  className={clsx(
                    "flex items-center gap-2 border px-4 py-2.5 text-[12px] uppercase tracking-[0.16em] transition-colors",
                    form.label === l ? "border-ink bg-ink text-white" : "border-line bg-white text-graphite hover:border-ink"
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.2} /> {l}
                </button>
              );
            })}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nome de quem recebe" value={form.recipient} onChange={set("recipient")} error={errors.recipient} autoComplete="name" />
            <Field
              label="Telefone"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: maskPhone(e.target.value) }))}
              error={errors.phone}
              placeholder="(00) 00000-0000"
              autoComplete="tel"
            />
          </div>
        </Panel>

        <Panel title="Endereço">
          <div className="grid gap-5 sm:grid-cols-6">
            <div className="relative sm:col-span-3">
              <Field
                label="CEP"
                inputMode="numeric"
                value={form.zip}
                onChange={(e) => onCep(e.target.value)}
                error={errors.zip}
                placeholder="00000-000"
                autoComplete="postal-code"
                hint={
                  <a href="https://buscacepinter.correios.com.br" target="_blank" rel="noreferrer" className="underline decoration-gold underline-offset-4">
                    Não sei meu CEP
                  </a>
                }
              />
              {loadingCep && <LoaderCircle className="absolute right-4 top-[42px] size-4 animate-spin text-gold" strokeWidth={1.4} />}
            </div>
            <Field className="sm:col-span-6" label="Rua / Avenida" value={form.street} onChange={set("street")} error={errors.street} autoComplete="address-line1" />
            <div className="sm:col-span-2">
              <Field label="Número" value={noNumber ? "" : form.number} onChange={set("number")} error={errors.number} disabled={noNumber} inputMode="numeric" />
              <Checkbox className="mt-2" checked={noNumber} onChange={(e) => setNoNumber(e.target.checked)} label="Sem número" />
            </div>
            <Field className="sm:col-span-4" label="Complemento (opcional)" value={form.complement} onChange={set("complement")} placeholder="Apto, bloco, referência" />
            <Field className="sm:col-span-2" label="Bairro" value={form.district} onChange={set("district")} error={errors.district} />
            <Field className="sm:col-span-3" label="Cidade" value={form.city} onChange={set("city")} error={errors.city} autoComplete="address-level2" />
            <Select className="sm:col-span-1" label="UF" value={form.state} onChange={set("state")} options={states.map((s) => ({ value: s, label: s }))} />
          </div>
          <Checkbox className="mt-6" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} label="Usar como endereço padrão" />
        </Panel>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving || loadingCep}>
            {saving ? "Salvando..." : editing ? "Salvar alterações" : "Salvar endereço"}
          </Button>
          <Button href="/conta/enderecos" variant="secondary">
            Cancelar
          </Button>
        </div>
      </form>
    </>
  );
}
