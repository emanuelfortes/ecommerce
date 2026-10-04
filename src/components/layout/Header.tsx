"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Heart, Menu, Search, ShoppingBag, User, MapPin, Globe, ChevronDown } from "lucide-react";
import { Logo } from "@/components/shared/Brand";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { mainNav } from "./navigation";
import { MegaMenu } from "./MegaMenu";

const announcements = [
  "Frete grátis acima de R$ 399",
  "Até 6x sem juros no cartão",
  "5% de desconto no PIX",
  "Primeira troca grátis em 30 dias",
];

function IconBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1.5 -top-1 grid min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-medium leading-4 text-ink">
      {count}
    </span>
  );
}

/** Tela 111: Menu desktop · aciona 112 (mobile), 113 (mega menu), 114 (busca), 115/116 (drawers), 120/121/122 (CEP, idioma, moeda) */
export function Header() {
  const { cartCount, wishlist, cep, user, currency, locale, hydrated } = useStore();
  const { open } = useUI();
  const pathname = usePathname();
  const [mega, setMega] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [msg, setMsg] = useState(0);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setMsg((m) => (m + 1) % announcements.length), 4000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => setMega(null), [pathname]);

  const enter = (slug?: string) => {
    window.clearTimeout(closeTimer.current);
    setMega(slug ?? null);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setMega(null), 150);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Barra de anúncios */}
      <div
        className={clsx(
          "overflow-hidden border-b border-white/5 bg-[#151413] text-center text-[10.5px] uppercase tracking-[0.28em] text-champagne transition-all duration-500",
          scrolled ? "max-h-0 py-0" : "max-h-10 py-2.5"
        )}
      >
        <span key={msg} className="inline-block">
          {announcements[msg]}
        </span>
      </div>

      <div className="bg-ink text-offwhite" onMouseLeave={leave}>
        <div className="container-km grid h-[72px] grid-cols-[1fr_auto_1fr] items-center md:h-20">
          {/* Esquerda */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => open({ type: "menu" })}
              aria-label="Abrir menu"
              className="-ml-2 grid size-10 place-items-center text-white hover:text-gold lg:hidden"
            >
              <Menu className="size-5" strokeWidth={1.2} />
            </button>
            <button
              onClick={() => open({ type: "search" })}
              aria-label="Buscar"
              className="grid size-10 place-items-center text-white hover:text-gold lg:hidden"
            >
              <Search className="size-5" strokeWidth={1.2} />
            </button>
            <button
              onClick={() => open({ type: "cep" })}
              className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-offwhite/80 transition-colors hover:text-gold lg:flex"
            >
              <MapPin className="size-4" strokeWidth={1.2} />
              {hydrated && cep ? (
                <span>
                  Enviar para <span className="text-offwhite">{cep}</span>
                </span>
              ) : (
                "Informe seu CEP"
              )}
            </button>
          </div>

          {/* Logo */}
          <Logo variant="dark" className="justify-self-center" />

          {/* Direita */}
          <div className="flex items-center justify-end gap-0.5 md:gap-1.5">
            <button
              onClick={() => open({ type: "locale" })}
              className="mr-2 hidden items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-offwhite/80 hover:text-gold xl:flex"
              aria-label="Idioma e moeda"
            >
              <Globe className="size-4" strokeWidth={1.2} />
              {locale === "pt-BR" ? "PT" : locale.toUpperCase()} · {currency}
              <ChevronDown className="size-3" strokeWidth={1.2} />
            </button>
            <button
              onClick={() => open({ type: "search" })}
              aria-label="Buscar"
              className="hidden size-10 place-items-center text-white transition-colors hover:text-gold lg:grid"
            >
              <Search className="size-5" strokeWidth={1.2} />
            </button>
            <Link
              href={user ? "/conta" : "/login"}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  open({ type: "login" });
                }
              }}
              aria-label="Minha conta"
              className="hidden size-10 place-items-center text-white transition-colors hover:text-gold sm:grid"
            >
              <User className="size-5" strokeWidth={1.2} />
            </Link>
            <button
              onClick={() => open({ type: "wishlist" })}
              aria-label="Favoritos"
              className="relative grid size-10 place-items-center text-white transition-colors hover:text-gold"
            >
              <span className="relative">
                <Heart className="size-5" strokeWidth={1.2} />
                {hydrated && <IconBadge count={wishlist.length} />}
              </span>
            </button>
            <button
              onClick={() => open({ type: "cart" })}
              aria-label="Sacola"
              className="relative grid size-10 place-items-center text-white transition-colors hover:text-gold"
            >
              <span className="relative">
                <ShoppingBag className="size-5" strokeWidth={1.2} />
                {hydrated && <IconBadge count={cartCount} />}
              </span>
            </button>
          </div>
        </div>

        {/* Navegação principal desktop */}
        <nav aria-label="Principal" className="hidden border-t border-white/10 lg:block">
          <ul className="container-km flex items-center justify-center gap-9">
            {mainNav.map((item) => {
              const active = pathname === item.href || (item.mega && pathname.startsWith(`/categoria/${item.mega}`));
              return (
                <li key={item.href} onMouseEnter={() => enter(item.mega)}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "relative block py-4 text-[11.5px] uppercase tracking-[0.22em] transition-colors hover:text-gold",
                      active ? "text-gold" : "text-offwhite"
                    )}
                  >
                    {item.highlight && <span className="mr-1.5 inline-block size-1 -translate-y-0.5 rotate-45 bg-gold" />}
                    {item.label}
                    <span
                      className={clsx(
                        "absolute inset-x-0 bottom-0 h-px origin-center bg-gold transition-transform duration-500",
                        mega === item.mega && item.mega ? "scale-x-100" : active ? "scale-x-100" : "scale-x-0"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
            <li onMouseEnter={() => enter()}>
              <Link href="/marcas" className="block py-4 text-[11.5px] uppercase tracking-[0.22em] text-offwhite hover:text-gold">
                Marcas
              </Link>
            </li>
            <li onMouseEnter={() => enter()}>
              <Link href="/blog" className="block py-4 text-[11.5px] uppercase tracking-[0.22em] text-offwhite hover:text-gold">
                Journal
              </Link>
            </li>
          </ul>
        </nav>

        <MegaMenu slug={mega} onEnter={() => enter(mega ?? undefined)} onLeave={leave} />
      </div>
    </header>
  );
}
