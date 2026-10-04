"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Field, Select, TextArea, Checkbox } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { useUI } from "@/components/providers/UIProvider";

const requestTypes = [
  { value: "", label: "Selecione o tipo de solicitação" },
  { value: "acesso", label: "Acesso aos meus dados" },
  { value: "correcao", label: "Correção de dados" },
  { value: "portabilidade", label: "Portabilidade" },
  { value: "exclusao", label: "Exclusão dos meus dados" },
  { value: "revogacao", label: "Revogação de consentimento" },
  { value: "informacao", label: "Informação sobre compartilhamento" },
];

/** Formulário de solicitação do titular de dados (tela 86). */
export function LgpdRequestForm() {
  const { toast } = useUI();
  const [form, setForm] = useState({ name: "", email: "", cpf: "", type: "", details: "", confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 3) errs.name = "Informe o seu nome completo.";
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Informe um e-mail válido.";
    if (form.cpf.replace(/\D/g, "").length !== 11) errs.cpf = "Informe um CPF com 11 dígitos.";
    if (!form.type) errs.type = "Escolha o tipo de solicitação.";
    if (!form.confirm) errs.confirm = "Confirme que você é a titular dos dados.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast("Verifique o formulário", { message: "Alguns campos precisam de atenção.", variant: "error" });
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      const p = `LGPD-${Math.floor(100000 + Math.random() * 900000)}`;
      setProtocol(p);
      setSending(false);
      toast("Solicitação registrada", { message: `Protocolo ${p}. Responderemos em até 15 dias.` });
    }, 800);
  };

  if (protocol) {
    return (
      <div className="flex flex-col items-start gap-4 border border-line bg-white p-8">
        <ShieldCheck className="size-8 text-gold" strokeWidth={1.1} />
        <p className="font-serif text-3xl text-ink">Solicitação recebida</p>
        <p className="text-sm leading-relaxed text-graphite/80">
          Seu protocolo é <strong className="tracking-widest text-ink">{protocol}</strong>. Enviamos uma confirmação para{" "}
          {form.email}. Para a sua segurança, poderemos solicitar uma validação de identidade antes de concluir o pedido.
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setProtocol(null);
            setForm({ name: "", email: "", cpf: "", type: "", details: "", confirm: false });
          }}
        >
          Nova solicitação
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="grid gap-5 border border-line bg-white p-6 md:grid-cols-2 md:p-8">
      <Field label="Nome completo" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} autoComplete="name" />
      <Field label="E-mail cadastrado" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} autoComplete="email" />
      <Field label="CPF" inputMode="numeric" value={form.cpf} onChange={(e) => set("cpf", e.target.value)} error={errors.cpf} placeholder="000.000.000-00" />
      <div>
        <Select label="Tipo de solicitação" options={requestTypes} value={form.type} onChange={(e) => set("type", e.target.value)} />
        {errors.type && <span className="mt-1.5 block text-xs text-danger">{errors.type}</span>}
      </div>
      <TextArea
        label="Detalhes (opcional)"
        className="md:col-span-2"
        value={form.details}
        onChange={(e) => set("details", e.target.value)}
        placeholder="Conte o que você precisa. Quanto mais detalhes, mais rápido conseguimos atender."
      />
      <div className="md:col-span-2">
        <Checkbox
          label="Declaro que sou a titular dos dados ou sua representante legal."
          checked={form.confirm}
          onChange={(e) => set("confirm", e.target.checked)}
        />
        {errors.confirm && <span className="mt-1.5 block text-xs text-danger">{errors.confirm}</span>}
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={sending}>
          {sending ? "Enviando..." : "Enviar solicitação"}
        </Button>
      </div>
    </form>
  );
}
