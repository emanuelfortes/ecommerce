import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogCategories, blogPosts, getAuthor } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { aos } from "@/lib/aos";
import { PageHeader } from "@/components/ui/Primitives";
import { PostCard } from "@/components/shared/PostCard";
import { Photo } from "@/components/shared/Photo";
import { AuthorAvatar, CategoryPills } from "@/components/content/Blog";
import { NewsletterCallout } from "@/components/content/NewsletterCallout";

export const metadata: Metadata = {
  title: "Journal · Blog de moda",
  description: "Tendências, styling, bastidores do ateliê e cuidados com as peças. O journal da Karen Michelly.",
  alternates: { canonical: "/blog" },
};

/** Tela 88: Blog */
export default function BlogPage() {
  const [featured, ...rest] = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  const author = getAuthor(featured.author);
  const cat = blogCategories.find((c) => c.slug === featured.category);

  return (
    <>
      <PageHeader
        eyebrow="Journal Karen Michelly"
        title="Inspiração & estilo"
        text="Histórias do ateliê, tendências que valem a pena e o jeito Karen Michelly de vestir o dia a dia."
        crumbs={[{ label: "Blog" }]}
      >
        <div className="mt-6">
          <CategoryPills />
        </div>
      </PageHeader>

      {/* Destaque */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-km">
          <article className="group grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <Link href={`/blog/${featured.slug}`} className="block overflow-hidden lg:col-span-7" {...aos.zoomIn()}>
              <Photo
                src={featured.image}
                alt={featured.title}
                className="aspect-[16/11] w-full transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
            <div className="lg:col-span-5" {...aos.fadeUp(120)}>
              <span className="eyebrow flex items-center gap-3">
                <span className="h-px w-8 bg-gold" /> Em destaque
              </span>
              <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-taupe">
                <Link href={`/blog/categoria/${featured.category}`} className="text-gold hover:text-ink">
                  {cat?.name}
                </Link>
                <span className="size-1 rotate-45 bg-champagne" />
                <span>{formatDate(featured.date)}</span>
              </div>
              <Link href={`/blog/${featured.slug}`}>
                <h2 className="mt-4 text-4xl leading-[1.05] transition-colors group-hover:text-gold md:text-5xl">{featured.title}</h2>
              </Link>
              <span className="gold-rule mt-6" />
              <p className="mt-6 text-[16px] leading-relaxed text-taupe">{featured.excerpt}</p>
              {author && (
                <Link href={`/blog/autor/${author.slug}`} className="mt-8 flex items-center gap-4">
                  <AuthorAvatar author={author} size="sm" />
                  <span>
                    <span className="block text-sm text-ink">{author.name}</span>
                    <span className="block text-xs text-taupe">
                      {author.role} · {featured.readTime} min de leitura
                    </span>
                  </span>
                </Link>
              )}
              <Link href={`/blog/${featured.slug}`} className="link-luxe mt-10 inline-flex items-center gap-2">
                Ler artigo <ArrowRight className="size-3.5" strokeWidth={1.3} />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Grade */}
      <section className="bg-offwhite py-16 md:py-24">
        <div className="container-km">
          <div className="mb-10 flex items-end justify-between gap-6" {...aos.fadeUp()}>
            <div>
              <span className="eyebrow">Mais recentes</span>
              <h2 className="mt-3 text-4xl md:text-5xl">Últimas do journal</h2>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-taupe md:block">{blogPosts.length} artigos</span>
          </div>
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <PostCard key={p.slug} post={p} index={i % 3} />
            ))}
          </div>

          <div className="mt-20">
            <NewsletterCallout />
          </div>
        </div>
      </section>
    </>
  );
}
