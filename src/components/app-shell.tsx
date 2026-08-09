"use client";
import type { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatedBackground } from "@/components/core/animated-background";
import { TextRoll } from "@/components/core/text-roll";
import { ThemeToggle } from "@/components/theme-toggle";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "kana", href: "/", label: "Kana" },
  { id: "kanji", href: "/kanji", label: "Kanji" },
];

export function AppShell({
  tabs,
  sideTabs,
  children,
}: {
  tabs?: ReactNode;
  sideTabs?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const activeSection = pathname === "/kanji" ? "kanji" : "kana";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex w-full items-center gap-4 py-3 pl-3 pr-4 md:pr-6 lg:pr-12 min-[1440px]:pr-24">
          <TextRoll className="shrink-0 font-kiwi-soda text-[28px] tracking-tight text-foreground">
            MecchaKucchaYabai
          </TextRoll>
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Section"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-1"
            >
              <AnimatedBackground
                defaultValue={activeSection}
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
                    aria-selected={activeSection === section.id}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      "text-foreground/70 data-[checked=true]:text-primary-foreground"
                    )}
                  >
                    {section.label}
                  </button>
                ))}
              </AnimatedBackground>
              {sideTabs && <div className="pl-2">{sideTabs}</div>}
            </div>
            {tabs}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-16 md:px-6 lg:px-12 min-[1440px]:px-24">
        {children}
      </main>
    </div>
  );
}
