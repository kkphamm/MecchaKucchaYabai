"use client";
import { AnimatedBackground } from "@/components/core/animated-background";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Script } from "@/types/kana";

const SCRIPTS: { id: Script; label: string }[] = [
  { id: "hiragana", label: "Hiragana" },
  { id: "katakana", label: "Katakana" },
];

export function KanaTabs({
  active,
  onChange,
}: {
  active: Script;
  onChange: (script: Script) => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Script"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-1"
    >
      <AnimatedBackground
        defaultValue={active}
        onValueChange={(id) => id && onChange(id as Script)}
        className="rounded-full bg-primary"
        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
      >
        {SCRIPTS.map((script) => (
          <button
            key={script.id}
            data-id={script.id}
            role="tab"
            aria-selected={active === script.id}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              "text-foreground/70 data-[checked=true]:text-primary-foreground"
            )}
          >
            {script.label}
          </button>
        ))}
      </AnimatedBackground>
    </div>
  );
}
