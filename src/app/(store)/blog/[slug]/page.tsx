import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { blogCategories, blogPosts, getAuthor, getPost } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { aos } from "@/lib/aos";
import { Breadcrumbs, SectionHeading } from "@/components/ui/Primitives";
import { Photo } from "@/components/shared/Photo";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { PostCard } from "@/components/shared/PostCard";
import { AuthorAvatar, PostBody, shopTheLook } from "@/components/content/Blog";
import { ShareButtons } from "@/components/content/ShareButtons";

const SITE = "https://www.karenmichelly.com.br";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Artigo não encontrado" };
  const author = getAuthor(post.author);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: author ? [{ name: author.name, url: `/blog/autor/${author.slug}` }] : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: author ? [author.name] : undefined,
    },
  };
}

/** Tela 89: Artigo do blog */
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = getAuthor(post.author);
  const cat = blogCategories.find((c) => c.slug === post.category);
  const related = [
    ...blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...blogPosts.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3);
  const look = shopTheLook(post);
  const headings = post.body.map((b, i) => ({ ...b, i })).filter((b) => b.type === "h2");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${SITE}/blog/${post.slug}`,
    articleSection: cat?.name,
    image: [`${SITE}/brand/karen-michelly-logo.jpg`],
    author: author ? { "@type": "Person", name: author.name, url: `${SITE}/blog/autor/${author.slug}` } : undefined,
    publisher: {
      "@type": "Organization",
      name: "Karen Michelly Woman Wear",
      logo: { "@type": "ImageObject", url: `${SITE}/brand/km-monogram.png` },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Cabeçalho do artigo */}
      <header className="bg-offwhite">
        <div className="container-km pt-10 md:pt-14">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: cat?.name ?? "Artigo", href: `/blog/categoria/${post.category}` }, { label: post.title }]} />
          <div className="mx-auto max-w-3xl pb-12 pt-6 text-center md:pb-16" {...aos.fadeUp()}>
            <Link href={`/blog/categoria/${post.category}`} className="eyebrow text-gold hover:text-ink">
              {cat?.name}
            </Link>
            <h1 className="mt-5 text-4xl leading-[1.05] md:text-6xl">{post.title}</h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-taupe">{post.excerpt}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-taupe">
              {author && (
                <Link href={`/blog/autor/${author.slug}`} className="text-ink hover:text-gold">
                  Por {author.name}
                </Link>
              )}
              <span className="size-1 rotate-45 bg-champagne" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="size-1 rotate-45 bg-champagne" />
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" strokeWidth={1.3} /> {post.readTime} min de leitura
              </span>
            </div>
          </div>
        </div>
        <div className="container-km" {...aos.zoomIn()}>
          <Photo
            src={post.image}
            alt={post.title}
            className="aspect-[16/9] w-full md:aspect-[21/9]"
          />
        </div>
      </header>

      {/* Corpo */}
      <section className="bg-offwhite py-16 md:py-24">
        <div className="container-km grid gap-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-36">
              <ShareButtons path={`/blog/${post.slug}`} title={post.title} vertical />
            </div>
          </aside>

          <article className="lg:col-span-7">
            <PostBody body={post.body} />

            <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-y border-line py-6">
              <ShareButtons path={`/blog/${post.slug}`} title={post.title} />
              <Link href="/blog" className="link-luxe inline-flex items-center gap-2">
                <ArrowLeft className="size-3.5" strokeWidth={1.3} /> Voltar ao journal
              </Link>
            </div>

            {author && (
              <div className="mt-12 flex flex-col gap-6 bg-white p-8 sm:flex-row sm:items-center" {...aos.fadeUp()}>
                <AuthorAvatar author={author} />
                <div className="flex-1">
                  <span className="eyebrow">Sobre a autora</span>
                  <p className="mt-2 font-serif text-3xl text-ink">{author.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{author.role}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-graphite/80">{author.bio}</p>
                  <Link href={`/blog/autor/${author.slug}`} className="link-luxe mt-5 inline-block">
                    Ver todos os artigos
                  </Link>
                </div>
              </div>
            )}
          </article>

          <aside className="lg:col-span-3">
            <div className="sticky top-36 flex flex-col gap-8">
              {headings.length > 0 && (
                <nav aria-label="Neste artigo" className="border-l border-line pl-5">
                  <p className="eyebrow mb-4">Neste artigo</p>
                  <ol className="flex flex-col gap-3 text-sm">
                    {headings.map((h) => (
                      <li key={h.i}>
                        <a href={`#secao-${h.i}`} className="text-taupe transition-colors hover:text-ink">
                          {h.text as string}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <div className="bg-ink p-6 text-white">
                <p className="eyebrow text-champagne/70">Inspirou?</p>
                <p className="mt-3 font-serif text-2xl leading-snug text-white">As peças deste artigo estão a um clique.</p>
                <a href="#compre-o-look" className="mt-5 inline-block border-b border-gold pb-1 text-[11px] uppercase tracking-[0.2em] text-white hover:text-gold">
                  Compre o look
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Compre o look */}
      <section id="compre-o-look" className="scroll-mt-28 bg-white py-20 md:py-28">
        <div className="container-km">
          <SectionHeading align="left" eyebrow="Do journal para o seu closet" title="Compre o look" text="Peças selecionadas pela nossa equipe para compor o visual deste artigo." />
          <ProductCarousel products={look} />
        </div>
      </section>

      {/* Relacionados */}
      <section className="bg-offwhite py-20 md:py-28">
        <div className="container-km">
          <SectionHeading eyebrow="Continue lendo" title="Artigos relacionados" />
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
            {related.map((p, i) => (
              <PostCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
