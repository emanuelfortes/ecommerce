"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { BadgeCheck, PenLine, ThumbsUp } from "lucide-react";
import type { Product, Review } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Rating } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { ratingDistribution } from "./pdpData";

const fitLabel = { pequeno: "Veste pequeno", perfeito: "Tamanho ideal", grande: "Veste grande" } as const;

/** Tela 11: Avaliações do produto. */
export function Reviews({ product, reviews }: { product: Product; reviews: Review[] }) {
  const [sort, setSort] = useState<"recentes" | "uteis" | "nota">("recentes");
  const [filter, setFilter] = useState<number | null>(null);
  const [visible, setVisible] = useState(3);
  const [voted, setVoted] = useState<string[]>([]);

  const dist = ratingDistribution(product.rating);
  const fitScore = reviews.length
    ? reviews.reduce((s, r) => s + (r.fit === "pequeno" ? -1 : r.fit === "grande" ? 1 : 0), 0) / reviews.length
    : 0;
  const fitPos = 50 + fitScore * 45;
  const fitText = fitScore < -0.25 ? "Veste um pouco pequeno" : fitScore > 0.25 ? "Veste um pouco grande" : "Veste no tamanho certo";
  const recommend = Math.round(dist[0].pct + dist[1].pct);

  const list = useMemo(() => {
    const l = reviews.filter((r) => filter === null || r.rating === filter);
    if (sort === "recentes") l.sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "uteis") l.sort((a, b) => b.helpful - a.helpful);
    if (sort === "nota") l.sort((a, b) => b.rating - a.rating);
    return l;
  }, [reviews, sort, filter]);

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      {/* Resumo */}
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <div className="flex items-end gap-4">
            <span className="font-serif text-7xl leading-none text-ink">{product.rating.toFixed(1)}</span>
            <div className="pb-2">
              <Rating value={product.rating} size="md" />
              <p className="mt-1 text-xs text-taupe">{product.reviewsCount} avaliações</p>
            </div>
          </div>

          <ul className="mt-8 flex flex-col gap-2.5">
            {dist.map((d) => (
              <li key={d.stars}>
                <button
                  onClick={() => setFilter(filter === d.stars ? null : d.stars)}
                  className={clsx(
                    "grid w-full grid-cols-[3.5rem_1fr_2.5rem] items-center gap-3 text-xs transition-colors",
                    filter === d.stars ? "text-ink" : "text-taupe hover:text-ink"
                  )}
                  aria-pressed={filter === d.stars}
                >
                  <span className="text-left">{d.stars} estrelas</span>
                  <span className="h-1 bg-line">
                    <span className="block h-1 bg-ink" style={{ width: `${d.pct}%` }} />
                  </span>
                  <span className="text-right tabular-nums">{d.pct}%</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="field-label">Caimento</p>
            <div className="relative mt-4 h-px bg-line">
              <span className="absolute -top-[5px] size-[11px] -translate-x-1/2 rotate-45 bg-gold" style={{ left: `${fitPos}%` }} />
            </div>
            <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.16em] text-taupe">
              <span>Pequeno</span>
              <span>Ideal</span>
              <span>Grande</span>
            </div>
            <p className="mt-3 text-sm text-graphite">{fitText}</p>
          </div>

          <p className="mt-8 border-t border-line pt-6 text-sm text-graphite">
            <span className="font-serif text-3xl text-ink">{recommend}%</span> das clientes recomendam esta peça.
          </p>

          <Button href={`/avaliar/produto/${product.slug}`} variant="secondary" className="mt-6" full>
            <PenLine className="size-4" strokeWidth={1.3} /> Escrever avaliação
          </Button>
        </div>
      </div>

      {/* Lista */}
      <div className="lg:col-span-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm text-taupe">
            {filter ? `${list.length} avaliações com ${filter} estrelas` : `Exibindo ${Math.min(visible, list.length)} de ${list.length}`}
            {filter && (
              <button onClick={() => setFilter(null)} className="ml-3 text-xs underline underline-offset-4 hover:text-ink">
                Limpar
              </button>
            )}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-taupe">Ordenar</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border-0 border-b border-ink bg-transparent py-1 pr-6 text-sm text-ink focus:outline-none"
            >
              <option value="recentes">Mais recentes</option>
              <option value="uteis">Mais úteis</option>
              <option value="nota">Maior nota</option>
            </select>
          </label>
        </div>

        {list.length === 0 ? (
          <p className="py-10 text-center text-sm text-taupe">Nenhuma avaliação com essa nota ainda.</p>
        ) : (
          <ul className="divide-y divide-line">
            {list.slice(0, visible).map((r) => {
              const didVote = voted.includes(r.id);
              return (
                <li key={r.id} className="py-8 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Rating value={r.rating} />
                    <span className="text-[11px] uppercase tracking-[0.16em] text-taupe">{formatDate(r.date)}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl text-ink">{r.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-graphite/85">{r.body}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-taupe">
                    <span className="text-graphite">{r.author}</span>
                    {r.verified && (
                      <span className="flex items-center gap-1.5">
                        <BadgeCheck className="size-3.5 text-gold" strokeWidth={1.3} /> Compra verificada
                      </span>
                    )}
                    <span>Tamanho comprado: {r.size}</span>
                    <span>{fitLabel[r.fit]}</span>
                  </div>
                  <button
                    onClick={() => setVoted((v) => (didVote ? v.filter((x) => x !== r.id) : [...v, r.id]))}
                    aria-pressed={didVote}
                    className={clsx(
                      "mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] transition-colors",
                      didVote ? "text-ink" : "text-taupe hover:text-ink"
                    )}
                  >
                    <ThumbsUp className={clsx("size-3.5", didVote && "text-gold")} strokeWidth={1.3} />
                    Útil ({r.helpful + (didVote ? 1 : 0)})
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {visible < list.length && (
          <div className="mt-8 text-center">
            <Button variant="secondary" onClick={() => setVisible((v) => v + 3)}>
              Ver mais avaliações
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
