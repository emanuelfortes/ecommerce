"use client";

import clsx from "clsx";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field } from "@/components/ui/Form";
import { LoginForm, SignupForm } from "@/components/account/AuthForms";
import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { useCheckout } from "@/components/checkout/CheckoutState";

type Tab = "login" | "cadastro" | "convidada";

const tabs: { id: Tab; label: string }[] = [
  { id: "login", label: "Já sou cliente" },
  { id: "cadastro", label: "Criar conta" },
  { id: "convidada", label: "Continuar como convidada" },
];

/** Telas 26 e 27: identificação, login e cadastro durante o checkout */
export function IdentificationStep() {
  const router = useRouter();
  const { user, logout } = useStore();
  const { data, update } = useCheckout();
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState(data.guest ? data.email : "");
  const [error, setError] = useState("");

  const goNext = (mail: string, guest: boolean) => {
    update({ email: mail, guest });
    router.push("/checkout/entrega");
  };

  return (
    <CheckoutShell
      step={0}
      title={user ? `Olá, ${user.name.split(" ")[0]}` : "Identificação"}
      text={
        user
          ? "Que bom ter você de volta. Confira seus dados e siga para a entrega."
          : "Entre na sua conta para usar endereços salvos e acompanhar seus pedidos, ou siga como convidada."
      }
    >
      {user ? (
        <div className="border border-line bg-white p-6 md:p-8">
          <div className="flex items-center gap-5">
            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-champagne font-serif text-2xl text-ink">
              {user.name.trim().charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="font-serif text-2xl capitalize text-ink">{user.name}</p>
              <p className="truncate text-sm text-taupe">{user.email}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={() => goNext(user.email, false)}>
              Continuar para entrega <ArrowRight className="size-4" strokeWidth={1.3} />
            </Button>
            <button
              type="button"
              onClick={() => {
                logout();
                update({ email: "", guest: false, addressId: null });
              }}
              className="text-sm text-taupe underline-offset-4 hover:text-ink hover:underline"
            >
              Não é você? Sair
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-line bg-white">
          <div role="tablist" className="no-scrollbar flex overflow-x-auto border-b border-line">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={clsx(
                  "relative flex-1 shrink-0 whitespace-nowrap px-5 py-5 text-[11px] uppercase tracking-[0.2em] transition-colors",
                  tab === t.id ? "text-ink" : "text-taupe hover:text-ink"
                )}
              >
                {t.label}
                <span
                  className={clsx(
                    "absolute inset-x-5 -bottom-px h-px bg-gold transition-transform duration-500",
                    tab === t.id ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="p-6 md:p-10">
            {tab === "login" && (
              <div className="mx-auto max-w-md">
                <h2 className="text-3xl">Bem-vinda de volta</h2>
                <p className="mb-8 mt-2 text-sm text-taupe">Acesse sua conta para uma compra mais rápida.</p>
                <LoginForm compact onSuccess={() => router.push("/checkout/entrega")} onSignup={() => setTab("cadastro")} />
              </div>
            )}

            {tab === "cadastro" && (
              <div>
                <h2 className="text-3xl">Crie sua conta</h2>
                <p className="mb-8 mt-2 text-sm text-taupe">
                  Salve endereços, acompanhe pedidos e receba benefícios exclusivos do Clube KM.
                </p>
                <SignupForm onSuccess={() => router.push("/checkout/entrega")} onLogin={() => setTab("login")} />
              </div>
            )}

            {tab === "convidada" && (
              <form
                noValidate
                className="mx-auto flex max-w-md flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!/\S+@\S+\.\S+/.test(email)) return setError("Informe um e-mail válido para receber a confirmação.");
                  setError("");
                  goNext(email.trim(), true);
                }}
              >
                <div>
                  <h2 className="text-3xl">Compra rápida</h2>
                  <p className="mt-2 text-sm text-taupe">
                    Usaremos seu e-mail apenas para enviar a confirmação e o rastreio do pedido.
                  </p>
                </div>
                <Field
                  label="E-mail"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                />
                <Checkbox defaultChecked label="Quero receber novidades e ofertas exclusivas por e-mail." />
                <Button type="submit" full>
                  Continuar <ArrowRight className="size-4" strokeWidth={1.3} />
                </Button>
                <p className="flex items-start gap-3 text-xs leading-relaxed text-taupe">
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.2} />
                  Você poderá criar uma conta depois da compra para acompanhar este pedido.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3 text-xs text-taupe">
        <UserRound className="size-4 text-gold" strokeWidth={1.2} />
        Seus dados são usados somente para processar o pedido, conforme a nossa política de privacidade.
      </div>
    </CheckoutShell>
  );
}
