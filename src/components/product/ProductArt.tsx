import type { ArtKind } from "@/lib/types";

/**
 * Ilustração editorial em SVG usada como imagem de produto enquanto não há fotos reais.
 * Para usar fotos, preencha `images` no produto (src/lib/data.ts): o <ProductImage>
 * passa a exibir a foto automaticamente.
 */

const tones = [
  { from: "#F7F4EF", to: "#E8D8D2", arch: "#EFE5DD", line: "#24211F", dark: false },
  { from: "#EFE3DC", to: "#D8C3A5", arch: "#E8D8D2", line: "#24211F", dark: false },
  { from: "#F3EDE5", to: "#DCCBB8", arch: "#F7F4EF", line: "#24211F", dark: false },
  { from: "#1C1A18", to: "#0D0D0D", arch: "#24211F", line: "#D8C3A5", dark: true },
];

function luminance(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

const hanger = (
  <g fill="none" strokeWidth="1.2">
    <path d="M150 46 Q150 36 156 34 Q162 32 161 26" />
    <path d="M112 66 L150 46 L188 66" />
  </g>
);

function Garment({ kind, fill, detail }: { kind: ArtKind; fill: string; detail: string }) {
  const d = { stroke: detail, fill: "none", strokeWidth: 0.9, opacity: 0.55 };
  const gold = "#C6A15B";
  switch (kind) {
    case "dress":
      return (
        <g>
          {hanger}
          <path d="M126 108 Q150 122 174 108 Q182 140 179 170 L214 334 Q150 352 86 334 L121 170 Q118 140 126 108 Z" fill={fill} />
          <path d="M128 108 L118 66 M172 108 L182 66" fill="none" strokeWidth="1.2" />
          <path d="M121 170 Q150 180 179 170" {...d} />
          <path d="M140 182 L126 338 M160 182 L174 338 M150 180 L150 344" {...d} />
        </g>
      );
    case "blouse":
      return (
        <g>
          {hanger}
          <path d="M116 70 L150 62 L184 70 L222 92 L238 172 L218 178 L204 122 L204 252 Q150 262 96 252 L96 122 L82 178 L62 172 L78 92 Z" fill={fill} />
          <path d="M134 66 L150 94 L166 66" fill="none" strokeWidth="1.1" />
          <path d="M150 94 L150 254" {...d} />
          {[114, 140, 166, 192, 218].map((y) => (
            <circle key={y} cx="153" cy={y} r="1.8" fill={gold} stroke="none" />
          ))}
        </g>
      );
    case "pants":
      return (
        <g>
          <path d="M100 58 L200 58 M150 58 L150 46 Q150 36 156 34" fill="none" strokeWidth="1.2" />
          <path d="M106 70 L194 70 L196 88 L104 88 Z" fill={fill} />
          <path d="M104 88 L80 344 L144 344 L150 156 L156 344 L220 344 L196 88 Z" fill={fill} />
          <path d="M122 104 L112 338 M178 104 L188 338 M150 88 L150 150" {...d} />
          <circle cx="150" cy="79" r="2.2" fill={gold} stroke="none" />
        </g>
      );
    case "skirt":
      return (
        <g>
          <path d="M100 64 L200 64 M150 64 L150 46 Q150 36 156 34" fill="none" strokeWidth="1.2" />
          <path d="M112 78 L188 78 L190 94 L110 94 Z" fill={fill} />
          <path d="M110 94 L78 322 Q150 338 222 322 L190 94 Z" fill={fill} />
          {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${150 + i * 12} 96 L${150 + i * 22} 328`} {...d} />
          ))}
        </g>
      );
    case "blazer":
    case "coat": {
      const long = kind === "coat";
      const hem = long ? 352 : 292;
      return (
        <g>
          {hanger}
          <path
            d={`M118 70 L150 64 L182 70 L224 90 L238 ${long ? 250 : 232} L218 ${long ? 254 : 236} L206 130 L208 ${hem} L150 ${hem + 6} L92 ${hem} L94 130 L82 ${long ? 254 : 236} L62 ${long ? 250 : 232} L76 90 Z`}
            fill={fill}
          />
          <path d="M132 68 L150 176 L168 68 M132 68 L116 112 L140 122 M168 68 L184 112 L160 122" fill="none" strokeWidth="1.1" />
          <path d={`M150 176 L150 ${hem + 6}`} {...d} />
          {long ? (
            <>
              <path d="M94 204 L206 204 L206 216 L94 216 Z" fill={fill} />
              <rect x="143" y="202" width="14" height="16" fill="none" stroke={gold} strokeWidth="1.4" />
              {[150, 180, 240, 270].map((y) => (
                <g key={y}>
                  <circle cx="136" cy={y} r="2.2" fill={gold} stroke="none" />
                  <circle cx="164" cy={y} r="2.2" fill={gold} stroke="none" />
                </g>
              ))}
            </>
          ) : (
            <>
              <circle cx="150" cy="200" r="3" fill={gold} stroke="none" />
              <circle cx="150" cy="232" r="3" fill={gold} stroke="none" />
              <path d="M104 238 L132 238 M168 238 L196 238" {...d} />
            </>
          )}
        </g>
      );
    }
    case "knit":
      return (
        <g>
          <path d="M128 54 L172 54 L176 80 L124 80 Z" fill={fill} />
          <path d="M112 78 L188 78 L228 102 L242 242 L218 246 L206 142 L206 272 Q150 282 94 272 L94 142 L82 246 L58 242 L72 102 Z" fill={fill} />
          {[132, 138, 144, 150, 156, 162, 168].map((x) => (
            <path key={x} d={`M${x} 56 L${x} 78`} {...d} />
          ))}
          {[110, 140, 170, 200, 230].map((y) => (
            <path key={y} d={`M100 ${y} Q150 ${y + 6} 200 ${y}`} {...d} />
          ))}
          {[100, 116, 132, 148, 164, 180, 196].map((x) => (
            <path key={x} d={`M${x} 262 L${x} 274`} {...d} />
          ))}
        </g>
      );
    case "jumpsuit":
      return (
        <g>
          {hanger}
          <path d="M118 68 L132 66 L150 122 L168 66 L182 68 L188 170 L208 344 L160 344 L150 214 L140 344 L92 344 L112 170 Z" fill={fill} />
          <path d="M112 170 L188 170 L189 182 L111 182 Z" fill={fill} />
          <path d="M150 182 L142 214 M150 182 L160 212" fill="none" strokeWidth="1" />
          <path d="M132 190 L118 340 M168 190 L182 340" {...d} />
        </g>
      );
    case "bag":
      return (
        <g>
          <path d="M116 182 Q116 106 150 106 Q184 106 184 182" fill="none" strokeWidth="4" stroke={fill} />
          <path d="M116 182 Q116 106 150 106 Q184 106 184 182" fill="none" strokeWidth="1" />
          <path d="M84 180 L216 180 L228 322 L72 322 Z" fill={fill} />
          <path d="M84 180 L216 180 L210 240 Q150 262 90 240 Z" fill={fill} />
          <path d="M80 300 L220 300" {...d} />
          <circle cx="150" cy="250" r="7" fill={gold} stroke="none" />
          <circle cx="150" cy="250" r="3" fill="none" stroke={detail} strokeWidth="0.8" />
        </g>
      );
    case "heels":
      return (
        <g>
          <path d="M46 300 C52 282 92 276 132 268 C172 260 196 232 214 206 L246 198 L248 222 C238 236 224 252 212 270 C192 292 152 304 120 306 Z" fill={fill} />
          <path d="M232 224 L246 222 L240 318 L234 318 Z" fill={fill} />
          <path d="M46 300 Q130 312 212 270" {...d} />
          <path d="M132 268 Q172 254 214 206" fill="none" strokeWidth="1" />
          <path d="M226 318 L246 318" fill="none" strokeWidth="1.4" />
          <ellipse cx="150" cy="330" rx="100" ry="5" fill="#0D0D0D" opacity="0.06" stroke="none" />
        </g>
      );
    case "necklace":
      return (
        <g>
          <path d="M112 60 L112 116 Q78 150 70 280 L230 280 Q222 150 188 116 L188 60 Q150 70 112 60 Z" fill={fill} opacity="0.9" />
          <path d="M112 60 Q150 52 188 60" fill="none" strokeWidth="1" />
          <path d="M98 92 Q150 268 202 92" fill="none" stroke={gold} strokeWidth="2.4" strokeDasharray="5 3" />
          <path d="M150 180 L150 196" stroke={gold} strokeWidth="1.4" />
          <ellipse cx="150" cy="210" rx="9" ry="13" fill={gold} stroke="none" />
          <ellipse cx="147" cy="205" rx="2.5" ry="4" fill="#fff" opacity="0.5" stroke="none" />
          <path d="M70 280 L230 280 L220 300 L80 300 Z" fill={fill} />
        </g>
      );
    case "swim":
      return (
        <g>
          <path d="M100 52 L200 52" fill="none" strokeWidth="1.2" />
          <path d="M126 82 L138 54 M174 82 L162 54" fill="none" strokeWidth="1" />
          <path d="M106 126 L144 126 L126 80 Z M156 126 L194 126 L174 80 Z" fill={fill} />
          <path d="M84 128 L216 128" fill="none" strokeWidth="1" />
          <path d="M98 206 L202 206 L198 240 Q170 248 160 284 L140 284 Q130 248 102 240 Z" fill={fill} />
          <circle cx="104" cy="213" r="5" fill="none" stroke={gold} strokeWidth="1.6" />
          <circle cx="196" cy="213" r="5" fill="none" stroke={gold} strokeWidth="1.6" />
        </g>
      );
  }
}

export interface ProductArtProps {
  kind: ArtKind;
  tone?: number;
  color?: string;
  /** 0 frente · 1 detalhe · 2 costas · 3 editorial escuro */
  variant?: number;
  className?: string;
  label?: string;
}

export function ProductArt({ kind, tone = 0, color = "#E8D8D2", variant = 0, className, label }: ProductArtProps) {
  const t = tones[(variant === 3 ? 3 : tone) % tones.length];
  const fillLum = luminance(color);
  // o colar é exibido sobre um busto neutro para o dourado aparecer
  const fill = kind === "necklace" ? (t.dark ? "#2E2A27" : "#EFE5DD") : color;
  const outline = t.dark ? "#D8C3A5" : fillLum < 0.25 ? "#24211F" : "#24211F";
  const detail = fillLum < 0.3 ? "#D8C3A5" : "#24211F";
  const id = `km-${kind}-${tone}-${variant}-${color.replace("#", "")}`;

  const transform =
    variant === 1
      ? "translate(-150 -60) scale(2)"
      : variant === 2
        ? "translate(300 0) scale(-1 1)"
        : undefined;

  return (
    <svg
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={label ?? "Ilustração do produto"}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={t.from} />
          <stop offset="1" stopColor={t.to} />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill={`url(#${id}-bg)`} />
      {variant !== 1 && (
        <>
          <path d="M50 400 L50 140 A100 100 0 0 1 250 140 L250 400 Z" fill={t.arch} opacity={variant === 2 ? 0.4 : 0.85} />
          <circle cx="232" cy="78" r="38" fill="none" stroke="#C6A15B" strokeWidth="0.6" opacity="0.7" />
        </>
      )}
      {variant === 2 &&
        Array.from({ length: 14 }).map((_, i) => (
          <path key={i} d={`M0 ${i * 30} L300 ${i * 30 - 60}`} stroke={t.line} strokeWidth="0.3" opacity="0.15" />
        ))}
      <g transform={transform} stroke={outline} strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.1">
        <Garment kind={kind} fill={fill} detail={detail} />
      </g>
      {variant !== 1 && <ellipse cx="150" cy="372" rx="80" ry="4" fill="#0D0D0D" opacity="0.05" />}
    </svg>
  );
}
