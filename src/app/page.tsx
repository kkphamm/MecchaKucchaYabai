"use client";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { KanaTabs } from "@/features/kana/kana-tabs";
import { Overview } from "@/features/kana/overview";
import { QuizView, type QuizResults as QuizResultsData } from "@/features/quiz/quiz-view";
import { QuizResults } from "@/features/quiz/quiz-results";
import { kanaForScript } from "@/data/kana";
import { useHydrateKanaProgress, useKanaProgress } from "@/hooks/use-kana-progress";
import type { Script } from "@/types/kana";

type Mode = { kind: "overview" } | { kind: "quiz" } | { kind: "results"; results: QuizResultsData };

export default function Home() {
  useHydrateKanaProgress();
  const [activeScript, setActiveScript] = useState<Script>("hiragana");
  const [mode, setMode] = useState<Mode>({ kind: "overview" });
  const [quizKey, setQuizKey] = useState(0);

  const progress = useKanaProgress((s) => s[activeScript]);
  const resetScript = useKanaProgress((s) => s.resetScript);
  const kanaList = kanaForScript(activeScript);

  function handleScriptChange(script: Script) {
    setActiveScript(script);
    setMode({ kind: "overview" });
  }

  return (
    <AppShell tabs={<KanaTabs active={activeScript} onChange={handleScriptChange} />}>
      {mode.kind === "overview" && (
        <Overview
          script={activeScript}
          kanaList={kanaList}
          progress={progress}
          onStartQuiz={() => setMode({ kind: "quiz" })}
          onResetScript={resetScript}
        />
      )}
      {mode.kind === "quiz" && (
        <QuizView
          key={quizKey}
          script={activeScript}
          kanaList={kanaList}
          onExit={() => setMode({ kind: "overview" })}
          onComplete={(results) => setMode({ kind: "results", results })}
        />
      )}
      {mode.kind === "results" && (
        <QuizResults
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
