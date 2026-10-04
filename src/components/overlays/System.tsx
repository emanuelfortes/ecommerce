"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { CheckCircle2, XCircle, Info, MapPin, Cookie, AlertCircle, X } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { Modal } from "@/components/ui/Overlay";
import { Button } from "@/components/ui/Button";
import { Field, Toggle } from "@/components/ui/Form";
import { LoginForm, SignupForm } from "@/components/account/AuthForms";
import { shippingOptions } from "@/lib/data";
import type { Currency, Locale } from "@/lib/format";

/** Telas 117 e 118: Login Modal e Cadastro Modal */
export function AuthModals() {
  const { is, close, open } = useUI();
  return (
    <>
      <Modal open={is("login")} onClose={close} size="md">
        <div className="p-8 md:p-10">
          <span className="eyebrow">Minha conta</span>
          <h2 className="mt-2 text-4xl">Bem-vinda de volta</h2>
          <span className="gold-rule mb-8 mt-4" />
          <LoginForm onSuccess={close} onSignup={() => open({ type: "signup" })} />
        </div>
      </Modal>
      <Modal open={is("signup")} onClose={close} size="lg">
        <div className="grid md:grid-cols-[2fr_3fr]">
          <div className="hidden flex-col justify-end bg-ink p-10 text-white md:flex">
            <p className="eyebrow text-champagne/70">Cadastro</p>
            <h2 className="mt-3 text-4xl leading-tight text-white">
              Faça parte do universo <em className="text-champagne">Karen Michelly</em>
            </h2>
            <ul className="mt-6 flex flex-col gap-2 text-sm text-champagne">
              <li>◆ 10% off na primeira compra</li>
              <li>◆ Acesso antecipado a lançamentos</li>
              <li>◆ Acompanhe pedidos e trocas</li>
            </ul>
          </div>
          <div className="p-8 md:p-10">
            <h2 className="mb-6 text-3xl md:hidden">Criar conta</h2>
            <SignupForm onSuccess={close} onLogin={() => open({ type: "login" })} />
          </div>
        </div>
      </Modal>
    </>
  );
}

/** Tela 120: Seletor de localização / CEP */
export function CepModal() {
  const { is, close, toast } = useUI();
  const { cep, setCep, money } = useStore();
  const [value, setValue] = useState(cep);
  const [result, setResult] = useState<boolean>(!!cep);
  const [error, setError] = useState("");

  const isOpen = is("cep");
  useEffect(() => {
    if (isOpen) {
      setValue(cep);
      setResult(!!cep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const mask = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, "$1-$2");

  return (
    <Modal open={isOpen} onClose={close} size="md">
      <div className="p-8 md:p-10">
        <MapPin className="size-7 text-gold" strokeWidth={1} />
        <h2 className="mt-4 text-3xl">Onde você está?</h2>
        <p className="mt-2 text-sm text-taupe">Informe seu CEP para ver prazos e valores de entrega.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (value.replace(/\D/g, "").length !== 8) return setError("CEP inválido. Use 8 dígitos.");
            setError("");
            setCep(value);
            setResult(true);
            toast("Localização atualizada", { message: `Entregas para ${value}` });
          }}
          className="mt-6 flex gap-3"
        >
          <Field className="flex-1" value={value} onChange={(e) => setValue(mask(e.target.value))} placeholder="00000-000" inputMode="numeric" aria-label="CEP" error={error} />
          <Button type="submit" className="h-[50px]">OK</Button>
        </form>
        <a href="https://buscacepinter.correios.com.br" target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-taupe underline underline-offset-4">
          Não sei meu CEP
        </a>
        {result && (
          <div className="mt-6 divide-y divide-line border border-line bg-white">
            {shippingOptions.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="text-ink">{s.name}</p>
                  <p className="text-xs text-taupe">{s.days}</p>
                </div>
                <span>{s.price === 0 ? "Grátis" : money(s.price)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

/** Telas 121 e 122: Seletor de idioma e moeda */
export function LocaleModal() {
  const { is, close, toast } = useUI();
  const { locale, currency, setLocale, setCurrency } = useStore();
  const [l, setL] = useState<Locale>(locale);
  const [c, setC] = useState<Currency>(currency);
  const isOpen = is("locale");
  useEffect(() => {
    if (isOpen) {
      setL(locale);
      setC(currency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const langs: { v: Locale; label: string; flag: string }[] = [
    { v: "pt-BR", label: "Português (Brasil)", flag: "BR" },
    { v: "en", label: "English", flag: "EN" },
    { v: "es", label: "Español", flag: "ES" },
  ];
  const curs: { v: Currency; label: string }[] = [
    { v: "BRL", label: "Real brasileiro (R$)" },
    { v: "USD", label: "Dólar americano (US$)" },
    { v: "EUR", label: "Euro (€)" },
  ];

  return (
    <Modal open={isOpen} onClose={close} size="md">
      <div className="p-8 md:p-10">
        <h2 className="text-3xl">Idioma e moeda</h2>
        <span className="gold-rule mt-3" />
        <p className="field-label mt-8">Idioma</p>
        <div className="grid gap-2">
          {langs.map((x) => (
            <button
              key={x.v}
              onClick={() => setL(x.v)}
              className={clsx("flex items-center gap-3 border px-4 py-3 text-left text-sm", l === x.v ? "border-ink bg-white" : "border-line hover:border-champagne")}
            >
              <span className="grid size-7 place-items-center bg-nude text-[10px] tracking-wider">{x.flag}</span>
              {x.label}
            </button>
          ))}
        </div>
        <p className="field-label mt-8">Moeda</p>
        <div className="grid gap-2">
          {curs.map((x) => (
            <button
              key={x.v}
              onClick={() => setC(x.v)}
              className={clsx("border px-4 py-3 text-left text-sm", c === x.v ? "border-ink bg-white" : "border-line hover:border-champagne")}
            >
              {x.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-taupe">Valores convertidos são aproximados. A cobrança é feita em reais.</p>
        <Button
          full
          className="mt-8"
          onClick={() => {
            setLocale(l);
            setCurrency(c);
            toast("Preferências salvas", { message: `${langs.find((x) => x.v === l)?.label} · ${c}` });
            close();
          }}
        >
          Salvar preferências
        </Button>
      </div>
    </Modal>
  );
}

/** Tela 125: Modal de confirmação */
export function ConfirmModal() {
  const { overlay, close } = useUI();
  const data = overlay?.type === "confirm" ? overlay : null;
  return (
    <Modal open={!!data} onClose={close} size="sm" bare>
      {data && (
        <div className="p-8 text-center">
          <span className={clsx("mx-auto grid size-14 place-items-center rounded-full border", data.tone === "danger" ? "border-danger/40 text-danger" : "border-champagne text-ink")}>
            <AlertCircle className="size-6" strokeWidth={1.1} />
          </span>
          <h2 className="mt-5 text-3xl">{data.title}</h2>
          <p className="mt-2 text-sm text-taupe">{data.message}</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={close}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                data.onConfirm();
                close();
              }}
            >
              {data.confirmLabel ?? "Confirmar"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/** Tela 123: Cookie consent (LGPD) */
export function CookieConsent() {
  const { cookieConsent, setCookieConsent, hydrated } = useStore();
  const [custom, setCustom] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: true, marketing: false });
  if (!hydrated || cookieConsent) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-[55] mx-auto max-w-3xl border border-champagne/50 bg-offwhite p-5 shadow-2xl md:inset-x-6 md:bottom-6 md:p-7">
      <div className="flex gap-4">
        <Cookie className="mt-1 hidden size-6 shrink-0 text-gold sm:block" strokeWidth={1} />
        <div className="flex-1">
          <p className="font-serif text-2xl text-ink">Sua privacidade importa</p>
          <p className="mt-2 text-sm leading-relaxed text-graphite/80">
            Usamos cookies para melhorar sua experiência, personalizar conteúdos e analisar o tráfego, conforme a{" "}
            <Link href="/politica-de-privacidade" className="underline decoration-gold underline-offset-4">Política de Privacidade</Link> e a LGPD.
          </p>
          {custom && (
            <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 text-sm">
              <div className="flex items-center justify-between"><span>Essenciais (sempre ativos)</span><Toggle checked onChange={() => {}} label="Essenciais" /></div>
              <div className="flex items-center justify-between"><span>Desempenho e análise</span><Toggle checked={prefs.analytics} onChange={(v) => setPrefs({ ...prefs, analytics: v })} label="Análise" /></div>
              <div className="flex items-center justify-between"><span>Marketing personalizado</span><Toggle checked={prefs.marketing} onChange={(v) => setPrefs({ ...prefs, marketing: v })} label="Marketing" /></div>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button size="sm" onClick={() => setCookieConsent("all")}>Aceitar todos</Button>
            <Button size="sm" variant="secondary" onClick={() => setCookieConsent("essential")}>
              {custom ? "Salvar escolhas" : "Somente essenciais"}
            </Button>
            {!custom && (
              <button onClick={() => setCustom(true)} className="px-2 text-[11px] uppercase tracking-[0.18em] text-taupe underline underline-offset-4 hover:text-ink">
                Personalizar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Tela 126: Toast de sucesso / erro / informação */
export function Toaster() {
  const { toasts, dismissToast } = useUI();
  return (
    <div aria-live="polite" className="pointer-events-none fixed right-3 top-3 z-[90] flex w-[calc(100%-1.5rem)] max-w-sm flex-col gap-2 md:right-6 md:top-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex items-start gap-3 border-l-2 bg-ink p-4 text-white shadow-2xl"
          style={{ borderColor: t.variant === "error" ? "#A24A3F" : t.variant === "info" ? "#D8C3A5" : "#C6A15B", animation: "km-toast .5s cubic-bezier(.22,1,.36,1)" }}
        >
          {t.variant === "success" && <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.2} />}
          {t.variant === "error" && <XCircle className="mt-0.5 size-5 shrink-0 text-[#e08a7e]" strokeWidth={1.2} />}
          {t.variant === "info" && <Info className="mt-0.5 size-5 shrink-0 text-champagne" strokeWidth={1.2} />}
          <div className="flex-1">
            <p className="text-sm font-medium">{t.title}</p>
            {t.message && <p className="mt-0.5 text-xs text-champagne">{t.message}</p>}
          </div>
          <button onClick={() => dismissToast(t.id)} aria-label="Fechar" className="text-champagne hover:text-white">
            <X className="size-4" strokeWidth={1.2} />
          </button>
        </div>
      ))}
    </div>
  );
}
