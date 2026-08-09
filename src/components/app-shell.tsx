"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TextRoll } from "@/components/core/text-roll";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { href: "/", label: "Kana" },
  { href: "/kanji", label: "Kanji" },
];

export function AppShell({
  tabs,
  children,
}: {
  tabs: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-12 min-[1440px]:px-24">
          <div className="flex items-center gap-6">
            <TextRoll className="font-kiwi-soda text-lg tracking-tight text-foreground">
              MecchaKucchaYabai
            </TextRoll>
            <nav className="flex items-center gap-4">
              {SECTIONS.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    pathname === section.href ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {section.label}
                </Link>
              ))}
            </nav>
          </div>
          {tabs}
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-16 md:px-6 lg:px-12 min-[1440px]:px-24">
        {children}
      </main>
    </div>
  );
}
