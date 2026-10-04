"use client";

import Link from "next/link";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { categories, products } from "@/lib/data";
import { ProductImage } from "@/components/product/ProductImage";

/** Tela 113: Mega Menu */
export function MegaMenu({ slug, onEnter, onLeave }: { slug: string | null; onEnter: () => void; onLeave: () => void }) {
  const cat = categories.find((c) => c.slug === slug);
  const featured = cat ? products.filter((p) => p.category === cat.slug).slice(0, 2) : [];

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={clsx(
        "absolute inset-x-0 top-full hidden border-t border-white/10 bg-offwhite text-graphite shadow-[0_30px_60px_-30px_rgba(13,13,13,0.35)] transition-all duration-500 lg:block",
        cat ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
      )}
    >
      {cat && (
        <div className="container-km grid grid-cols-12 gap-10 py-10">
          <div className="col-span-3">
            <p className="eyebrow mb-5">{cat.name}</p>
            <ul className="flex flex-col gap-3">
              {cat.subcategories.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/categoria/${cat.slug}/${s.slug}`}
                    className="font-serif text-xl text-ink transition-colors hover:text-gold"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={`/categoria/${cat.slug}`} className="link-luxe mt-7 inline-flex items-center gap-2">
              Ver tudo <ArrowRight className="size-3.5" strokeWidth={1.3} />
            </Link>
          </div>
          <div className="col-span-3">
            <p className="eyebrow mb-5">Curadoria</p>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link className="hover:text-gold" href="/novidades">Novidades da semana</Link></li>
              <li><Link className="hover:text-gold" href="/mais-vendidos">Mais vendidos</Link></li>
              <li><Link className="hover:text-gold" href="/ofertas">Ofertas especiais</Link></li>
              <li><Link className="hover:text-gold" href="/campanha/aurora">Coleção Aurora</Link></li>
              <li><Link className="hover:text-gold" href="/colecao/alfaiataria">Edit: Alfaiataria</Link></li>
              <li><Link className="hover:text-gold" href="/colecao/festa">Edit: Festa</Link></li>
            </ul>
          </div>
          <div className="col-span-6 grid grid-cols-2 gap-5">
            {featured.length ? (
              featured.map((p) => (
                <Link key={p.id} href={`/produto/${p.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden">
                    <ProductImage product={p} className="!aspect-auto h-full transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="mt-3 font-serif text-lg text-ink">{p.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-taupe">Descobrir</p>
                </Link>
              ))
            ) : (
              <div className="col-span-2 grid place-items-center bg-nude p-10 text-center">
                <p className="font-serif text-2xl">{cat.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
