"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import {
  AMBIGUOUS_NAMES,
  CHAR_STYLES,
  classifyChar,
  MAX_LENGTH,
} from "@/lib/characters";

/** Empty grid shows this many full rows before anything is typed. */
const MIN_ROWS = 2;

/** Used for SSR and the first paint, before columns are measured. */
const FALLBACK_COLUMNS = 16;

const TILE_CLASS =
  "keycap animate-tile-pop flex aspect-square w-full items-center justify-center rounded-lg border font-mono text-lg leading-none sm:text-xl";

interface CharacterStripProps {
  chars: string[];
  visible: boolean;
  revealed: ReadonlySet<number>;
  onToggleReveal: (index: number) => void;
}

/** Number of columns the auto-fill grid resolved to at the current width. */
function useColumnCount<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [columns, setColumns] = useState(FALLBACK_COLUMNS);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      // A laid-out grid reports one used pixel value per column; anything else
      // (e.g. the specified value while the strip is hidden) is not measurable.
      const tracks = getComputedStyle(el).gridTemplateColumns.split(" ");
      if (tracks.every((track) => track.endsWith("px"))) {
        setColumns(tracks.length);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return columns;
}

export function CharacterStrip({
  chars,
  visible,
  revealed,
  onToggleReveal,
}: CharacterStripProps) {
  const gridRef = useRef<HTMLOListElement>(null);
  const columns = useColumnCount(gridRef);

  const slotCount = Math.min(
    MAX_LENGTH,
    Math.max(columns * MIN_ROWS, Math.ceil(chars.length / columns) * columns)
  );

  return (
    <div className="mt-4 px-0.5 pb-1 pt-2">
      <ol
        ref={gridRef}
        className="grid gap-1.5 [--tile:2.25rem] [grid-template-columns:repeat(auto-fill,minmax(var(--tile),1fr))] sm:[--tile:2rem]"
        aria-label="Password characters by position"
      >
        {Array.from({ length: slotCount }, (_, i) => {
          const char = chars[i];
          const filled = char !== undefined;
          const style = filled ? CHAR_STYLES[classifyChar(char)] : null;
          const masked = filled && !visible && !revealed.has(i);
          const shown = filled && !masked;
          const name = shown ? AMBIGUOUS_NAMES[char] : undefined;

          const display = masked ? "•" : char === " " ? "␣" : char;
          // Changing this key remounts the tile, which replays tile-pop
          const tileKey = `${char}-${masked}`;
          // Every fifth position is emphasised so long passwords stay countable
          const milestone = (i + 1) % 5 === 0;
          const ariaLabel = masked
            ? `Position ${i + 1}: hidden, click to reveal`
            : filled && style
              ? `Position ${i + 1}: ${style.label} ${name ?? char}`
              : undefined;

          return (
            <li
              key={i}
              className="flex flex-col items-center gap-1"
              aria-hidden={!filled || undefined}
            >
              {filled && style ? (
                !visible ? (
                  <button
                    type="button"
                    key={tileKey}
                    onClick={() => onToggleReveal(i)}
                    aria-pressed={!masked}
                    aria-label={ariaLabel}
                    title={name}
                    className={`${TILE_CLASS} cursor-pointer transition hover:brightness-110 ${style.tile}`}
                  >
                    {display}
                  </button>
                ) : (
                  <span
                    key={tileKey}
                    role="img"
                    aria-label={ariaLabel}
                    title={name}
                    className={`${TILE_CLASS} ${style.tile}`}
                  >
                    {display}
                  </span>
                )
              ) : (
                <span
                  aria-hidden="true"
                  className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-line bg-inset/50 font-mono text-base leading-none text-faint"
                >
                  ·
                </span>
              )}
              <span
                aria-hidden="true"
                className={`font-mono text-[10px] leading-none tabular-nums transition-colors ${
                  filled ? "text-fg/80" : "text-faint"
                } ${milestone ? "font-semibold" : ""}`}
              >
                {i + 1}
              </span>
              {/* Too narrow to read on phones; the name stays in title/aria-label */}
              <span
                aria-hidden="true"
                className="hidden h-2.5 w-full truncate text-center text-[9px] leading-none text-muted sm:block"
              >
                {name ?? ""}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
