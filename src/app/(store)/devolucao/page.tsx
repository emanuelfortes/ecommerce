import Link from "next/link";
import type { Metadata } from "next";
import { aos } from "@/lib/aos";
import { PageHeader } from "@/components/ui/Primitives";
import { PublicReturnRequest } from "@/components/orders/ReturnFlow";

export const metadata: Metadata = {
  title: "Solicitação de devolução",
  description: "Solicite a devolução das suas peças Karen Michelly e escolha a forma de reembolso, sem precisar de login.",
};

const steps = [["01", "Localize o pedido", "Número do pedido e e-mail usados na compra."], ["02", "Selecione as peças", "Informe o motivo da devolução."], ["03", "Envie sem custo", "Postagem em agência ou coleta no seu endereço."], ["04", "Receba o reembolso", "Estorno, PIX ou vale-compras com 10% extra."]];
const rules = ["Prazo de 30 dias após o recebimento", "Peças sem uso, com etiqueta e embalagem original", "Frete de retorno por nossa conta", "Reembolso em até 7 dias úteis após a análise"];

/** Tela 76: Solicitação de devolução (sem login) */
export default function PublicReturnPage() {
  return (
    <>
      <PageHeader eyebrow="Devoluções" title="Solicitação de devolução" text="Não ficou como esperava? Devolva em até 30 dias e escolha como prefere receber o reembolso." crumbs={[{ label: "Devoluções" }]} />
      <section className="container-km grid gap-10 py-14 md:py-20 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <PublicReturnRequest mode="devolucao" />
        </div>
        <aside className="flex flex-col gap-6">
          <div {...aos.fadeUp()} className="bg-ink p-6 text-white md:p-8">
            <p className="eyebrow text-champagne/70">Como funciona</p>
            <ol className="mt-6 flex flex-col gap-6">
              {steps.map(([n, title, text]) => (
                <li key={n} className="flex gap-4">
                  <span className="font-serif text-2xl leading-none text-gold">{n}</span>
                  <div>
                    <p className="text-[15px] text-white">{title}</p>
                    <p className="mt-1 text-sm text-champagne/70">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div {...aos.fadeUp(80)} className="border border-line bg-white p-6 md:p-8">
            <p className="eyebrow">Condições</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-graphite">
              {rules.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-gold" /> {r}
                </li>
              ))}
            </ul>
            <Link href="/politica-de-troca-e-devolucao" className="link-luxe mt-6">
              Política completa
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
