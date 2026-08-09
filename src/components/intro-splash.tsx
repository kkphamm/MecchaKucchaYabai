"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TextRoll } from "@/components/core/text-roll";

const INTRO_KEY = "mkya:intro-played";
const SWOOSH_DURATION_MS = 600;

type Phase = "rolling" | "swooshing" | "done";

function alreadyPlayed(): boolean {
  return !!sessionStorage.getItem(INTRO_KEY) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function IntroSplash() {
  // Always starts at "rolling" — server has no sessionStorage, so the first
  // client render must match it exactly or React flags a hydration mismatch.
  // The layout effect below then skips ahead client-side, post-hydration.
  const [phase, setPhase] = useState<Phase>("rolling");

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe hydration correction: server can't see sessionStorage, so the client must reconcile post-mount
    if (alreadyPlayed()) setPhase("done");
  }, []);

  // Drives the swoosh -> done transition on a timer matching the layout
  // transition's duration below — onLayoutAnimationComplete is unreliable
  // here since the swoosh changes position scheme (flex-centered -> fixed
  // corner) and content (full name -> "MKY") in the same render.
  useEffect(() => {
    if (phase !== "swooshing") return;
    const timeout = setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      setPhase("done");
    }, SWOOSH_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            layout
            transition={{ duration: SWOOSH_DURATION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
            className={
              phase === "rolling"
                ? "whitespace-nowrap font-ham text-[clamp(32px,7vw,100px)] text-foreground"
                : "fixed left-3 top-3 whitespace-nowrap font-ham text-[28px] text-foreground"
            }
          >
            <TextRoll onDone={() => setPhase("swooshing")}>
              {phase === "rolling" ? "MecchaKucchaYabai" : "MKY"}
            </TextRoll>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
