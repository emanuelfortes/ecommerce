import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays, ChevronDown, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/Primitives";
import { formatDate } from "@/lib/format";
import { aos } from "@/lib/aos";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

/**
 * Layout das páginas institucionais e jurídicas (telas 81 a 87):
 * PageHeader + sumário fixo com âncoras à esquerda + artigo `prose-km` + data de atualização.
 */
export function LegalLayout({
  eyebrow = "Institucional",
  title,
  intro,
  updated,
  sections,
  crumb,
  before,
  after,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  updated: string;
  sections: LegalSection[];
  crumb?: string;
  /** Conteúdo exibido antes do artigo (ex.: resumo em destaque). */
  before?: ReactNode;
  /** Conteúdo exibido após o artigo (ex.: formulário, contato). */
  after?: ReactNode;
}) {
  const toc = (
    <ol className="flex flex-col">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="group flex items-baseline gap-3 border-l border-line py-2 pl-4 text-sm text-taupe transition-colors hover:border-gold hover:text-ink"
          >
            <span className="font-serif text-[15px] tabular-nums text-champagne transition-colors group-hover:text-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} text={intro} crumbs={[{ label: "Institucional", href: "/sobre" }, { label: crumb ?? title }]}>
        <p className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-taupe">
          <CalendarDays className="size-3.5 text-gold" strokeWidth={1.3} />
          Última atualização: {formatDate(updated)}
        </p>
      </PageHeader>

      <section className="bg-offwhite py-14 md:py-20">
        <div className="container-km grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Sumário */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <details className="group border border-line bg-white p-5 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
                Nesta página
                <ChevronDown className="size-4 text-taupe transition-transform group-open:rotate-180" strokeWidth={1.2} />
              </summary>
              <div className="mt-4">{toc}</div>
            </details>
            <nav aria-label="Sumário" className="sticky top-32 hidden lg:block">
              <p className="eyebrow mb-5">Nesta página</p>
              {toc}
              <div className="mt-10 border border-line bg-white p-5">
                <p className="font-serif text-xl text-ink">Ficou alguma dúvida?</p>
                <p className="mt-2 text-sm leading-relaxed text-taupe">Nossa equipe responde em até 1 dia útil.</p>
                <Link href="/contato" className="link-luxe mt-4 inline-flex items-center gap-2">
                  <MessageCircle className="size-3.5" strokeWidth={1.3} /> Falar conosco
                </Link>
              </div>
            </nav>
          </aside>

          {/* Artigo */}
          <div className="lg:col-span-8 xl:col-span-8 xl:col-start-5">
            {before}
            <article className="prose-km max-w-3xl text-[15px]">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-36" {...aos.fadeUp()}>
                  <h2 className={i === 0 ? "!mt-0" : undefined}>
                    <span className="mr-3 font-serif text-2xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  {s.content}
                </section>
              ))}
            </article>
            <p className="mt-14 max-w-3xl border-t border-line pt-6 text-xs leading-relaxed text-taupe">
              Este documento foi atualizado em {formatDate(updated)} e pode ser revisado periodicamente. Alterações
              relevantes serão comunicadas por e-mail e nesta página. Karen Michelly Woman Wear Ltda. · CNPJ
              00.000.000/0001-00 · Rua Oscar Freire, 1020, Jardins, São Paulo, SP.
            </p>
            {after}
          </div>
        </div>
      </section>
    </>
  );
}

/** Tabela com estilo da marca para uso dentro dos documentos. */
export function LegalTable({ head, rows, caption }: { head: string[]; rows: ReactNode[][]; caption?: string }) {
  return (
    <div className="mb-8 overflow-x-auto border border-line bg-white">
      <table className="w-full min-w-[520px] text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-line bg-ink text-white">
            {head.map((h) => (
              <th key={h} scope="col" className="px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {r.map((c, j) => (
                <td key={j} className={j === 0 ? "px-5 py-4 text-ink" : "px-5 py-4 text-graphite/85"}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Lista com losangos dourados. */
export function DiamondList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mb-6 list-none space-y-3 pl-0">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-graphite/90">
          <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
