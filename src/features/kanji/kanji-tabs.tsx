"use client";
import { cn } from "@/lib/utils";
import type { JlptLevel } from "@/types/kanji";

const LEVELS: JlptLevel[] = ["N5", "N4"];

export function KanjiTabs({
  active,
  onChange,
}: {
  active: JlptLevel;
  onChange: (level: JlptLevel) => void;
}) {
  return (
    <div role="group" aria-label="JLPT Level" className="flex items-center gap-1 text-sm font-medium">
      {LEVELS.map((level, i) => (
        <div key={level} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden="true" className="text-muted-foreground">
              _
            </span>
          )}
          <button
            type="button"
            aria-pressed={active === level}
            onClick={() => onChange(level)}
            className={cn(
              "rounded-sm px-0.5 py-1.5 underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              active === level ? "text-foreground underline" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {level}
          </button>
        </div>
      ))}
    </div>
  );
}
