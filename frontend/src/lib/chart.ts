/* Hex equivalents of OKLCH tokens — recharts can't read Tailwind classes. */

export function formatMonthAxis(value: string): string {
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  const d = new Date(Number(year), Number(month) - 1, 1);
  const mo = new Intl.DateTimeFormat("fr-CH", { month: "short" }).format(d);
  return `${mo} ${String(year).slice(2)}`;
}

export function formatAxisValue(value: number): string {
  return new Intl.NumberFormat("fr-CH", { maximumFractionDigits: 0 }).format(value);
}
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
