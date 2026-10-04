import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalTable, DiamondList } from "@/components/content/LegalLayout";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Saiba como a Karen Michelly coleta, utiliza, armazena e protege os seus dados pessoais.",
};

/** Tela 81: Política de privacidade */
export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      intro="A sua confiança é o nosso bem mais precioso. Aqui explicamos, com transparência, como tratamos os seus dados pessoais."
      updated="2026-09-15"
      sections={[
        {
          id: "quem-somos",
          title: "Quem somos",
          content: (
            <>
              <p>
                A Karen Michelly Woman Wear Ltda. é a controladora dos dados pessoais tratados neste site, no aplicativo e
                nas nossas lojas físicas. Esta política se aplica a todas as clientes, visitantes e assinantes da nossa
                lista de novidades.
              </p>
              <p>
                Ao utilizar os nossos canais, você declara estar ciente das práticas descritas a seguir, elaboradas em
                conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
            </>
          ),
        },
        {
          id: "dados-coletados",
          title: "Dados que coletamos",
          content: (
            <>
              <p>Coletamos apenas as informações necessárias para oferecer uma experiência de compra completa:</p>
              <LegalTable
                caption="Categorias de dados coletados"
                head={["Categoria", "Exemplos", "Como obtemos"]}
                rows={[
                  ["Cadastro", "Nome, CPF, e-mail, telefone, data de nascimento", "Informados por você"],
                  ["Entrega", "Endereço, CEP, ponto de referência", "Informados por você"],
                  ["Pagamento", "Bandeira e últimos dígitos do cartão", "Parceiro de pagamentos"],
                  ["Navegação", "Páginas visitadas, dispositivo, IP, cookies", "Automaticamente"],
                  ["Preferências", "Tamanhos, favoritos, histórico de compras", "Uso da loja"],
                ]}
              />
              <p>
                Não armazenamos o número completo do seu cartão de crédito. Essas informações são processadas diretamente
                por parceiros certificados no padrão PCI DSS.
              </p>
            </>
          ),
        },
        {
          id: "finalidades",
          title: "Para que usamos os seus dados",
          content: (
            <DiamondList
              items={[
                "Processar pedidos, pagamentos, entregas, trocas e devoluções.",
                "Prestar atendimento pelos canais de WhatsApp, e-mail e telefone.",
                "Enviar comunicações sobre lançamentos e ofertas, quando autorizado.",
                "Personalizar recomendações de peças e tamanhos.",
                "Prevenir fraudes e garantir a segurança das transações.",
                "Cumprir obrigações legais, fiscais e regulatórias.",
              ]}
            />
          ),
        },
        {
          id: "compartilhamento",
          title: "Compartilhamento",
          content: (
            <>
              <p>
                Compartilhamos dados somente com parceiros essenciais à operação, como transportadoras, meios de pagamento,
                plataformas de e-mail e ferramentas de análise, sempre sob contrato com cláusulas de confidencialidade e
                proteção de dados.
              </p>
              <p>Jamais vendemos ou alugamos os seus dados pessoais a terceiros.</p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies",
          content: (
            <>
              <p>
                Utilizamos cookies essenciais, de desempenho e de marketing. Você pode alterar as suas preferências a
                qualquer momento pelo aviso de cookies ou pelas configurações do seu navegador.
              </p>
              <ul>
                <li>Essenciais: mantêm o carrinho, o login e a segurança do site.</li>
                <li>Desempenho: ajudam a entender como o site é utilizado.</li>
                <li>Marketing: permitem anúncios mais relevantes para você.</li>
              </ul>
            </>
          ),
        },
        {
          id: "armazenamento",
          title: "Armazenamento e segurança",
          content: (
            <p>
              Os dados ficam armazenados em servidores com criptografia, controle de acesso e monitoramento contínuo.
              Mantemos as informações pelo tempo necessário às finalidades descritas ou pelo prazo exigido em lei, como
              os 5 anos previstos para documentos fiscais.
            </p>
          ),
        },
        {
          id: "seus-direitos",
          title: "Os seus direitos",
          content: (
            <p>
              Você pode confirmar a existência de tratamento, acessar, corrigir, portar ou solicitar a exclusão dos seus
              dados, além de revogar consentimentos. Conheça todos os detalhes e faça a sua solicitação na página{" "}
              <Link href="/lgpd">LGPD e seus direitos</Link>.
            </p>
          ),
        },
        {
          id: "contato-dpo",
          title: "Encarregada de dados",
          content: (
            <p>
              Nossa Encarregada pelo Tratamento de Dados Pessoais (DPO) é a Dra. Helena Duarte, que pode ser contatada pelo
              e-mail <a href="mailto:privacidade@karenmichelly.com.br">privacidade@karenmichelly.com.br</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
