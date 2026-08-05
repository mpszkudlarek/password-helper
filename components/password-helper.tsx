"use client";

import { useMemo, useReducer } from "react";
import {
  MAX_LENGTH,
  sanitizeGraphemes,
  segmentGraphemes,
} from "@/lib/characters";
import {
  initialPasswordState,
  type PasswordAction,
  passwordReducer,
} from "@/lib/password-state";
import { useIdleTimer } from "@/lib/use-idle-timer";
import { CharacterStrip } from "./character-strip";
import { ClearIcon, EyeIcon } from "./icons";
import { Legend } from "./legend";
import { Toast, useToast } from "./toast";

const AUTO_CLEAR_MS = 120_000;

export function PasswordHelper() {
  const [state, rawDispatch] = useReducer(
    passwordReducer,
    initialPasswordState
  );
  const { message, showToast } = useToast();

  const resetIdle = useIdleTimer(state.password !== "", AUTO_CLEAR_MS, () => {
    rawDispatch({ type: "clear" });
    showToast("Password cleared after inactivity.");
  });

  // Wrapping dispatch makes "any interaction restarts the countdown" true by
  // construction, instead of a call every handler has to remember.
  const dispatch = (action: PasswordAction) => {
    resetIdle();
    rawDispatch(action);
  };

  const handleChange = (value: string) => {
    const { graphemes, removed } = sanitizeGraphemes(segmentGraphemes(value));
    const truncated = graphemes.length > MAX_LENGTH;
    const kept = truncated ? graphemes.slice(0, MAX_LENGTH) : graphemes;

    dispatch({ type: "set", password: kept.join("") });

    const messages: string[] = [];
    if (removed > 0) {
      messages.push(
        `Removed ${removed} invisible character${removed === 1 ? "" : "s"}.`
      );
    }
    if (truncated) {
      messages.push(`Kept the first ${MAX_LENGTH} characters.`);
    }
    if (messages.length > 0) showToast(messages.join(" "));
  };

  const chars = useMemo(
    () => segmentGraphemes(state.password),
    [state.password]
  );
  const atLimit = chars.length >= MAX_LENGTH;

  return (
    <section className="rounded-3xl border border-line bg-surface/70 p-5 shadow-2xl shadow-black/10 backdrop-blur sm:p-7 dark:shadow-black/40">
      {message && <Toast message={message} />}

      <div className="relative">
        <input
          type={state.visible ? "text" : "password"}
          value={state.password}
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
          {state.password.length > 0 && (
            <button
              type="button"
              onClick={() => dispatch({ type: "clear" })}
              aria-label="Clear"
              title="Clear"
              className="rounded-lg p-2 text-muted transition hover:bg-line/60 hover:text-fg"
            >
              <ClearIcon />
            </button>
          )}
          <button
            type="button"
            onClick={() => dispatch({ type: "toggleVisibility" })}
            aria-label={state.visible ? "Hide characters" : "Show characters"}
            title={state.visible ? "Hide characters" : "Show characters"}
            className="rounded-lg p-2 text-muted transition hover:bg-line/60 hover:text-fg"
          >
            <EyeIcon open={state.visible} />
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

      <CharacterStrip
        chars={chars}
        visible={state.visible}
        revealed={state.revealed}
        onToggleReveal={(index) => dispatch({ type: "toggleReveal", index })}
      />
      <Legend />
    </section>
  );
}
