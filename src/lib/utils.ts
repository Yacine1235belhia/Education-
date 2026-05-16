import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAppreciation(average: number | undefined): string {
  if (average === undefined || average === null) return "-";
  if (average >= 18) return "امتياز";
  if (average >= 16) return "تهنئة";
  if (average >= 14) return "تشجيع";
  if (average >= 12) return "لوحة شرف";
  return "-";
}
