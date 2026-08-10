import { HIRAGANA, KATAKANA } from "@/data/kana";
import { MASTERY_THRESHOLD, type ProgressMap } from "@/types/kana";

export const STORAGE_KEY = "mkya:state:v1";
export const STORAGE_VERSION = 1;

const HIRAGANA_IDS = new Set(HIRAGANA.map((k) => k.id));
const KATAKANA_IDS = new Set(KATAKANA.map((k) => k.id));

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

export interface PersistedProgress {
  hiragana: ProgressMap;
  katakana: ProgressMap;
}

export const DEFAULT_PROGRESS: PersistedProgress = { hiragana: {}, katakana: {} };

// Validates a parsed localStorage payload against the known dataset.
// Any shape/range/id mismatch discards the whole blob (Section 24) rather
// than partially trusting corrupted data.
export function validateProgress(raw: unknown): PersistedProgress | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { hiragana, katakana } = raw as Record<string, unknown>;
  if (!isValidProgressMap(hiragana, HIRAGANA_IDS)) return null;
  if (!isValidProgressMap(katakana, KATAKANA_IDS)) return null;
  return { hiragana, katakana };
}

// Runnable self-check: exercises valid/corrupted inputs against the real
// dataset every time this module loads (build, dev, or test).
function selfCheck() {
  const sampleId = HIRAGANA[0].id;
  if (!validateProgress({ hiragana: { [sampleId]: 10 }, katakana: {} })) {
    throw new Error("persistence self-check: valid progress was rejected");
  }
  if (validateProgress({ hiragana: { "bogus-id": 10 }, katakana: {} })) {
    throw new Error("persistence self-check: unknown id was accepted");
  }
  if (validateProgress({ hiragana: { [sampleId]: MASTERY_THRESHOLD + 1 }, katakana: {} })) {
    throw new Error("persistence self-check: out-of-range count was accepted");
  }
  if (validateProgress({ hiragana: { [sampleId]: 1.5 }, katakana: {} })) {
    throw new Error("persistence self-check: non-integer count was accepted");
  }
  if (validateProgress(null) || validateProgress("not an object")) {
    throw new Error("persistence self-check: malformed payload was accepted");
  }
}
selfCheck();
