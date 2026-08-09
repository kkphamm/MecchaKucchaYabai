import type { Direction, KanaCharacter } from "@/types/kana";

export function QuizPrompt({ kana, direction }: { kana: KanaCharacter; direction: Direction }) {
  if (direction === "KANA_TO_ROMAJI") {
    return (
      <p className="font-kana text-center text-[96px] leading-none text-foreground md:text-[128px]">
        {kana.kana}
      </p>
    );
  }
  return (
    <p className="text-center text-4xl font-medium leading-tight text-foreground md:text-5xl">
      {kana.romaji}
    </p>
  );
}
