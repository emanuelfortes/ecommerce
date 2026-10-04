import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, DiamondList } from "@/components/content/LegalLayout";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Condições gerais de uso do site e de compra na loja Karen Michelly Woman Wear.",
};

/** Tela 82: Termos de uso */
export default function TermsPage() {
  return (
    <LegalLayout
      title="Termos de Uso"
      intro="As regras que orientam a sua experiência no nosso site, escritas de forma clara e objetiva."
      updated="2026-09-15"
      sections={[
        {
          id: "aceitacao",
          title: "Aceitação dos termos",
          content: (
            <p>
              Ao acessar e utilizar o site da Karen Michelly Woman Wear, você concorda com estes Termos de Uso e com a nossa{" "}
              <Link href="/politica-de-privacidade">Política de Privacidade</Link>. Caso não concorde com alguma condição,
              pedimos que não utilize os nossos serviços.
            </p>
          ),
        },
        {
          id: "cadastro",
          title: "Cadastro e conta",
          content: (
            <>
              <p>
                Para comprar é necessário ter 18 anos ou mais e criar uma conta com informações verdadeiras e atualizadas.
                Você é responsável por manter a confidencialidade da sua senha.
              </p>
              <DiamondList
                items={[
                  "Cada CPF pode estar vinculado a apenas uma conta.",
                  "Contas com indícios de fraude podem ser suspensas preventivamente.",
                  "Você pode encerrar a sua conta a qualquer momento pela área Minha Conta.",
                ]}
              />
            </>
          ),
        },
        {
          id: "produtos-precos",
          title: "Produtos, preços e estoque",
          content: (
            <>
              <p>
                Buscamos representar cada peça com a máxima fidelidade. Pequenas variações de cor podem ocorrer em razão
                das configurações de cada tela.
              </p>
              <p>
                Preços e condições podem ser alterados sem aviso prévio, sendo garantido o valor exibido no momento da
                finalização do pedido. Os produtos estão sujeitos à disponibilidade de estoque.
              </p>
            </>
          ),
        },
        {
          id: "pedidos",
          title: "Pedidos e confirmação",
          content: (
            <p>
              O pedido é confirmado após a aprovação do pagamento. Podemos cancelar pedidos em caso de erro evidente de
              preço, suspeita de fraude ou indisponibilidade de estoque, com reembolso integral do valor pago.
            </p>
          ),
        },
        {
          id: "cupons",
          title: "Cupons e promoções",
          content: (
            <ul>
              <li>Cupons não são cumulativos, salvo indicação expressa.</li>
              <li>Cada cupom possui validade, valor mínimo e regras próprias.</li>
              <li>Promoções são válidas enquanto durarem os estoques ou pelo período informado.</li>
            </ul>
          ),
        },
        {
          id: "propriedade",
          title: "Propriedade intelectual",
          content: (
            <p>
              Marcas, logotipos, fotografias, ilustrações, textos e modelagens publicados neste site são de propriedade da
              Karen Michelly ou licenciados a ela. É proibida a reprodução sem autorização prévia por escrito.
            </p>
          ),
        },
        {
          id: "responsabilidades",
          title: "Responsabilidades",
          content: (
            <p>
              Empregamos os melhores esforços para manter o site disponível e seguro, mas não nos responsabilizamos por
              falhas causadas por terceiros, conexões de internet ou eventos de força maior.
            </p>
          ),
        },
        {
          id: "foro",
          title: "Legislação e foro",
          content: (
            <p>
              Estes termos são regidos pelas leis brasileiras, em especial pelo Código de Defesa do Consumidor. Fica eleito
              o foro do domicílio da consumidora para dirimir eventuais controvérsias.
            </p>
          ),
        },
      ]}
    />
  );
}
