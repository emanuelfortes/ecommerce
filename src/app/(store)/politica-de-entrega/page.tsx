import type { Metadata } from "next";
import { LegalLayout, LegalTable, DiamondList } from "@/components/content/LegalLayout";
import { shippingOptions } from "@/lib/data";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Política de Entrega",
  description: "Modalidades de envio, prazos, frete grátis acima de R$ 399 e informações sobre o recebimento do seu pedido.",
};

/** Tela 84: Política de entrega */
export default function ShippingPolicyPage() {
  return (
    <LegalLayout
      title="Política de Entrega"
      intro="Cada pedido é embalado à mão no nosso ateliê e enviado com todo o cuidado que a sua peça merece."
      updated="2026-09-01"
      sections={[
        {
          id: "modalidades",
          title: "Modalidades e prazos",
          content: (
            <>
              <p>
                Os prazos começam a contar a partir da aprovação do pagamento e consideram apenas dias úteis. O valor exato
                é calculado no carrinho a partir do seu CEP.
              </p>
              <LegalTable
                caption="Opções de entrega"
                head={["Modalidade", "Transportadora", "Prazo", "A partir de"]}
                rows={shippingOptions.map((s) => [
                  s.name,
                  s.carrier,
                  s.days,
                  s.price === 0 ? "Grátis" : formatMoney(s.price),
                ])}
              />
            </>
          ),
        },
        {
          id: "prazos-regiao",
          title: "Prazos por região",
          content: (
            <LegalTable
              caption="Prazo estimado por região no envio Econômico"
              head={["Região", "Econômico", "Expresso"]}
              rows={[
                ["Capital de São Paulo", "2 a 4 dias úteis", "1 dia útil"],
                ["Sudeste", "4 a 6 dias úteis", "2 a 3 dias úteis"],
                ["Sul e Centro-Oeste", "5 a 8 dias úteis", "2 a 4 dias úteis"],
                ["Nordeste", "6 a 9 dias úteis", "3 a 5 dias úteis"],
                ["Norte", "8 a 12 dias úteis", "4 a 6 dias úteis"],
              ]}
            />
          ),
        },
        {
          id: "frete-gratis",
          title: "Frete grátis",
          content: (
            <p>
              Pedidos acima de <strong>R$ 399,00</strong> têm frete grátis na modalidade Econômica para todo o Brasil. O
              benefício é calculado sobre o valor dos produtos após a aplicação de descontos e cupons.
            </p>
          ),
        },
        {
          id: "processamento",
          title: "Processamento do pedido",
          content: (
            <DiamondList
              items={[
                "Pagamentos via PIX e cartão são confirmados em poucos minutos.",
                "Pagamentos via boleto podem levar até 3 dias úteis para compensar.",
                "Pedidos aprovados até as 14h são despachados no mesmo dia útil.",
                "Você recebe o código de rastreio por e-mail e WhatsApp assim que o pedido é enviado.",
              ]}
            />
          ),
        },
        {
          id: "recebimento",
          title: "Recebimento",
          content: (
            <>
              <p>
                Qualquer pessoa maior de 18 anos presente no endereço pode receber o pedido mediante apresentação de
                documento. São realizadas até 3 tentativas de entrega.
              </p>
              <p>
                Ao receber, confira se a embalagem está lacrada. Em caso de avaria, recuse a entrega e fale com o nosso
                atendimento.
              </p>
            </>
          ),
        },
        {
          id: "atrasos",
          title: "Atrasos e extravios",
          content: (
            <p>
              Se o seu pedido estiver atrasado, acompanhe o rastreamento na sua conta ou fale conosco. Em caso de extravio
              confirmado pela transportadora, enviamos uma nova peça ou realizamos o reembolso integral, à sua escolha.
            </p>
          ),
        },
        {
          id: "internacional",
          title: "Envios internacionais",
          content: (
            <p>
              No momento realizamos entregas apenas em território nacional. Para pedidos internacionais, fale com a nossa
              equipe pelo e-mail atendimento@karenmichelly.com.br e avaliaremos cada caso.
            </p>
          ),
        },
      ]}
    />
  );
}
