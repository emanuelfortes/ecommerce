"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { popularSearches } from "@/lib/data";

/** Campo de busca usado nas telas de estado (404). */
export function NotFoundSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const go = (term: string) => {
    const t = term.trim();
    if (t) router.push(`/busca?q=${encodeURIComponent(t)}`);
  };
  return (
    <div className="w-full max-w-xl">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
        className="flex border border-line bg-white focus-within:border-ink"
      >
        <label htmlFor="nf-search" className="sr-only">
          Buscar na loja
        </label>
        <Search className="ml-5 size-5 self-center text-taupe" strokeWidth={1.2} />
        <input
          id="nf-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="O que você procura?"
          className="h-14 flex-1 bg-transparent px-4 text-[15px] text-graphite placeholder:text-taupe/80 focus:outline-none"
        />
        <button type="submit" aria-label="Buscar" className="grid w-14 place-items-center bg-ink text-white transition-colors hover:bg-gold hover:text-ink">
          <ArrowRight className="size-4" strokeWidth={1.3} />
        </button>
      </form>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {popularSearches.slice(0, 5).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => go(t)}
            className="border border-line bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-graphite transition-colors hover:border-ink"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
