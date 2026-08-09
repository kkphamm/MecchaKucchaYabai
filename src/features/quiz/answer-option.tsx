import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Direction, KanaCharacter } from "@/types/kana";

export function AnswerOption({
  option,
  index,
  direction,
  isSelected,
  isCorrectOption,
  answered,
  onClick,
}: {
  option: KanaCharacter;
  index: number;
  direction: Direction;
  isSelected: boolean;
  isCorrectOption: boolean;
  answered: boolean;
  onClick: () => void;
}) {
  const showAsCorrect = answered && isCorrectOption;
  const showAsIncorrect = answered && isSelected && !isCorrectOption;
  const dimmed = answered && !isCorrectOption && !isSelected;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={answered}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-[8px] border px-4 py-4 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        !answered && "border-border bg-card text-foreground hover:border-foreground/30 hover:bg-muted",
        showAsCorrect && "border-state-correct-fg bg-state-correct-bg text-state-correct-fg",
        showAsIncorrect && "border-state-incorrect-fg bg-state-incorrect-bg text-state-incorrect-fg",
        dimmed && "border-border bg-card text-muted-foreground opacity-50"
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
      >
        {index + 1}
      </span>
      <span className={direction === "ROMAJI_TO_KANA" ? "font-kana text-2xl" : undefined}>
        {direction === "ROMAJI_TO_KANA" ? option.kana : option.romaji}
      </span>
      {showAsCorrect && <Check aria-hidden="true" className="size-4" />}
      {showAsIncorrect && <X aria-hidden="true" className="size-4" />}
    </button>
  );
}
