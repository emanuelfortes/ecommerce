import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { blogCategories, getAuthor } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { aos } from "@/lib/aos";
import { ProductArt } from "@/components/product/ProductArt";

export function PostCard({ post, index = 0, featured }: { post: BlogPost; index?: number; featured?: boolean }) {
  const cat = blogCategories.find((c) => c.slug === post.category);
  return (
    <article {...aos.fadeUp(index * 100)} className="group flex flex-col">
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
        <ProductArt
          kind={post.art}
          tone={post.tone}
          color={["#D8C3A5", "#0D0D0D", "#E8D8D2", "#F7F4EF"][post.tone]}
          className={`w-full transition-transform duration-700 group-hover:scale-105 ${featured ? "aspect-[16/10]" : "aspect-[4/3]"}`}
        />
      </Link>
      <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-taupe">
        <Link href={`/blog/categoria/${post.category}`} className="text-gold hover:text-ink">
          {cat?.name}
        </Link>
        <span className="size-1 rotate-45 bg-champagne" />
        <span>{formatDate(post.date, { day: "2-digit", month: "short" })}</span>
        <span className="size-1 rotate-45 bg-champagne" />
        <span>{post.readTime} min</span>
      </div>
      <Link href={`/blog/${post.slug}`}>
        <h3 className={`mt-3 leading-tight text-ink transition-colors group-hover:text-gold ${featured ? "text-4xl" : "text-2xl"}`}>{post.title}</h3>
      </Link>
      <p className="mt-2 text-sm leading-relaxed text-taupe">{post.excerpt}</p>
      <p className="mt-4 text-xs text-graphite">Por {getAuthor(post.author)?.name}</p>
    </article>
  );
}
