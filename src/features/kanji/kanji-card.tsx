import { Check } from "lucide-react";
import { KanaProgressBar } from "@/features/kana/kana-progress-bar";
import type { KanjiCharacter } from "@/types/kanji";

export function KanjiCard({
  kanji,
  correctCount,
}: {
  kanji: KanjiCharacter;
  correctCount: number;
}) {
  const mastered = correctCount === 50;
  const percentage = Math.round((correctCount / 50) * 100);

  return (
    <div
      aria-label={`${kanji.kanji}, ${kanji.meanings[0]}, ${percentage}% mastered${mastered ? ", mastered" : ""}`}
      className="flex flex-col items-center gap-2 rounded-[12px] border border-border bg-card p-3 transition-transform duration-150 ease-out hover:-translate-y-1 hover:scale-[1.01]"
    >
      <div className="relative flex h-10 w-full items-center justify-center">
        <span className="font-kana text-[32px] leading-none text-foreground">{kanji.kanji}</span>
        {mastered && (
          <Check
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 size-3.5 text-state-mastered"
          />
        )}
      </div>
      <span className="truncate text-[13px] leading-none text-muted-foreground">{kanji.meanings[0]}</span>
      <KanaProgressBar correctCount={correctCount} mastered={mastered} />
    </div>
  );
}
