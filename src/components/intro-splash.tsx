"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TextScramble } from "@/components/core/text-scramble";

const SWOOSH_DURATION_MS = 600;
const SETTLE_PAUSE_MS = 500;
const BASE_FONT_PX = 56;
const CORNER_FONT_PX = 28;
const CORNER = { top: 12, left: 12 };

type Phase = "rolling" | "settled" | "swooshing" | "done";

export function IntroSplash() {
  // Plays once per full page load/refresh (this component lives in the root
  // layout, which persists across in-app client-side navigation, so it
  // naturally doesn't replay when switching Hiragana/Katakana/Kanji — only
  // on an actual reload). Always starts at "rolling" — the server can't see
  // prefers-reduced-motion, so the first client render must match it exactly
  // or React flags a hydration mismatch; the layout effect below then skips
  // ahead client-side, post-hydration, when that preference is set.
  const [phase, setPhase] = useState<Phase>("rolling");
  const rollingTextRef = useRef<HTMLSpanElement>(null);
  const [startRect, setStartRect] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe hydration correction: server can't see matchMedia, so the client must reconcile post-mount
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPhase("done");
  }, []);

  useEffect(() => {
    if (phase !== "settled") return;
    const timeout = setTimeout(() => setPhase("swooshing"), SETTLE_PAUSE_MS);
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "swooshing") return;
    const timeout = setTimeout(() => setPhase("done"), SWOOSH_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [phase]);

  // Measure the scrambling text's on-screen position the instant it
  // settles, so the swoosh can animate plain top/left pixel values from
  // there to the corner — explicit and reliable, unlike `layout`'s
  // automatic FLIP, which doesn't handle a flex-centered -> fixed-corner
  // positioning-scheme jump. Measured now (not after the pause) since the
  // text doesn't move while it sits there settled.
  function handleScrambleDone() {
    const rect = rollingTextRef.current?.getBoundingClientRect();
    if (rect) setStartRect({ top: rect.top, left: rect.left });
    setPhase("settled");
  }

  const swooshing = phase === "swooshing" || phase === "done";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro-overlay"
          className="fixed inset-0 z-50 overflow-hidden bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {!swooshing && (
            <div className="flex h-full w-full items-center justify-center">
              <span
                ref={rollingTextRef}
                className="whitespace-nowrap font-ham text-foreground"
                style={{ fontSize: BASE_FONT_PX }}
              >
                <TextScramble duration={1.2} speed={0.045} onScrambleComplete={handleScrambleDone}>
                  MecchaKucchaYabai
                </TextScramble>
              </span>
            </div>
          )}
          {swooshing && startRect && (
            <motion.span
              initial={{ top: startRect.top, left: startRect.left, fontSize: BASE_FONT_PX }}
              animate={{ top: CORNER.top, left: CORNER.left, fontSize: CORNER_FONT_PX }}
              transition={{ duration: SWOOSH_DURATION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
              className="fixed whitespace-nowrap font-ham text-foreground"
            >
              MKY
            </motion.span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
