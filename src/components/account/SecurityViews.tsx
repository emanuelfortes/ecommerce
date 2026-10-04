"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Monitor, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Primitives";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { AccountHeading, Panel } from "./AccountUI";
import { useAccountUser } from "./AccountShell";
import { PasswordInput, StrengthMeter, passwordScore } from "./PasswordFields";

/** Tela 64: Alterar senha */
export function ChangePasswordForm() {
  const { toast } = useUI();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  return (
    <>
      <AccountHeading eyebrow="Segurança" title="Alterar senha" text="Escolha uma senha forte e exclusiva. Ela protege seus pedidos, endereços e cartões salvos." />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Panel>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const errs: Record<string, string> = {};
              if (form.current.length < 6) errs.current = "Informe sua senha atual.";
              if (form.next.length < 8) errs.next = "A nova senha precisa ter no mínimo 8 caracteres.";
              else if (passwordScore(form.next) < 3) errs.next = "Use uma senha mais forte, atendendo ao menos 3 requisitos.";
              else if (form.next === form.current) errs.next = "A nova senha deve ser diferente da atual.";
              if (form.confirm !== form.next) errs.confirm = "As senhas não coincidem.";
              setErrors(errs);
              if (Object.keys(errs).length) return;
              setSaving(true);
              window.setTimeout(() => {
                setSaving(false);
                setForm({ current: "", next: "", confirm: "" });
                toast("Senha alterada", { message: "Use a nova senha no próximo acesso." });
              }, 700);
            }}
            className="flex flex-col gap-5"
          >
            <PasswordInput label="Senha atual" value={form.current} onChange={(v) => setForm({ ...form, current: v })} error={errors.current} autoComplete="current-password" />
            <Link href="/recuperar-senha" className="-mt-2 self-end text-xs text-taupe underline-offset-4 hover:text-ink hover:underline">
              Esqueci minha senha atual
            </Link>
            <PasswordInput label="Nova senha" value={form.next} onChange={(v) => setForm({ ...form, next: v })} error={errors.next} />
            <StrengthMeter value={form.next} />
            <PasswordInput label="Confirmar nova senha" value={form.confirm} onChange={(v) => setForm({ ...form, confirm: v })} error={errors.confirm} />
            <div className="pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar nova senha"}
              </Button>
            </div>
          </form>
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel title="Sessões ativas">
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-center gap-3">
                <Monitor className="size-4 text-gold" strokeWidth={1.2} />
                <div className="flex-1">
                  <p className="text-ink">Navegador atual</p>
                  <p className="text-xs text-taupe">São Paulo, SP · agora</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Smartphone className="size-4 text-taupe" strokeWidth={1.2} />
                <div className="flex-1">
                  <p className="text-ink">iPhone · App</p>
                  <p className="text-xs text-taupe">São Paulo, SP · há 2 dias</p>
                </div>
              </li>
            </ul>
          </Panel>
          <section className="bg-nude p-6 md:p-8">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-graphite">
              <ShieldCheck className="size-4 text-gold" strokeWidth={1.2} /> Dica de segurança
            </p>
            <p className="mt-3 text-sm leading-relaxed text-graphite">
              A Karen Michelly nunca solicita sua senha por e-mail, telefone ou WhatsApp. Desconfie de mensagens com links fora do nosso site.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

/** Tela 66: Sair */
export function LogoutConfirm() {
  const router = useRouter();
  const { logout } = useStore();
  const { toast } = useUI();
  const me = useAccountUser();
  const [leaving, setLeaving] = useState(false);

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center border border-line bg-white px-6 py-16 text-center md:px-14 md:py-20">
      <span className="grid size-16 place-items-center rounded-full border border-champagne text-ink">
        <LogOut className="size-6" strokeWidth={1.1} />
      </span>
      <span className="gold-rule mt-6" />
      <h2 className="mt-5 text-4xl md:text-5xl">Deseja sair?</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-taupe">
        {me.firstName}, sua sacola e seus favoritos ficam salvos neste dispositivo para quando você voltar.
      </p>
      <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
        <Button
          disabled={leaving}
          onClick={() => {
            setLeaving(true);
            logout();
            toast("Até breve", { message: "Você saiu da sua conta com segurança.", variant: "info" });
            router.push("/");
          }}
        >
          {leaving ? "Saindo..." : "Sim, sair"}
        </Button>
        <Button href="/conta" variant="secondary">
          Continuar na conta
        </Button>
      </div>
      <Ornament className="mt-12" />
    </section>
  );
}
