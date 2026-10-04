import { privateMeta } from "@/components/account/meta";
import { ChangePasswordForm } from "@/components/account/SecurityViews";

export const metadata = privateMeta("Alterar senha");

/** Tela 64: Alterar senha */
export default function ChangePasswordPage() {
  return <ChangePasswordForm />;
}
