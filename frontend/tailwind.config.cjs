/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "Inter", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      colors: {
        paper: "oklch(0.985 0.002 260 / <alpha-value>)",
        surface: "oklch(1 0 0 / <alpha-value>)",
        sunken: "oklch(0.962 0.004 260 / <alpha-value>)",
        ink: {
          DEFAULT: "oklch(0.215 0.02 265 / <alpha-value>)",
          soft: "oklch(0.45 0.02 265 / <alpha-value>)",
          faint: "oklch(0.52 0.02 265 / <alpha-value>)",
        },
        line: {
          DEFAULT: "oklch(0.9 0.005 265 / <alpha-value>)",
          strong: "oklch(0.8 0.01 265 / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(0.49 0.2 264 / <alpha-value>)",
          soft: "oklch(0.95 0.025 264 / <alpha-value>)",
        },
        positive: {
          DEFAULT: "oklch(0.5 0.12 158 / <alpha-value>)",
          soft: "oklch(0.94 0.04 158 / <alpha-value>)",
        },
        negative: {
          DEFAULT: "oklch(0.51 0.17 27 / <alpha-value>)",
          soft: "oklch(0.95 0.025 27 / <alpha-value>)",
        },
      },
      zIndex: {
        dropdown: "10",
        sticky: "20",
        overlay: "30",
        modal: "40",
        toast: "50",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    },
  },
  plugins: [],
};
