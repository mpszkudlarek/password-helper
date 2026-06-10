import { MAX_LENGTH } from "@/lib/characters";
import { WarningIcon } from "./icons";

export function LimitToast() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center">
      <div
        role="status"
        className="animate-toast-in flex items-center gap-2.5 whitespace-nowrap rounded-full border border-upper/40 bg-surface py-2.5 pl-3.5 pr-5 text-sm text-fg shadow-xl shadow-black/20 backdrop-blur"
      >
        <WarningIcon size={16} className="shrink-0 text-upper" />
        Pasted text was too long - kept the first {MAX_LENGTH} characters.
      </div>
    </div>
  );
}
