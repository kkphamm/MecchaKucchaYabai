"use client";
import { AnimatedNumber } from "@/components/core/animated-number";
import { Button } from "@/components/ui/button";
import type { KanaCharacter } from "@/types/kana";

export function QuizResults({
  correct,
  total,
  newlyMastered,
  onStudyAgain,
  onBackToOverview,
}: {
  correct: number;
  total: number;
  newlyMastered: KanaCharacter[];
  onStudyAgain: () => void;
  onBackToOverview: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <h2 className="text-xl font-medium text-foreground">Quiz Complete</h2>
      <p className="text-3xl font-medium tabular-nums text-foreground">
        <AnimatedNumber value={correct} /> / {total} correct
      </p>
      {newlyMastered.length > 0 && (
        <p className="font-kana text-lg text-state-mastered">
          Newly mastered: {newlyMastered.map((k) => k.kana).join(" ")}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBackToOverview}>
          Back to Overview
        </Button>
        <Button onClick={onStudyAgain}>Study Again</Button>
      </div>
    </div>
  );
}
