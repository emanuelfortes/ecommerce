import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalTable, DiamondList } from "@/components/content/LegalLayout";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Política de Troca e Devolução",
  description: "Primeira troca grátis em até 30 dias. Conheça prazos, condições e como solicitar trocas e devoluções.",
};

/** Tela 83: Política de troca e devolução */
export default function ExchangePolicyPage() {
  return (
    <LegalLayout
      title="Trocas e Devoluções"
      crumb="Política de troca e devolução"
      intro="Queremos que cada peça encontre o seu lugar no seu guarda-roupa. Se não for o caso, a troca é simples e a primeira é por nossa conta."
      updated="2026-08-20"
      before={
        <div className="mb-12 grid max-w-3xl gap-px border border-line bg-line sm:grid-cols-3">
          {[
            ["30 dias", "para trocar"],
            ["7 dias", "para desistir"],
            ["1ª troca", "grátis"],
          ].map(([n, l]) => (
            <div key={l} className="bg-white p-6 text-center">
              <p className="font-serif text-4xl text-ink">{n}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-taupe">{l}</p>
            </div>
          ))}
        </div>
      }
      after={
        <div className="mt-12 flex max-w-3xl flex-col items-start justify-between gap-6 bg-nude p-8 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-3xl text-ink">Pronta para solicitar?</p>
            <p className="mt-1 text-sm text-graphite">Leva menos de 2 minutos, direto pela sua conta.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/troca">Solicitar troca</Button>
            <Button href="/devolucao" variant="secondary">
              Devolução
            </Button>
          </div>
        </div>
      }
      sections={[
        {
          id: "prazos",
          title: "Prazos",
          content: (
            <>
              <p>
                Você tem até <strong>30 dias corridos</strong> após o recebimento para solicitar a troca e até{" "}
                <strong>7 dias corridos</strong> para exercer o direito de arrependimento, conforme o artigo 49 do Código de
                Defesa do Consumidor.
              </p>
              <LegalTable
                caption="Prazos de troca e devolução"
                head={["Solicitação", "Prazo", "Custo do envio"]}
                rows={[
                  ["Troca por tamanho ou cor", "Até 30 dias", "Grátis na primeira troca"],
                  ["Troca por outra peça", "Até 30 dias", "Grátis na primeira troca"],
                  ["Desistência da compra", "Até 7 dias", "Grátis"],
                  ["Produto com defeito", "Até 90 dias", "Grátis"],
                ]}
              />
            </>
          ),
        },
        {
          id: "condicoes",
          title: "Condições da peça",
          content: (
            <DiamondList
              items={[
                "Sem sinais de uso, lavagem, perfume ou alterações de ajuste.",
                "Com a etiqueta original fixada e o lacre de segurança intacto.",
                "Na embalagem original, acompanhada da nota fiscal ou do número do pedido.",
                "Peças íntimas e de moda praia só podem ser trocadas com o forro higiênico preservado.",
              ]}
            />
          ),
        },
        {
          id: "como-solicitar",
          title: "Como solicitar",
          content: (
            <ol className="mb-5 list-decimal space-y-2 pl-5 text-graphite/90 marker:text-gold">
              <li>
                Acesse <Link href="/conta/pedidos">Minha Conta &gt; Meus Pedidos</Link> e escolha o pedido.
              </li>
              <li>Selecione as peças, o motivo e se deseja troca, vale-compras ou reembolso.</li>
              <li>Você recebe por e-mail o código de postagem para levar a uma agência dos Correios.</li>
              <li>Acompanhe cada etapa pela sua conta até a conclusão.</li>
            </ol>
          ),
        },
        {
          id: "loja-fisica",
          title: "Troca na loja física",
          content: (
            <p>
              Compras feitas no site podem ser trocadas nas nossas lojas de São Paulo e do Rio de Janeiro, mediante
              apresentação do número do pedido. Aproveite para fazer ajustes gratuitos de barra e cintura com a nossa
              costureira.
            </p>
          ),
        },
        {
          id: "reembolso",
          title: "Reembolso",
          content: (
            <>
              <p>Após a conferência da peça, o reembolso é realizado na mesma forma de pagamento:</p>
              <ul>
                <li>Cartão de crédito: estorno solicitado em até 5 dias úteis, podendo aparecer em até 2 faturas.</li>
                <li>PIX: devolução em até 3 dias úteis na conta de origem.</li>
                <li>Boleto: depósito em conta de mesma titularidade em até 10 dias úteis.</li>
                <li>Vale-compras: liberado em até 24 horas, com 10% de bônus.</li>
              </ul>
            </>
          ),
        },
        {
          id: "defeitos",
          title: "Peças com defeito",
          content: (
            <p>
              Todas as peças passam por inspeção de qualidade. Se ainda assim você identificar algum defeito de fabricação,
              entre em contato em até 90 dias. Faremos a troca por uma peça igual ou o reembolso integral, sem custo.
            </p>
          ),
        },
      ]}
    />
  );
}
