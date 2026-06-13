import type { Metadata } from "next";
import { 
  Plus_Jakarta_Sans, 
  JetBrains_Mono,
  Noto_Sans_Devanagari
} from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/shared/QueryProvider";
import { LanguageProvider } from "@/components/shared/LanguageProvider";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

// Single Devanagari font covering all Hindi text needs (replaces both Tiro + Noto)
const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ["400", "600"],
  subsets: ["devanagari"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
  preload: false, // Only loaded when Hindi text is rendered
});

export const metadata: Metadata = {
  title: "KrishiMitra - Agricultural Decision Infrastructure",
  description: "AI-powered decision-support platform for Indian farmers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} ${notoSansDevanagari.variable}`}>
      <body className="antialiased text-foreground bg-background">
        <QueryProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
