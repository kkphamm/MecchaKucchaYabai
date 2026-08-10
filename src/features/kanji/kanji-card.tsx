"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { KanaProgressBar } from "@/features/kana/kana-progress-bar";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { MASTERY_THRESHOLD } from "@/types/kana";
import type { KanjiCharacter } from "@/types/kanji";

export function KanjiCard({
  kanji,
  correctCount,
}: {
  kanji: KanjiCharacter;
  correctCount: number;
}) {
  const [showReadings, setShowReadings] = useState(false);
  const reducedMotion = useReducedMotion();
  const readingsId = useId();
  const mastered = correctCount === MASTERY_THRESHOLD;
  const percentage = Math.round((correctCount / MASTERY_THRESHOLD) * 100);
  const hasReadings = kanji.onyomi.length > 0 || kanji.kunyomi.length > 0;

  return (
    <div
      tabIndex={0}
      aria-label={`${kanji.kanji}, ${kanji.meanings[0]}, ${percentage}% mastered${mastered ? ", mastered" : ""}`}
      aria-describedby={hasReadings ? readingsId : undefined}
      onMouseEnter={() => setShowReadings(true)}
      onMouseLeave={() => setShowReadings(false)}
      onFocus={() => setShowReadings(true)}
      onBlur={() => setShowReadings(false)}
      className="relative flex flex-col items-center gap-2 rounded-[12px] border border-border bg-card p-3 transition-transform duration-150 ease-out hover:-translate-y-1 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <AnimatePresence>
        {hasReadings && showReadings && (
          <motion.div
            id={readingsId}
            role="tooltip"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 w-max max-w-[160px] -translate-x-1/2 rounded-[8px] border border-border bg-popover px-2.5 py-1.5 text-center text-[11px] leading-tight text-popover-foreground shadow-sm"
          >
            {kanji.onyomi.length > 0 && (
              <div>
                <span className="text-muted-foreground">On </span>
                {kanji.onyomi.join("・")}
              </div>
            )}
            {kanji.kunyomi.length > 0 && (
              <div>
                <span className="text-muted-foreground">Kun </span>
                {kanji.kunyomi.join("・")}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative flex h-10 w-full items-center justify-center">
        <span className="font-kana text-[32px] leading-none text-foreground">{kanji.kanji}</span>
        {mastered && (
          <Check
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 size-3.5 text-state-mastered"
          />
        )}
      </div>
      <span className="truncate text-[13px] leading-none text-muted-foreground">{kanji.meanings[0]}</span>
      <KanaProgressBar correctCount={correctCount} mastered={mastered} />
    </div>
  );
}
