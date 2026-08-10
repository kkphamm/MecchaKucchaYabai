import { Check } from "lucide-react";
import { KanaProgressBar } from "@/features/kana/kana-progress-bar";
import { MASTERY_THRESHOLD, type KanaCharacter } from "@/types/kana";

export function KanaCard({
  kana,
  correctCount,
}: {
  kana: KanaCharacter;
  correctCount: number;
}) {
  const mastered = correctCount === MASTERY_THRESHOLD;
  const percentage = Math.round((correctCount / MASTERY_THRESHOLD) * 100);

  return (
    <div
      aria-label={`${kana.kana}, ${kana.romaji}, ${percentage}% mastered${mastered ? ", mastered" : ""}`}
      className="flex flex-col items-center gap-2 rounded-[12px] border border-border bg-card p-3 transition-transform duration-150 ease-out hover:-translate-y-1 hover:scale-[1.01]"
    >
      <div className="relative flex h-10 w-full items-center justify-center">
        <span className="font-kana text-[32px] leading-none text-foreground">{kana.kana}</span>
        {mastered && (
          <Check
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 size-3.5 text-state-mastered"
          />
        )}
      </div>
      <span className="text-[13px] leading-none text-muted-foreground">{kana.romaji}</span>
      <KanaProgressBar correctCount={correctCount} mastered={mastered} />
    </div>
  );
}
