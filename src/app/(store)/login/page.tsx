import type { Metadata } from "next";
import { AuthLayout } from "@/components/account/AuthLayout";
import { LoginView } from "@/components/account/AuthPages";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta Karen Michelly para acompanhar pedidos, favoritos e benefícios exclusivos.",
};

/** Tela 43: Login */
export default function LoginPage() {
  return (
    <AuthLayout eyebrow="Bem-vinda de volta" title="Entrar na sua conta" text="Acompanhe pedidos, salve favoritos e aproveite benefícios exclusivos de cliente.">
      <LoginView />
    </AuthLayout>
  );
}
