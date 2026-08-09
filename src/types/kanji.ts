import type { ProgressMap } from "@/types/kana";

export type JlptLevel = "N5" | "N4";

export interface KanjiCharacter {
  id: string;
  level: JlptLevel;
  kanji: string;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
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
