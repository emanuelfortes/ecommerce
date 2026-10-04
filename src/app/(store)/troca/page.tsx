import Link from "next/link";
import type { Metadata } from "next";
import { aos } from "@/lib/aos";
import { PageHeader } from "@/components/ui/Primitives";
import { PublicReturnRequest } from "@/components/orders/ReturnFlow";

export const metadata: Metadata = {
  title: "Solicitação de troca",
  description: "Solicite a troca de tamanho ou cor das suas peças Karen Michelly, sem precisar de login.",
};

const steps = [["01", "Localize o pedido", "Número do pedido e e-mail usados na compra."], ["02", "Escolha as peças", "Selecione o novo tamanho ou a nova cor."], ["03", "Envie sem custo", "Postagem em agência ou coleta no seu endereço."], ["04", "Receba a nova peça", "Despachamos após a conferência no Atelier."]];
const rules = ["Prazo de 30 dias após o recebimento", "Peças sem uso, com etiqueta e embalagem original", "Primeira troca de cada pedido com frete grátis", "Peças em promoção também podem ser trocadas"];

/** Tela 75: Solicitação de troca (sem login) */
export default function PublicExchangePage() {
  return (
    <>
      <PageHeader eyebrow="Trocas" title="Solicitação de troca" text="Trocou de ideia sobre o tamanho ou a cor? Localize seu pedido e escolha as novas peças. A primeira troca é gratuita." crumbs={[{ label: "Trocas" }]} />
      <section className="container-km grid gap-10 py-14 md:py-20 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <PublicReturnRequest mode="troca" />
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
