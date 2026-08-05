export const MAX_LENGTH = 64;

/** Declaration order drives the legend. */
export const CHAR_TYPES = [
  "digit",
  "uppercase",
  "lowercase",
  "symbol",
] as const;

export type CharType = (typeof CHAR_TYPES)[number];

export interface CharStyle {
  tile: string;
  dot: string;
  label: string;
}

export const CHAR_STYLES: Record<CharType, CharStyle> = {
  digit: {
    tile: "border-digit/40 bg-gradient-to-b from-digit/25 to-digit/10 text-digit [--glow:var(--digit)]",
    dot: "bg-digit",
    label: "Digit",
  },
  uppercase: {
    tile: "border-upper/40 bg-gradient-to-b from-upper/25 to-upper/10 text-upper [--glow:var(--upper)]",
    dot: "bg-upper",
    label: "Uppercase",
  },
  lowercase: {
    tile: "border-lower/40 bg-gradient-to-b from-lower/20 to-lower/5 text-lower [--glow:var(--lower)]",
    dot: "bg-lower",
    label: "Lowercase",
  },
  symbol: {
    tile: "border-symbol/40 bg-gradient-to-b from-symbol/25 to-symbol/10 text-symbol [--glow:var(--symbol)]",
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

const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

/** Split into user-perceived characters (grapheme clusters), so composed
 * emoji and combining marks count as a single tile. */
export function segmentGraphemes(value: string): string[] {
  if (!segmenter) return Array.from(value);
  return Array.from(segmenter.segment(value), (s) => s.segment);
}

// Graphemes made only of control characters (incl. \r \n \t) or invisible
// formatting characters (zero-width space, BOM, bidi marks) would render as
// blank tiles or visually reorder characters, breaking position numbering.
// ZWJ inside emoji clusters is safe: those graphemes also contain visible
// characters, so they don't match this "invisible-only" test.
const INVISIBLE_ONLY =
  /^[\p{Cc}\u200B\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF]+$/u;

export function sanitizeGraphemes(graphemes: string[]): {
  graphemes: string[];
  removed: number;
} {
  const kept = graphemes.filter((g) => !INVISIBLE_ONLY.test(g));
  return { graphemes: kept, removed: graphemes.length - kept.length };
}

/** Spoken names for characters that are easy to misread on a tile. */
export const AMBIGUOUS_NAMES: Record<string, string> = {
  "0": "zero",
  O: "capital O",
  o: "small o",
  "1": "one",
  l: "small L",
  I: "capital I",
  "|": "vertical bar",
  "`": "backtick",
  "'": "apostrophe",
  '"': "quote",
  ",": "comma",
  ".": "period",
  ";": "semicolon",
  ":": "colon",
  "-": "hyphen",
  _: "underscore",
  "5": "five",
  S: "capital S",
  s: "small s",
  "8": "eight",
  B: "capital B",
  "2": "two",
  Z: "capital Z",
  z: "small z",
  " ": "space",
};
