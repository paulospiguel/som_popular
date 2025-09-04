"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { checkAdminAccess } from "@/lib/auth-guards";
import { db } from "@/server/database";
import { eventRegistrations, participants } from "@/server/database/schema";

/**
 * Buscar todos os participantes aprovados
 */
export async function getApprovedParticipants() {
  try {
    const approvedParticipants = await db
      .select()
      .from(participants)
      .where(eq(participants.status, "approved"));

    return { success: true, data: approvedParticipants };
  } catch (error) {
    console.error("Erro ao buscar participantes aprovados:", error);
    return { success: false, error: "Erro ao buscar participantes" };
  }
}

/**
 * Buscar participantes registrados em um evento específico
 */
export async function getEventParticipants(eventId: string) {
  try {
    const eventParticipants = await db
      .select({
        registration: eventRegistrations,
        participant: participants,
      })
      .from(eventRegistrations)
      .innerJoin(
        participants,
        eq(eventRegistrations.participantId, participants.id)
      )
      .where(eq(eventRegistrations.eventId, eventId));

    return { success: true, data: eventParticipants };
  } catch (error) {
    console.error("Erro ao buscar participantes do evento:", error);
    return { success: false, error: "Erro ao buscar participantes do evento" };
  }
}

/**
 * Registrar participante em um evento
 */
export async function registerParticipantInEvent(
  eventId: string,
  participantId: string
) {
  try {
    // Verificar permissões de admin
    await checkAdminAccess();

    // Verificar se já existe registro
    const existing = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.participantId, participantId)
        )
      );

    if (existing.length > 0) {
      return {
        success: false,
        error: "Participante já está registrado neste evento",
      };
    }

    // Criar registro
    const [registration] = await db
      .insert(eventRegistrations)
      .values({
        eventId,
        participantId,
        status: "registered",
        registeredAt: new Date(),
      })
      .returning();

    revalidatePath("/dashboard/events");
    return {
      success: true,
      data: registration,
      message: "Participante registrado no evento com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao registrar participante no evento:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao registrar participante";
    return { success: false, error: errorMessage };
  }
}

/**
 * Remover participante de um evento
 */
export async function removeParticipantFromEvent(
  eventId: string,
  participantId: string
) {
  try {
    // Verificar permissões de admin
    await checkAdminAccess();

    await db
      .delete(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.participantId, participantId)
        )
      );

    revalidatePath("/dashboard/events");
    return {
      success: true,
      message: "Participante removido do evento com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao remover participante do evento:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao remover participante";
    return { success: false, error: errorMessage };
  }
}

/**
 * Criar participantes de teste
 */
export async function createSampleParticipants() {
  try {
    await checkAdminAccess();

    const sampleParticipants = [
      {
        name: "João Silva",
        email: "joao.silva@email.com",
        phone: "912345678",
        category: "fado",
        experience: "intermedio",
        additionalInfo:
          "5 anos de experiência em fado, participei em vários eventos locais.",
        status: "approved",
        registrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Maria Costa",
        email: "maria.costa@email.com",
        phone: "923456789",
        category: "guitarra",
        experience: "avancado",
        additionalInfo: "Guitarrista profissional com 15 anos de experiência.",
        status: "approved",
        registrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "António Oliveira",
        email: "antonio.oliveira@email.com",
        phone: "934567890",
        category: "cavaquinho",
        experience: "intermedio",
        additionalInfo:
          "Cantor profissional, novo no fado. Toco cavaquinho há 3 anos.",
        status: "approved",
        registrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ana Ferreira",
        email: "ana.ferreira@email.com",
        phone: "945678901",
        category: "concertina",
        experience: "avancado",
        additionalInfo:
          "Toco concertina desde criança, ensino música tradicional.",
        status: "approved",
        registrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Carlos Mendes",
        email: "carlos.mendes@email.com",
        phone: "956789012",
        category: "viola",
        experience: "iniciante",
        additionalInfo:
          "Sempre gostei de música tradicional, quero começar na viola campaniça.",
        status: "approved",
        registrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const createdParticipants = await db
      .insert(participants)
      .values(sampleParticipants)
      .returning();

    revalidatePath("/dashboard/participantes");
    revalidatePath("/dashboard/events");

    return {
      success: true,
      data: createdParticipants,
      message: `${createdParticipants.length} participantes criados com sucesso!`,
    };
  } catch (error) {
    console.error("Erro ao criar participantes de exemplo:", error);
    return { success: false, error: "Erro ao criar participantes de exemplo" };
  }
}
