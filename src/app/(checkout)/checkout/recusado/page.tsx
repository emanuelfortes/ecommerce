import type { Metadata } from "next";
import { DeclinedView } from "@/components/checkout/OutcomeViews";

export const metadata: Metadata = {
  title: "Pagamento recusado",
  description: "Não foi possível aprovar o pagamento.",
  robots: { index: false, follow: false },
};

/** Tela 39: Pagamento recusado */
export default function Page() {
  return <DeclinedView />;
}
