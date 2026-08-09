"use client";
import { AnimatedBackground } from "@/components/core/animated-background";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { JlptLevel } from "@/types/kanji";

const LEVELS: { id: JlptLevel; label: string }[] = [
  { id: "N5", label: "N5" },
  { id: "N4", label: "N4" },
];

export function KanjiTabs({
  active,
  onChange,
}: {
  active: JlptLevel;
  onChange: (level: JlptLevel) => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="JLPT Level"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-1"
    >
      <AnimatedBackground
        defaultValue={active}
        onValueChange={(id) => id && onChange(id as JlptLevel)}
        className="rounded-full bg-primary"
        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
      >
        {LEVELS.map((level) => (
          <button
            key={level.id}
            data-id={level.id}
            role="tab"
            aria-selected={active === level.id}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              "text-foreground/70 data-[checked=true]:text-primary-foreground"
            )}
          >
            {level.label}
          </button>
        ))}
      </AnimatedBackground>
    </div>
  );
}
