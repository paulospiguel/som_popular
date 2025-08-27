import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to show relative time ago in Portuguese
 */
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} min`;
  } else if (diffInHours < 24) {
    return `há ${diffInHours}h`;
  } else if (diffInDays === 1) {
    return "ontem";
  } else if (diffInDays < 7) {
    return `há ${diffInDays} dias`;
  } else {
    return date.toLocaleDateString("pt-PT");
  }
}
