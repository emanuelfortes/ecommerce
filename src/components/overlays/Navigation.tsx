"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowRight, ChevronRight, ChevronLeft, Search, User, Heart, MapPin, Globe, Clock, X } from "lucide-react";
import { categories, popularSearches, products, searchProducts, getBrand } from "@/lib/data";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { Drawer, CloseButton, Backdrop } from "@/components/ui/Overlay";
import { Logo, SocialIcon, socialLinks } from "@/components/shared/Brand";
import { ProductImage } from "@/components/product/ProductImage";
import { mainNav } from "@/components/layout/navigation";

/** Tela 112: Menu mobile */
export function MobileMenu() {
  const { is, close, open } = useUI();
  const { user, cep, currency, locale } = useStore();
  const [panel, setPanel] = useState<string | null>(null);
  const cat = categories.find((c) => c.slug === panel);

  const isOpen = is("menu");
  useEffect(() => {
    if (!isOpen) setPanel(null);
  }, [isOpen]);

  return (
    <Drawer open={isOpen} onClose={close} side="left" dark width="max-w-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <Logo variant="dark" />
        <CloseButton onClick={close} className="text-white" />
      </div>
      <div className="relative overflow-hidden">
        <div className={clsx("transition-transform duration-500", panel ? "-translate-x-full" : "translate-x-0")}>
          <nav className="flex flex-col px-5 py-4">
            {mainNav.map((item) =>
              item.mega ? (
                <button
                  key={item.href}
                  onClick={() => setPanel(item.mega!)}
                  className="flex items-center justify-between border-b border-white/5 py-4 text-left font-serif text-2xl text-offwhite hover:text-gold"
                >
                  {item.label}
                  <ChevronRight className="size-4 text-champagne" strokeWidth={1.2} />
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "border-b border-white/5 py-4 font-serif text-2xl hover:text-gold",
                    item.highlight ? "text-gold" : "text-offwhite"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
            {[
              { label: "Moda Praia", href: "/categoria/praia" },
              { label: "Macacões", href: "/categoria/macacoes" },
              { label: "Marcas", href: "/marcas" },
              { label: "Journal", href: "/blog" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="border-b border-white/5 py-4 font-serif text-2xl text-offwhite hover:text-gold">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4 px-5 py-6 text-sm text-offwhite/80">
            <Link href={user ? "/conta" : "/login"} className="flex items-center gap-3 hover:text-gold">
              <User className="size-4" strokeWidth={1.2} /> {user ? `Olá, ${user.name.split(" ")[0]}` : "Entrar ou cadastrar"}
            </Link>
            <button onClick={() => open({ type: "wishlist" })} className="flex items-center gap-3 hover:text-gold">
              <Heart className="size-4" strokeWidth={1.2} /> Favoritos
            </button>
            <button onClick={() => open({ type: "cep" })} className="flex items-center gap-3 hover:text-gold">
              <MapPin className="size-4" strokeWidth={1.2} /> {cep ? `Enviar para ${cep}` : "Informe seu CEP"}
            </button>
            <button onClick={() => open({ type: "locale" })} className="flex items-center gap-3 hover:text-gold">
              <Globe className="size-4" strokeWidth={1.2} /> {locale} · {currency}
            </button>
          </div>
          <div className="flex gap-2 px-5 pb-8">
            {socialLinks.map((s) => (
              <a key={s.name} href={s.href} aria-label={s.label} className="grid size-10 place-items-center border border-white/15 text-offwhite hover:text-gold">
                <SocialIcon name={s.name} className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className={clsx("absolute inset-0 transition-transform duration-500", panel ? "translate-x-0" : "translate-x-full")}>
          {cat && (
            <div className="px-5 py-4">
              <button onClick={() => setPanel(null)} className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-champagne">
                <ChevronLeft className="size-4" strokeWidth={1.2} /> Voltar
              </button>
              <p className="font-serif text-3xl text-white">{cat.name}</p>
              <span className="gold-rule mt-3" />
              <div className="mt-4 flex flex-col">
                {cat.subcategories.map((s) => (
                  <Link key={s.slug} href={`/categoria/${cat.slug}/${s.slug}`} className="border-b border-white/5 py-4 text-lg text-offwhite hover:text-gold">
                    {s.name}
                  </Link>
                ))}
                <Link href={`/categoria/${cat.slug}`} className="mt-6 flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-gold">
                  Ver tudo em {cat.name} <ArrowRight className="size-4" strokeWidth={1.2} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}

/** Tela 114: Busca aberta (com sugestões ao vivo) */
export function SearchOverlay() {
  const { is, close } = useUI();
  const { money } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpen = is("search");
  const results = useMemo(() => searchProducts(q).slice(0, 4), [q]);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 200);
      try {
        setRecent(JSON.parse(localStorage.getItem("km-recent-search") || "[]"));
      } catch {
        setRecent([]);
      }
    } else setQ("");
  }, [isOpen]);

  const go = (term: string) => {
    if (!term.trim()) return;
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    try {
      localStorage.setItem("km-recent-search", JSON.stringify(next));
    } catch {}
    close();
    router.push(`/busca?q=${encodeURIComponent(term)}`);
  };

  if (!isOpen) return null;
  return (
    <>
      <Backdrop visible onClick={close} />
      <div className="fixed inset-x-0 top-0 z-[70] max-h-[90vh] overflow-y-auto bg-offwhite shadow-2xl">
        <div className="container-km py-6 md:py-10">
          <div className="flex items-center justify-between">
            <span className="eyebrow">O que você procura?</span>
            <CloseButton onClick={close} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(q);
            }}
            className="mt-4 flex items-center gap-4 border-b border-ink pb-3"
          >
            <Search className="size-6 text-taupe" strokeWidth={1} />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Vestidos, alfaiataria, seda..."
              aria-label="Buscar produtos"
              className="w-full bg-transparent font-serif text-3xl text-ink placeholder:text-taupe/50 focus:outline-none md:text-5xl"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Limpar">
                <X className="size-5 text-taupe" strokeWidth={1.2} />
              </button>
            )}
          </form>

          <div className="mt-8 grid gap-10 md:grid-cols-[1fr_2fr]">
            <div className="flex flex-col gap-8">
              {recent.length > 0 && (
                <div>
                  <p className="eyebrow mb-4">Buscas recentes</p>
                  <ul className="flex flex-col gap-2">
                    {recent.map((r) => (
                      <li key={r}>
                        <button onClick={() => go(r)} className="flex items-center gap-2 text-sm text-graphite hover:text-gold">
                          <Clock className="size-3.5 text-taupe" strokeWidth={1.2} /> {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="eyebrow mb-4">Mais buscados</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((t) => (
                    <button key={t} onClick={() => go(t)} className="border border-line bg-white px-4 py-2 text-sm hover:border-ink">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-4">{q ? `Sugestões para "${q}"` : "Em alta agora"}</p>
              {q && results.length === 0 ? (
                <p className="text-sm text-taupe">Nenhuma sugestão. Pressione Enter para buscar em todo o site.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {(q ? results : products.filter((p) => p.isBestseller).slice(0, 4)).map((p) => (
                    <Link key={p.id} href={`/produto/${p.slug}`} onClick={close} className="group">
                      <ProductImage product={p} className="transition-opacity group-hover:opacity-90" />
                      <p className="mt-2 font-serif text-base leading-snug text-graphite">{p.name}</p>
                      <p className="text-xs text-taupe">{getBrand(p.brand)?.name}</p>
                      <p className="mt-1 text-sm text-ink">{money(p.price)}</p>
                    </Link>
                  ))}
                </div>
              )}
              {q && results.length > 0 && (
                <button onClick={() => go(q)} className="link-luxe mt-6 inline-flex items-center gap-2">
                  Ver todos os resultados <ArrowRight className="size-3.5" strokeWidth={1.3} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
