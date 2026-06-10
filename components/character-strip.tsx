import type { CSSProperties } from "react";
import { CHAR_STYLES, classifyChar, MAX_LENGTH } from "@/lib/characters";

export function CharacterStrip({ chars }: { chars: string[] }) {
  return (
    <div className="no-scrollbar mt-4 overflow-x-auto px-0.5 pb-1 pt-2">
      <ol
        className="flex min-w-[560px] gap-1.5"
        aria-label="Password characters by position"
      >
        {Array.from({ length: MAX_LENGTH }, (_, i) => {
          const char = chars[i];
          const filled = char !== undefined;
          const style = filled ? CHAR_STYLES[classifyChar(char)] : null;

          return (
            <li key={i} className="flex flex-1 flex-col items-center gap-1.5">
              {style ? (
                <span
                  key={`${i}-${char}`}
                  style={{ "--glow": style.glow } as CSSProperties}
                  className={`keycap animate-tile-pop flex aspect-square w-full items-center justify-center rounded-lg border font-mono text-lg leading-none sm:text-xl ${style.tile}`}
                >
                  {char === " " ? "␣" : char}
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-line bg-inset/50 font-mono text-base leading-none text-faint"
                >
                  ·
                </span>
              )}
              <span
                className={`font-mono text-[10px] leading-none tabular-nums transition-colors ${
                  filled ? "text-fg/80" : "text-faint"
                }`}
              >
                {i + 1}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
