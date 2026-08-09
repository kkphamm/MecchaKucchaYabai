"use client";
import { useState } from "react";
import { KanjiLevelSidebar } from "@/features/kanji/kanji-level-sidebar";
import { KanjiOverview } from "@/features/kanji/overview";
import { KanjiQuizView, type KanjiQuizResults as KanjiQuizResultsData } from "@/features/kanji/kanji-quiz-view";
import { KanjiQuizResultsView } from "@/features/kanji/kanji-quiz-results";
import { kanjiForLevel } from "@/data/kanji";
import { useHydrateKanjiProgress, useKanjiProgress, progressForLevel } from "@/hooks/use-kanji-progress";
import type { JlptLevel } from "@/types/kanji";

type Mode = { kind: "overview" } | { kind: "quiz" } | { kind: "results"; results: KanjiQuizResultsData };

export default function KanjiPage() {
  useHydrateKanjiProgress();
  const [activeLevel, setActiveLevel] = useState<JlptLevel>("N5");
  const [mode, setMode] = useState<Mode>({ kind: "overview" });
  const [quizKey, setQuizKey] = useState(0);

  const progress = useKanjiProgress((s) => progressForLevel(s, activeLevel));
  const resetLevel = useKanjiProgress((s) => s.resetLevel);
  const kanjiList = kanjiForLevel(activeLevel);

  function handleLevelChange(level: JlptLevel) {
    setActiveLevel(level);
    setMode({ kind: "overview" });
  }

  return (
    <>
      {mode.kind === "overview" && (
        <div className="flex gap-6 sm:gap-10">
          <KanjiLevelSidebar active={activeLevel} onChange={handleLevelChange} />
          <div className="min-w-0 flex-1">
            <KanjiOverview
              level={activeLevel}
              kanjiList={kanjiList}
              progress={progress}
              onStartQuiz={() => setMode({ kind: "quiz" })}
              onResetLevel={resetLevel}
            />
          </div>
        </div>
      )}
      {mode.kind === "quiz" && (
        <KanjiQuizView
          key={quizKey}
          level={activeLevel}
          kanjiList={kanjiList}
          onExit={() => setMode({ kind: "overview" })}
          onComplete={(results) => setMode({ kind: "results", results })}
        />
      )}
      {mode.kind === "results" && (
        <KanjiQuizResultsView
          correct={mode.results.correct}
          total={mode.results.total}
          newlyMastered={mode.results.newlyMastered}
          onBackToOverview={() => setMode({ kind: "overview" })}
          onStudyAgain={() => {
            setQuizKey((k) => k + 1);
            setMode({ kind: "quiz" });
          }}
        />
      )}
    </>
  );
}
