export const MAX_LENGTH = 15;

export type CharType = "digit" | "uppercase" | "lowercase" | "symbol";

export interface CharStyle {
  tile: string;
  glow: string;
  dot: string;
  label: string;
}

export const CHAR_STYLES: Record<CharType, CharStyle> = {
  digit: {
    tile: "border-digit/40 bg-gradient-to-b from-digit/25 to-digit/10 text-digit",
    glow: "var(--digit)",
    dot: "bg-digit",
    label: "Digit",
  },
  uppercase: {
    tile: "border-upper/40 bg-gradient-to-b from-upper/25 to-upper/10 text-upper",
    glow: "var(--upper)",
    dot: "bg-upper",
    label: "Uppercase",
  },
  lowercase: {
    tile: "border-lower/40 bg-gradient-to-b from-lower/20 to-lower/5 text-lower",
    glow: "var(--lower)",
    dot: "bg-lower",
    label: "Lowercase",
  },
  symbol: {
    tile: "border-symbol/40 bg-gradient-to-b from-symbol/25 to-symbol/10 text-symbol",
    glow: "var(--symbol)",
    dot: "bg-symbol",
    label: "Symbol",
  },
};

export function classifyChar(char: string): CharType {
  if (/\d/.test(char)) return "digit";
  if (/\p{Lu}/u.test(char)) return "uppercase";
  if (/\p{Ll}/u.test(char)) return "lowercase";
  return "symbol";
}
