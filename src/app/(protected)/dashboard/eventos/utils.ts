export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    draft: "Rascunho",
    published: "Publicado",
    ongoing: "Em Curso",
    completed: "Concluído",
    cancelled: "Cancelado",
  };
  return statusMap[status] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    draft: "text-gray-600 bg-gray-100",
    published: "text-green-600 bg-green-100",
    ongoing: "text-blue-600 bg-blue-100",
    completed: "text-yellow-600 bg-yellow-100",
    cancelled: "text-red-600 bg-red-100",
  };
  return colorMap[status] || "text-gray-600 bg-gray-100";
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
  const now = new Date();
  return event.startDate <= now && (!event.endDate || event.endDate >= now);
}

export function isRegistrationOpen(event: any): boolean {
  const now = new Date();
  const registrationStart = event.registrationStartDate || event.createdAt;
  const registrationEnd = event.registrationEndDate || event.startDate;
  
  return registrationStart <= now && registrationEnd >= now && event.status === "published";
}