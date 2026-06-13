import type { Metadata } from "next";
import {
  Fraunces,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Noto_Sans_Devanagari,
} from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/shared/QueryProvider";
import { LanguageProvider } from "@/components/shared/LanguageProvider";

// Luxury editorial serif — optical-size variable, ink-trap detail
// Closest web equivalent to Apple's "New York" typeface
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

// Premium sans — slightly wider than Inter, better optically at small sizes
// Used by Pitch, Raycast — distinct personality without being decorative
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

// JetBrains Mono — for all numeric data, labels, mono contexts
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

// Devanagari — Hindi support
const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ["400", "600"],
  subsets: ["devanagari"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "KrishiMitra — Smart Farming for India",
  description: "AI-powered agricultural decision platform for Indian farmers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} ${notoSansDevanagari.variable}`}
    >
      <body className="antialiased">
        <QueryProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
