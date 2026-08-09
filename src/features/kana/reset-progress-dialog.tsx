"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/core/dialog";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Script } from "@/types/kana";

const SCRIPT_LABEL: Record<Script, string> = {
  hiragana: "Hiragana",
  katakana: "Katakana",
};

export function ResetProgressDialog({
  open,
  onOpenChange,
  script,
  count,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  script: Script;
  count: number;
  onConfirm: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const label = SCRIPT_LABEL[script];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      transition={reducedMotion ? { duration: 0 } : { ease: "easeOut", duration: 0.22 }}
    >
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Reset {label} Progress?</DialogTitle>
          <DialogDescription>
            This clears mastery for all {count} {label} characters and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            onClick={() => onOpenChange(false)}
            className="rounded-[8px] border border-border px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="rounded-[8px] bg-state-incorrect-fg px-4 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Reset
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
