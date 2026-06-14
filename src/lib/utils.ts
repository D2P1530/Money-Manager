import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "CHF") {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat("fr-CH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}
