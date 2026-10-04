"use client";

import Link from "next/link";
import { RefreshCw, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Primitives";
import { aos } from "@/lib/aos";

/**
 * Tela 96: Erro 500. Usada por app/(store)/error.tsx e pela rota de pré-visualização /erro-500.
 * Sem `onRetry`, o botão recarrega a página.
 */
export function ServerErrorView({ onRetry, digest }: { onRetry?: () => void; digest?: string }) {
  return (
    <section className="relative overflow-hidden bg-offwhite">
      <span className="pointer-events-none absolute left-1/2 top-10 size-[520px] -translate-x-1/2 rounded-full border border-champagne/40" aria-hidden />
      <span className="pointer-events-none absolute left-1/2 top-24 size-[380px] -translate-x-1/2 rounded-full border border-champagne/30" aria-hidden />
      <div className="container-km relative flex flex-col items-center py-20 text-center md:py-28" {...aos.zoomIn()}>
        <span className="eyebrow">Erro 500</span>
        <p className="mt-4 font-serif text-[120px] font-light leading-none text-ink md:text-[170px]">
          5<span className="text-gold">0</span>0
        </p>
        <Ornament className="my-6" />
        <h1 className="max-w-xl text-4xl leading-tight md:text-5xl">Um ponto saiu do lugar</h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-taupe">
          Tivemos um problema inesperado no nosso servidor. Nossa equipe já foi avisada e está ajustando cada detalhe.
          Sua sacola e seus favoritos continuam guardados.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button onClick={() => (onRetry ? onRetry() : window.location.reload())}>
            <RefreshCw className="size-4" strokeWidth={1.3} /> Tentar novamente
          </Button>
          <Button href="/" variant="secondary">
            <Home className="size-4" strokeWidth={1.3} /> Ir para o início
          </Button>
        </div>
        <p className="mt-10 flex items-center gap-2 text-sm text-taupe">
          <MessageCircle className="size-4 text-gold" strokeWidth={1.3} />
          O problema continua?{" "}
          <Link href="/contato" className="text-ink underline decoration-gold underline-offset-4">
            Fale com o atendimento
          </Link>
        </p>
        {digest && <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-taupe/80">Código do erro: {digest}</p>}
      </div>
    </section>
  );
}
