import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogAuthors, blogCategories, blogPosts, getAuthor } from "@/lib/data";
import { aos } from "@/lib/aos";
import { Breadcrumbs, SectionHeading } from "@/components/ui/Primitives";
import { PostCard } from "@/components/shared/PostCard";
import { SocialIcon } from "@/components/shared/Brand";
import { AuthorAvatar } from "@/components/content/Blog";

const SITE = "https://www.karenmichelly.com.br";

export function generateStaticParams() {
  return blogAuthors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getAuthor(slug);
  if (!a) return { title: "Autora não encontrada" };
  return {
    title: `${a.name} · ${a.role}`,
    description: a.bio,
    alternates: { canonical: `/blog/autor/${slug}` },
    openGraph: { type: "profile", title: a.name, description: a.bio },
  };
}

/** Tela 91: Autora do blog */
export default async function BlogAuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const posts = blogPosts.filter((p) => p.author === slug).sort((a, b) => b.date.localeCompare(a.date));
  const totalMinutes = posts.reduce((n, p) => n + p.readTime, 0);
  const topics = Array.from(new Set(posts.map((p) => p.category)))
    .map((c) => blogCategories.find((x) => x.slug === c)?.name)
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `${SITE}/blog/autor/${author.slug}`,
    worksFor: { "@type": "Organization", name: "Karen Michelly Woman Wear" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b border-line bg-offwhite">
        <div className="container-km py-10 md:py-16">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "Autoras" }, { label: author.name }]} />
          <div className="mt-6 flex flex-col items-center gap-10 text-center md:flex-row md:items-center md:text-left" {...aos.fadeUp()}>
            <AuthorAvatar author={author} size="lg" />
            <div className="flex-1">
              <span className="eyebrow">{author.role}</span>
              <h1 className="mt-3 text-5xl leading-tight md:text-6xl">{author.name}</h1>
              <span className="gold-rule mx-auto mt-5 md:mx-0" />
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-graphite/80">{author.bio}</p>
              <div className="mt-6 flex items-center justify-center gap-2 md:justify-start">
                {(["instagram", "pinterest"] as const).map((n) => (
                  <a
                    key={n}
                    href={`https://${n}.com`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${author.name} no ${n === "instagram" ? "Instagram" : "Pinterest"}`}
                    className="grid size-10 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-gold hover:text-gold"
                  >
                    <SocialIcon name={n} className="size-4" />
                  </a>
                ))}
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-px self-stretch border border-line bg-line md:w-80 md:grid-cols-1">
              {[
                [String(posts.length), posts.length === 1 ? "artigo" : "artigos"],
                [`${totalMinutes} min`, "de leitura"],
                [String(topics.length), topics.length === 1 ? "tema" : "temas"],
              ].map(([n, l]) => (
                <div key={l} className="bg-white p-5 text-center">
                  <dt className="font-serif text-3xl text-ink">{n}</dt>
                  <dd className="mt-1 text-[10px] uppercase tracking-[0.2em] text-taupe">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-offwhite py-16 md:py-24">
        <div className="container-km">
          <SectionHeading
            align="left"
            eyebrow={topics.join(" · ")}
            title={`Artigos de ${author.name.split(" ")[0]}`}
          />
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <PostCard key={p.slug} post={p} index={i % 3} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-km">
          <p className="eyebrow mb-6 text-center">Outras vozes do journal</p>
          <div className="flex flex-wrap justify-center gap-6">
            {blogAuthors
              .filter((a) => a.slug !== author.slug)
              .map((a) => (
                <Link key={a.slug} href={`/blog/autor/${a.slug}`} className="group flex items-center gap-4 border border-line bg-offwhite px-6 py-4 transition-colors hover:border-champagne">
                  <AuthorAvatar author={a} size="sm" />
                  <span className="text-left">
                    <span className="block font-serif text-xl text-ink group-hover:text-gold">{a.name}</span>
                    <span className="block text-xs text-taupe">{a.role}</span>
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
