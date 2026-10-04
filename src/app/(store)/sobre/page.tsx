import type { Metadata } from "next";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { stores } from "@/lib/data";
import { aos } from "@/lib/aos";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs, Ornament, SectionHeading } from "@/components/ui/Primitives";
import { Photo } from "@/components/shared/Photo";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "Conheça a história da Karen Michelly Woman Wear: 15 anos de ateliê, alfaiataria feminina e peças feitas para mulheres reais.",
};

const timeline = [
  { year: "2011", title: "O primeiro ateliê", text: "Karen abre um pequeno estúdio de costura sob medida no bairro de Pinheiros, em São Paulo." },
  { year: "2014", title: "A primeira coleção", text: "Vinte peças de alfaiataria feminina esgotam em um único fim de semana de pré-venda." },
  { year: "2017", title: "Atelier Jardins", text: "Inauguração da loja conceito na Rua Oscar Freire, com provador de ajustes." },
  { year: "2020", title: "Loja online", text: "O ateliê chega a todo o Brasil com entregas embaladas à mão." },
  { year: "2023", title: "Leblon", text: "Abertura da segunda loja física, no Rio de Janeiro, e lançamento da linha KM Noir." },
  { year: "2026", title: "Coleção Aurora", text: "Cetim, crochê e alfaiataria em uma coleção que celebra 15 anos de história." },
];

const values = [
  { title: "Feito para durar", text: "Tecidos nobres, costuras reforçadas e modelagens atemporais que atravessam estações." },
  { title: "Mulheres reais", text: "Grade ampliada e provas com corpos diversos em cada etapa do desenvolvimento." },
  { title: "Produção consciente", text: "Pequenas tiragens, fornecedores certificados e zero desperdício de retalhos." },
  { title: "Cuidado em cada detalhe", text: "Do botão banhado a ouro ao papel de seda que envolve a sua peça." },
];

const team = [
  { initials: "KM", name: "Karen Michelly", role: "Fundadora & Diretora Criativa" },
  { initials: "RA", name: "Renata Alves", role: "Chefe de Modelagem" },
  { initials: "ML", name: "Marina Lopes", role: "Editora de Moda" },
  { initials: "CS", name: "Cláudia Souza", role: "Mestre Costureira" },
];

/** Tela 78: Sobre nós */
export default function AboutPage() {
  return (
    <>
      {/* Abertura editorial */}
      <section className="bg-offwhite">
        <div className="container-km pt-10 md:pt-14">
          <Breadcrumbs items={[{ label: "Sobre nós" }]} />
        </div>
        <div className="container-km grid items-center gap-12 pb-20 pt-6 md:pb-28 lg:grid-cols-12">
          <div className="lg:col-span-6" {...aos.fadeUp()}>
            <span className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold" /> Nossa história
            </span>
            <h1 className="mt-6 text-[48px] leading-[0.98] text-ink sm:text-7xl">
              Vestir mulheres
              <br />
              com <em className="font-light text-gold">intenção</em>
            </h1>
            <p className="mt-7 max-w-lg text-[16px] leading-relaxed text-taupe">
              A Karen Michelly nasceu de uma tesoura, uma fita métrica e uma certeza: toda mulher merece uma peça que a
              vista como se tivesse sido feita para ela. Quinze anos depois, seguimos costurando essa promessa, ponto a
              ponto.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/campanha/aurora">
                Coleção Aurora <ArrowRight className="size-4" strokeWidth={1.3} />
              </Button>
              <Button href="#lojas" variant="secondary">
                Visite uma loja
              </Button>
            </div>
          </div>
          <div className="relative lg:col-span-6" {...aos.zoomIn(120)}>
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 aspect-[3/4] overflow-hidden rounded-t-full border border-champagne/60">
                <Photo src="/img/conjunto-alfaiataria-blazer-calca-off-white.webp" alt="Conjunto de alfaiataria do ateliê" className="size-full" />
              </div>
              <div className="col-span-2 mt-24 aspect-[3/4] overflow-hidden">
                <Photo src="/img/vestido-midi-cetim-fenda-champagne.webp" alt="Vestido midi em cetim" className="size-full" />
              </div>
            </div>
            <span className="absolute -bottom-6 left-1/3 h-20 w-px bg-gold" />
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="border-y border-line bg-white">
        <dl className="container-km grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {[
            ["15", "anos de ateliê"],
            ["40 mil", "clientes atendidas"],
            ["2", "lojas físicas"],
            ["94%", "peças produzidas no Brasil"],
          ].map(([n, l], i) => (
            <div key={l} className="text-center" {...aos.fadeUp(i * 80)}>
              <dt className="font-serif text-5xl text-ink">{n}</dt>
              <dd className="mt-2 text-[11px] uppercase tracking-[0.2em] text-taupe">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Linha do tempo */}
      <section className="bg-offwhite py-20 md:py-28">
        <div className="container-km">
          <SectionHeading eyebrow="2011 até hoje" title="Uma trajetória costurada à mão" />
          <ol className="relative mx-auto max-w-4xl">
            <span className="absolute left-4 top-0 h-full w-px bg-line md:left-1/2" aria-hidden />
            {timeline.map((t, i) => (
              <li
                key={t.year}
                {...aos.fadeUp(i * 60)}
                className={`relative mb-12 pl-14 last:mb-0 md:w-1/2 md:pl-0 ${i % 2 === 0 ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"}`}
              >
                <span
                  className={`absolute left-[11px] top-3 size-2.5 rotate-45 bg-gold md:left-auto ${i % 2 === 0 ? "md:-right-[5px]" : "md:-left-[5px]"}`}
                  aria-hidden
                />
                <p className="font-serif text-5xl leading-none text-champagne">{t.year}</p>
                <h3 className="mt-3 text-2xl">{t.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-taupe">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-km grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4" {...aos.fadeUp()}>
            <span className="eyebrow">O que nos guia</span>
            <h2 className="mt-4 text-5xl leading-[1.02]">Nossos valores</h2>
            <span className="gold-rule mt-6" />
            <p className="mt-6 text-[15px] leading-relaxed text-taupe">
              Luxo, para nós, é a soma de pequenas escolhas responsáveis. É assim que criamos cada coleção.
            </p>
          </div>
          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-8">
            {values.map((v, i) => (
              <li key={v.title} className="bg-white p-8" {...aos.fadeUp(i * 80)}>
                <span className="flex items-center gap-3">
                  <span className="size-2 rotate-45 bg-gold" aria-hidden />
                  <span className="font-serif text-sm text-champagne">0{i + 1}</span>
                </span>
                <h3 className="mt-4 text-3xl">{v.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-graphite/80">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ateliê */}
      <section className="bg-nude">
        <div className="container-km grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          <div {...aos.zoomIn()} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden">
                <Photo src="/img/conjunto-top-calca-pantalona-preto.webp" alt="Conjunto de pantalona preto" className="size-full" />
              </div>
              <div className="mt-16 aspect-[3/4] overflow-hidden">
                <Photo src="/img/camisa-cetim-rosa-saia-midi-off-white.webp" alt="Camisa de cetim e saia midi" className="size-full" />
              </div>
            </div>
          </div>
          <div {...aos.fadeUp()}>
            <span className="eyebrow text-gold">O ateliê</span>
            <h2 className="mt-4 text-5xl leading-[1.02] md:text-6xl">
              Onde cada peça
              <br />
              ganha forma
            </h2>
            <span className="gold-rule mt-6" />
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-graphite">
              No nosso ateliê em São Paulo, doze artesãs dão vida aos croquis. Cada molde é testado em provas reais e
              cada costura passa por três revisões de qualidade antes de chegar até você.
            </p>
            <ul className="mt-6 flex flex-col gap-2 text-sm text-graphite">
              {["Modelagem desenvolvida para o corpo brasileiro", "Acabamentos feitos à mão", "Ajustes gratuitos nas lojas físicas"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="size-1.5 rotate-45 bg-gold" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button href="/blog/bastidores-colecao-aurora">Bastidores da coleção</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Fundadora */}
      <section className="bg-ink py-20 text-white md:py-28">
        <div className="container-km mx-auto max-w-4xl text-center" {...aos.fadeUp()}>
          <Ornament className="mb-10" />
          <blockquote className="font-serif text-3xl font-light italic leading-snug text-white md:text-5xl">
            “Não desenho roupas para manequins. Desenho para a mulher que acorda cedo, decide, cuida, lidera e ainda
            quer se sentir linda no fim do dia.”
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/km-monogram.png" alt="" className="size-14 object-contain" />
            <div className="text-left">
              <p className="font-serif text-2xl text-white">Karen Michelly</p>
              <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Fundadora & Diretora Criativa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="bg-offwhite py-20 md:py-28">
        <div className="container-km">
          <SectionHeading eyebrow="Quem faz" title="As mãos por trás da marca" />
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {team.map((m, i) => (
              <li key={m.name} className="flex flex-col items-center text-center" {...aos.fadeUp(i * 80)}>
                <span className="grid size-28 place-items-center rounded-full border border-champagne bg-white font-serif text-4xl text-ink">
                  {m.initials}
                </span>
                <span className="mt-5 font-serif text-2xl text-ink">{m.name}</span>
                <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-taupe">{m.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Lojas */}
      <section id="lojas" className="scroll-mt-28 bg-white py-20 md:py-28">
        <div className="container-km">
          <SectionHeading eyebrow="Visite-nos" title="Nossas lojas" text="Provador com consultoria de estilo, ajustes de barra e um café à sua espera." />
          <div className="grid gap-6 md:grid-cols-2">
            {stores.map((s, i) => (
              <article key={s.name} className="group flex border border-line bg-offwhite transition-colors hover:border-champagne" {...aos.fadeUp(i * 100)}>
                <div className="hidden w-40 shrink-0 overflow-hidden sm:block">
                  <Photo src={i ? "/img/vestido-longo-argola-off-white.webp" : "/img/conjunto-alfaiataria-blazer-camisa-cetim-azul-marinho.webp"} alt={s.name} className="size-full" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <span className="eyebrow">{s.city}</span>
                  <h3 className="mt-2 text-3xl">{s.name}</h3>
                  <p className="mt-4 flex items-center gap-2 text-sm text-graphite">
                    <MapPin className="size-4 text-gold" strokeWidth={1.3} /> {s.address}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-graphite">
                    <Clock className="size-4 text-gold" strokeWidth={1.3} /> {s.hours}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.address}, ${s.city}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="link-luxe mt-6 self-start"
                  >
                    Como chegar
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
