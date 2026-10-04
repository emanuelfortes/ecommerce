"use client";

import Link from "next/link";
import clsx from "clsx";
import { GitCompare, Plus, X, ShoppingBag } from "lucide-react";
import { bestsellers, getBrand, getCategory, getProduct, similarProducts } from "@/lib/data";
import type { Product } from "@/lib/types";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { EmptyState } from "@/components/ui/Feedback";
import { Badge, Rating } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { Price } from "@/components/product/Price";
import { Skeleton } from "@/components/ui/Primitives";

const stockText = {
  disponivel: { label: "Disponível", tone: "success" as const },
  esgotado: { label: "Esgotado", tone: "ink" as const },
  indisponivel: { label: "Indisponível", tone: "nude" as const },
};

function Suggestions({ base, exclude }: { base?: Product; exclude: string[] }) {
  const { toggleCompare } = useStore();
  const { toast } = useUI();
  const pool = (base ? [...similarProducts(base, 8), ...bestsellers()] : bestsellers()).filter(
    (p, i, arr) => !exclude.includes(p.id) && arr.findIndex((x) => x.id === p.id) === i
  );
  return (
    <div className="mt-16">
      <p className="eyebrow mb-6">{base ? "Compare com" : "Sugestões para comparar"}</p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pool.slice(0, 4).map((p) => (
          <li key={p.id} className="flex items-center gap-4 border border-line bg-white p-3 transition-colors hover:border-champagne">
            <Link href={`/produto/${p.slug}`} className="w-16 shrink-0">
              <ProductImage product={p} />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/produto/${p.slug}`} className="line-clamp-2 font-serif text-lg leading-tight text-ink hover:text-gold">
                {p.name}
              </Link>
              <button
                onClick={() => {
                  const r = toggleCompare(p.id);
                  if (r === "full") toast("Limite atingido", { message: "Compare até 4 produtos por vez.", variant: "error" });
                  else toast("Adicionado à comparação", { message: p.name, variant: "info" });
                }}
                className="mt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-graphite hover:text-gold"
              >
                <Plus className="size-3.5" strokeWidth={1.4} /> Comparar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Tela 16: Comparar produtos */
export function CompareView() {
  const { compare, hydrated, toggleCompare } = useStore();
  const { open, toast, confirm } = useUI();
  const items = compare.map((id) => getProduct(id)).filter((p): p is Product => !!p);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4]" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <EmptyState
          icon={<GitCompare />}
          title="Nenhuma peça para comparar"
          text="Nas listagens, toque no ícone de comparar dos cards para adicionar até 4 peças e ver tudo lado a lado."
          actions={
            <>
              <Button href="/produtos">Explorar produtos</Button>
              <Button href="/categorias" variant="secondary">
                Categorias
              </Button>
            </>
          }
        />
        <Suggestions exclude={[]} />
      </>
    );
  }

  const remove = (p: Product) => {
    toggleCompare(p.id);
    toast("Removido da comparação", { message: p.name, variant: "info" });
  };

  const minPrice = Math.min(...items.map((p) => p.price));
  const maxRating = Math.max(...items.map((p) => p.rating));
  const cols = items.length < 4 ? [...items, null] : items;

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    {
      label: "Preço",
      render: (p) => (
        <div className="flex flex-col gap-2">
          <Price price={p.price} oldPrice={p.oldPrice} showInstallments />
          {items.length > 1 && p.price === minPrice && <Badge tone="gold" className="self-start">Menor preço</Badge>}
        </div>
      ),
    },
    {
      label: "Avaliação",
      render: (p) => (
        <div className="flex flex-col gap-1">
          <Rating value={p.rating} count={p.reviewsCount} />
          <span className={clsx("text-xs", items.length > 1 && p.rating === maxRating ? "text-ink" : "text-taupe")}>
            {p.rating.toFixed(1)} de 5
          </span>
        </div>
      ),
    },
    { label: "Marca", render: (p) => getBrand(p.brand)?.name },
    { label: "Categoria", render: (p) => getCategory(p.category)?.name },
    {
      label: "Tamanhos",
      render: (p) => (
        <div className="flex flex-wrap gap-1.5">
          {p.sizes.map((s) => (
            <span key={s} className="border border-line px-2 py-1 text-xs">
              {s}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Cores",
      render: (p) => (
        <div className="flex flex-wrap gap-2">
          {p.colors.map((c) => (
            <span key={c.name} className="flex items-center gap-1.5 text-xs">
              <span className="size-3.5 rounded-full border border-black/10" style={{ background: c.hex }} /> {c.name}
            </span>
          ))}
        </div>
      ),
    },
    { label: "Composição", render: (p) => p.composition },
    { label: "Detalhes", render: (p) => p.details.join(" · ") },
    {
      label: "Disponibilidade",
      render: (p) => <Badge tone={stockText[p.stock].tone}>{stockText[p.stock].label}</Badge>,
    },
  ];

  const cell = "border-b border-line p-4 align-top text-sm text-graphite md:p-5";
  const labelCell =
    "sticky left-0 z-10 w-28 min-w-28 border-b border-line bg-offwhite p-4 text-left align-top text-[10px] font-medium uppercase tracking-[0.18em] text-ink md:w-44 md:p-5 md:text-[11px]";

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <p className="text-sm text-taupe">
          {items.length} de 4 peças em comparação
        </p>
        <button
          onClick={() =>
            confirm({
              title: "Limpar comparação?",
              message: "Todas as peças serão removidas da comparação.",
              confirmLabel: "Limpar",
              onConfirm: () => items.forEach((p) => toggleCompare(p.id)),
            })
          }
          className="text-[11px] uppercase tracking-[0.18em] text-taupe underline underline-offset-4 hover:text-ink"
        >
          Limpar comparação
        </button>
      </div>

      <div className="no-scrollbar -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <table className="w-full min-w-[640px] table-fixed border-collapse">
          <caption className="sr-only">Comparação de produtos</caption>
          <thead>
            <tr>
              <th className={clsx(labelCell, "border-b-0")} scope="row">
                <span className="sr-only">Produto</span>
              </th>
              {cols.map((p, i) =>
                p ? (
                  <th key={p.id} scope="col" className="p-3 align-top font-normal md:p-5">
                    <div className="relative">
                      <Link href={`/produto/${p.slug}`} className="block">
                        <ProductImage product={p} />
                      </Link>
                      <button
                        onClick={() => remove(p)}
                        aria-label={`Remover ${p.name} da comparação`}
                        className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 text-ink hover:text-gold"
                      >
                        <X className="size-4" strokeWidth={1.3} />
                      </button>
                    </div>
                    <Link href={`/produto/${p.slug}`} className="mt-4 block text-left font-serif text-xl leading-snug text-ink hover:text-gold">
                      {p.name}
                    </Link>
                  </th>
                ) : (
                  <th key={`add-${i}`} scope="col" className="p-3 align-top font-normal md:p-5">
                    <Link
                      href="/produtos"
                      className="flex aspect-[3/4] flex-col items-center justify-center gap-3 border border-dashed border-champagne bg-white text-center text-taupe transition-colors hover:border-ink hover:text-ink"
                    >
                      <Plus className="size-6" strokeWidth={1.1} />
                      <span className="px-4 text-[11px] uppercase tracking-[0.18em]">Adicionar peça</span>
                    </Link>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row" className={labelCell}>
                  {r.label}
                </th>
                {cols.map((p, i) => (
                  <td key={p?.id ?? `e-${i}`} className={cell}>
                    {p ? r.render(p) : <span className="text-taupe/60">·</span>}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className={clsx(labelCell, "border-b-0")}>
                <span className="sr-only">Comprar</span>
              </th>
              {cols.map((p, i) => (
                <td key={p?.id ?? `b-${i}`} className="p-4 align-top md:p-5">
                  {p &&
                    (p.stock === "disponivel" ? (
                      <Button size="sm" full onClick={() => open({ type: "quickview", productId: p.id })}>
                        <ShoppingBag className="size-3.5" strokeWidth={1.3} /> Adicionar
                      </Button>
                    ) : (
                      <Button size="sm" full variant="secondary" href={`/produto/${p.slug}`}>
                        Ver detalhes
                      </Button>
                    ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {items.length === 1 && (
        <div className="mt-12 border-l-2 border-gold bg-white p-6 md:p-8">
          <p className="font-serif text-2xl text-ink">Adicione mais uma peça para comparar</p>
          <p className="mt-2 text-sm text-taupe">
            A comparação fica mais útil com duas ou mais peças. Escolha uma das sugestões abaixo ou continue navegando.
          </p>
        </div>
      )}
      {items.length < 4 && <Suggestions base={items[0]} exclude={compare} />}
    </>
  );
}
