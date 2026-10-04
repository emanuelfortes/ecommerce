import type { Metadata } from "next";
import { MessageCircle, Mail } from "lucide-react";
import { faqs } from "@/lib/data";
import { aos } from "@/lib/aos";
import { PageHeader } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { FaqExplorer, type FaqGroup } from "@/components/content/FaqExplorer";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: "Tire dúvidas sobre pedidos, pagamentos, entregas, trocas, tamanhos e privacidade na Karen Michelly.",
};

/** Perguntas adicionais que complementam a base de src/lib/data.ts */
const extra: FaqGroup[] = [
  {
    group: "Entrega",
    items: [
      { q: "Qual o prazo de entrega?", a: "Depende da modalidade e da região. O Expresso chega em 2 a 4 dias úteis e o Econômico em 6 a 9 dias úteis. Nas capitais, oferecemos Entrega Premium em até 24h." },
      { q: "O frete é grátis?", a: "Sim, para compras acima de R$ 399 na modalidade Econômica, para todo o Brasil." },
      { q: "Posso retirar na loja?", a: "Pode. Escolha Retirar no Atelier no checkout e a sua peça fica pronta em até 2 horas na loja dos Jardins." },
    ],
  },
  {
    group: "Conta e privacidade",
    items: [
      { q: "Esqueci a minha senha. E agora?", a: "Clique em Esqueci a senha na tela de login e enviaremos um link de redefinição para o seu e-mail." },
      { q: "Como solicito a exclusão dos meus dados?", a: "Acesse a página LGPD e preencha o formulário de solicitação. Respondemos em até 15 dias." },
    ],
  },
];

const groups: FaqGroup[] = [
  ...faqs.map((g) =>
    g.group === "Produtos"
      ? {
          ...g,
          items: [
            ...g.items,
            { q: "As peças têm ajuste?", a: "Nas lojas físicas oferecemos ajustes gratuitos de barra e cintura para peças de alfaiataria compradas na Karen Michelly." },
            { q: "Como cuidar das peças de seda?", a: "Lave à mão em água fria com sabão neutro, sem torcer, e seque à sombra. Veja o guia completo no nosso blog." },
          ],
        }
      : g
  ),
  ...extra,
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups.flatMap((g) =>
    g.items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } }))
  ),
};

/** Tela 80: FAQ */
export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHeader
        eyebrow="Central de ajuda"
        title="Perguntas frequentes"
        text="Respostas rápidas para as dúvidas mais comuns das nossas clientes."
        crumbs={[{ label: "Ajuda" }, { label: "FAQ" }]}
      />

      <section className="bg-offwhite py-16 md:py-24">
        <div className="container-km">
          <FaqExplorer groups={groups} />
        </div>
      </section>

      <section className="bg-nude">
        <div className="container-km grid items-center gap-10 py-20 md:grid-cols-2 md:py-24">
          <div {...aos.fadeUp()}>
            <span className="eyebrow text-gold">Ainda com dúvidas?</span>
            <h2 className="mt-4 text-5xl leading-[1.02]">Nossa equipe está aqui por você</h2>
            <span className="gold-rule mt-6" />
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-graphite">
              Consultoras de estilo e atendimento prontas para ajudar, de segunda a sábado, com a mesma atenção da loja
              física.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end" {...aos.fadeUp(120)}>
            <Button href="/contato">
              <Mail className="size-4" strokeWidth={1.3} /> Ir para contato
            </Button>
            <Button href="https://wa.me/5511999999999" variant="secondary" target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" strokeWidth={1.3} /> WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
