import type { KanjiCharacter } from "@/types/kanji";

export function KanjiQuizPrompt({ kanji }: { kanji: KanjiCharacter }) {
  const reading = kanji.kunyomi[0] ?? kanji.onyomi[0];
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-kana text-center text-[96px] leading-none text-foreground md:text-[128px]">
        {kanji.kanji}
      </p>
      {reading && <p className="font-kana text-lg text-muted-foreground">{reading}</p>}
    </div>
  );
}
