import { privateMeta } from "@/components/account/meta";
import { FavoritesView } from "@/components/account/FavoritesView";

export const metadata = privateMeta("Favoritos");

/** Tela 63: Favoritos na conta */
export default function AccountFavoritesPage() {
  return <FavoritesView />;
}
