import type { Metadata } from "next";
import { AuthLayout } from "@/components/account/AuthLayout";
import { SignupView } from "@/components/account/AuthPages";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta Karen Michelly e ganhe 10% de desconto na primeira compra.",
};

/** Tela 44: Cadastro */
export default function SignupPage() {
  return (
    <AuthLayout
      wide
      art="blazer"
      color="#0D0D0D"
      eyebrow="Nova cliente"
      title="Criar conta"
      text="Ganhe 10% na primeira compra, acompanhe pedidos e receba lançamentos do Atelier em primeira mão."
      quote="Peças criadas para mulheres que vestem a própria história."
    >
      <SignupView />
    </AuthLayout>
  );
}
