import { privateMeta } from "@/components/account/meta";
import { ProfileEditForm } from "@/components/account/ProfileViews";

export const metadata = privateMeta("Editar dados");

/** Tela 50: Editar perfil */
export default function ProfileEditPage() {
  return <ProfileEditForm />;
}
