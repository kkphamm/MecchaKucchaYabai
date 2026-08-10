"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/core/text-effect";
import { KanaGrid } from "@/features/kana/kana-grid";
import { ResetProgressDialog } from "@/features/kana/reset-progress-dialog";
import { eligiblePool } from "@/features/quiz/quiz-engine";
import { MASTERY_THRESHOLD, type KanaCharacter, type ProgressMap, type Script } from "@/types/kana";

const SCRIPT_LABEL: Record<Script, string> = {
  hiragana: "Hiragana",
  katakana: "Katakana",
};

export function Overview({
  script,
  kanaList,
  progress,
  onStartQuiz,
  onResetScript,
}: {
  script: Script;
  kanaList: KanaCharacter[];
  progress: ProgressMap;
  onStartQuiz: () => void;
  onResetScript: (script: Script) => void;
}) {
  const [resetOpen, setResetOpen] = useState(false);
  const label = SCRIPT_LABEL[script];
  const mastered = kanaList.filter((k) => (progress[k.id] ?? 0) === MASTERY_THRESHOLD).length;
  const eligibleCount = eligiblePool(kanaList, progress).length;
  const allMastered = eligibleCount === 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-medium text-foreground">
          {label} <span className="text-muted-foreground">· {mastered} / {kanaList.length} mastered</span>
        </h1>
        {allMastered ? (
          <div className="flex items-center gap-2 text-base font-medium text-state-mastered">
            <Check aria-hidden="true" className="size-5" />
            <TextEffect as="span" per="word" preset="fade" trigger>
              {`All ${label} Mastered`}
            </TextEffect>
          </div>
        ) : (
          <Button onClick={onStartQuiz} size="lg" className="px-8">
            Start Quiz
          </Button>
        )}
      </div>

      <KanaGrid kanaList={kanaList} progress={progress} />

      <div className="flex justify-center py-4">
        <button
          type="button"
          onClick={() => setResetOpen(true)}
          className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Reset Progress
        </button>
      </div>

      <ResetProgressDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        script={script}
        count={kanaList.length}
        onConfirm={() => onResetScript(script)}
      />
    </div>
  );
}
