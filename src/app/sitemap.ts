import type { MetadataRoute } from "next";
import { blogAuthors, blogCategories, blogPosts, brands, categories, products } from "@/lib/data";
import { campaigns, collections, promos } from "@/components/content/landings";

const BASE = "https://www.karenmichelly.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly",
    lastModified: Date | string = now
  ) => ({ url: `${BASE}${path}`, lastModified, changeFrequency, priority });

  const staticPages = [
    page("/", 1, "daily"),
    page("/novidades", 0.9, "daily"),
    page("/mais-vendidos", 0.8, "daily"),
    page("/ofertas", 0.8, "daily"),
    page("/produtos", 0.8, "daily"),
    page("/categorias", 0.7),
    page("/marcas", 0.6),
    page("/cupons", 0.5),
    page("/blog", 0.7, "weekly"),
    page("/sobre", 0.5, "monthly"),
    page("/contato", 0.5, "monthly"),
    page("/faq", 0.5, "monthly"),
    page("/politica-de-privacidade", 0.3, "yearly"),
    page("/termos-de-uso", 0.3, "yearly"),
    page("/politica-de-troca-e-devolucao", 0.4, "yearly"),
    page("/politica-de-entrega", 0.4, "yearly"),
    page("/politica-de-pagamento", 0.4, "yearly"),
    page("/lgpd", 0.3, "yearly"),
    page("/acessibilidade", 0.3, "yearly"),
  ];

  const categoryPages = categories.flatMap((c) => [
    page(`/categoria/${c.slug}`, 0.8, "daily"),
    ...c.subcategories.map((s) => page(`/categoria/${c.slug}/${s.slug}`, 0.7, "daily")),
  ]);

  const productPages = products
    .filter((p) => p.stock !== "indisponivel")
    .map((p) => page(`/produto/${p.slug}`, p.stock === "disponivel" ? 0.8 : 0.5, "weekly", p.createdAt));

  const brandPages = brands.map((b) => page(`/marcas/${b.slug}`, 0.6));

  const blogPages = [
    ...blogPosts.map((p) => page(`/blog/${p.slug}`, 0.6, "monthly", p.date)),
    ...blogCategories.map((c) => page(`/blog/categoria/${c.slug}`, 0.5)),
    ...blogAuthors.map((a) => page(`/blog/autor/${a.slug}`, 0.4, "monthly")),
  ];

  const landingPages = [
    ...campaigns.map((c) => page(`/campanha/${c.slug}`, 0.8)),
    ...collections.map((c) => page(`/colecao/${c.slug}`, 0.7)),
    ...promos.map((p) => page(`/promo/${p.slug}`, 0.7, "daily")),
  ];

  return [...staticPages, ...categoryPages, ...productPages, ...brandPages, ...blogPages, ...landingPages];
}
