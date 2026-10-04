import type { Metadata } from "next";
import Link from "next/link";
import { Hourglass, ShieldCheck, ArrowLeft } from "lucide-react";
import { aos } from "@/lib/aos";
import { SessionExpiredLogin } from "@/components/content/SessionExpiredLogin";

export const metadata: Metadata = {
  title: "Sessão expirada",
  robots: { index: false, follow: false },
};

/** Tela 108: Sessão expirada */
export default function SessionExpiredPage() {
  return (
    <section className="bg-offwhite py-16 md:py-24">
      <div className="container-km grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="text-center lg:text-left" {...aos.fadeUp()}>
          <span className="mx-auto grid size-20 place-items-center rounded-full border border-champagne text-ink lg:mx-0">
            <Hourglass className="size-8" strokeWidth={1.1} />
          </span>
          <span className="eyebrow mt-8 block">Sessão expirada</span>
          <h1 className="mt-4 text-5xl leading-[1.02] md:text-6xl">Por segurança, encerramos a sua sessão</h1>
          <span className="gold-rule mx-auto mt-6 lg:mx-0" />
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-taupe lg:mx-0">
            Depois de 30 minutos sem atividade, desconectamos a sua conta automaticamente para proteger os seus dados
            pessoais e de pagamento. Entre novamente para continuar de onde parou.
          </p>
          <ul className="mx-auto mt-8 flex max-w-md flex-col gap-3 text-left text-sm text-graphite lg:mx-0">
            {[
              "Sua sacola e seus favoritos continuam salvos",
              "Nenhum pedido em andamento foi afetado",
              "Seus dados permanecem protegidos com criptografia",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="size-1.5 shrink-0 rotate-45 bg-gold" /> {t}
              </li>
            ))}
          </ul>
          <Link href="/" className="link-luxe mt-10 inline-flex items-center gap-2">
            <ArrowLeft className="size-3.5" strokeWidth={1.3} /> Voltar para o início
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md border border-line bg-white p-8 md:p-10" {...aos.zoomIn(100)}>
          <p className="font-serif text-3xl text-ink">Entrar novamente</p>
          <p className="mb-8 mt-2 text-sm text-taupe">Use o e-mail e a senha da sua conta Karen Michelly.</p>
          <SessionExpiredLogin />
          <p className="mt-8 flex items-center gap-2 border-t border-line pt-6 text-xs text-taupe">
            <ShieldCheck className="size-4 shrink-0 text-gold" strokeWidth={1.2} />
            Dica: em dispositivos compartilhados, sempre saia da sua conta ao terminar.
          </p>
        </div>
      </div>
    </section>
  );
}
