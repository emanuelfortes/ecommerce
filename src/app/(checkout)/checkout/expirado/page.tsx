import type { Metadata } from "next";
import { ExpiredView } from "@/components/checkout/OutcomeViews";

export const metadata: Metadata = {
  title: "Checkout expirado",
  description: "Sua sessão de checkout expirou.",
  robots: { index: false, follow: false },
};

/** Tela 107: Checkout expirado */
export default function Page() {
  return <ExpiredView />;
}
