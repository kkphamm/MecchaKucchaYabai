import { N4_KANJI, N5_KANJI } from "@/data/kanji";
import { MASTERY_THRESHOLD, type ProgressMap } from "@/types/kana";

export const KANJI_STORAGE_KEY = "mkya:kanji:v1";
export const KANJI_STORAGE_VERSION = 1;

const N5_IDS = new Set(N5_KANJI.map((k) => k.id));
const N4_IDS = new Set(N4_KANJI.map((k) => k.id));

function isValidProgressMap(value: unknown, validIds: Set<string>): value is ProgressMap {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  return Object.entries(value).every(
    ([id, count]) =>
      validIds.has(id) &&
      typeof count === "number" &&
      Number.isInteger(count) &&
      count >= 0 &&
      count <= MASTERY_THRESHOLD
  );
}

export interface PersistedKanjiProgress {
  n5: ProgressMap;
  n4: ProgressMap;
}

export const DEFAULT_KANJI_PROGRESS: PersistedKanjiProgress = { n5: {}, n4: {} };

// Same discard-whole-blob-on-mismatch policy as lib/persistence.ts.
export function validateKanjiProgress(raw: unknown): PersistedKanjiProgress | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { n5, n4 } = raw as Record<string, unknown>;
  if (!isValidProgressMap(n5, N5_IDS)) return null;
  if (!isValidProgressMap(n4, N4_IDS)) return null;
  return { n5, n4 };
}

function selfCheck() {
  const sampleId = N5_KANJI[0].id;
  if (!validateKanjiProgress({ n5: { [sampleId]: 10 }, n4: {} })) {
    throw new Error("kanji-persistence self-check: valid progress was rejected");
  }
  if (validateKanjiProgress({ n5: { "bogus-id": 10 }, n4: {} })) {
    throw new Error("kanji-persistence self-check: unknown id was accepted");
  }
  if (validateKanjiProgress({ n5: { [sampleId]: MASTERY_THRESHOLD + 1 }, n4: {} })) {
    throw new Error("kanji-persistence self-check: out-of-range count was accepted");
  }
  if (validateKanjiProgress(null) || validateKanjiProgress("not an object")) {
    throw new Error("kanji-persistence self-check: malformed payload was accepted");
  }
}
selfCheck();
