"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_LENGTH } from "@/lib/characters";
import { CharacterStrip } from "./character-strip";
import { ClearIcon, EyeIcon } from "./icons";
import { Legend } from "./legend";
import { LimitToast } from "./limit-toast";

const TOAST_DURATION_MS = 4000;

export function PasswordHelper() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleChange = (value: string) => {
    // Count code points (not UTF-16 units) so the limit matches the tiles
    const codePoints = Array.from(value);
    if (codePoints.length > MAX_LENGTH) {
      setPassword(codePoints.slice(0, MAX_LENGTH).join(""));
      setToastVisible(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(
        () => setToastVisible(false),
        TOAST_DURATION_MS
      );
    } else {
      setPassword(value);
    }
  };

  const chars = Array.from(password);
  const atLimit = chars.length >= MAX_LENGTH;

  return (
    <section className="rounded-3xl border border-line bg-surface/70 p-5 shadow-2xl shadow-black/10 backdrop-blur sm:p-7 dark:shadow-black/40">
      {toastVisible && <LimitToast />}

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={password}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter a password…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-1p-ignore
          data-lpignore="true"
          data-bwignore="true"
          aria-label="Password to inspect"
          className="w-full rounded-xl border border-line-strong bg-inset py-3 pl-4 pr-24 font-mono text-lg tracking-widest text-fg shadow-inner shadow-black/5 placeholder:font-sans placeholder:text-base placeholder:tracking-normal placeholder:text-muted/80 outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/15 dark:shadow-black/30"
        />
        <div className="absolute inset-y-0 right-2 flex items-center gap-0.5">
          {password.length > 0 && (
            <button
              type="button"
              onClick={() => setPassword("")}
              aria-label="Clear"
              title="Clear"
              className="rounded-lg p-2 text-muted transition hover:bg-line/60 hover:text-fg"
            >
              <ClearIcon />
            </button>
          )}
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide input" : "Show input"}
            title={visible ? "Hide input" : "Show input"}
            className="rounded-lg p-2 text-muted transition hover:bg-line/60 hover:text-fg"
          >
            <EyeIcon open={visible} />
          </button>
        </div>
      </div>

      <div
        className={`mt-2 text-right font-mono text-xs tabular-nums transition-colors ${
          atLimit ? "text-upper" : "text-muted"
        }`}
      >
        {chars.length} / {MAX_LENGTH}
      </div>

      <CharacterStrip chars={chars} />
      <Legend />
    </section>
  );
}
