import type { MetadataRoute } from "next";

const BASE = "https://www.karenmichelly.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/conta",
          "/checkout",
          "/carrinho",
          "/favoritos",
          "/comparar",
          "/busca",
          "/login",
          "/cadastro",
          "/recuperar-senha",
          "/redefinir-senha",
          "/verificar-email",
          "/acompanhamento",
          "/avaliar",
          "/reembolso",
          "/mapa-do-site",
          "/carregando",
          "/erro-500",
          "/erro-de-conexao",
          "/sessao-expirada",
          "/manutencao",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
