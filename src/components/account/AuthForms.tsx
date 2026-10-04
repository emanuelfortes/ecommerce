"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Field, Checkbox } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";

function PasswordField({ label, name, value, onChange, error, hint }: { label: string; name: string; value: string; onChange: (v: string) => void; error?: string; hint?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Field
        label={label}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        hint={hint}
        autoComplete={name === "password" ? "current-password" : "new-password"}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        className="absolute right-3 top-[34px] grid size-9 place-items-center text-taupe hover:text-ink"
      >
        {show ? <EyeOff className="size-4" strokeWidth={1.3} /> : <Eye className="size-4" strokeWidth={1.3} />}
      </button>
    </div>
  );
}

function SocialLogin() {
  return (
    <>
      <div className="my-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-taupe">
        <span className="h-px flex-1 bg-line" /> ou <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="btn-secondary btn-sm">Google</button>
        <button type="button" className="btn-secondary btn-sm">Apple</button>
      </div>
    </>
  );
}

/** Usado em: tela 43 (Login), 117 (Login Modal) e 26 (Identificação no checkout) */
export function LoginForm({ onSuccess, onSignup, compact }: { onSuccess?: () => void; onSignup?: () => void; compact?: boolean }) {
  const { login } = useStore();
  const { toast } = useUI();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Informe um e-mail válido.";
        if (password.length < 6) errs.password = "A senha deve ter ao menos 6 caracteres.";
        setErrors(errs);
        if (Object.keys(errs).length) return;
        setLoading(true);
        window.setTimeout(() => {
          login({ name: email.split("@")[0].replace(/\W/g, " "), email });
          toast("Bem-vinda de volta", { message: "Login realizado com sucesso." });
          setLoading(false);
          onSuccess?.();
        }, 700);
      }}
      className="flex flex-col gap-5"
    >
      <Field label="E-mail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="voce@email.com" />
      <PasswordField label="Senha" name="password" value={password} onChange={setPassword} error={errors.password} />
      <div className="flex items-center justify-between text-sm">
        <Checkbox label="Lembrar de mim" defaultChecked />
        <Link href="/recuperar-senha" className="text-taupe underline-offset-4 hover:text-ink hover:underline">
          Esqueci a senha
        </Link>
      </div>
      <Button type="submit" full disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
      {!compact && <SocialLogin />}
      {onSignup && (
        <p className="text-center text-sm text-taupe">
          Ainda não tem conta?{" "}
          <button type="button" onClick={onSignup} className="text-ink underline decoration-gold underline-offset-4">
            Criar conta
          </button>
        </p>
      )}
    </form>
  );
}

/** Usado em: tela 44 (Cadastro), 118 (Cadastro Modal) e 27 (Cadastro durante checkout) */
export function SignupForm({ onSuccess, onLogin }: { onSuccess?: () => void; onLogin?: () => void }) {
  const { login } = useStore();
  const { toast } = useUI();
  const [form, setForm] = useState({ name: "", email: "", cpf: "", phone: "", password: "", birth: "" });
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (form.name.trim().length < 3) errs.name = "Informe seu nome completo.";
        if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Informe um e-mail válido.";
        if (form.cpf.replace(/\D/g, "").length !== 11) errs.cpf = "CPF deve ter 11 dígitos.";
        if (form.password.length < 8) errs.password = "Mínimo de 8 caracteres.";
        if (!accept) errs.accept = "É necessário aceitar os termos.";
        setErrors(errs);
        if (Object.keys(errs).length) return;
        login({ name: form.name, email: form.email });
        toast("Conta criada", { message: "Enviamos um link de verificação para o seu e-mail." });
        onSuccess?.();
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      <Field className="sm:col-span-2" label="Nome completo" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
      <Field className="sm:col-span-2" label="E-mail" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
      <Field label="CPF" inputMode="numeric" value={form.cpf} onChange={set("cpf")} error={errors.cpf} placeholder="000.000.000-00" />
      <Field label="Celular" inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="(00) 00000-0000" autoComplete="tel" />
      <Field label="Data de nascimento" type="date" value={form.birth} onChange={set("birth")} />
      <PasswordField label="Senha" name="new-password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} error={errors.password} hint="Mínimo de 8 caracteres" />
      <div className="flex flex-col gap-3 sm:col-span-2">
        <Checkbox
          checked={accept}
          onChange={(e) => setAccept(e.target.checked)}
          label={
            <>
              Li e aceito os <Link href="/termos-de-uso" className="underline decoration-gold underline-offset-4">Termos de uso</Link> e a{" "}
              <Link href="/politica-de-privacidade" className="underline decoration-gold underline-offset-4">Política de privacidade</Link>.
            </>
          }
        />
        {errors.accept && <span className="text-xs text-danger">{errors.accept}</span>}
        <Checkbox defaultChecked label="Quero receber novidades e ofertas exclusivas por e-mail e WhatsApp." />
      </div>
      <Button type="submit" full className="sm:col-span-2">
        Criar minha conta
      </Button>
      {onLogin && (
        <p className="text-center text-sm text-taupe sm:col-span-2">
          Já tem conta?{" "}
          <button type="button" onClick={onLogin} className="text-ink underline decoration-gold underline-offset-4">
            Entrar
          </button>
        </p>
      )}
    </form>
  );
}
