"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/core/text-effect";
import { KanjiGrid } from "@/features/kanji/kanji-grid";
import { ReadingLegend } from "@/features/kanji/reading-legend";
import { ResetKanjiProgressDialog } from "@/features/kanji/reset-progress-dialog";
import { eligiblePool } from "@/features/kanji/kanji-quiz-engine";
import type { KanjiCharacter, JlptLevel } from "@/types/kanji";
import type { ProgressMap } from "@/types/kana";

export function KanjiOverview({
  level,
  kanjiList,
  progress,
  onStartQuiz,
  onResetLevel,
}: {
  level: JlptLevel;
  kanjiList: KanjiCharacter[];
  progress: ProgressMap;
  onStartQuiz: () => void;
  onResetLevel: (level: JlptLevel) => void;
}) {
  const [resetOpen, setResetOpen] = useState(false);
  const mastered = kanjiList.filter((k) => (progress[k.id] ?? 0) === 50).length;
  const eligibleCount = eligiblePool(kanjiList, progress).length;
  const allMastered = eligibleCount === 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <h1 className="text-lg font-medium text-foreground">
            {level} Kanji <span className="text-muted-foreground">· {mastered} / {kanjiList.length} mastered</span>
          </h1>
          <ReadingLegend />
        </div>
        {allMastered ? (
          <div className="flex items-center gap-2 text-base font-medium text-state-mastered">
            <Check aria-hidden="true" className="size-5" />
            <TextEffect as="span" per="word" preset="fade" trigger>
              {`All ${level} Kanji Mastered`}
            </TextEffect>
          </div>
        ) : (
          <Button onClick={onStartQuiz} size="lg" className="px-8">
            Start Quiz
          </Button>
        )}
      </div>

      <KanjiGrid kanjiList={kanjiList} progress={progress} />

      <div className="flex justify-center py-4">
        <button
          type="button"
          onClick={() => setResetOpen(true)}
          className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Reset Progress
        </button>
      </div>

      <ResetKanjiProgressDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        level={level}
        count={kanjiList.length}
        onConfirm={() => onResetLevel(level)}
      />
    </div>
  );
}
