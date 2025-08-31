import { EVENT_STATUSES } from "@/constants";

export function getStatusText(status: string): string {
  const statusInfo = EVENT_STATUSES.find((s) => s.value === status);
  return statusInfo?.label || status;
}

export function getStatusColor(status: string): string {
  const statusInfo = EVENT_STATUSES.find((s) => s.value === status);
  return statusInfo?.color || "text-gray-600 bg-gray-100";
}

export function getTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    classificatoria: "Classificatória",
    "semi-final": "Semi-Final",
    final: "Final",
    workshop: "Workshop",
    masterclass: "Masterclass",
  };
  return typeMap[type] || type;
}

export function getCategoryText(category: string): string {
  const categoryMap: Record<string, string> = {
    fado: "Fado",
    guitarra: "Guitarra Portuguesa",
    cavaquinho: "Cavaquinho",
    concertina: "Concertina",
    viola: "Viola Campaniça",
    cante: "Cante Alentejano",
  };
  return categoryMap[category] || category;
}

export function formatEventDate(date: Date): string {
  return date.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatEventTime(date: Date): string {
  return date.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isEventActive(event: any): boolean {
  return event.status === "ongoing";
}

export function isRegistrationOpen(event: any): boolean {
  const now = new Date();
  const registrationStart = event.registrationStartDate || event.createdAt;
  const registrationEnd = event.registrationEndDate || event.startDate;

  return (
    registrationStart <= now &&
    registrationEnd >= now &&
    event.status === "published"
  );
}
