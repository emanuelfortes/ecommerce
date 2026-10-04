import type { Metadata } from "next";
import { ApprovedView } from "@/components/checkout/OutcomeViews";

export const metadata: Metadata = {
  title: "Pagamento aprovado",
  description: "Seu pagamento foi aprovado.",
  robots: { index: false, follow: false },
};

/** Tela 38: Pagamento aprovado */
export default function Page() {
  return <ApprovedView />;
}
