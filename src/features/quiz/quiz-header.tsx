import { ChevronLeft } from "lucide-react";

export function QuizHeader({
  current,
  total,
  onExit,
}: {
  current: number;
  total: number;
  onExit: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onExit}
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Exit
      </button>
      <span className="text-sm tabular-nums text-muted-foreground">
        Question {current} / {total}
      </span>
    </div>
  );
}
