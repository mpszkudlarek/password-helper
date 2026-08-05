"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WarningIcon } from "./icons";

const TOAST_DURATION_MS = 4000;

/** A single self-dismissing message; a new one replaces the pending timer. */
export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Cancel a pending dismissal if the component goes away first
  useEffect(() => clear, [clear]);

  const showToast = useCallback(
    (next: string) => {
      clear();
      setMessage(next);
      timer.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS);
    },
    [clear]
  );

  return { message, showToast };
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4 sm:top-6">
      <div
        role="status"
        className="animate-toast-in flex items-center gap-2.5 rounded-full border border-upper/40 bg-surface py-2.5 pl-3.5 pr-5 text-sm text-fg shadow-xl shadow-black/20 backdrop-blur"
      >
        <WarningIcon size={16} className="shrink-0 text-upper" />
        {message}
      </div>
    </div>
  );
}
