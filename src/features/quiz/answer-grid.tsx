import { useEffect } from "react";
import { AnswerOption } from "@/features/quiz/answer-option";
import type { Direction, KanaCharacter } from "@/types/kana";

export function AnswerGrid({
  options,
  correctId,
  direction,
  selectedId,
  answered,
  onSelect,
}: {
  options: KanaCharacter[];
  correctId: string;
  direction: Direction;
  selectedId: string | null;
  answered: boolean;
  onSelect: (id: string) => void;
}) {
  useEffect(() => {
    if (answered) return;
    function handleKeyDown(e: KeyboardEvent) {
      const index = Number(e.key) - 1;
      if (index < 0 || index >= options.length) return;
      onSelect(options[index].id);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answered, options, onSelect]);

  return (
    <div role="radiogroup" aria-label="Answer options" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((option, index) => (
        <AnswerOption
          key={option.id}
          option={option}
          index={index}
          direction={direction}
          isSelected={selectedId === option.id}
          isCorrectOption={option.id === correctId}
          answered={answered}
          onClick={() => onSelect(option.id)}
        />
      ))}
    </div>
  );
}
