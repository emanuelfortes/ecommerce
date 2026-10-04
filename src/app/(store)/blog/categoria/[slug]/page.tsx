import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { blogCategories, blogPosts } from "@/lib/data";
import { PageHeader } from "@/components/ui/Primitives";
import { EmptyState } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/shared/PostCard";
import { CategoryPills } from "@/components/content/Blog";
import { NewsletterCallout } from "@/components/content/NewsletterCallout";

const descriptions: Record<string, string> = {
  tendencias: "O que está nas passarelas, nas ruas e no nosso radar, traduzido para o seu guarda-roupa.",
  styling: "Combinações, proporções e truques de consultoras para vestir bem em qualquer ocasião.",
  bastidores: "Do croqui à última prova: o dia a dia do ateliê e as histórias por trás de cada coleção.",
  cuidados: "Guias práticos para lavar, guardar e preservar as suas peças por muito mais tempo.",
};

export function generateStaticParams() {
  return blogCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = blogCategories.find((c) => c.slug === slug);
  if (!cat) return { title: "Categoria não encontrada" };
  return {
    title: `${cat.name} · Journal`,
    description: descriptions[slug],
    alternates: { canonical: `/blog/categoria/${slug}` },
  };
}

/** Tela 90: Categoria do blog */
export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = blogCategories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const posts = blogPosts.filter((p) => p.category === slug).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader
        eyebrow="Journal · Categoria"
        title={cat.name}
        text={descriptions[slug]}
        crumbs={[{ label: "Blog", href: "/blog" }, { label: cat.name }]}
      >
        <div className="mt-6">
          <CategoryPills active={slug} />
        </div>
      </PageHeader>

      <section className="bg-offwhite py-16 md:py-24">
        <div className="container-km">
          <p className="mb-10 text-xs uppercase tracking-[0.2em] text-taupe">
            {posts.length} {posts.length === 1 ? "artigo" : "artigos"} em {cat.name}
          </p>
          {posts.length ? (
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <PostCard key={p.slug} post={p} index={i % 3} featured={i === 0 && posts.length > 2} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText />}
              title="Em breve por aqui"
              text="Ainda não publicamos artigos nesta categoria. Que tal explorar o journal completo?"
              actions={<Button href="/blog">Ver todos os artigos</Button>}
            />
          )}
          <div className="mt-20">
            <NewsletterCallout />
          </div>
        </div>
      </section>
    </>
  );
}
