"use client";

import { useEffect } from "react";
import { ServerErrorView } from "@/components/content/ServerErrorView";

/** Tela 96: Erro 500 (fronteira de erro das páginas da loja). */
export default function StoreError({
  error,
  retry,
  reset,
}: {
  error: Error & { digest?: string };
  retry?: () => void;
  reset?: () => void;
}) {
  useEffect(() => {
    // Envie para o seu serviço de monitoramento (Sentry, Datadog...)
    console.error(error);
  }, [error]);

  return <ServerErrorView onRetry={retry ?? reset} digest={error.digest} />;
}
