"use client";
import { AnimatedGroup } from "@/components/core/animated-group";
import { InView } from "@/components/core/in-view";
import { KanjiCard } from "@/features/kanji/kanji-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CATEGORY_ORDER } from "@/data/kanji-categories";
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

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: kanjiList.filter((k) => k.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-8">
      {groups.map(({ category, items }) => (
        <div key={category}>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">{category}</h2>
          <div role="list" aria-label={category}>
            <InView once viewOptions={{ margin: "-80px" }}>
              <AnimatedGroup
                preset="slide"
                as="div"
                asChild="div"
                className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3"
                variants={
                  reducedMotion
                    ? { container: { visible: { transition: { staggerChildren: 0 } } }, item: { hidden: { opacity: 0 }, visible: { opacity: 1 } } }
                    : { container: { visible: { transition: { staggerChildren: 0.015 } } } }
                }
              >
                {items.map((kanji) => (
                  <KanjiCard key={kanji.id} kanji={kanji} correctCount={progress[kanji.id] ?? 0} />
                ))}
              </AnimatedGroup>
            </InView>
          </div>
        </div>
      ))}
    </div>
  );
}
