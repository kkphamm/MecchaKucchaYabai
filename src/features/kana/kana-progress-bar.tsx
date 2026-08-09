import { cn } from "@/lib/utils";

export function KanaProgressBar({
  correctCount,
  mastered,
}: {
  correctCount: number;
  mastered: boolean;
}) {
  const percentage = Math.round((correctCount / 50) * 100);

  return (
    <div className="flex w-full items-center gap-2">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${percentage}% mastered`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300 ease-out",
            mastered ? "bg-state-mastered" : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="flex items-center text-[12px] tabular-nums text-muted-foreground">
        {percentage}%
      </span>
    </div>
  );
}
