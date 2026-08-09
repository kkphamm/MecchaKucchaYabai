"use client";
import { AnimatedGroup } from "@/components/core/animated-group";
import { InView } from "@/components/core/in-view";
import { KanjiCard } from "@/features/kanji/kanji-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { KanjiCharacter } from "@/types/kanji";
import type { ProgressMap } from "@/types/kana";

export function KanjiGrid({
  kanjiList,
  progress,
}: {
  kanjiList: KanjiCharacter[];
  progress: ProgressMap;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div role="list">
      <InView once viewOptions={{ margin: "-80px" }}>
        <AnimatedGroup
          preset="slide"
          as="div"
          asChild="div"
          className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6 min-[1440px]:grid-cols-8"
          variants={
            reducedMotion
              ? { container: { visible: { transition: { staggerChildren: 0 } } }, item: { hidden: { opacity: 0 }, visible: { opacity: 1 } } }
              : { container: { visible: { transition: { staggerChildren: 0.015 } } } }
          }
        >
          {kanjiList.map((kanji) => (
            <KanjiCard key={kanji.id} kanji={kanji} correctCount={progress[kanji.id] ?? 0} />
          ))}
        </AnimatedGroup>
      </InView>
    </div>
  );
}
