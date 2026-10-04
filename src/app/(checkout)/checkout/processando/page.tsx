import type { Metadata } from "next";
import { ProcessingView } from "@/components/checkout/OutcomeViews";

export const metadata: Metadata = {
  title: "Processando pagamento",
  description: "Estamos finalizando o seu pedido.",
  robots: { index: false, follow: false },
};

/** Tela 37: Processando pagamento */
export default function Page() {
  return <ProcessingView />;
}
