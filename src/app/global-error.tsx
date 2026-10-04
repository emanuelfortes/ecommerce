"use client";

import "@fontsource/cormorant-garamond/300.css";
import "@fontsource-variable/jost";
import "./globals.css";

/** Erro crítico no layout raiz: documento mínimo e independente. */
export default function GlobalError({
  error,
  retry,
  reset,
}: {
  error: Error & { digest?: string };
  retry?: () => void;
  reset?: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ background: "#0D0D0D", color: "#F7F4EF", margin: 0 }}>
        <title>Erro inesperado · Karen Michelly</title>
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/km-monogram.png" alt="Karen Michelly" width={72} height={72} className="size-18 object-contain" />
          <span className="mt-10 text-[11px] uppercase tracking-[0.3em] text-champagne/70">Erro inesperado</span>
          <h1 className="mt-4 font-serif text-4xl font-light text-white md:text-5xl">Voltamos em um instante</h1>
          <span className="mt-6 block h-px w-12 bg-gold" />
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-champagne">
            Algo não saiu como esperado ao carregar a loja. Tente novamente em alguns segundos.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => (retry ?? reset ?? (() => window.location.reload()))()}
              className="btn-gold"
            >
              Tentar novamente
            </button>
            <a href="/" className="btn-light">
              Página inicial
            </a>
          </div>
          {error.digest && <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-taupe">Código: {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
