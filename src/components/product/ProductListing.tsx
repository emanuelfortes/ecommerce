"use client";

import { useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import { SlidersHorizontal, X, SearchX, LayoutGrid, Rows3 } from "lucide-react";
import type { Product } from "@/lib/types";
import { brands, categories, discountPercent } from "@/lib/data";
import { ProductCard } from "./ProductCard";
import { Drawer } from "@/components/ui/Overlay";
import { EmptyState } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/components/providers/StoreProvider";

export type SortKey = "relevancia" | "novidades" | "mais-vendidos" | "menor-preco" | "maior-preco" | "avaliacao" | "desconto";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "novidades", label: "Novidades" },
  { value: "mais-vendidos", label: "Mais vendidos" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "avaliacao", label: "Melhor avaliados" },
  { value: "desconto", label: "Maior desconto" },
];

interface Filters {
  categories: string[];
  sizes: string[];
  colors: string[];
  brands: string[];
  price: [number, number];
  onlyAvailable: boolean;
  onlySale: boolean;
}

const PRICE_MAX = 2000;
const emptyFilters: Filters = {
  categories: [],
  sizes: [],
  colors: [],
  brands: [],
  price: [0, PRICE_MAX],
  onlyAvailable: false,
  onlySale: false,
};

function sortProducts(list: Product[], key: SortKey) {
  const l = [...list];
  switch (key) {
    case "novidades":
      return l.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "mais-vendidos":
      return l.sort((a, b) => b.sold - a.sold);
    case "menor-preco":
      return l.sort((a, b) => a.price - b.price);
    case "maior-preco":
      return l.sort((a, b) => b.price - a.price);
    case "avaliacao":
      return l.sort((a, b) => b.rating - a.rating);
    case "desconto":
      return l.sort((a, b) => discountPercent(b) - discountPercent(a));
    default:
      return l;
  }
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line py-6 first:pt-0">
      <legend className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-ink">{title}</legend>
      {children}
    </fieldset>
  );
}

/** Tela 7: Filtros de produtos */
function FilterPanel({
  products,
  filters,
  setFilters,
  hideCategory,
}: {
  products: Product[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  hideCategory?: boolean;
}) {
  const { money } = useStore();
  const allSizes = useMemo(() => Array.from(new Set(products.flatMap((p) => p.sizes))), [products]);
  const allColors = useMemo(() => {
    const m = new Map<string, string>();
    products.forEach((p) => p.colors.forEach((c) => m.set(c.name, c.hex)));
    return Array.from(m, ([name, hex]) => ({ name, hex }));
  }, [products]);
  const cats = useMemo(() => categories.filter((c) => products.some((p) => p.category === c.slug)), [products]);
  const brs = useMemo(() => brands.filter((b) => products.some((p) => p.brand === b.slug)), [products]);

  const toggle = (key: "categories" | "sizes" | "colors" | "brands", v: string) =>
    setFilters({
      ...filters,
      [key]: filters[key].includes(v) ? filters[key].filter((x) => x !== v) : [...filters[key], v],
    });

  return (
    <div>
      {!hideCategory && cats.length > 1 && (
        <Group title="Categoria">
          <div className="flex flex-col gap-3">
            {cats.map((c) => (
              <label key={c.slug} className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" className="size-4 accent-ink" checked={filters.categories.includes(c.slug)} onChange={() => toggle("categories", c.slug)} />
                {c.name}
              </label>
            ))}
          </div>
        </Group>
      )}
      <Group title="Tamanho">
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => (
            <button
              key={s}
              onClick={() => toggle("sizes", s)}
              className={clsx(
                "h-9 min-w-9 border px-2 text-xs transition-colors",
                filters.sizes.includes(s) ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Group>
      <Group title="Cor">
        <div className="flex flex-wrap gap-2.5">
          {allColors.map((c) => (
            <button
              key={c.name}
              title={c.name}
              aria-label={c.name}
              onClick={() => toggle("colors", c.name)}
              className={clsx(
                "grid size-8 place-items-center rounded-full border",
                filters.colors.includes(c.name) ? "border-ink" : "border-transparent"
              )}
            >
              <span className="size-6 rounded-full border border-black/10" style={{ background: c.hex }} />
            </button>
          ))}
        </div>
      </Group>
      <Group title="Faixa de preço">
        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          step={50}
          value={filters.price[1]}
          onChange={(e) => setFilters({ ...filters, price: [0, Number(e.target.value)] })}
          className="w-full accent-ink"
        />
        <div className="mt-2 flex justify-between text-xs text-taupe">
          <span>{money(0)}</span>
          <span>até {money(filters.price[1])}</span>
        </div>
      </Group>
      {brs.length > 1 && (
        <Group title="Marca">
          <div className="flex flex-col gap-3">
            {brs.map((b) => (
              <label key={b.slug} className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" className="size-4 accent-ink" checked={filters.brands.includes(b.slug)} onChange={() => toggle("brands", b.slug)} />
                {b.name}
              </label>
            ))}
          </div>
        </Group>
      )}
      <Group title="Disponibilidade">
        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" className="size-4 accent-ink" checked={filters.onlyAvailable} onChange={(e) => setFilters({ ...filters, onlyAvailable: e.target.checked })} />
            Somente disponíveis
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" className="size-4 accent-ink" checked={filters.onlySale} onChange={(e) => setFilters({ ...filters, onlySale: e.target.checked })} />
            Em promoção
          </label>
        </div>
      </Group>
    </div>
  );
}

/**
 * Listagem completa: telas 6 (listagem), 7 (filtros), 8 (ordenação)
 * e os estados 97/98 (sem resultados / categoria sem produtos).
 */
export function ProductListing({
  products,
  defaultSort = "relevancia",
  hideCategoryFilter,
  empty,
}: {
  products: Product[];
  defaultSort?: SortKey;
  hideCategoryFilter?: boolean;
  empty?: ReactNode;
}) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dense, setDense] = useState(false);
  const [visible, setVisible] = useState(12);

  const result = useMemo(() => {
    const f = products.filter(
      (p) =>
        (!filters.categories.length || filters.categories.includes(p.category)) &&
        (!filters.sizes.length || p.sizes.some((s) => filters.sizes.includes(s))) &&
        (!filters.colors.length || p.colors.some((c) => filters.colors.includes(c.name))) &&
        (!filters.brands.length || filters.brands.includes(p.brand)) &&
        p.price <= filters.price[1] &&
        (!filters.onlyAvailable || p.stock === "disponivel") &&
        (!filters.onlySale || !!p.oldPrice)
    );
    return sortProducts(f, sort);
  }, [products, filters, sort]);

  const activeChips = [
    ...filters.categories.map((v) => ({ k: "categories" as const, v, label: categories.find((c) => c.slug === v)?.name ?? v })),
    ...filters.sizes.map((v) => ({ k: "sizes" as const, v, label: `Tam. ${v}` })),
    ...filters.colors.map((v) => ({ k: "colors" as const, v, label: v })),
    ...filters.brands.map((v) => ({ k: "brands" as const, v, label: brands.find((b) => b.slug === v)?.name ?? v })),
  ];

  if (products.length === 0) {
    return <>{empty}</>;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-32">
          <FilterPanel products={products} filters={filters} setFilters={setFilters} hideCategory={hideCategoryFilter} />
        </div>
      </aside>

      <div>
        {/* Barra de ferramentas: contagem, filtros (mobile), ordenação (tela 8) */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] lg:hidden">
              <SlidersHorizontal className="size-4" strokeWidth={1.3} /> Filtrar
            </button>
            <span className="text-sm text-taupe">
              {result.length} {result.length === 1 ? "peça" : "peças"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-taupe sm:inline">Ordenar por</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="border-0 border-b border-ink bg-transparent py-1 pr-6 text-sm text-ink focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="hidden gap-1 md:flex">
              <button onClick={() => setDense(false)} aria-label="Grade ampla" className={clsx("p-1.5", !dense ? "text-ink" : "text-taupe")}>
                <Rows3 className="size-4" strokeWidth={1.3} />
              </button>
              <button onClick={() => setDense(true)} aria-label="Grade compacta" className={clsx("p-1.5", dense ? "text-ink" : "text-taupe")}>
                <LayoutGrid className="size-4" strokeWidth={1.3} />
              </button>
            </div>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {activeChips.map((c) => (
              <button
                key={c.k + c.v}
                onClick={() => setFilters({ ...filters, [c.k]: filters[c.k].filter((x) => x !== c.v) })}
                className="flex items-center gap-1.5 border border-line bg-white px-3 py-1.5 text-xs hover:border-ink"
              >
                {c.label} <X className="size-3" strokeWidth={1.4} />
              </button>
            ))}
            <button onClick={() => setFilters(emptyFilters)} className="ml-2 text-xs text-taupe underline underline-offset-4 hover:text-ink">
              Limpar tudo
            </button>
          </div>
        )}

        {result.length === 0 ? (
          <EmptyState
            compact
            icon={<SearchX />}
            title="Nenhuma peça com esses filtros"
            text="Experimente remover alguns filtros ou ampliar a faixa de preço."
            actions={
              <Button variant="secondary" onClick={() => setFilters(emptyFilters)}>
                Limpar filtros
              </Button>
            }
          />
        ) : (
          <>
            <div className={clsx("grid grid-cols-2 gap-3 md:gap-6", dense ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3")}>
              {result.slice(0, visible).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
            {visible < result.length && (
              <div className="mt-14 flex flex-col items-center gap-4">
                <p className="text-xs text-taupe">
                  Você viu {Math.min(visible, result.length)} de {result.length} peças
                </p>
                <div className="h-px w-48 bg-line">
                  <div className="h-px bg-gold" style={{ width: `${(visible / result.length) * 100}%` }} />
                </div>
                <Button variant="secondary" onClick={() => setVisible((v) => v + 12)}>
                  Carregar mais
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        side="left"
        title="Filtrar"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setFilters(emptyFilters)}>
              Limpar
            </Button>
            <Button className="flex-1" onClick={() => setMobileOpen(false)}>
              Ver {result.length}
            </Button>
          </div>
        }
      >
        <div className="p-6">
          <FilterPanel products={products} filters={filters} setFilters={setFilters} hideCategory={hideCategoryFilter} />
        </div>
      </Drawer>
    </div>
  );
}
