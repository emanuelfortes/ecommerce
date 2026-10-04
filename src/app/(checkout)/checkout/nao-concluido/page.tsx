import type { Metadata } from "next";
import { NotCompletedView } from "@/components/checkout/OutcomeViews";

export const metadata: Metadata = {
  title: "Pedido não concluído",
  description: "Sua compra não foi finalizada. Suas peças continuam na sacola.",
  robots: { index: false, follow: false },
};

/** Tela 42: Pedido não concluído */
export default function Page() {
  return <NotCompletedView />;
}
