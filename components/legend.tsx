import { CHAR_STYLES, type CharType } from "@/lib/characters";

export function Legend() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-line pt-5">
      {(Object.keys(CHAR_STYLES) as CharType[]).map((type) => (
        <span
          key={type}
          className="flex items-center gap-2 rounded-full border border-line bg-inset/70 px-3 py-1.5 text-xs font-medium text-fg"
        >
          <span className={`h-2 w-2 rounded-full ${CHAR_STYLES[type].dot}`} />
          {CHAR_STYLES[type].label}
        </span>
      ))}
    </div>
  );
}
