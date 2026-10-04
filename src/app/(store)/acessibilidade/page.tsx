import type { Metadata } from "next";
import { Keyboard, Contrast, Type, ZoomIn, Volume2, Smartphone, Mail, Phone } from "lucide-react";
import { LegalLayout, LegalTable, DiamondList } from "@/components/content/LegalLayout";

export const metadata: Metadata = {
  title: "Acessibilidade",
  description: "Nosso compromisso com uma experiência de compra acessível, recursos disponíveis e atalhos de teclado.",
};

const features = [
  { icon: Keyboard, title: "Navegação por teclado", text: "Todos os menus, filtros e modais funcionam sem mouse." },
  { icon: Contrast, title: "Contraste adequado", text: "Textos com contraste mínimo AA sobre os fundos da marca." },
  { icon: Type, title: "Texto redimensionável", text: "Layout preservado com zoom de até 200% no navegador." },
  { icon: ZoomIn, title: "Foco visível", text: "Contorno dourado indica claramente o elemento ativo." },
  { icon: Volume2, title: "Leitores de tela", text: "Rótulos descritivos, regiões e avisos dinâmicos anunciados." },
  { icon: Smartphone, title: "Movimento reduzido", text: "Animações desativadas quando o sistema solicita." },
];

const Kbd = ({ children }: { children: string }) => (
  <kbd className="inline-flex min-w-7 items-center justify-center border border-line bg-offwhite px-2 py-0.5 font-sans text-xs text-ink">
    {children}
  </kbd>
);

/** Tela 87: Acessibilidade */
export default function AccessibilityPage() {
  return (
    <LegalLayout
      title="Acessibilidade"
      intro="Elegância é também acolher. Trabalhamos para que todas as pessoas possam navegar, escolher e comprar com autonomia."
      updated="2026-08-10"
      sections={[
        {
          id: "compromisso",
          title: "Nosso compromisso",
          content: (
            <>
              <p>
                O site da Karen Michelly é desenvolvido seguindo as Diretrizes de Acessibilidade para Conteúdo Web (WCAG
                2.2), nível AA, e a Lei Brasileira de Inclusão (Lei nº 13.146/2015).
              </p>
              <DiamondList
                items={[
                  "Auditorias de acessibilidade a cada nova coleção.",
                  "Testes com leitores de tela NVDA, VoiceOver e TalkBack.",
                  "Equipe de atendimento treinada para apoiar compras assistidas.",
                ]}
              />
            </>
          ),
        },
        {
          id: "recursos",
          title: "Recursos disponíveis",
          content: (
            <div className="mb-6 grid gap-px border border-line bg-line sm:grid-cols-2">
              {features.map(({ icon: Icon, title, text }) => (
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
          id: "atalhos",
          title: "Atalhos de teclado",
          content: (
            <LegalTable
              caption="Atalhos de teclado"
              head={["Tecla", "Ação"]}
              rows={[
                [<Kbd key="t">Tab</Kbd>, "Avança para o próximo elemento interativo"],
                [
                  <span key="st" className="flex gap-1">
                    <Kbd>Shift</Kbd>
                    <Kbd>Tab</Kbd>
                  </span>,
                  "Volta para o elemento anterior",
                ],
                [<Kbd key="e">Enter</Kbd>, "Ativa links e botões"],
                [<Kbd key="s">Espaço</Kbd>, "Marca caixas de seleção e alterna opções"],
                [<Kbd key="esc">Esc</Kbd>, "Fecha menus, buscas, modais e a sacola"],
                [
                  <span key="ar" className="flex gap-1">
                    <Kbd>←</Kbd>
                    <Kbd>→</Kbd>
                  </span>,
                  "Navega entre abas e imagens do produto",
                ],
                [<Kbd key="tab1">Tab (1º)</Kbd>, "Exibe o link Pular para o conteúdo"],
              ]}
            />
          ),
        },
        {
          id: "imagens",
          title: "Imagens e conteúdo",
          content: (
            <p>
              Todas as imagens de produto possuem texto alternativo com nome e cor da peça. Vídeos de campanha contam com
              legendas, e as tabelas de medidas são apresentadas em formato de tabela acessível.
            </p>
          ),
        },
        {
          id: "limitacoes",
          title: "Limitações conhecidas",
          content: (
            <p>
              Alguns conteúdos de parceiros, como mapas e widgets de pagamento, podem não atender integralmente às
              diretrizes. Trabalhamos com esses fornecedores para corrigir as barreiras identificadas.
            </p>
          ),
        },
        {
          id: "contato",
          title: "Fale conosco",
          content: (
            <>
              <p>
                Encontrou alguma barreira? Queremos saber. Sua mensagem é encaminhada diretamente à equipe responsável.
              </p>
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <a href="mailto:acessibilidade@karenmichelly.com.br" className="flex items-center gap-3 border border-line bg-white p-5 !no-underline transition-colors hover:border-champagne">
                  <Mail className="size-5 text-gold" strokeWidth={1.2} />
                  <span className="text-sm">acessibilidade@karenmichelly.com.br</span>
                </a>
                <a href="tel:+551130000000" className="flex items-center gap-3 border border-line bg-white p-5 !no-underline transition-colors hover:border-champagne">
                  <Phone className="size-5 text-gold" strokeWidth={1.2} />
                  <span className="text-sm">(11) 3000-0000 · Seg a Sex, 9h às 18h</span>
                </a>
              </div>
            </>
          ),
        },
      ]}
    />
  );
}
