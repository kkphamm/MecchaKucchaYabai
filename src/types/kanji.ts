import type { ProgressMap } from "@/types/kana";
import type { KanjiCategory } from "@/data/kanji-categories";

export type JlptLevel = "N5" | "N4";
export type { KanjiCategory };

export interface KanjiCharacter {
  id: string;
  level: JlptLevel;
  kanji: string;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  category: KanjiCategory;
}

export interface KanjiQuizQuestion {
  kanjiId: string;
  optionIds: string[];
  correctId: string;
}

export interface KanjiQuizAnswerRecord {
  kanjiId: string;
  isCorrect: boolean;
}

export type { ProgressMap };
