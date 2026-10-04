import { privateMeta } from "@/components/account/meta";
import { ProfileView } from "@/components/account/ProfileViews";

export const metadata = privateMeta("Meus dados");

/** Tela 49: Perfil */
export default function ProfilePage() {
  return <ProfileView />;
}
