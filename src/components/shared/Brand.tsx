import Link from "next/link";
import clsx from "clsx";

/**
 * Logotipo Karen Michelly.
 * Monograma KM extraído do logotipo original (PNG transparente).
 * - "dark": para fundos pretos (header/footer), nome em dourado.
 * - "light": para fundos claros, nome em preto.
 */
export function Logo({
  variant = "dark",
  className,
  compact,
}: {
  variant?: "dark" | "light";
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" aria-label="Karen Michelly, página inicial" className={clsx("group inline-flex items-center gap-2 sm:gap-3", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/km-monogram.png"
        alt=""
        width={48}
        height={48}
        className="size-9 shrink-0 object-contain sm:size-12 transition-transform duration-500 group-hover:scale-105"
      />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={clsx(
              "whitespace-nowrap font-serif text-[14px] font-medium uppercase tracking-[0.1em] sm:text-[19px] sm:tracking-[0.16em] md:text-[21px]",
              variant === "dark" ? "text-gold" : "text-ink"
            )}
          >
            Karen Michelly
          </span>
          <span
            className={clsx(
              "mt-1.5 flex items-center gap-2 whitespace-nowrap text-[7.5px] uppercase tracking-[0.36em] sm:text-[8.5px] sm:tracking-[0.42em]",
              variant === "dark" ? "text-champagne/80" : "text-taupe"
            )}
          >
            <span className="h-px w-4 bg-gold/60" />
            Woman Wear
            <span className="h-px w-4 bg-gold/60" />
          </span>
        </span>
      )}
    </Link>
  );
}

const paths = {
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-9.6a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z",
  facebook:
    "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5V13h2.7v8h3.3z",
  tiktok:
    "M16.6 5.8A4.3 4.3 0 0115.5 3h-3.1v12.4a2.6 2.6 0 11-1.8-2.5V9.7a5.7 5.7 0 104.9 5.7V9.1a7.4 7.4 0 004.3 1.4V7.4a4.3 4.3 0 01-3.2-1.6z",
  pinterest:
    "M12 2a10 10 0 00-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.5 2.1-4.5 4.4 0 .9.3 1.8.8 2.3l.1.4-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.2 6.4-5.4 6.4-1 0-2-.5-2.4-1.2l-.6 2.5c-.2.9-.9 2-1.3 2.7A10 10 0 1012 2z",
  whatsapp:
    "M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 01-2.4-1.5 9 9 0 01-1.6-2c-.2-.3 0-.5.1-.6l.4-.5.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 00-.8.4 3.4 3.4 0 00-1 2.5 5.9 5.9 0 001.2 3.1 13.4 13.4 0 005.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 002-1.4 2.5 2.5 0 00.2-1.4c-.1-.2-.3-.3-.6-.4zM12 21.8a9.8 9.8 0 01-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1112 21.8zM12 0a12 12 0 00-10.3 18L0 24l6.2-1.6A12 12 0 1012 0z",
  youtube:
    "M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.5 12a31 31 0 00.5 4.8 3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1 31 31 0 00.5-4.8 31 31 0 00-.5-4.8zM9.8 15V9l5.7 3-5.7 3z",
};

export type SocialName = keyof typeof paths;

export function SocialIcon({ name, className }: { name: SocialName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={clsx("fill-current", className)} aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}

export const socialLinks: { name: SocialName; label: string; href: string }[] = [
  { name: "instagram", label: "Instagram", href: "https://instagram.com" },
  { name: "tiktok", label: "TikTok", href: "https://tiktok.com" },
  { name: "pinterest", label: "Pinterest", href: "https://pinterest.com" },
  { name: "facebook", label: "Facebook", href: "https://facebook.com" },
  { name: "youtube", label: "YouTube", href: "https://youtube.com" },
];
