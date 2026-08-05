"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Calls `onIdle` after `delayMs` without a `reset()`. The countdown is paused
 * while the tab is hidden, so switching to another tab never fires it; it
 * starts over when the user comes back.
 *
 * @returns reset - re-arms the countdown without touching React state
 */
export function useIdleTimer(
  enabled: boolean,
  delayMs: number,
  onIdle: () => void
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callback = useRef(onIdle);

  useEffect(() => {
    callback.current = onIdle;
  }, [onIdle]);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current =
      enabled && !document.hidden
        ? setTimeout(() => callback.current(), delayMs)
        : null;
  }, [enabled, delayMs]);

  useEffect(() => {
    reset();
    // Pausing and resuming are both just "start over from now"
    document.addEventListener("visibilitychange", reset);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      document.removeEventListener("visibilitychange", reset);
    };
  }, [reset]);

  return reset;
}
