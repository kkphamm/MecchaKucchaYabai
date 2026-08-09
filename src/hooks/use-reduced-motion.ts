"use client";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

// Shared across every component in Section 9's motion spec that needs to
// suppress transient/entrance effects under prefers-reduced-motion.
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
