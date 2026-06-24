import type { Config } from "tailwindcss";

// Colors are driven by CSS variables (see app/globals.css) so the whole site
// can switch between light and dark by toggling the `.dark` class on <html>.
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: v("--ink"),
          soft: v("--ink-soft"),
          muted: v("--ink-muted"),
        },
        paper: {
          DEFAULT: v("--paper"),
          card: v("--paper-card"),
        },
        brand: {
          DEFAULT: v("--brand"),
          dark: v("--brand-dark"),
        },
        gold: v("--gold"),
        line: v("--line"),
        // "panel" = the always-dark branded surfaces (footer, ribbon, CTA).
        panel: {
          DEFAULT: v("--panel"),
          fg: v("--panel-fg"),
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        gothic: ["var(--font-gothic-modern)", "var(--font-display)", "serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      maxWidth: {
        content: "1220px",
        prose: "680px",
      },
      boxShadow: {
        card: "0 1px 2px rgb(var(--ink) / 0.04), 0 10px 26px -14px rgb(var(--ink) / 0.16)",
        lift: "0 2px 4px rgb(var(--ink) / 0.05), 0 22px 44px -18px rgb(var(--ink) / 0.26)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
