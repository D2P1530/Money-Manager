/* Couleurs hex équivalentes aux tokens OKLCH (recharts ne lit pas les classes Tailwind). */
export const chartColors = {
  ink: "#1a1d29",
  inkFaint: "#6a6f80",
  line: "#dcdee4",
  positive: "#1b7a4f",
  positiveSoft: "#d8efe3",
  negative: "#bb4430",
  negativeSoft: "#f7e2dd",
  accent: "#3a4ed8",
};

export const axisTick = {
  fill: chartColors.inkFaint,
  fontSize: 11,
  fontFamily: "IBM Plex Mono, ui-monospace, monospace",
};

export const tooltipStyle: React.CSSProperties = {
  background: "#ffffff",
  border: `1px solid ${chartColors.line}`,
  borderRadius: 6,
  fontSize: 12,
  fontFamily: "IBM Plex Mono, ui-monospace, monospace",
  color: chartColors.ink,
  boxShadow: "0 4px 16px rgba(26, 29, 41, 0.08)",
};
