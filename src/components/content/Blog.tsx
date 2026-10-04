import Link from "next/link";
import clsx from "clsx";
import type { BlogAuthor, BlogPost, Product } from "@/lib/types";
import { blogCategories, blogPosts, products } from "@/lib/data";
import { aos } from "@/lib/aos";

/** Iniciais do nome para o avatar monograma. */
export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** Avatar monograma da autora (círculo com fio dourado e iniciais serifadas). */
export function AuthorAvatar({ author, size = "md" }: { author: BlogAuthor; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={clsx(
        "relative grid shrink-0 place-items-center rounded-full border border-gold/70 bg-ink font-serif text-champagne",
        size === "sm" && "size-11 text-base",
        size === "md" && "size-16 text-2xl",
        size === "lg" && "size-36 text-5xl md:size-44 md:text-6xl"
      )}
    >
      <span className="absolute inset-1 rounded-full border border-white/10" />
      {initials(author.name)}
    </span>
  );
}

/** Pílulas de categoria do blog. */
export function CategoryPills({ active }: { active?: string }) {
  const items = [{ slug: "", name: "Todos" }, ...blogCategories];
  return (
    <nav aria-label="Categorias do blog" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
      {items.map((c) => {
        const on = (active ?? "") === c.slug;
        return (
          <Link
            key={c.slug || "todos"}
            href={c.slug ? `/blog/categoria/${c.slug}` : "/blog"}
            aria-current={on ? "page" : undefined}
            className={clsx(
              "shrink-0 border px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors",
              on ? "border-ink bg-ink text-white" : "border-line bg-white text-graphite hover:border-ink"
            )}
          >
            {c.name}
            <span className={clsx("ml-2", on ? "text-gold" : "text-taupe")}>
              {c.slug ? blogPosts.filter((p) => p.category === c.slug).length : blogPosts.length}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Renderiza o corpo do artigo a partir dos blocos p / h2 / quote / list. */
export function PostBody({ body }: { body: BlogPost["body"] }) {
  return (
    <div className="prose-km text-[17px]">
      {body.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={`secao-${i}`} className="scroll-mt-32">
                {b.text}
              </h2>
            );
          case "quote":
            return (
              <blockquote key={i} {...aos.fadeUp()} className="my-12 border-y border-line py-10 text-center">
                <span className="mx-auto mb-5 block size-2 rotate-45 bg-gold" aria-hidden />
                <p className="!mb-0 font-serif text-3xl font-light italic leading-snug !text-ink md:text-4xl">“{b.text}”</p>
              </blockquote>
            );
          case "list":
            return (
              <ul key={i}>
                {(Array.isArray(b.text) ? b.text : [b.text]).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={i} className={i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-ink" : undefined}>
                {b.text}
              </p>
            );
        }
      })}
    </div>
  );
}

/** Seleciona produtos para o carrossel "Compre o look" de um artigo. */
export function shopTheLook(post: BlogPost, n = 8): Product[] {
  const featured = products.filter((p) => p.images?.includes(post.image) && p.stock === "disponivel");
  const rest = products.filter((p) => !featured.includes(p) && p.stock === "disponivel" && (p.isBestseller || p.isNew));
  return [...featured, ...rest].slice(0, n);
}
