"use client";
import { cn } from "@/lib/utils";
import type { JlptLevel } from "@/types/kanji";

const LEVELS: { id: JlptLevel | "N3" | "N2" | "N1"; enabled: boolean }[] = [
  { id: "N5", enabled: true },
  { id: "N4", enabled: true },
  { id: "N3", enabled: false },
  { id: "N2", enabled: false },
  { id: "N1", enabled: false },
];

export function KanjiLevelSidebar({
  active,
  onChange,
}: {
  active: JlptLevel;
  onChange: (level: JlptLevel) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 pt-1 text-xl font-medium">
      {LEVELS.map((level, i) => (
        <div key={level.id} className="flex flex-col items-center gap-2">
          {i > 0 && <span aria-hidden="true" className="h-px w-4 bg-border" />}
          <button
            type="button"
            disabled={!level.enabled}
            title={level.enabled ? undefined : "In development"}
            aria-pressed={level.enabled ? active === level.id : undefined}
            onClick={() => level.enabled && onChange(level.id as JlptLevel)}
            className={cn(
              "px-1 py-0.5 underline-offset-4 transition-colors",
              level.enabled
                ? cn(
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    active === level.id ? "text-foreground underline" : "text-muted-foreground hover:text-foreground"
                  )
                : "cursor-not-allowed text-muted-foreground/30"
            )}
          >
            {level.id}
          </button>
        </div>
      ))}
    </div>
  );
}
