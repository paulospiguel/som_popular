"use server";

import { db } from "@/database";
import { eventRegistrations, participants } from "@/database/schema";
import { participantSchema } from "@/schemas/participant";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface ParticipantRegistrationData {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
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

    if (existingParticipant.length > 0) {
      return {
        success: false,
        error:
          "Já existe um participante registrado com este email. Use a opção 'Já sou participante' para se inscrever em eventos.",
      };
    }

    // Criar novo participante
    const newParticipant = await db
      .insert(participants)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        avatar: validatedData.avatar || null,
        category: validatedData.category,
        experience: validatedData.experience,
        additionalInfo: validatedData.additionalInfo || null,
        hasSpecialNeeds: validatedData.hasSpecialNeeds,
        specialNeedsDescription: validatedData.specialNeedsDescription || null,
        acceptsEmailNotifications: validatedData.acceptsEmailNotifications,
        status: "approved", // Auto aprovar para registro público
        registrationDate: new Date(),
        approvedAt: new Date(),
      })
      .returning();

    // Criar inscrição automática no evento
    if (validatedData.eventId) {
      await db.insert(eventRegistrations).values({
        eventId: validatedData.eventId,
        participantId: newParticipant[0].id,
        status: "registered",
        registrationDate: new Date(),
      });
    }

    revalidatePath("/participantes");
    revalidatePath("/eventos");

    return {
      success: true,
      participantId: newParticipant[0].id,
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
