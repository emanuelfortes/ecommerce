"use client";

import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CircleCheck, MailCheck, ShieldCheck } from "lucide-react";
import { LoginForm, SignupForm } from "@/components/account/AuthForms";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Feedback";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { PasswordInput, StrengthMeter, passwordScore } from "./PasswordFields";

/** Contagem regressiva para reenvio */
function useCountdown(initial: number) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left]);
  return { left, restart: () => setLeft(initial) };
}

function SuccessBlock({ icon, title, text, children }: { icon: React.ReactNode; title: string; text: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start">
      <span className="grid size-16 place-items-center rounded-full border border-champagne text-ink [&>svg]:size-7">{icon}</span>
      <h2 className="mt-6 text-3xl md:text-4xl">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-taupe">{text}</p>
      {children && <div className="mt-8 flex w-full flex-col gap-3">{children}</div>}
    </div>
  );
}

/** Tela 43 */
export function LoginView() {
  const router = useRouter();
  return (
    <>
      <LoginForm onSuccess={() => router.push("/conta")} onSignup={() => router.push("/cadastro")} />
      <div className="mt-10 border-t border-line pt-8">
        <p className="eyebrow">Sem cadastro?</p>
        <p className="mt-2 text-sm text-taupe">
          Acompanhe uma entrega ou solicite uma troca usando apenas o número do pedido.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/troca" className="link-luxe">
            Solicitar troca
          </Link>
          <Link href="/devolucao" className="link-luxe">
            Solicitar devolução
          </Link>
        </div>
      </div>
    </>
  );
}

/** Tela 44 */
export function SignupView() {
  const router = useRouter();
  return <SignupForm onSuccess={() => router.push("/verificar-email")} onLogin={() => router.push("/login")} />;
}

/** Tela 45 */
export function RecoverPasswordView() {
  const { toast } = useUI();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { left, restart } = useCountdown(0);

  if (sent) {
    return (
      <SuccessBlock
        icon={<MailCheck strokeWidth={1.1} />}
        title="Verifique seu e-mail"
        text={
          <>
            Se houver uma conta associada a <strong className="font-medium text-ink">{email}</strong>, você receberá em instantes um link
            para criar uma nova senha. O link é válido por 30 minutos.
          </>
        }
      >
        <Notice tone="info">Não encontrou? Confira a caixa de spam ou promoções.</Notice>
        <Button
          variant="secondary"
          full
          disabled={left > 0}
          onClick={() => {
            restart();
            toast("E-mail reenviado", { message: email, variant: "info" });
          }}
        >
          {left > 0 ? `Reenviar em ${left}s` : "Reenviar e-mail"}
        </Button>
        <Button href="/redefinir-senha" full>
          Abrir link de redefinição
        </Button>
        <Link href="/login" className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-taupe hover:text-ink">
          <ArrowLeft className="size-3.5" strokeWidth={1.3} /> Voltar ao login
        </Link>
      </SuccessBlock>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(email)) {
          setError("Informe um e-mail válido.");
          return;
        }
        setError("");
        setLoading(true);
        window.setTimeout(() => {
          setLoading(false);
          setSent(true);
          restart();
        }, 700);
      }}
      className="flex flex-col gap-5"
    >
      <Field label="E-mail cadastrado" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} placeholder="voce@email.com" />
      <Button type="submit" full disabled={loading}>
        {loading ? "Enviando..." : "Enviar link de recuperação"}
      </Button>
      <Link href="/login" className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-taupe hover:text-ink">
        <ArrowLeft className="size-3.5" strokeWidth={1.3} /> Voltar ao login
      </Link>
    </form>
  );
}

/** Tela 46 */
export function ResetPasswordView() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <SuccessBlock
        icon={<CircleCheck strokeWidth={1.1} />}
        title="Senha redefinida"
        text="Tudo certo. Por segurança, encerramos as sessões abertas em outros dispositivos. Entre novamente com a nova senha."
      >
        <Button href="/login" full>
          Ir para o login
        </Button>
      </SuccessBlock>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (password.length < 8) errs.password = "A senha precisa ter no mínimo 8 caracteres.";
        else if (passwordScore(password) < 3) errs.password = "Use uma senha mais forte, atendendo ao menos 3 requisitos.";
        if (confirm !== password) errs.confirm = "As senhas não coincidem.";
        setErrors(errs);
        if (!Object.keys(errs).length) setDone(true);
      }}
      className="flex flex-col gap-5"
    >
      <PasswordInput label="Nova senha" value={password} onChange={setPassword} error={errors.password} />
      <StrengthMeter value={password} />
      <PasswordInput label="Confirmar nova senha" value={confirm} onChange={setConfirm} error={errors.confirm} />
      <Button type="submit" full className="mt-2">
        Redefinir senha
      </Button>
      <p className="flex items-center gap-2 text-xs text-taupe">
        <ShieldCheck className="size-4 text-gold" strokeWidth={1.2} /> Nunca pedimos sua senha por e-mail, telefone ou WhatsApp.
      </p>
    </form>
  );
}

/** Tela 47 */
export function VerifyEmailView() {
  const { user } = useStore();
  const { toast } = useUI();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const { left, restart } = useCountdown(60);
  const email = user?.email ?? "seu e-mail";

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const fill = (start: number, value: string) => {
    const chars = value.replace(/\D/g, "").split("");
    if (!chars.length) return;
    setDigits((d) => {
      const next = [...d];
      chars.forEach((c, k) => {
        if (start + k < 6) next[start + k] = c;
      });
      return next;
    });
    const target = Math.min(5, start + chars.length);
    refs.current[target]?.focus();
    setError("");
  };

  if (done) {
    return (
      <SuccessBlock
        icon={<CircleCheck strokeWidth={1.1} />}
        title="E-mail verificado"
        text="Sua conta está ativa. Como boas-vindas, o cupom BEMVINDA10 garante 10% na sua primeira compra."
      >
        <Button href="/conta" full>
          Ir para minha conta
        </Button>
        <Button href="/novidades" variant="secondary" full>
          Explorar novidades
        </Button>
      </SuccessBlock>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (digits.some((d) => !d)) {
          setError("Digite os 6 números do código.");
          return;
        }
        setLoading(true);
        window.setTimeout(() => {
          setLoading(false);
          setDone(true);
          toast("E-mail verificado", { message: "Boas-vindas à Karen Michelly." });
        }, 700);
      }}
      className="flex flex-col gap-6"
    >
      <p className="text-sm text-graphite">
        Enviamos um código de 6 dígitos para <strong className="font-medium text-ink">{email}</strong>.
      </p>
      <fieldset>
        <legend className="field-label">Código de verificação</legend>
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={6}
              aria-label={`Dígito ${i + 1}`}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                if (!v) {
                  setDigits((all) => all.map((x, j) => (j === i ? "" : x)));
                  return;
                }
                fill(i, v.length > 1 && d ? v.replace(d, "") || v : v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[i] && i > 0) {
                  e.preventDefault();
                  setDigits((all) => all.map((x, j) => (j === i - 1 ? "" : x)));
                  refs.current[i - 1]?.focus();
                }
                if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
                if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
              }}
              onPaste={(e) => {
                e.preventDefault();
                fill(i, e.clipboardData.getData("text"));
              }}
              onFocus={(e) => e.target.select()}
              className={clsx(
                "aspect-[4/5] w-full border bg-white text-center font-serif text-3xl text-ink transition-colors focus:border-ink focus:outline-none",
                error ? "border-danger" : d ? "border-champagne" : "border-line"
              )}
            />
          ))}
        </div>
        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </fieldset>
      <Button type="submit" full disabled={loading}>
        {loading ? "Verificando..." : "Verificar e-mail"}
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-taupe">Não recebeu o código?</span>
        <button
          type="button"
          disabled={left > 0}
          onClick={() => {
            restart();
            setDigits(Array(6).fill(""));
            refs.current[0]?.focus();
            toast("Código reenviado", { message: "Confira sua caixa de entrada.", variant: "info" });
          }}
          className="text-[11px] uppercase tracking-[0.2em] text-ink underline decoration-gold underline-offset-4 disabled:text-taupe disabled:no-underline"
        >
          {left > 0 ? `Reenviar em 0:${String(left).padStart(2, "0")}` : "Reenviar código"}
        </button>
      </div>
      <p className="text-xs text-taupe">Para testar, digite qualquer sequência de 6 números.</p>
    </form>
  );
}
