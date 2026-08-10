"use client";
import { useEffect } from "react";
import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import {
  DEFAULT_PROGRESS,
  STORAGE_KEY,
  STORAGE_VERSION,
  validateProgress,
  type PersistedProgress,
} from "@/lib/persistence";
import { MASTERY_THRESHOLD, type Script } from "@/types/kana";

interface KanaProgressState extends PersistedProgress {
  markCorrect: (script: Script, id: string) => void;
  resetScript: (script: Script) => void;
}

export const useKanaProgress = create<KanaProgressState>()(
  persist(
    (set) => ({
      ...DEFAULT_PROGRESS,
      markCorrect: (script, id) =>
        set((state) => {
          const map = state[script];
          const next = { ...map, [id]: Math.min(MASTERY_THRESHOLD, (map[id] ?? 0) + 1) };
          return { [script]: next } as Pick<KanaProgressState, "hiragana" | "katakana">;
        }),
      resetScript: (script) =>
        set(() => ({ [script]: {} }) as Pick<KanaProgressState, "hiragana" | "katakana">),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      // Rehydration reads localStorage, which doesn't exist on the server.
      // Skip the middleware's automatic (synchronous, pre-hydration) rehydrate
      // and trigger it ourselves post-mount via useHydrateKanaProgress, so the
      // first client render still matches the server-rendered default state.
      skipHydration: true,
      storage: {
        getItem: (name): StorageValue<PersistedProgress> | null => {
          if (typeof window === "undefined") return null;
          const raw = window.localStorage.getItem(name);
          if (!raw) return null;
          try {
            const parsed = JSON.parse(raw) as { state?: unknown; version?: number };
            if (parsed?.version !== STORAGE_VERSION) return null;
            const state = validateProgress(parsed.state);
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

// Call once, client-side, after mount — rehydrates from localStorage without
// touching the first render the server already produced.
export function useHydrateKanaProgress() {
  useEffect(() => {
    void useKanaProgress.persist.rehydrate();
  }, []);
}
