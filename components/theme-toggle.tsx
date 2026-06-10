"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = !document.documentElement.classList.contains("dark");
    const apply = () => {
      document.documentElement.classList.toggle("dark", next);
      flushSync(() => setDark(next));
    };

    if (!document.startViewTransition) {
      // Fallback: smooth color cross-fade
      const root = document.documentElement;
      root.classList.add("theme-transition");
      apply();
      window.setTimeout(() => root.classList.remove("theme-transition"), 400);
      return;
    }

    // Circular reveal expanding from the toggle button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        const radius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 550,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {
        // Transition was skipped (e.g. reduced motion); theme is applied anyway
      });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light/dark mode"
      title="Toggle light/dark mode"
      className="fixed right-4 top-4 z-50 rounded-full border border-line bg-surface/80 p-2.5 text-muted backdrop-blur transition hover:text-fg"
    >
      {(dark ?? true) ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
