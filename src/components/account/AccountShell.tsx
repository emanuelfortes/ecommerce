"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Bell, CreditCard, Heart, LayoutGrid, Lock, LogOut, MapPin, Package, Ticket, User } from "lucide-react";
import { formatDate } from "@/lib/format";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { Notice } from "@/components/ui/Feedback";
import { demoUser } from "./meta";

/** Usuária logada ou, na ausência, a cliente de demonstração. */
export function useAccountUser() {
  const { user, hydrated } = useStore();
  const name = (user?.name?.trim() || demoUser.name)
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    ...demoUser,
    name,
    email: user?.email || demoUser.email,
    firstName: name.split(" ")[0],
    isDemo: !user,
    hydrated,
  };
}

export const accountNav = [
  { href: "/conta", label: "Visão geral", icon: LayoutGrid },
  { href: "/conta/pedidos", label: "Pedidos", icon: Package, match: ["/conta/devolucoes"] },
  { href: "/conta/perfil", label: "Meus dados", icon: User },
  { href: "/conta/enderecos", label: "Endereços", icon: MapPin },
  { href: "/conta/pagamentos", label: "Pagamentos", icon: CreditCard },
  { href: "/conta/cupons", label: "Cupons", icon: Ticket },
  { href: "/conta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/conta/notificacoes", label: "Notificações", icon: Bell },
  { href: "/conta/senha", label: "Senha", icon: Lock },
  { href: "/conta/sair", label: "Sair", icon: LogOut },
];

function isActive(pathname: string, item: (typeof accountNav)[number]) {
  if (item.href === "/conta") return pathname === "/conta";
  return [item.href, ...(item.match ?? [])].some((h) => pathname === h || pathname.startsWith(h + "/"));
}

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/conta";
  const me = useAccountUser();
  const { open } = useUI();
  const current = accountNav.find((i) => isActive(pathname, i));

  return (
    <>
      <section className="border-b border-line bg-offwhite">
        <div className="container-km py-10 md:py-14">
          <Breadcrumbs
            items={[
              { label: "Minha conta", href: current && current.href !== "/conta" ? "/conta" : undefined },
              ...(current && current.href !== "/conta" ? [{ label: current.label }] : []),
            ]}
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-5">
              <span className="grid size-16 shrink-0 place-items-center rounded-full border border-champagne bg-ink font-serif text-2xl text-gold md:size-20 md:text-3xl">
                {me.name
                  .split(" ")
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join("")}
              </span>
              <div>
                <span className="eyebrow">Minha conta</span>
                <h1 className="mt-1 text-4xl leading-tight md:text-5xl">Olá, {me.firstName}</h1>
                <p className="mt-1 text-sm text-taupe">Cliente desde {formatDate(me.since, { month: "long", year: "numeric" })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-taupe">
              <span className="h-px w-8 bg-gold" /> Cliente Atelier · Nível Ouro
            </div>
          </div>
        </div>
      </section>

      {/* Abas horizontais (mobile) */}
      <nav aria-label="Menu da conta" className="sticky top-[72px] z-20 md:top-20 border-b border-line bg-offwhite/95 backdrop-blur lg:hidden">
        <ul className="no-scrollbar container-km flex gap-7 overflow-x-auto">
          {accountNav.map((item) => {
            const active = isActive(pathname, item);
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "relative block py-4 text-[11px] uppercase tracking-[0.2em] transition-colors",
                    active ? "text-ink" : "text-taupe hover:text-ink"
                  )}
                >
                  {item.label}
                  <span className={clsx("absolute inset-x-0 bottom-0 h-px bg-gold transition-transform duration-500", active ? "scale-x-100" : "scale-x-0")} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="container-km grid gap-10 py-10 md:py-16 lg:grid-cols-[230px_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <nav aria-label="Menu da conta" className="sticky top-40">
            <ul className="flex flex-col border-l border-line">
              {accountNav.map((item) => {
                const active = isActive(pathname, item);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "-ml-px flex items-center gap-3 border-l py-3 pl-5 text-[12px] uppercase tracking-[0.18em] transition-colors",
                        active ? "border-gold text-ink" : "border-transparent text-taupe hover:text-ink",
                        item.href === "/conta/sair" && "mt-4"
                      )}
                    >
                      <Icon className={clsx("size-4", active && "text-gold")} strokeWidth={1.2} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10 border border-line bg-white p-5">
              <p className="font-serif text-xl text-ink">Precisa de ajuda?</p>
              <p className="mt-1 text-xs leading-relaxed text-taupe">Nossa consultoria responde de segunda a sábado, das 9h às 20h.</p>
              <Link href="/contato" className="link-luxe mt-4">
                Fale conosco
              </Link>
            </div>
          </nav>
        </aside>

        <div className="min-w-0">
          {me.hydrated && me.isDemo && (
            <div className="mb-8">
              <Notice tone="info" title="Você está vendo uma conta de demonstração">
                <button type="button" onClick={() => open({ type: "login" })} className="text-ink underline decoration-gold underline-offset-4">
                  Entre
                </button>{" "}
                ou{" "}
                <Link href="/cadastro" className="text-ink underline decoration-gold underline-offset-4">
                  crie sua conta
                </Link>{" "}
                para acompanhar seus pedidos e salvar seus dados.
              </Notice>
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
