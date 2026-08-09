"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TextRoll } from "@/components/core/text-roll";

const INTRO_KEY = "mkya:intro-played";
const SWOOSH_DURATION_MS = 600;
const BASE_FONT_PX = 56;
const CORNER_FONT_PX = 28;
const CORNER = { top: 12, left: 12 };

type Phase = "rolling" | "swooshing" | "done";

function alreadyPlayed(): boolean {
  return !!sessionStorage.getItem(INTRO_KEY) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function IntroSplash() {
  // Always starts at "rolling" — server has no sessionStorage, so the first
  // client render must match it exactly or React flags a hydration mismatch.
  // The layout effect below then skips ahead client-side, post-hydration.
  const [phase, setPhase] = useState<Phase>("rolling");
  const rollingTextRef = useRef<HTMLSpanElement>(null);
  const [startRect, setStartRect] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe hydration correction: server can't see sessionStorage, so the client must reconcile post-mount
    if (alreadyPlayed()) setPhase("done");
  }, []);

  useEffect(() => {
    if (phase !== "swooshing") return;
    const timeout = setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      setPhase("done");
    }, SWOOSH_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [phase]);

  // Measure the rolling text's on-screen position the instant the roll
  // finishes, so the swoosh can animate plain top/left pixel values from
  // there to the corner — explicit and reliable, unlike `layout`'s
  // automatic FLIP, which doesn't handle a flex-centered -> fixed-corner
  // positioning-scheme jump (and was distorting TextRoll's own letter
  // transforms in the process).
  function handleRollDone() {
    const rect = rollingTextRef.current?.getBoundingClientRect();
    if (rect) setStartRect({ top: rect.top, left: rect.left });
    setPhase("swooshing");
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
                <TextRoll onDone={handleRollDone}>MecchaKucchaYabai</TextRoll>
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
