"use client";

import Link from "next/link";
import { ArrowUpRight, MousePointerClick } from "lucide-react";
import { useUI, type Overlay } from "@/components/providers/UIProvider";

type Action =
  | { kind: "link"; href: string; note: string }
  | { kind: "open"; overlay: Exclude<Overlay, null | { type: "confirm" }>; label?: string }
  | { kind: "cookies" }
  | { kind: "confirm" }
  | { kind: "toast" };

const items: { n: number; name: string; action: Action }[] = [
  { n: 111, name: "Menu desktop", action: { kind: "link", href: "/", note: "Cabeçalho fixo em qualquer página da loja" } },
  { n: 112, name: "Menu mobile", action: { kind: "open", overlay: { type: "menu" } } },
  { n: 113, name: "Mega menu", action: { kind: "link", href: "/", note: "Passe o mouse em Vestidos" } },
  { n: 114, name: "Busca aberta", action: { kind: "open", overlay: { type: "search" } } },
  { n: 115, name: "Mini-cart (sacola lateral)", action: { kind: "open", overlay: { type: "cart" } } },
  { n: 116, name: "Wishlist lateral", action: { kind: "open", overlay: { type: "wishlist" } } },
  { n: 117, name: "Modal de login", action: { kind: "open", overlay: { type: "login" } } },
  { n: 118, name: "Modal de cadastro", action: { kind: "open", overlay: { type: "signup" } } },
  { n: 119, name: "Quick view do produto", action: { kind: "open", overlay: { type: "quickview", productId: "p1" } } },
  { n: 120, name: "Seletor de localização / CEP", action: { kind: "open", overlay: { type: "cep" } } },
  { n: 121, name: "Seletor de idioma", action: { kind: "open", overlay: { type: "locale" } } },
  { n: 122, name: "Seletor de moeda", action: { kind: "open", overlay: { type: "locale" } } },
  { n: 123, name: "Cookie consent", action: { kind: "cookies" } },
  { n: 124, name: "Modal de cupom", action: { kind: "open", overlay: { type: "coupon" } } },
  { n: 125, name: "Modal de confirmação", action: { kind: "confirm" } },
  { n: 126, name: "Toast de sucesso / erro", action: { kind: "toast" } },
];

const STORAGE_KEY = "km-store-v1";

/** Reexibe o aviso de cookies limpando a escolha salva e recarregando a página. */
function resetCookieConsent() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const state = raw ? JSON.parse(raw) : {};
    state.cookieConsent = null;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* armazenamento indisponível */
  }
  window.location.reload();
}

const btn =
  "inline-flex items-center gap-2 border border-ink px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-white";

/** Grupo "Componentes de navegação" (111 a 126) do mapa do site, com acionadores. */
export function SiteMapComponents() {
  const { open, confirm, toast } = useUI();

  const render = (a: Action) => {
    switch (a.kind) {
      case "link":
        return (
          <span className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-taupe">{a.note}</span>
            <Link href={a.href} className={btn}>
              Abrir <ArrowUpRight className="size-3.5" strokeWidth={1.3} />
            </Link>
          </span>
        );
      case "open":
        return (
          <button type="button" className={btn} onClick={() => open(a.overlay)}>
            <MousePointerClick className="size-3.5" strokeWidth={1.3} /> Acionar
          </button>
        );
      case "cookies":
        return (
          <button type="button" className={btn} onClick={resetCookieConsent}>
            <MousePointerClick className="size-3.5" strokeWidth={1.3} /> Reexibir aviso
          </button>
        );
      case "confirm":
        return (
          <span className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btn}
              onClick={() =>
                confirm({
                  title: "Remover da sacola?",
                  message: "O Vestido Midi Cetim Aurora será removido da sua sacola.",
                  confirmLabel: "Remover",
                  tone: "danger",
                  onConfirm: () => toast("Item removido", { message: "Demonstração: nada foi alterado.", variant: "info" }),
                })
              }
            >
              <MousePointerClick className="size-3.5" strokeWidth={1.3} /> Acionar
            </button>
          </span>
        );
      case "toast":
        return (
          <span className="flex flex-wrap gap-2">
            <button type="button" className={btn} onClick={() => toast("Adicionado à sacola", { message: "Vestido Midi Cetim Aurora · M · Champagne" })}>
              Sucesso
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => toast("Não foi possível concluir", { message: "Verifique os dados e tente novamente.", variant: "error" })}
            >
              Erro
            </button>
          </span>
        );
    }
  };

  return (
    <ul className="divide-y divide-line border-y border-line bg-white">
      {items.map((it) => (
        <li key={it.n} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <span className="flex items-baseline gap-4">
            <span className="w-10 shrink-0 font-serif text-2xl tabular-nums text-gold">{it.n}</span>
            <span className="text-[15px] text-ink">{it.name}</span>
          </span>
          {render(it.action)}
        </li>
      ))}
    </ul>
  );
}
