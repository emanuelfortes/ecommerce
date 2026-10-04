import type { Metadata } from "next";
import { OfflineView } from "@/components/content/OfflineView";

export const metadata: Metadata = {
  title: "Sem conexão",
  robots: { index: false, follow: false },
};

/** Tela 106: Erro de conexão */
export default function ConnectionErrorPage() {
  return <OfflineView />;
}
