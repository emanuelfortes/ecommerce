"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Search, X, SearchX } from "lucide-react";
import { Accordion } from "@/components/ui/Interactive";
import { EmptyState } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";

export interface FaqGroup {
  group: string;
  items: { q: string; a: string }[];
}

/** Remove acentos preservando o comprimento do texto (para destacar o trecho encontrado). */
const norm = (s: string) =>
  Array.from(s)
    .map((c) => c.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || c)
    .join("")
    .toLowerCase();

/** Busca + abas por grupo + acordeão (tela 80). */
export function FaqExplorer({ groups }: { groups: FaqGroup[] }) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<string>("Todas");
  const tabs = ["Todas", ...groups.map((g) => g.group)];

  const results = useMemo(() => {
    const t = norm(q.trim());
    return groups
      .filter((g) => tab === "Todas" || g.group === tab)
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => !t || norm(`${it.q} ${it.a}`).includes(t)),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, q, tab]);

  const total = results.reduce((n, g) => n + g.items.length, 0);

  const highlight = (text: string) => {
    const t = q.trim();
    if (!t) return text;
    const i = norm(text).indexOf(norm(t));
    if (i < 0) return text;
    return (
      <>
        {text.slice(0, i)}
        <mark className="bg-champagne/60 text-ink">{text.slice(i, i + t.length)}</mark>
        {text.slice(i + t.length)}
      </>
    );
  };

  return (
    <div>
      <div className="relative mx-auto max-w-2xl">
        <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-taupe" strokeWidth={1.2} />
        <label htmlFor="faq-search" className="sr-only">
          Buscar nas perguntas frequentes
        </label>
        <input
          id="faq-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Busque por troca, PIX, prazo, tamanho..."
          className="h-16 w-full border border-line bg-white pl-14 pr-12 text-[15px] text-graphite placeholder:text-taupe/80 focus:border-ink focus:outline-none"
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="Limpar busca" className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe hover:text-ink">
            <X className="size-4" strokeWidth={1.3} />
          </button>
        )}
      </div>

      <div role="tablist" aria-label="Grupos de perguntas" className="no-scrollbar mt-10 flex justify-start gap-2 overflow-x-auto md:justify-center">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={clsx(
              "shrink-0 border px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors",
              tab === t ? "border-ink bg-ink text-white" : "border-line bg-white text-graphite hover:border-ink"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-taupe" aria-live="polite">
        {total} {total === 1 ? "pergunta encontrada" : "perguntas encontradas"}
      </p>

      <div className="mx-auto mt-10 max-w-3xl">
        {results.length === 0 ? (
          <EmptyState
            compact
            icon={<SearchX />}
            title="Nenhuma resposta encontrada"
            text="Tente outras palavras ou fale diretamente com a nossa equipe."
            actions={
              <>
                <Button variant="secondary" size="sm" onClick={() => { setQ(""); setTab("Todas"); }}>
                  Limpar busca
                </Button>
                <Button size="sm" href="/contato">
                  Falar conosco
                </Button>
              </>
            }
          />
        ) : (
          results.map((g) => (
            <section key={`${g.group}-${q}`} className="mb-12 last:mb-0">
              <h2 className="mb-4 flex items-center gap-3 text-3xl">
                <span className="size-1.5 rotate-45 bg-gold" aria-hidden />
                {g.group}
              </h2>
              <Accordion
                defaultOpen={q ? 0 : null}
                items={g.items.map((it) => ({ title: highlight(it.q), content: highlight(it.a) }))}
              />
            </section>
          ))
        )}
      </div>
    </div>
  );
}
