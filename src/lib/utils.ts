import { clsx, type ClassValue } from "clsx";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock } from "lucide-react";
import { twMerge } from "tailwind-merge";

import {
  EVENT_CATEGORIES,
  EVENT_STATUSES,
  EVENT_TYPES,
  EXPERIENCE_LEVELS,
} from "@/constants";
import { type Event } from "@/infra/database/schema";

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getStatusText(status: string): string {
  const statusInfo = EVENT_STATUSES.find((s) => s.value === status);
  return statusInfo?.label || status;
}

export function getStatusIcon(status: string) {
  const statusInfo = EVENT_STATUSES.find((s) => s.value === status);
  return statusInfo?.icon || Clock;
}

export function getStatusColor(status: string): string {
  const statusInfo = EVENT_STATUSES.find((s) => s.value === status);
  return statusInfo?.color || "text-gray-600 bg-gray-100";
}

export function getTypeText(type: string): string {
  const typeMap: Record<string, string> = EVENT_TYPES.reduce(
    (acc, type) => {
      acc[type.value] = type.label;
      return acc;
    },
    {} as Record<string, string>
  );
  return typeMap[type] || type;
}

export function formatEventDate(
  date: Date,
  format = "EEEE, dd 'de' MMMM 'de' yyyy"
): string {
  return formatDate(date, format, { locale: ptBR });
}

export function formatEventTime(date: Date): string {
  return formatDate(date, "HH:mm", { locale: ptBR });
}

export function isEventActive(event: Event): boolean {
  return event.status === "ongoing";
}

export function isRegistrationOpen(event: Event): boolean {
  const now = new Date();
  const registrationStart = event.registrationStartDate || event.createdAt;
  const registrationEnd = event.registrationEndDate || event.startDate;

  return (
    registrationStart != null &&
    registrationEnd != null &&
    registrationStart <= now &&
    registrationEnd >= now &&
    event.status === "published"
  );
}

export function formatTimeAgo(date: Date | string | number): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return "agora mesmo";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"} atrás`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hora" : "horas"} atrás`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "dia" : "dias"} atrás`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "semana" : "semanas"} atrás`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "mês" : "meses"} atrás`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? "ano" : "anos"} atrás`;
}

export function getEventTypeText(type: string): string {
  return EVENT_TYPES.find((t) => t.value === type)?.label || type;
}

export const getCategoryText = (category: string) => {
  const categories = EVENT_CATEGORIES.reduce(
    (acc, category) => {
      acc[category.value] = category.label;
      return acc;
    },
    {} as Record<string, string>
  );
  return categories[category as keyof typeof categories] || category;
};

export const getExperienceText = (experience: string) => {
  const experiences = EXPERIENCE_LEVELS.reduce(
    (acc, experience) => {
      acc[experience.value] = experience.label;
      return acc;
    },
    {} as Record<string, string>
  );
  return experiences[experience as keyof typeof experiences] || experience;
};

export function formatDateTime(date: Date): string {
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
