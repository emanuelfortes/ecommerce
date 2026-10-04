import type { Metadata } from "next";
import { AuthLayout } from "@/components/account/AuthLayout";
import { ResetPasswordView } from "@/components/account/AuthPages";

export const metadata: Metadata = {
  title: "Redefinir senha",
  robots: { index: false, follow: false },
};

/** Tela 46: Redefinir senha */
export default function ResetPasswordPage() {
  return (
    <AuthLayout
      image="/img/conjunto-alfaiataria-blazer-calca-off-white.webp"
      eyebrow="Acesso"
      title="Crie uma nova senha"
      text="Escolha uma senha forte, que você ainda não tenha usado em outros sites."
      quote="Elegância é quando o interior é tão bonito quanto o exterior."
      author="Atelier Karen Michelly"
    >
      <ResetPasswordView />
    </AuthLayout>
  );
}
