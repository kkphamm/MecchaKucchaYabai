"use client";
import { useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatedBackground } from "@/components/core/animated-background";
import { TextScramble } from "@/components/core/text-scramble";
import { ThemeToggle } from "@/components/theme-toggle";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "hiragana", href: "/", label: "Hiragana" },
  { id: "katakana", href: "/katakana", label: "Katakana" },
  { id: "kanji", href: "/kanji", label: "Kanji" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const active = SECTIONS.find((s) => s.href === pathname)?.id ?? "hiragana";
  const [scrambleKey, setScrambleKey] = useState(0);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm">
        <div className="relative flex w-full items-center gap-4 py-3 pl-3 pr-3">
          <TextScramble
            key={scrambleKey}
            onMouseEnter={() => setScrambleKey((k) => k + 1)}
            className="shrink-0 font-ham text-[28px] tracking-tight text-foreground"
          >
            MKY
          </TextScramble>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              role="tablist"
              aria-label="Content"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-1"
            >
              <AnimatedBackground
                defaultValue={active}
                onValueChange={(id) => {
                  const section = SECTIONS.find((s) => s.id === id);
                  if (section) router.push(section.href);
                }}
                className="rounded-full bg-primary"
                transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
              >
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    data-id={section.id}
                    role="tab"
                    aria-selected={active === section.id}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      "text-foreground/70 data-[checked=true]:text-primary-foreground"
                    )}
                  >
                    {section.label}
                  </button>
                ))}
              </AnimatedBackground>
            </div>
          </div>
          <div className="flex-1" />
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-16 md:px-6 lg:px-12 min-[1440px]:px-24">
        {children}
      </main>
    </div>
  );
}
