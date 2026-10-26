import { useId } from "react";
import type { ArtKind } from "../types";

const INK = "#5A3E44";

function shape(kind: ArtKind, c: string) {
  const s = { fill: c, stroke: INK, strokeWidth: 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const line = { fill: "none", stroke: INK, strokeWidth: 1.3, strokeLinecap: "round" as const, opacity: 0.55 };
  switch (kind) {
    case "dress":
      return <g>
        <path {...s} d="M84 52 L88 34 M116 52 L112 34" fill="none" />
        <path {...s} d="M84 52 Q100 62 116 52 L120 104 Q150 170 158 214 Q100 226 42 214 Q50 170 80 104 Z" />
        <path {...line} d="M82 104 Q100 112 118 104 M92 120 Q84 170 78 214 M108 120 Q118 170 124 214" />
      </g>;
    case "blouse":
      return <g>
        <path {...s} d="M78 62 Q100 74 122 62 L134 72 Q168 66 172 102 Q166 126 148 120 L142 106 L144 196 Q100 204 56 196 L58 106 L52 120 Q34 126 28 102 Q32 66 66 72 Z" />
        <path {...line} d="M86 70 L86 96 L114 96 L114 70 M100 100 L100 190" />
        <circle cx="100" cy="120" r="2.4" fill={INK} opacity=".5" /><circle cx="100" cy="146" r="2.4" fill={INK} opacity=".5" /><circle cx="100" cy="172" r="2.4" fill={INK} opacity=".5" />
      </g>;
    case "skirt":
      return <g>
        <path {...s} d="M68 52 L132 52 L136 70 Q160 150 166 214 Q100 226 34 214 Q40 150 64 70 Z" />
        <path {...line} d="M64 70 L136 70 M82 74 Q74 150 66 216 M100 74 L100 220 M118 74 Q126 150 134 216" />
      </g>;
    case "coat":
      return <g>
        <path {...s} d="M76 40 Q100 48 124 40 L150 56 Q160 120 162 222 L38 222 Q40 120 50 56 Z" />
        <path {...s} d="M76 40 L100 120 L124 40 L112 40 L100 92 L88 40 Z" fill="#fff" fillOpacity=".25" />
        <path {...line} d="M100 120 L100 222 M50 56 L36 170 M150 56 L164 170 M64 160 L84 160 M116 160 L136 160" />
        <circle cx="90" cy="134" r="3" fill={INK} opacity=".55" /><circle cx="110" cy="134" r="3" fill={INK} opacity=".55" />
        <circle cx="90" cy="164" r="3" fill={INK} opacity=".55" /><circle cx="110" cy="164" r="3" fill={INK} opacity=".55" />
      </g>;
    case "heels":
      return <g>
        <path {...s} d="M30 170 Q40 152 64 150 Q96 148 116 130 Q132 112 146 104 L160 104 Q170 108 168 124 L164 196 L156 196 L152 140 Q136 150 120 166 Q100 186 66 186 L36 186 Q26 182 30 170 Z" />
        <path {...line} d="M146 104 Q134 92 128 106 M60 162 Q84 162 104 150" />
      </g>;
    case "flats":
      return <g>
        <path {...s} d="M22 172 Q30 150 70 146 Q110 142 140 136 Q168 132 176 152 Q180 172 162 178 L60 182 Q30 184 22 172 Z" />
        <path {...line} d="M70 150 Q100 166 140 140 M30 176 L170 174" />
        <path {...s} d="M96 150 q6 -8 12 0 q-6 8 -12 0" fill="#fff" fillOpacity=".5" />
      </g>;
    case "boots":
      return <g>
        <path {...s} d="M86 56 L140 56 L144 150 Q150 170 176 176 Q186 182 180 196 L56 196 L56 176 Q72 170 80 150 Z" />
        <path {...s} d="M140 196 L148 214 L166 214 L168 196" />
        <path {...line} d="M128 62 L130 150 M80 150 Q110 150 144 150" />
      </g>;
    case "tote":
      return <g>
        <path {...s} d="M70 96 Q70 50 100 50 Q130 50 130 96" fill="none" strokeWidth={4} />
        <path {...s} d="M44 92 L156 92 L168 212 L32 212 Z" />
        <path {...line} d="M48 116 L152 116 M46 140 L154 140 M42 164 L158 164 M38 188 L162 188 M70 92 L62 212 M100 92 L100 212 M130 92 L138 212" />
      </g>;
    case "handbag":
      return <g>
        <path {...s} d="M70 110 Q70 62 100 62 Q130 62 130 110" fill="none" strokeWidth={5} />
        <path {...s} d="M40 116 L160 116 Q166 196 100 200 Q34 196 40 116 Z" />
        <path {...line} d="M44 132 Q100 150 156 132" />
        <rect x="94" y="136" width="12" height="9" rx="2" fill="#D4B47C" stroke={INK} strokeWidth="1.2" />
      </g>;
    case "clutch":
      return <g>
        <rect {...s} x="30" y="100" width="140" height="84" rx="14" />
        <path {...line} d="M30 128 Q100 150 170 128" />
        <circle cx="94" cy="96" r="7" fill="#FBF6EE" stroke={INK} strokeWidth="1.4" /><circle cx="106" cy="96" r="7" fill="#FBF6EE" stroke={INK} strokeWidth="1.4" />
      </g>;
    case "earrings":
      return <g>
        {[70, 130].map((x) => <g key={x}>
          <circle cx={x} cy="96" r="20" fill="none" stroke={c} strokeWidth="5" />
          <circle cx={x} cy="96" r="20" fill="none" stroke={INK} strokeWidth="1" opacity=".5" />
          <line x1={x} y1="116" x2={x} y2="138" stroke={INK} strokeWidth="1.4" />
          <ellipse cx={x} cy="156" rx="15" ry="18" fill="#FBF6EE" stroke={INK} strokeWidth="1.4" />
          <ellipse cx={x - 5} cy="150" rx="4" ry="5" fill="#fff" />
        </g>)}
      </g>;
    case "necklace":
      return <g>
        <path d="M42 50 Q100 160 158 50" fill="none" stroke={c} strokeWidth="3.5" />
        <path d="M34 50 Q100 210 166 50" fill="none" stroke={c} strokeWidth="3.5" />
        <path d="M34 50 Q100 210 166 50" fill="none" stroke={INK} strokeWidth=".8" opacity=".5" />
        <path {...s} d="M100 150 l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1 Z" />
      </g>;
    case "ring":
      return <g>
        <ellipse cx="72" cy="140" rx="34" ry="34" fill="none" stroke={c} strokeWidth="7" />
        <ellipse cx="128" cy="140" rx="34" ry="34" fill="none" stroke={c} strokeWidth="7" strokeDasharray="6 3" />
        <ellipse cx="100" cy="110" rx="34" ry="34" fill="none" stroke={c} strokeWidth="5" />
        <path {...s} fill="#fff" d="M100 68 l9 8 -9 10 -9 -10 Z" />
      </g>;
    case "bracelet":
      return <g>
        <ellipse cx="100" cy="130" rx="66" ry="40" fill="none" stroke={c} strokeWidth="12" />
        <ellipse cx="100" cy="130" rx="66" ry="40" fill="none" stroke={INK} strokeWidth="1" strokeDasharray="3 5" opacity=".6" />
      </g>;
    case "scarf":
      return <g>
        <path {...s} d="M100 34 L176 120 L100 206 L24 120 Z" />
        <path d="M100 58 L154 120 L100 182 L46 120 Z" fill="none" stroke="#fff" strokeWidth="2" opacity=".8" />
        {[[100, 120], [80, 100], [120, 100], [80, 140], [120, 140]].map(([x, y], i) => <g key={i}>
          <circle cx={x} cy={y} r="6" fill="#fff" opacity=".85" /><circle cx={x} cy={y} r="2.5" fill={INK} opacity=".5" />
        </g>)}
      </g>;
    case "hat":
      return <g>
        <ellipse {...s} cx="100" cy="150" rx="86" ry="30" />
        <path {...s} d="M58 148 Q56 84 100 84 Q144 84 142 148 Q100 162 58 148 Z" />
        <path d="M59 134 Q100 148 141 134 L142 146 Q100 160 58 146 Z" fill="#3B2A2F" opacity=".75" />
        <path {...line} d="M30 150 Q100 170 170 150" />
      </g>;
    case "sunglasses":
      return <g>
        <path {...s} d="M24 112 Q40 96 82 104 Q90 136 66 146 Q34 150 28 128 Z" />
        <path {...s} d="M176 112 Q160 96 118 104 Q110 136 134 146 Q166 150 172 128 Z" />
        <path d="M82 110 Q100 100 118 110" fill="none" stroke={INK} strokeWidth="2.5" />
        <path d="M40 118 Q50 110 64 114" fill="none" stroke="#fff" strokeWidth="3" opacity=".6" strokeLinecap="round" />
        <path d="M136 114 Q150 110 160 118" fill="none" stroke="#fff" strokeWidth="3" opacity=".6" strokeLinecap="round" />
      </g>;
  }
}

function tint(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (v: number) => Math.round(v + (255 - v) * amt);
  return `rgb(${mix(n >> 16)},${mix((n >> 8) & 255)},${mix(n & 255)})`;
}

export function Art({ kind, color, bg, className }: { kind: ArtKind; color: string; bg?: [string, string]; className?: string }) {
  const id = useId().replace(/:/g, "");
  const [a, b] = bg ?? [tint(color, 0.82), tint(color, 0.62)];
  return (
    <svg className={className} viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill={`url(#${id})`} />
      <circle cx="160" cy="40" r="60" fill="#fff" opacity=".18" />
      <ellipse cx="100" cy="228" rx="70" ry="6" fill={INK} opacity=".07" />
      <g transform="translate(0 6)">{shape(kind, color)}</g>
    </svg>
  );
}

export function ProductImage({ p, index = 0, colorHex, className }: {
  p: { images: string[]; kind: ArtKind; colors: { hex: string }[] }; index?: number; colorHex?: string; className?: string;
}) {
  const src = p.images[index];
  if (src) return <img className={className} src={src} alt="" loading="lazy" />;
  const color = colorHex ?? p.colors[index % Math.max(1, p.colors.length)]?.hex ?? "#E9C4BE";
  return <Art className={className} kind={p.kind} color={color} />;
}
