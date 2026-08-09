import { Check, X } from "lucide-react";
import { GlowEffect } from "@/components/core/glow-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { KanjiCharacter } from "@/types/kanji";

export function KanjiQuizFeedback({
  isCorrect,
  kanji,
  justMastered,
}: {
  isCorrect: boolean;
  kanji: KanjiCharacter;
  justMastered: boolean;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-2 text-base font-medium",
        isCorrect ? "text-state-correct-fg" : "text-state-incorrect-fg"
      )}
    >
      <span className="relative inline-flex items-center gap-2">
        {justMastered && !reducedMotion && (
          <GlowEffect
            mode="pulse"
            colors={["#4ADE80"]}
            blur="medium"
            scale={1.6}
            transition={{ duration: 0.4, repeat: 0 }}
          />
        )}
        {isCorrect ? <Check className="size-4" aria-hidden="true" /> : <X className="size-4" aria-hidden="true" />}
        {isCorrect ? "Correct" : "Incorrect"} — {kanji.kanji} = {kanji.meanings[0]}
      </span>
    </div>
  );
}
