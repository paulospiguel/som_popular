"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { participantSchema } from "@/schemas/participant";
import { db } from "@/server/database";
import { eventRegistrations, participants } from "@/server/database/schema";

export interface ParticipantRegistrationData {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  rankingPhoto?: string;
  category: string;
  experience: string;
  additionalInfo?: string;
  hasSpecialNeeds: boolean;
  specialNeedsDescription?: string;
  acceptsEmailNotifications: boolean;
  eventId: string; // ID do evento para inscrição automática
}

export async function registerParticipant(
  data: ParticipantRegistrationData
): Promise<{
  success: boolean;
  participantId?: string;
  isNewParticipant?: boolean;
  message?: string;
  error?: string;
}> {
  try {
    // Validar dados usando schema
    const validatedData = participantSchema.parse(data);

    // Verificar se email já existe
    const existingParticipant = await db
      .select()
      .from(participants)
      .where(eq(participants.email, validatedData.email))
      .limit(1);

    let participantId: string;
    let isNewParticipant = false;

    if (existingParticipant.length > 0) {
      // Participante já existe - usar ID existente
      participantId = existingParticipant[0].id;

      // Atualizar informações do participante se necessário
      await db
        .update(participants)
        .set({
          name: validatedData.name,
          phone: validatedData.phone || existingParticipant[0].phone,
          category: validatedData.category,
          experience: validatedData.experience,
          additionalInfo:
            validatedData.additionalInfo ||
            existingParticipant[0].additionalInfo,
          hasSpecialNeeds: validatedData.hasSpecialNeeds,
          specialNeedsDescription:
            validatedData.specialNeedsDescription ||
            existingParticipant[0].specialNeedsDescription,
          acceptsEmailNotifications: validatedData.acceptsEmailNotifications,
          rankingPhoto:
            validatedData.rankingPhoto || existingParticipant[0].rankingPhoto,
          updatedAt: new Date(),
        })
        .where(eq(participants.id, participantId));
    } else {
      // Criar novo participante
      const newParticipant = await db
        .insert(participants)
        .values({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          avatar: validatedData.avatar || null,
          rankingPhoto: validatedData.rankingPhoto || null,
          category: validatedData.category,
          experience: validatedData.experience,
          additionalInfo: validatedData.additionalInfo || null,
          hasSpecialNeeds: validatedData.hasSpecialNeeds,
          specialNeedsDescription:
            validatedData.specialNeedsDescription || null,
          acceptsEmailNotifications: validatedData.acceptsEmailNotifications,
          status: "approved", // Auto aprovar para registro público
          registrationDate: new Date(),
          approvedAt: new Date(),
        })
        .returning();

      participantId = newParticipant[0].id;
      isNewParticipant = true;
    }

    // Verificar se já está inscrito neste evento
    if (validatedData.eventId) {
      const existingRegistration = await db
        .select({ id: eventRegistrations.id })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, validatedData.eventId),
            eq(eventRegistrations.participantId, participantId)
          )
        )
        .limit(1);

      if (existingRegistration.length === 0) {
        // Criar inscrição no evento
        await db.insert(eventRegistrations).values({
          eventId: validatedData.eventId,
          participantId: participantId,
          status: "registered",
          registeredAt: new Date(),
        });
      }
    }

    revalidatePath("/participantes");
    revalidatePath("/events");

    return {
      success: true,
      participantId: participantId,
      isNewParticipant,
      message: isNewParticipant
        ? "Participante registrado com sucesso!"
        : "Participante atualizado e inscrito no evento com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao registrar participante:", error);

    if (error instanceof Error && error.message.includes("UNIQUE constraint")) {
      return {
        success: false,
        error:
          "Este email já está registrado. Use a opção 'Já sou participante' para acessar sua conta.",
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor. Tente novamente em alguns minutos.",
    };
  }
}

export async function getParticipantByEmail(email: string): Promise<{
  success: boolean;
  participant?: any;
  error?: string;
}> {
  try {
    const participant = await db
      .select()
      .from(participants)
      .where(eq(participants.email, email))
      .limit(1);

    if (participant.length === 0) {
      return {
        success: false,
        error: "Nenhum participante encontrado com este email.",
      };
    }

    return {
      success: true,
      participant: participant[0],
    };
  } catch (error) {
    console.error("Erro ao buscar participante:", error);
    return {
      success: false,
      error: "Erro interno do servidor.",
    };
  }
}
