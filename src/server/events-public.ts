"use server";

import { db } from "@/server/database";
import {
  eventRegistrations,
  events,
  participants,
} from "@/server/database/schema";
import { and, eq, sql } from "drizzle-orm";

export interface PublicEvent {
  id: string;
  name: string;
  description: string | null;
  type: string;
  category: string;
  location: string;
  maxParticipants: number | null;
  currentParticipants: number;
  startDate: Date;
  endDate: Date | null;
  registrationStartDate: Date | null;
  registrationEndDate: Date | null;
  status: string;
  rules: string | null;
  prizes: string | null;
  regulationPdf: string | null;
  registrationStatus: "not_open" | "open" | "closed" | "full";
  canRegister: boolean;
}

export interface EventRegistrationData {
  eventId: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  experience: string;
  additionalInfo?: string;
  hasSpecialNeeds: boolean;
  specialNeedsDescription?: string;
  acceptsEmailNotifications: boolean;
  avatar?: string;
}

/**
 * Busca eventos públicos (published) com informações de inscrição
 */
export async function getPublicEvents(): Promise<{
  success: boolean;
  events?: PublicEvent[];
  error?: string;
}> {
  try {
    const now = new Date();

    // Buscar eventos públicos ativos
    const publicEvents = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        type: events.type,
        category: events.category,
        location: events.location,
        maxParticipants: events.maxParticipants,
        currentParticipants: events.currentParticipants,
        startDate: events.startDate,
        endDate: events.endDate,
        registrationStartDate: events.registrationStartDate,
        registrationEndDate: events.registrationEndDate,
        status: events.status,
        rules: events.rules,
        prizes: events.prizes,
        regulationPdf: events.regulationPdf,
      })
      .from(events)
      .where(
        and(
          eq(events.isPublic, true),
          sql`${events.status} IN ('published', 'ongoing')`
        )
      )
      .orderBy(events.startDate);

    // Calcular status de inscrição para cada evento
    const eventsWithStatus: PublicEvent[] = publicEvents.map((event) => {
      let registrationStatus: PublicEvent["registrationStatus"] = "not_open";
      let canRegister = false;

      // Verificar se há período de inscrição definido
      if (event.registrationStartDate && event.registrationEndDate) {
        if (now < event.registrationStartDate) {
          registrationStatus = "not_open";
        } else if (now > event.registrationEndDate) {
          registrationStatus = "closed";
        } else if (
          event.maxParticipants &&
          event.currentParticipants >= event.maxParticipants
        ) {
          registrationStatus = "full";
        } else {
          registrationStatus = "open";
          canRegister = true;
        }
      } else {
        // Se não há período definido, usar data do evento
        if (now < event.startDate) {
          if (
            !event.maxParticipants ||
            event.currentParticipants < event.maxParticipants
          ) {
            registrationStatus = "open";
            canRegister = true;
          } else {
            registrationStatus = "full";
          }
        } else {
          registrationStatus = "closed";
        }
      }

      return {
        ...event,
        registrationStatus,
        canRegister,
      };
    });

    return {
      success: true,
      events: eventsWithStatus,
    };
  } catch (error) {
    console.error("Erro ao buscar eventos públicos:", error);
    return {
      success: false,
      error: "Erro ao buscar eventos",
    };
  }
}

/**
 * Busca um evento específico por ID
 */
export async function getPublicEventById(eventId: string): Promise<{
  success: boolean;
  event?: PublicEvent;
  error?: string;
}> {
  try {
    const eventResult = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        type: events.type,
        category: events.category,
        location: events.location,
        maxParticipants: events.maxParticipants,
        currentParticipants: events.currentParticipants,
        startDate: events.startDate,
        endDate: events.endDate,
        registrationStartDate: events.registrationStartDate,
        registrationEndDate: events.registrationEndDate,
        status: events.status,
        rules: events.rules,
        prizes: events.prizes,
        regulationPdf: events.regulationPdf,
      })
      .from(events)
      .where(
        and(
          eq(events.id, eventId),
          eq(events.isPublic, true),
          sql`${events.status} IN ('published', 'ongoing')`
        )
      )
      .limit(1);

    if (eventResult.length === 0) {
      return {
        success: false,
        error: "Evento não encontrado",
      };
    }

    const event = eventResult[0];
    const now = new Date();

    // Calcular status de inscrição
    let registrationStatus: PublicEvent["registrationStatus"] = "not_open";
    let canRegister = false;

    if (event.registrationStartDate && event.registrationEndDate) {
      if (now < event.registrationStartDate) {
        registrationStatus = "not_open";
      } else if (now > event.registrationEndDate) {
        registrationStatus = "closed";
      } else if (
        event.maxParticipants &&
        event.currentParticipants >= event.maxParticipants
      ) {
        registrationStatus = "full";
      } else {
        registrationStatus = "open";
        canRegister = true;
      }
    } else {
      if (now < event.startDate) {
        if (
          !event.maxParticipants ||
          event.currentParticipants < event.maxParticipants
        ) {
          registrationStatus = "open";
          canRegister = true;
        } else {
          registrationStatus = "full";
        }
      } else {
        registrationStatus = "closed";
      }
    }

    return {
      success: true,
      event: {
        ...event,
        registrationStatus,
        canRegister,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return {
      success: false,
      error: "Erro ao buscar evento",
    };
  }
}

/**
 * Registra um participante em um evento
 */
export async function registerForEvent(data: EventRegistrationData): Promise<{
  success: boolean;
  participantId?: string;
  registrationId?: string;
  error?: string;
}> {
  try {
    // Verificar se o evento existe e aceita inscrições
    const eventCheck = await getPublicEventById(data.eventId);
    if (!eventCheck.success || !eventCheck.event) {
      return {
        success: false,
        error: "Evento não encontrado",
      };
    }

    if (!eventCheck.event.canRegister) {
      return {
        success: false,
        error: "Inscrições não disponíveis para este evento",
      };
    }

    // Verificar se já existe participante com o mesmo email
    const existingParticipant = await db
      .select({ id: participants.id })
      .from(participants)
      .where(eq(participants.email, data.email))
      .limit(1);

    let participantId: string;

    if (existingParticipant.length > 0) {
      participantId = existingParticipant[0].id;

      // Atualizar informações do participante existente
      await db
        .update(participants)
        .set({
          name: data.name,
          phone: data.phone,
          avatar: data.avatar,
          category: data.category,
          experience: data.experience,
          additionalInfo: data.additionalInfo,
          hasSpecialNeeds: data.hasSpecialNeeds,
          specialNeedsDescription: data.specialNeedsDescription,
          acceptsEmailNotifications: data.acceptsEmailNotifications,
          updatedAt: new Date(),
        })
        .where(eq(participants.id, participantId));

      // Verificar se já está inscrito neste evento
      const existingRegistration = await db
        .select({ id: eventRegistrations.id })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, data.eventId),
            eq(eventRegistrations.participantId, participantId)
          )
        )
        .limit(1);

      if (existingRegistration.length > 0) {
        return {
          success: false,
          error: "Já está inscrito neste evento",
        };
      }
    } else {
      // Criar novo participante
      const newParticipant = await db
        .insert(participants)
        .values({
          name: data.name,
          email: data.email,
          phone: data.phone,
          avatar: data.avatar,
          category: data.category,
          experience: data.experience,
          additionalInfo: data.additionalInfo,
          hasSpecialNeeds: data.hasSpecialNeeds,
          specialNeedsDescription: data.specialNeedsDescription,
          acceptsEmailNotifications: data.acceptsEmailNotifications,
          status: "approved", // Auto-aprovado para inscrições públicas
        })
        .returning({ id: participants.id });

      participantId = newParticipant[0].id;
    }

    // Criar inscrição no evento
    const registration = await db
      .insert(eventRegistrations)
      .values({
        eventId: data.eventId,
        participantId: participantId,
        status: "registered",
      })
      .returning({ id: eventRegistrations.id });

    // Atualizar contador de participantes do evento
    await db
      .update(events)
      .set({
        currentParticipants: sql`${events.currentParticipants} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(events.id, data.eventId));

    return {
      success: true,
      participantId,
      registrationId: registration[0].id,
    };
  } catch (error) {
    console.error("Erro ao registrar participante:", error);
    return {
      success: false,
      error: "Erro ao processar inscrição",
    };
  }
}

/**
 * Busca eventos disponíveis para inscrição (todos os eventos futuros)
 */
export async function getAvailableEventsForRegistration(): Promise<{
  success: boolean;
  events?: PublicEvent[];
  error?: string;
}> {
  try {
    const now = new Date();

    // Buscar todos os eventos públicos futuros (não apenas os com inscrições abertas)
    const availableEvents = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        type: events.type,
        category: events.category,
        location: events.location,
        maxParticipants: events.maxParticipants,
        currentParticipants: events.currentParticipants,
        startDate: events.startDate,
        endDate: events.endDate,
        registrationStartDate: events.registrationStartDate,
        registrationEndDate: events.registrationEndDate,
        status: events.status,
        rules: events.rules,
        prizes: events.prizes,
      })
      .from(events)
      .where(
        and(
          eq(events.isPublic, true),
          sql`${events.status} IN ('published', 'ongoing')`
        )
      )
      .orderBy(events.startDate);

    // Calcular status de inscrição para cada evento
    const eventsWithStatus: PublicEvent[] = availableEvents.map((event) => {
      let registrationStatus: PublicEvent["registrationStatus"] = "not_open";
      let canRegister = false;

      // Verificar se as inscrições já começaram
      if (event.registrationStartDate && event.registrationEndDate) {
        if (now < event.registrationStartDate) {
          registrationStatus = "not_open";
          canRegister = false;
        } else if (now > event.registrationEndDate) {
          registrationStatus = "closed";
          canRegister = false;
        } else if (
          event.maxParticipants &&
          event.currentParticipants >= event.maxParticipants
        ) {
          registrationStatus = "full";
          canRegister = false;
        } else {
          registrationStatus = "open";
          canRegister = true;
        }
      } else {
        // Se não há período definido, usar data do evento
        if (now < event.startDate) {
          if (
            !event.maxParticipants ||
            event.currentParticipants < event.maxParticipants
          ) {
            registrationStatus = "open";
            canRegister = true;
          } else {
            registrationStatus = "full";
            canRegister = false;
          }
        } else {
          registrationStatus = "closed";
          canRegister = false;
        }
      }

      return {
        ...event,
        registrationStatus,
        canRegister,
      };
    });

    return {
      success: true,
      events: eventsWithStatus,
    };
  } catch (error) {
    console.error("Erro ao buscar eventos disponíveis:", error);
    return {
      success: false,
      error: "Erro ao buscar eventos disponíveis.",
    };
  }
}

/**
 * Busca inscrição por email e evento
 */
export async function getRegistrationByEmail(
  email: string,
  eventId?: string
): Promise<{
  success: boolean;
  registrations?: Array<{
    id: string;
    eventName: string;
    eventId: string;
    participantName: string;
    status: string;
    registrationDate: Date | null;
    eventDate: Date;
    qrData: string;
  }>;
  error?: string;
}> {
  try {
    // Buscar participante pelo email
    const participant = await db
      .select({ id: participants.id, name: participants.name })
      .from(participants)
      .where(eq(participants.email, email))
      .limit(1);

    if (participant.length === 0) {
      return {
        success: false,
        error: "Nenhuma inscrição encontrada para este email",
      };
    }

    // Buscar inscrições do participante
    const whereConditions = eventId
      ? [
          eq(eventRegistrations.participantId, participant[0].id),
          eq(eventRegistrations.eventId, eventId),
        ]
      : [eq(eventRegistrations.participantId, participant[0].id)];

    const registrations = await db
      .select({
        registrationId: eventRegistrations.id,
        eventName: events.name,
        eventId: events.id,
        participantName: participants.name,
        status: eventRegistrations.status,
        registrationDate: eventRegistrations.registrationDate,
        eventDate: events.startDate,
      })
      .from(eventRegistrations)
      .innerJoin(events, eq(eventRegistrations.eventId, events.id))
      .innerJoin(
        participants,
        eq(eventRegistrations.participantId, participants.id)
      )
      .where(and(...whereConditions));

    const registrationsWithQR = registrations.map((reg) => ({
      id: reg.registrationId,
      eventName: reg.eventName,
      eventId: reg.eventId,
      participantName: reg.participantName,
      status: reg.status,
      registrationDate: reg.registrationDate,
      eventDate: reg.eventDate,
      qrData: JSON.stringify({
        registrationId: reg.registrationId,
        participantName: reg.participantName,
        eventName: reg.eventName,
        eventDate: reg.eventDate.toISOString(),
        email: email,
      }),
    }));

    return {
      success: true,
      registrations: registrationsWithQR,
    };
  } catch (error) {
    console.error("Erro ao buscar inscrições:", error);
    return {
      success: false,
      error: "Erro ao buscar inscrições",
    };
  }
}
