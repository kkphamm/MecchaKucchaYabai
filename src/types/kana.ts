export type Script = "hiragana" | "katakana";

export type KanaCategory =
  | "basic"
  | "dakuten"
  | "handakuten"
  | "small"
  | "yoon"
  | "special"
  | "archaic";

export type Vowel = "a" | "i" | "u" | "e" | "o";

export interface KanaCharacter {
  id: string;
  script: Script;
  kana: string;
  romaji: string;
  category: KanaCategory;
  row: string;
  vowel: Vowel | null;
}

// Mutable learner progress (persisted, keyed by KanaCharacter.id)
export type ProgressMap = Record<string, number>;

// Correct-answer count at which a character counts as mastered.
export const MASTERY_THRESHOLD = 30;

export interface LearnerProgressState {
  hiragana: ProgressMap;
  katakana: ProgressMap;
}

export function isMastered(id: string, progress: ProgressMap): boolean {
  return progress[id] === MASTERY_THRESHOLD;
}

export type Direction = "KANA_TO_ROMAJI" | "ROMAJI_TO_KANA";

export interface QuizQuestion {
  kanaId: string;
  direction: Direction;
  optionIds: string[];
  correctId: string;
}

export interface QuizAnswerRecord {
  kanaId: string;
  isCorrect: boolean;
}

export interface QuizState {
  script: Script;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: QuizAnswerRecord[];
}

export type ThemePreference = "system" | "light" | "dark";

export interface PersistedStateV1 {
  version: 1;
  theme: ThemePreference;
  hiragana: ProgressMap;
  katakana: ProgressMap;
}
