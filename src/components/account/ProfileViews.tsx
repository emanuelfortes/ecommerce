"use client";

import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pencil, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Select } from "@/components/ui/Form";
import { SizeSelector } from "@/components/ui/Interactive";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { AccountHeading, Panel } from "./AccountUI";
import { useAccountUser } from "./AccountShell";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-4 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-taupe">{label}</dt>
      <dd className="text-[15px] text-ink sm:text-right">{value}</dd>
    </div>
  );
}

const maskCpf = (cpf: string) => cpf.replace(/^(\d{3})\.\d{3}\.\d{3}/, "$1.***.***");

/** Tela 49: Meus dados */
export function ProfileView() {
  const me = useAccountUser();
  return (
    <>
      <AccountHeading
        eyebrow="Perfil"
        title="Meus dados"
        text="Mantenha suas informações atualizadas para agilizar compras, entregas e atendimentos."
        action={
          <Button href="/conta/perfil/editar" size="sm">
            <Pencil className="size-3.5" strokeWidth={1.3} /> Editar dados
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Informações pessoais">
          <dl>
            <Row label="Nome completo" value={me.name} />
            <Row label="E-mail" value={me.email} />
            <Row label="CPF" value={maskCpf(me.cpf)} />
            <Row label="Celular" value={me.phone} />
            <Row label="Nascimento" value={formatDate(me.birth)} />
            <Row label="Gênero" value={me.gender} />
          </dl>
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel title="Preferências de estilo">
            <dl>
              <Row label="Tamanho de roupa" value={me.size} />
              <Row label="Numeração de calçado" value={me.shoe} />
              <Row label="Interesses" value="Alfaiataria · Cetim · Festa" />
            </dl>
          </Panel>
          <section className="bg-nude p-6 md:p-8">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-graphite">
              <ShieldCheck className="size-4 text-gold" strokeWidth={1.2} /> Privacidade
            </p>
            <p className="mt-3 text-sm leading-relaxed text-graphite">
              Seus dados são protegidos conforme a LGPD. Você pode solicitar uma cópia ou a exclusão a qualquer momento.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/lgpd" className="link-luxe">
                Meus direitos
              </Link>
              <Link href="/conta/senha" className="link-luxe">
                Alterar senha
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

/** Tela 50: Editar dados */
export function ProfileEditForm() {
  const me = useAccountUser();
  const { user, login } = useStore();
  const { toast } = useUI();
  const router = useRouter();
  const [form, setForm] = useState({ name: me.name, email: me.email, phone: me.phone, birth: me.birth, gender: me.gender, shoe: me.shoe });
  const [size, setSize] = useState(me.size);
  const [news, setNews] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Atualiza o formulário quando o usuário for carregado do navegador
  useEffect(() => {
    if (me.hydrated) setForm((f) => ({ ...f, name: me.name, email: me.email }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.hydrated]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: k === "phone" ? maskPhone(e.target.value) : e.target.value });

  return (
    <>
      <AccountHeading eyebrow="Perfil" title="Editar dados" text="As alterações valem para próximas compras e comunicações." />
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const errs: Record<string, string> = {};
          if (form.name.trim().length < 3) errs.name = "Informe seu nome completo.";
          if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Informe um e-mail válido.";
          if (form.phone.replace(/\D/g, "").length < 10) errs.phone = "Informe um celular com DDD.";
          setErrors(errs);
          if (Object.keys(errs).length) return;
          setSaving(true);
          window.setTimeout(() => {
            if (user) login({ name: form.name.trim(), email: form.email.trim() });
            setSaving(false);
            toast("Dados atualizados", { message: "Suas informações foram salvas com sucesso." });
            router.push("/conta/perfil");
          }, 600);
        }}
        className="flex flex-col gap-8"
      >
        <Panel title="Informações pessoais">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field className="sm:col-span-2" label="Nome completo" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
            <Field label="E-mail" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
            <Field label="Celular" inputMode="tel" value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" placeholder="(00) 00000-0000" />
            <Field label="CPF" value={me.cpf} disabled hint="Para alterar o CPF, fale com o atendimento." className="[&_input]:bg-offwhite [&_input]:text-taupe" />
            <Field label="Data de nascimento" type="date" value={form.birth} onChange={set("birth")} />
            <Select
              label="Gênero"
              value={form.gender}
              onChange={set("gender")}
              options={["Feminino", "Masculino", "Não binário", "Prefiro não informar"].map((g) => ({ value: g, label: g }))}
            />
          </div>
        </Panel>
        <Panel title="Preferências de estilo">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="field-label">Tamanho de roupa</p>
              <SizeSelector sizes={["PP", "P", "M", "G", "GG"]} value={size} onChange={setSize} />
            </div>
            <Select
              label="Numeração de calçado"
              value={form.shoe}
              onChange={set("shoe")}
              options={["33", "34", "35", "36", "37", "38", "39", "40"].map((n) => ({ value: n, label: n }))}
            />
          </div>
          <Checkbox
            className="mt-6"
            checked={news}
            onChange={(e) => setNews(e.target.checked)}
            label="Quero receber sugestões de looks com base nas minhas preferências."
          />
        </Panel>
        <div className={clsx("flex flex-wrap gap-3")}>
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
          <Button href="/conta/perfil" variant="secondary">
            Cancelar
          </Button>
        </div>
      </form>
    </>
  );
}
