import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        harvest: "var(--color-harvest)",
        soil: "var(--color-soil)",
        mist: "var(--color-mist)",
        sky: "var(--color-sky)",
        indigo: "var(--color-indigo)",
        "alert-red": "var(--color-alert-red)",
        "alert-amber": "var(--color-alert-amber)",
        "alert-lime": "var(--color-alert-lime)",
        leaf: "var(--color-leaf)",
        "neutral-800": "var(--color-neutral-800)",
        "neutral-400": "var(--color-neutral-400)",
        "neutral-100": "var(--color-neutral-100)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["var(--font-tiro-devanagari)", "serif"],
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        devanagari: ["var(--font-noto-sans-devanagari)", "sans-serif"],
      },
      boxShadow: {
        low: "var(--shadow-low)",
        mid: "var(--shadow-mid)",
        high: "var(--shadow-high)",
        map: "var(--shadow-map)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
    },
  },
  plugins: [],
};
export default config;
