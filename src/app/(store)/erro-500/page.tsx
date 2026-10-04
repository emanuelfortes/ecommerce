import type { Metadata } from "next";
import { ServerErrorView } from "@/components/content/ServerErrorView";

export const metadata: Metadata = {
  title: "Erro no servidor",
  robots: { index: false, follow: false },
};

/** Tela 96: pré-visualização do estado de erro 500. */
export default function ServerErrorPreviewPage() {
  return <ServerErrorView digest="KM-500-DEMO" />;
}
