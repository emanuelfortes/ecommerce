import type { Metadata } from "next";
import Link from "next/link";
import { Eye, PencilLine, Download, Trash2, Ban, Share2, Info, UserCheck, Mail } from "lucide-react";
import { LegalLayout } from "@/components/content/LegalLayout";
import { LgpdRequestForm } from "@/components/content/LgpdRequestForm";

export const metadata: Metadata = {
  title: "LGPD · Seus direitos",
  description: "Conheça os seus direitos como titular de dados e solicite acesso, correção, portabilidade ou exclusão.",
};

const rights = [
  { icon: Eye, title: "Confirmação e acesso", text: "Saber se tratamos os seus dados e receber uma cópia completa." },
  { icon: PencilLine, title: "Correção", text: "Atualizar dados incompletos, inexatos ou desatualizados." },
  { icon: Download, title: "Portabilidade", text: "Receber os seus dados em formato estruturado para outro fornecedor." },
  { icon: Trash2, title: "Eliminação", text: "Excluir dados tratados com base no seu consentimento." },
  { icon: Ban, title: "Oposição e revogação", text: "Revogar consentimentos e se opor a tratamentos específicos." },
  { icon: Share2, title: "Compartilhamento", text: "Saber com quais parceiros os seus dados foram compartilhados." },
  { icon: Info, title: "Informação", text: "Ser informada sobre a possibilidade de não consentir e suas consequências." },
  { icon: UserCheck, title: "Revisão", text: "Solicitar revisão de decisões tomadas de forma automatizada." },
];

/** Tela 86: LGPD */
export default function LgpdPage() {
  return (
    <LegalLayout
      eyebrow="Privacidade"
      title="LGPD e seus direitos"
      crumb="LGPD"
      intro="A Lei Geral de Proteção de Dados garante a você o controle sobre as suas informações. Aqui você entende e exerce cada um desses direitos."
      updated="2026-09-15"
      sections={[
        {
          id: "o-que-e",
          title: "O que é a LGPD",
          content: (
            <p>
              A Lei nº 13.709/2018 estabelece regras para a coleta, o uso, o armazenamento e o compartilhamento de dados
              pessoais. Na Karen Michelly, tratamos dados apenas com base legal adequada e para finalidades legítimas,
              descritas na nossa <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
            </p>
          ),
        },
        {
          id: "direitos",
          title: "Direitos da titular",
          content: (
            <div className="mb-6 grid gap-px border border-line bg-line sm:grid-cols-2">
              {rights.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 bg-white p-5">
                  <Icon className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.2} />
                  <div>
                    <p className="font-serif text-xl text-ink">{title}</p>
                    <span className="mt-1 block text-sm leading-relaxed text-taupe">{text}</span>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          id: "prazos",
          title: "Prazos de resposta",
          content: (
            <ul>
              <li>Confirmação de existência ou acesso simplificado: imediato, pela área Minha Conta.</li>
              <li>Declaração completa: em até 15 dias a partir da solicitação.</li>
              <li>Correção e exclusão: em até 15 dias, exceto dados com guarda obrigatória por lei.</li>
            </ul>
          ),
        },
        {
          id: "solicitar",
          title: "Faça a sua solicitação",
          content: (
            <>
              <p>
                Preencha o formulário abaixo. Você receberá um número de protocolo e poderá acompanhar o andamento por
                e-mail.
              </p>
              <LgpdRequestForm />
            </>
          ),
        },
        {
          id: "dpo",
          title: "Encarregada de dados (DPO)",
          content: (
            <div className="mb-6 flex flex-col gap-4 bg-nude p-6 sm:flex-row sm:items-center">
              <span className="grid size-16 shrink-0 place-items-center rounded-full border border-gold font-serif text-2xl text-ink">
                HD
              </span>
              <div className="flex-1">
                <p className="font-serif text-2xl text-ink">Dra. Helena Duarte</p>
                <span className="block text-sm text-graphite">Encarregada pelo Tratamento de Dados Pessoais</span>
                <a href="mailto:privacidade@karenmichelly.com.br" className="mt-2 inline-flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-gold" strokeWidth={1.3} /> privacidade@karenmichelly.com.br
                </a>
              </div>
            </div>
          ),
        },
        {
          id: "anpd",
          title: "Autoridade Nacional",
          content: (
            <p>
              Caso entenda que a sua solicitação não foi atendida adequadamente, você pode apresentar reclamação à
              Autoridade Nacional de Proteção de Dados (ANPD), pelo site oficial do Governo Federal.
            </p>
          ),
        },
      ]}
    />
  );
}
