import type { Metadata } from "next";
import { AuthLayout } from "@/components/account/AuthLayout";
import { RecoverPasswordView } from "@/components/account/AuthPages";

export const metadata: Metadata = {
  title: "Recuperar senha",
  robots: { index: false, follow: false },
};

/** Tela 45: Recuperar senha */
export default function RecoverPasswordPage() {
  return (
    <AuthLayout
      image="/img/vestido-longo-argola-off-white.webp"
      eyebrow="Acesso"
      title="Esqueceu a senha?"
      text="Informe o e-mail cadastrado e enviaremos um link seguro para você criar uma nova senha."
      quote="O cuidado está nos detalhes que ninguém vê, mas todos sentem."
      author="Atelier Karen Michelly"
    >
      <RecoverPasswordView />
    </AuthLayout>
  );
}
