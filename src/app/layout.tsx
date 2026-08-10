import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { IntroSplash } from "@/components/intro-splash";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const hamIsCute = localFont({
  src: "../../public/fonts/HamIsCute.woff",
  variable: "--font-ham",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "MecchaKucchaYabai",
  description: "Master Hiragana, Katakana, and Kanji, one loop at a time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} ${hamIsCute.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <IntroSplash />
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
