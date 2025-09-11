import { NextResponse } from "next/server";

import { getPublicEvents } from "@/server/events-public";

export async function GET() {
  try {
    const result = await getPublicEvents();
    
    if (!result.success || !result.events) {
      return NextResponse.json(
        { error: "Erro ao buscar eventos" },
        { status: 500 }
      );
    }

    // Formatar eventos para o dropdown
    const eventsForDropdown = result.events.map(event => ({
      id: event.id,
      name: event.name,
      description: event.description,
      type: event.type,
      category: event.category,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status,
      registrationStatus: event.registrationStatus,
      currentParticipants: event.currentParticipants,
      maxParticipants: event.maxParticipants,
    }));

    return NextResponse.json(eventsForDropdown);
  } catch (error) {
    console.error("Erro ao buscar eventos para dropdown:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
