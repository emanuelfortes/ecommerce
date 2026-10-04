import type { Metadata } from "next";
import { CreditCard, QrCode, Barcode, Gift } from "lucide-react";
import { LegalLayout, LegalTable, DiamondList } from "@/components/content/LegalLayout";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Política de Pagamento",
  description: "Formas de pagamento aceitas, parcelamento em até 6x sem juros e 5% de desconto no PIX.",
};

const methods = [
  { icon: CreditCard, title: "Cartão de crédito", text: "Até 6x sem juros" },
  { icon: QrCode, title: "PIX", text: "5% de desconto" },
  { icon: Barcode, title: "Boleto", text: "À vista, 3 dias úteis" },
  { icon: Gift, title: "Vale-presente", text: "Combinável com cartão" },
];

const examples = [300, 600, 1200];

/** Tela 85: Política de pagamento */
export default function PaymentPolicyPage() {
  return (
    <LegalLayout
      title="Política de Pagamento"
      intro="Pagamentos seguros, com as formas que você mais usa e condições pensadas para o seu conforto."
      updated="2026-09-01"
      before={
        <div className="mb-12 grid max-w-3xl grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          {methods.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center bg-white p-6 text-center">
              <Icon className="size-6 text-gold" strokeWidth={1.1} />
              <p className="mt-3 text-[12px] uppercase tracking-[0.18em] text-ink">{title}</p>
              <p className="mt-1 text-xs text-taupe">{text}</p>
            </div>
          ))}
        </div>
      }
      sections={[
        {
          id: "formas",
          title: "Formas aceitas",
          content: (
            <>
              <p>Aceitamos as principais bandeiras e meios de pagamento do país:</p>
              <DiamondList
                items={[
                  "Cartões de crédito Visa, Mastercard, Elo, American Express e Hipercard.",
                  "PIX com QR Code ou código copia e cola, com aprovação instantânea.",
                  "Boleto bancário com vencimento em 3 dias úteis.",
                  "Vale-presente e vale-compras Karen Michelly.",
                ]}
              />
            </>
          ),
        },
        {
          id: "parcelamento",
          title: "Parcelamento",
          content: (
            <>
              <p>
                Parcelamos em até <strong>6x sem juros</strong> no cartão de crédito, com parcela mínima de R$ 60,00.
                Veja alguns exemplos:
              </p>
              <LegalTable
                caption="Tabela de parcelamento"
                head={["Parcelas", "Valor mínimo do pedido", ...examples.map((v) => `Ex.: ${formatMoney(v)}`)]}
                rows={[1, 2, 3, 4, 5, 6].map((n) => [
                  `${n}x sem juros`,
                  formatMoney(n * 60),
                  ...examples.map((v) => (v / n >= 60 ? formatMoney(v / n) : "·")),
                ])}
              />
            </>
          ),
        },
        {
          id: "pix",
          title: "Desconto no PIX",
          content: (
            <p>
              Pagamentos via PIX recebem <strong>5% de desconto</strong> sobre o valor dos produtos. O QR Code é válido por
              30 minutos. Após esse período, o pedido é cancelado automaticamente e os itens retornam ao estoque.
            </p>
          ),
        },
        {
          id: "boleto",
          title: "Boleto bancário",
          content: (
            <p>
              O boleto vence em 3 dias úteis e a compensação pode levar até 3 dias úteis após o pagamento. O prazo de
              entrega começa a contar a partir da confirmação.
            </p>
          ),
        },
        {
          id: "seguranca",
          title: "Segurança",
          content: (
            <p>
              Todas as transações são criptografadas com certificado SSL e processadas por parceiros certificados PCI DSS.
              Pedidos podem passar por uma análise antifraude, que leva até 48 horas, para a sua proteção.
            </p>
          ),
        },
        {
          id: "recusa",
          title: "Pagamento recusado",
          content: (
            <ul>
              <li>Confira os dados digitados e o limite disponível no cartão.</li>
              <li>Tente outra forma de pagamento, como o PIX.</li>
              <li>Se o problema persistir, entre em contato com o banco emissor ou com o nosso atendimento.</li>
            </ul>
          ),
        },
        {
          id: "nota-fiscal",
          title: "Nota fiscal",
          content: (
            <p>
              A nota fiscal eletrônica é enviada por e-mail no momento do despacho e também fica disponível nos detalhes do
              pedido, na área Minha Conta.
            </p>
          ),
        },
      ]}
    />
  );
}
