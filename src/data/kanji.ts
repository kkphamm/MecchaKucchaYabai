import source from "./kanji-source.json" with { type: "json" };
import { KANJI_CATEGORY } from "./kanji-categories";
import type { JlptLevel, KanjiCharacter } from "@/types/kanji";

// Sourced from davidluzgouveia/kanji-data (KANJIDIC2-derived, jlpt_new field).
// The JLPT stopped publishing official kanji lists after the 2010 revision,
// so N5/N4 membership here is the commonly-used community approximation,
// not an official list.
interface SourceEntry {
  kanji: string;
  level: JlptLevel;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
}

function buildLevel(level: JlptLevel): KanjiCharacter[] {
  return (source as SourceEntry[])
    .filter((e) => e.level === level)
    .map((e) => ({
      id: `${level.toLowerCase()}-${e.kanji}`,
      level,
      kanji: e.kanji,
      meanings: e.meanings,
      onyomi: e.onyomi,
      kunyomi: e.kunyomi,
      category: KANJI_CATEGORY[e.kanji] ?? "Other",
    }));
}

export const N5_KANJI: KanjiCharacter[] = buildLevel("N5");
export const N4_KANJI: KanjiCharacter[] = buildLevel("N4");
export const ALL_KANJI: KanjiCharacter[] = [...N5_KANJI, ...N4_KANJI];

export function kanjiForLevel(level: JlptLevel): KanjiCharacter[] {
  return level === "N5" ? N5_KANJI : N4_KANJI;
}

// Runnable sanity check (ponytail: non-trivial generation logic gets one check).
function assertDataset() {
  if (N5_KANJI.length === 0 || N4_KANJI.length === 0) {
    throw new Error("Expected non-empty N5 and N4 kanji lists");
  }
  const ids = new Set(ALL_KANJI.map((k) => k.id));
  if (ids.size !== ALL_KANJI.length) {
    throw new Error("Duplicate kanji ids detected in dataset");
  }
  for (const k of ALL_KANJI) {
    if (k.meanings.length === 0) {
      throw new Error(`Kanji ${k.kanji} has no meanings`);
    }
    if (!(k.kanji in KANJI_CATEGORY)) {
      throw new Error(`Kanji ${k.kanji} is missing from KANJI_CATEGORY`);
    }
  }
}
assertDataset();
