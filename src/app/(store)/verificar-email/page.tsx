import type { Metadata } from "next";
import { AuthLayout } from "@/components/account/AuthLayout";
import { VerifyEmailView } from "@/components/account/AuthPages";

export const metadata: Metadata = {
  title: "Verificar e-mail",
  robots: { index: false, follow: false },
};

/** Tela 47: Verificação de e-mail */
export default function VerifyEmailPage() {
  return (
    <AuthLayout
      image="/img/vestido-midi-corset-fenda-preto.webp"
      eyebrow="Quase lá"
      title="Confirme seu e-mail"
      text="Digite o código que enviamos para ativar sua conta com segurança."
      quote="Um ponto de luz dourado assina a peça, nunca a domina."
      author="Atelier Karen Michelly"
    >
      <VerifyEmailView />
    </AuthLayout>
  );
}
