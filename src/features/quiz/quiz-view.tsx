"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { TransitionPanel } from "@/components/core/transition-panel";
import { useKanaProgress } from "@/hooks/use-kana-progress";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { QuizHeader } from "@/features/quiz/quiz-header";
import { QuizPrompt } from "@/features/quiz/quiz-prompt";
import { AnswerGrid } from "@/features/quiz/answer-grid";
import { QuizFeedback } from "@/features/quiz/quiz-feedback";
import { buildQuiz, computeResults, submitAnswer } from "@/features/quiz/quiz-engine";
import { MASTERY_THRESHOLD, type KanaCharacter, type ProgressMap, type QuizAnswerRecord, type Script } from "@/types/kana";

export interface QuizResults {
  correct: number;
  total: number;
  newlyMastered: KanaCharacter[];
}

export function QuizView({
  script,
  kanaList,
  onExit,
  onComplete,
}: {
  script: Script;
  kanaList: KanaCharacter[];
  onExit: () => void;
  onComplete: (results: QuizResults) => void;
}) {
  const progress = useKanaProgress((s) => s[script]);
  const markCorrect = useKanaProgress((s) => s.markCorrect);
  const reducedMotion = useReducedMotion();

  // Fixed at quiz start (Section 15) — never recomputed as progress changes mid-quiz.
  const [startProgress] = useState<ProgressMap>(() => ({ ...progress }));
  const [questions] = useState(() => buildQuiz(kanaList, progress));
  const lookup = useMemo(() => new Map(kanaList.map((k) => [k.id, k])), [kanaList]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [justMastered, setJustMastered] = useState(false);

  const question = questions[currentIndex];
  const answered = selectedId !== null;
  const options = question.optionIds.map((id) => lookup.get(id)!);

  function handleSelect(optionId: string) {
    if (answered) return;
    const correct = submitAnswer(question, optionId);
    setSelectedId(optionId);
    setAnswers((prev) => [...prev, { kanaId: question.kanaId, isCorrect: correct }]);
    if (correct) {
      const before = progress[question.kanaId] ?? 0;
      markCorrect(script, question.kanaId);
      if (before === MASTERY_THRESHOLD - 1) setJustMastered(true);
    }
  }

  function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedId(null);
      setJustMastered(false);
      return;
    }
    const finalProgress = useKanaProgress.getState()[script];
    const results = computeResults(answers, startProgress, finalProgress, lookup);
    onComplete(results);
  }

  return (
    <div className="flex flex-col gap-10">
      <QuizHeader current={currentIndex + 1} total={questions.length} onExit={onExit} />
      <TransitionPanel
        activeIndex={currentIndex}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.22, ease: "easeInOut" }}
        variants={{
          enter: { opacity: 0, y: reducedMotion ? 0 : 8 },
          center: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: reducedMotion ? 0 : -8 },
        }}
      >
        {questions.map((q, i) =>
          i === currentIndex ? (
            <div key={i} className="flex flex-col items-center gap-8">
              <QuizPrompt kana={lookup.get(q.kanaId)!} direction={q.direction} />
              <AnswerGrid
                options={options}
                correctId={q.correctId}
                direction={q.direction}
                selectedId={selectedId}
                answered={answered}
                onSelect={handleSelect}
              />
              {answered && (
                <>
                  <QuizFeedback
                    isCorrect={answers[answers.length - 1].isCorrect}
                    kana={lookup.get(q.kanaId)!}
                    justMastered={justMastered}
                  />
                  <Button onClick={handleNext} size="lg" className="px-8">
                    {currentIndex + 1 === questions.length ? "See Results" : "Next"}
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div key={i} />
          )
        )}
      </TransitionPanel>
    </div>
  );
}
