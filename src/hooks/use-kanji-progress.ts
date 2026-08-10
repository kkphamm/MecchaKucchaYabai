"use client";
import { useEffect } from "react";
import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import {
  DEFAULT_KANJI_PROGRESS,
  KANJI_STORAGE_KEY,
  KANJI_STORAGE_VERSION,
  validateKanjiProgress,
  type PersistedKanjiProgress,
} from "@/lib/kanji-persistence";
import { MASTERY_THRESHOLD } from "@/types/kana";
import type { JlptLevel } from "@/types/kanji";

const LEVEL_KEY: Record<JlptLevel, "n5" | "n4"> = { N5: "n5", N4: "n4" };

interface KanjiProgressState extends PersistedKanjiProgress {
  markCorrect: (level: JlptLevel, id: string) => void;
  resetLevel: (level: JlptLevel) => void;
}

export const useKanjiProgress = create<KanjiProgressState>()(
  persist(
    (set) => ({
      ...DEFAULT_KANJI_PROGRESS,
      markCorrect: (level, id) =>
        set((state) => {
          const key = LEVEL_KEY[level];
          const map = state[key];
          const next = { ...map, [id]: Math.min(MASTERY_THRESHOLD, (map[id] ?? 0) + 1) };
          return { [key]: next } as Pick<KanjiProgressState, "n5" | "n4">;
        }),
      resetLevel: (level) =>
        set(() => ({ [LEVEL_KEY[level]]: {} }) as Pick<KanjiProgressState, "n5" | "n4">),
    }),
    {
      name: KANJI_STORAGE_KEY,
      version: KANJI_STORAGE_VERSION,
      skipHydration: true,
      storage: {
        getItem: (name): StorageValue<PersistedKanjiProgress> | null => {
          if (typeof window === "undefined") return null;
          const raw = window.localStorage.getItem(name);
          if (!raw) return null;
          try {
            const parsed = JSON.parse(raw) as { state?: unknown; version?: number };
            if (parsed?.version !== KANJI_STORAGE_VERSION) return null;
            const state = validateKanjiProgress(parsed.state);
            if (!state) return null;
            return { state, version: parsed.version };
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          window.localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => window.localStorage.removeItem(name),
      },
    }
  )
);

export function useHydrateKanjiProgress() {
  useEffect(() => {
    void useKanjiProgress.persist.rehydrate();
  }, []);
}

export function progressForLevel(
  state: PersistedKanjiProgress,
  level: JlptLevel
) {
  return state[LEVEL_KEY[level]];
}
