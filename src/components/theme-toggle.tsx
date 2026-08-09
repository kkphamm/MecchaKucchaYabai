"use client";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid rendering a theme-dependent icon before hydration resolves "system".
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reducedMotion = useReducedMotion();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex size-8 items-center justify-center rounded-lg border border-transparent text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.15 }}
          className="flex items-center justify-center"
        >
          {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
