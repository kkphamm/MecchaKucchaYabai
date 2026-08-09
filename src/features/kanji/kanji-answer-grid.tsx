import { useEffect } from "react";
import { KanjiAnswerOption } from "@/features/kanji/kanji-answer-option";
import type { KanjiCharacter } from "@/types/kanji";

export function KanjiAnswerGrid({
  options,
  correctId,
  selectedId,
  answered,
  onSelect,
}: {
  options: KanjiCharacter[];
  correctId: string;
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
        <KanjiAnswerOption
          key={option.id}
          option={option}
          index={index}
          isSelected={selectedId === option.id}
          isCorrectOption={option.id === correctId}
          answered={answered}
          onClick={() => onSelect(option.id)}
        />
      ))}
    </div>
  );
}
