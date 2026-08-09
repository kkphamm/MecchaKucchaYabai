"use client";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { KanjiTabs } from "@/features/kanji/kanji-tabs";
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
    <AppShell tabs={<KanjiTabs active={activeLevel} onChange={handleLevelChange} />}>
      {mode.kind === "overview" && (
        <KanjiOverview
          level={activeLevel}
          kanjiList={kanjiList}
          progress={progress}
          onStartQuiz={() => setMode({ kind: "quiz" })}
          onResetLevel={resetLevel}
        />
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
    </AppShell>
  );
}
