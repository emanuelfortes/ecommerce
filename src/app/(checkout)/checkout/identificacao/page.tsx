import type { Metadata } from "next";
import { IdentificationStep } from "@/components/checkout/IdentificationStep";

export const metadata: Metadata = {
  title: "Identificação",
  description: "Entre, crie sua conta ou continue como convidada para finalizar a compra.",
  robots: { index: false, follow: false },
};

/** Telas 26 e 27: Login e cadastro no checkout */
export default function Page() {
  return <IdentificationStep />;
}
