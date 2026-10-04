import type { Metadata } from "next";
import { OrderPlacedView } from "@/components/checkout/OutcomeViews";

export const metadata: Metadata = {
  title: "Pedido realizado",
  description: "Obrigada pela sua compra.",
  robots: { index: false, follow: false },
};

/** Tela 41: Pedido realizado */
export default function Page() {
  return <OrderPlacedView />;
}
