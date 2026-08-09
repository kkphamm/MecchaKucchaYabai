"use client";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Info } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ReadingLegend() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="What do On and Kun mean?"
        onClick={() => setOpen((o) => !o)}
        className="flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Info aria-hidden="true" className="size-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Reading key"
            initial={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
            className="absolute left-0 top-full z-20 mt-2 w-64 rounded-[10px] border border-border bg-popover p-3 text-sm text-popover-foreground shadow-md"
          >
            <p>
              <span className="font-medium">On</span> — on&apos;yomi, the reading borrowed from Chinese pronunciation.
            </p>
            <p className="mt-1.5">
              <span className="font-medium">Kun</span> — kun&apos;yomi, the native Japanese reading.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
