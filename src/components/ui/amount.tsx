import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

type AmountProps = {
  value: number;
  /** "revenu" force +vert, "depense" force −rouge, "signed" colore selon le signe, "neutral" encre. */
  tone?: "revenu" | "depense" | "signed" | "neutral";
  currency?: string;
  className?: string;
};

const MINUS = "−";

export function Amount({ value, tone = "neutral", currency, className }: AmountProps) {
  const abs = formatCurrency(Math.abs(value), currency);

  let text: string;
  let color: string;

  switch (tone) {
    case "revenu":
      text = `+${abs}`;
      color = "text-positive";
      break;
    case "depense":
      text = `${MINUS}${abs}`;
      color = "text-negative";
      break;
    case "signed":
      text = value < 0 ? `${MINUS}${abs}` : `+${abs}`;
      color = value < 0 ? "text-negative" : "text-positive";
      break;
    default:
      text = value < 0 ? `${MINUS}${abs}` : abs;
      color = "text-ink";
  }

  return <span className={cn("font-mono tabular-nums", color, className)}>{text}</span>;
}
