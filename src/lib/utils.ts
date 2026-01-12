import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number, currency = "CHF") {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-CH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(date));
}
