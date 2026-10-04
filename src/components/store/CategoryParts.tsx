import Link from "next/link";
import clsx from "clsx";
import { Hourglass } from "lucide-react";
import type { Category } from "@/lib/types";
import { categories, products } from "@/lib/data";
import { EmptyState } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";

/** Navegação em pílulas das subcategorias de uma categoria. */
export function SubcategoryNav({ category, active }: { category: Category; active?: string }) {
  const pill = (on: boolean) =>
    clsx(
      "shrink-0 border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors",
      on ? "border-ink bg-ink text-white" : "border-line bg-white text-graphite hover:border-ink"
    );
  return (
    <nav aria-label={`Subcategorias de ${category.name}`} className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
      <Link href={`/categoria/${category.slug}`} className={pill(!active)} aria-current={!active ? "page" : undefined}>
        Todos
      </Link>
      {category.subcategories.map((s) => {
        const n = products.filter((p) => p.category === category.slug && p.subcategory === s.slug).length;
        return (
          <Link
            key={s.slug}
            href={`/categoria/${category.slug}/${s.slug}`}
            className={pill(active === s.slug)}
            aria-current={active === s.slug ? "page" : undefined}
          >
            {s.name} <span className={active === s.slug ? "text-champagne" : "text-taupe"}>{n}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Estado 98: categoria sem produtos. */
export function CategoryEmpty({ category, subName }: { category: Category; subName?: string }) {
  const others = categories.filter((c) => c.slug !== category.slug).slice(0, 4);
  return (
    <div>
      <EmptyState
        icon={<Hourglass />}
        title="Em breve por aqui"
        text={`Nosso ateliê está finalizando as novas peças de ${subName ? `${category.name} ${subName}` : category.name}. Enquanto isso, explore outras seleções.`}
        actions={
          <>
            <Button href={`/categoria/${category.slug}`}>Ver {category.name}</Button>
            <Button href="/novidades" variant="secondary">
              Novidades
            </Button>
          </>
        }
      />
      <div className="mx-auto -mt-8 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3 border-t border-line pt-8">
        {others.map((c) => (
          <Link key={c.slug} href={`/categoria/${c.slug}`} className="link-luxe">
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
