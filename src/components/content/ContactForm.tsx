"use client";

import Link from "next/link";
import { useState } from "react";
import { Send } from "lucide-react";
import { Field, Select, TextArea, Checkbox } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { useUI } from "@/components/providers/UIProvider";

const subjects = [
  { value: "", label: "Selecione um assunto" },
  { value: "pedido", label: "Dúvidas sobre um pedido" },
  { value: "troca", label: "Trocas e devoluções" },
  { value: "produto", label: "Informações de produto e tamanho" },
  { value: "pagamento", label: "Pagamentos" },
  { value: "estilo", label: "Consultoria de estilo" },
  { value: "imprensa", label: "Imprensa e parcerias" },
  { value: "outro", label: "Outro assunto" },
];

type FormState = { name: string; email: string; phone: string; subject: string; order: string; message: string; accept: boolean };
const empty: FormState = { name: "", email: "", phone: "", subject: "", order: "", message: "", accept: false };

/** Formulário de contato com validação (tela 79). */
export function ContactForm() {
  const { toast } = useUI();
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 3) errs.name = "Informe o seu nome.";
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Informe um e-mail válido.";
    if (form.phone && form.phone.replace(/\D/g, "").length < 10) errs.phone = "Telefone incompleto.";
    if (!form.subject) errs.subject = "Escolha um assunto.";
    if (form.message.trim().length < 10) errs.message = "Conte um pouco mais (mínimo de 10 caracteres).";
    if (!form.accept) errs.accept = "É necessário concordar com a Política de Privacidade.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast("Não foi possível enviar", { message: "Revise os campos destacados.", variant: "error" });
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setForm(empty);
      toast("Mensagem enviada", { message: "Responderemos em até 1 dia útil. Obrigada pelo contato!" });
    }, 900);
  };

  const needsOrder = form.subject === "pedido" || form.subject === "troca" || form.subject === "pagamento";

  return (
    <form noValidate onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Nome" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
      <Field label="E-mail" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
      <Field label="Telefone (opcional)" type="tel" autoComplete="tel" placeholder="(11) 90000-0000" value={form.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} />
      <div>
        <Select label="Assunto" options={subjects} value={form.subject} onChange={(e) => set("subject", e.target.value)} aria-invalid={!!errors.subject} />
        {errors.subject && <span className="mt-1.5 block text-xs text-danger">{errors.subject}</span>}
      </div>
      {needsOrder && (
        <Field
          label="Número do pedido"
          className="sm:col-span-2"
          placeholder="KM-000000"
          value={form.order}
          onChange={(e) => set("order", e.target.value.toUpperCase())}
          hint="Encontre o número no e-mail de confirmação ou em Minha Conta."
        />
      )}
      <div className="sm:col-span-2">
        <TextArea label="Mensagem" rows={6} maxLength={1000}value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Como podemos ajudar?" />
        <div className="mt-1.5 flex justify-between text-xs">
          <span className="text-danger">{errors.message}</span>
          <span className="text-taupe">{form.message.length}/1000</span>
        </div>
      </div>
      <div className="sm:col-span-2">
        <Checkbox
          checked={form.accept}
          onChange={(e) => set("accept", e.target.checked)}
          label={
            <>
              Li e concordo com a{" "}
              <Link href="/politica-de-privacidade" className="underline decoration-gold underline-offset-4">
                Política de Privacidade
              </Link>
              .
            </>
          }
        />
        {errors.accept && <span className="mt-1.5 block text-xs text-danger">{errors.accept}</span>}
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={sending}>
          {sending ? "Enviando..." : "Enviar mensagem"} <Send className="size-4" strokeWidth={1.3} />
        </Button>
      </div>
    </form>
  );
}
