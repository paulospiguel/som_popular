"use server";

import { and, eq, getTableColumns, ilike, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import {
  PARTICIPANT_STATUS_ENUM,
  REGISTRATION_METHOD_ENUM,
  REGISTRATION_STATUS_ENUM,
} from "@/constants/enum";
import { db } from "@/infra/database";
import {
  eventRegistrations,
  events,
  experienceLevelEnum,
  NewParticipant,
  Participant,
  participantCategoryEnum,
  participants,
  participantStatusEnum,
  uploads,
} from "@/infra/database/schema";
import { requireAdmin } from "@/lib/action-guards";
import { sendEmail } from "@/lib/mailer/resend";
import { SendAcceptTermsTemplate } from "@/lib/mailer/templates/send-accept-terms";

export type ParticipantFilters = {
  status?: (typeof participantStatusEnum.enumValues)[number];
  category?: (typeof participantCategoryEnum.enumValues)[number];
  experience?: (typeof experienceLevelEnum.enumValues)[number];
  search?: string | undefined;
  eventId?: string;
};

/**
 * Buscar todos os participantes aprovados
 */
export async function getApprovedParticipants(filters?: ParticipantFilters) {
  try {
    const whereClause: SQL[] = [];

    if (filters?.status) {
      whereClause.push(eq(participants.status, filters.status));
    }

    if (filters?.category) {
      whereClause.push(eq(participants.category, filters.category));
    }

    if (filters?.experience) {
      whereClause.push(eq(participants.experience, filters.experience));
    }

    if (filters?.search) {
      whereClause.push(ilike(participants.name, `%${filters.search}%`));
    }

    if (filters?.eventId) {
      whereClause.push(eq(eventRegistrations.eventId, filters.eventId));
    }

    const approvedParticipants = await db
      .select()
      .from(participants)
      .where(whereClause.length > 0 ? and(...whereClause) : undefined);

    return { success: true, data: approvedParticipants };
  } catch (error) {
    console.error("Erro ao buscar participantes aprovados:", error);
    return { success: false, error: "Erro ao buscar participantes" };
  }
}

/**
 * Buscar todos os participantes (qualquer status)
 */
export async function getAllParticipants(filters?: ParticipantFilters) {
  try {
    const whereClause: SQL[] = [];

    if (filters?.status) {
      whereClause.push(eq(participants.status, filters.status));
    }

    if (filters?.category) {
      whereClause.push(eq(participants.category, filters.category));
    }

    if (filters?.experience) {
      whereClause.push(eq(participants.experience, filters.experience));
    }

    if (filters?.search) {
      whereClause.push(ilike(participants.name, `%${filters.search}%`));
    }

    // Se há filtro por eventId, usar uma abordagem diferente para evitar duplicatas
    if (filters?.eventId) {
      const eventParticipants = await db
        .select({
          ...getTableColumns(participants),
          photoImage: uploads,
        })
        .from(participants)
        .leftJoin(uploads, eq(participants.photoImageId, uploads.id))
        .innerJoin(
          eventRegistrations,
          eq(participants.id, eventRegistrations.participantId)
        )
        .where(
          and(eq(eventRegistrations.eventId, filters.eventId), ...whereClause)
        );

      return {
        success: true,
        data: eventParticipants.map((item) => ({
          ...item,
          photoImage: item.photoImage,
        })),
      };
    }

    // Para outros filtros, usar a query original
    const allParticipants = await db
      .select({
        ...getTableColumns(participants),
        photoImage: uploads,
      })
      .from(participants)
      .leftJoin(uploads, eq(participants.photoImageId, uploads.id))
      .where(whereClause.length > 0 ? and(...whereClause) : undefined);

    return {
      success: true,
      data: allParticipants.map((item) => ({
        ...item,
        photoImage: item.photoImage,
      })),
    };
  } catch (error) {
    console.error("Erro ao buscar todos os participantes:", error);
    return { success: false, error: "Erro ao buscar participantes" };
  }
}

/**
 * Aprovar inscrição do participante
 */
export async function approveParticipant(participantId: string) {
  try {
    await requireAdmin();

    const [updated] = await db
      .update(participants)
      .set({
        status: "approved",
        approvedAt: new Date(),
        rejectedAt: null,
        rejectionReason: null,
      })
      .where(eq(participants.id, participantId))
      .returning();

    if (!updated)
      return { success: false, error: "Participante não encontrado" };

    try {
      await sendEmail({
        to: updated.email,
        subject: "Inscrição aprovada - Festival Som Popular",
        text: `Olá ${updated.name},\n\nA sua inscrição foi aprovada.\n\nAté breve!`,
      });
    } catch (e) {
      console.error("Falha ao enviar email de aprovação:", e);
    }

    revalidatePath("/dashboard/participants");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Erro ao aprovar participante:", error);
    return { success: false, error: "Erro ao aprovar inscrição" };
  }
}

/**
 * Rejeitar/Indeferir inscrição do participante (com justificativa)
 */
export async function rejectParticipant(participantId: string, reason: string) {
  try {
    await requireAdmin();
    if (!reason || reason.trim().length < 5)
      return { success: false, error: "Justificativa é obrigatória" };

    const [updated] = await db
      .update(participants)
      .set({
        status: "rejected",
        rejectionReason: reason,
        rejectedAt: new Date(),
      })
      .where(eq(participants.id, participantId))
      .returning();

    if (!updated)
      return { success: false, error: "Participante não encontrado" };

    try {
      await sendEmail({
        to: updated.email,
        subject: "Inscrição indeferida - Festival Som Popular",
        text: `Olá ${updated.name},\n\nA sua inscrição foi indeferida. Motivo: ${reason}.\n\nQualquer dúvida, responda este email.`,
      });
    } catch (e) {
      console.error("Falha ao enviar email de indeferimento:", e);
    }

    revalidatePath("/dashboard/participants");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Erro ao rejeitar participante:", error);
    return { success: false, error: "Erro ao rejeitar inscrição" };
  }
}

/**
 * Inativar participante (com justificativa), sem alterar histórico de inscrição
 */
export async function deactivateParticipant(
  participantId: string,
  reason: string
) {
  try {
    await requireAdmin();
    if (!reason || reason.trim().length < 5)
      return { success: false, error: "Justificativa é obrigatória" };

    const [updated] = await db
      .update(participants)
      .set({
        isActive: false,
        notes: reason,
        updatedAt: new Date(),
        status: PARTICIPANT_STATUS_ENUM.rejected,
      })
      .where(eq(participants.id, participantId))
      .returning();

    if (!updated)
      return { success: false, error: "Participante não encontrado" };

    try {
      await sendEmail({
        to: updated.email,
        subject: "Conta inativada - Festival Som Popular",
        text: `Olá ${updated.name},\n\nA sua conta foi inativada pelos seguintes motivos: ${reason}.`,
      });
    } catch (e) {
      console.error("Falha ao enviar email de inativação:", e);
    }

    revalidatePath("/dashboard/participants");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Erro ao inativar participante:", error);
    return { success: false, error: "Erro ao inativar participante" };
  }
}

/**
 * Detalhes do participante com inscrições e eventos relacionados
 */
export async function getParticipantDetails(participantId: string) {
  try {
    const participantRows = await db
      .select()
      .from(participants)
      .where(eq(participants.id, participantId));

    const participant = participantRows[0];
    if (!participant)
      return { success: false, error: "Participante não encontrado" };

    const registrations = await db
      .select({ registration: eventRegistrations, event: events })
      .from(eventRegistrations)
      .innerJoin(events, eq(eventRegistrations.eventId, events.id))
      .where(eq(eventRegistrations.participantId, participantId));

    return { success: true, data: { participant, registrations } };
  } catch (error) {
    console.error("Erro ao buscar detalhes do participante:", error);
    return { success: false, error: "Erro ao buscar detalhes" };
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
        photoImage: uploads,
      })
      .from(eventRegistrations)
      .innerJoin(
        participants,
        eq(eventRegistrations.participantId, participants.id)
      )
      .leftJoin(uploads, eq(participants.photoImageId, uploads.id))
      .where(eq(eventRegistrations.eventId, eventId));

    return {
      success: true,
      data: eventParticipants.map((item) => ({
        ...item.participant,
        photoImage: item.photoImage,
      })),
    };
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
    await requireAdmin();

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
        status: REGISTRATION_STATUS_ENUM.registered,
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
    await requireAdmin();

    const existingRegistration = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.participantId, participantId)
        )
      );

    if (existingRegistration.length === 0) {
      return {
        success: false,
        error: "Participante não está inscrito neste evento",
      };
    }

    const result = await db
      .delete(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.participantId, participantId)
        )
      );

    if (result.length === 0) {
      return {
        success: false,
        error: "Participante não está inscrito neste evento",
      };
    }

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
 * Verificar se email já existe
 */
export async function checkEmailExists(email: string) {
  try {
    const existingParticipant = await db
      .select({ id: participants.id })
      .from(participants)
      .where(eq(participants.email, email))
      .limit(1);

    return { success: true, exists: existingParticipant.length > 0 };
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    return { success: false, error: "Erro ao verificar email" };
  }
}

/**
 * Criar participante
 */
export async function createParticipant(participant: NewParticipant) {
  try {
    await requireAdmin();

    // Verificar se email já existe
    const emailCheck = await checkEmailExists(participant.email);
    if (!emailCheck.success) {
      return { success: false, error: emailCheck.error };
    }
    if (emailCheck.exists) {
      return {
        success: false,
        error: "Este email já está cadastrado no sistema",
      };
    }

    // Inserir participante no banco de dados marcando como cadastro via plataforma
    const [newParticipant] = await db
      .insert(participants)
      .values({
        ...participant,
        registrationMethod: REGISTRATION_METHOD_ENUM.platform,
      })
      .returning();

    revalidatePath("/dashboard/participants");
    return { success: true, data: newParticipant };
  } catch (error) {
    console.error("Erro ao criar participante:", error);
    return { success: false, error: "Erro ao criar participante" };
  }
}

/**
 * Criar participante com envio de email de termos e condições
 */
export async function createParticipantWithTermsEmail(
  participant: NewParticipant
) {
  try {
    await requireAdmin();

    // Verificar se email já existe
    const emailCheck = await checkEmailExists(participant.email);
    if (!emailCheck.success) {
      return { success: false, error: emailCheck.error };
    }
    if (emailCheck.exists) {
      return {
        success: false,
        error: "Este email já está cadastrado no sistema",
      };
    }

    // Inserir participante no banco de dados marcando como cadastro via plataforma
    const [newParticipant] = await db
      .insert(participants)
      .values({
        ...participant,
        registrationMethod: REGISTRATION_METHOD_ENUM.platform,
      })
      .returning();

    // Tentar enviar email de termos e condições
    try {
      await sendEmail({
        to: newParticipant.email,
        subject: "Termos e Condições - Festival Som Popular",
        text: `Olá ${newParticipant.name}, para aceitar os termos e condições, acesse: ${process.env.NEXT_PUBLIC_APP_URL}/accept-terms-and-conditions?participantId=${newParticipant.id}`,
        template: SendAcceptTermsTemplate({
          name: newParticipant.name,
          termsAndConditionsUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-terms-and-conditions?participantId=${newParticipant.id}`,
        }),
      });

      revalidatePath("/dashboard/participants");
      return { success: true, data: newParticipant, emailSent: true };
    } catch (emailError) {
      console.error("Erro ao enviar email de termos:", emailError);

      // Se o email falhar, deletar o participante criado
      await db
        .delete(participants)
        .where(eq(participants.id, newParticipant.id));

      return {
        success: false,
        error: "Erro ao enviar email de termos e condições",
        emailError:
          emailError instanceof Error
            ? emailError.message
            : "Erro desconhecido no envio de email",
      };
    }
  } catch (error) {
    console.error("Erro ao criar participante:", error);
    return { success: false, error: "Erro ao criar participante" };
  }
}

/**
 * Atualizar participante
 */
export async function updateParticipant(
  participantId: string,
  participant: Participant
) {
  try {
    await requireAdmin();
    const [updatedParticipant] = await db
      .update(participants)
      .set({
        ...participant,
        updatedAt: new Date(),
      })
      .where(eq(participants.id, participantId))
      .returning();
    return { success: true, data: updatedParticipant };
  } catch (error) {
    console.error("Erro ao atualizar participante:", error);
    return { success: false, error: "Erro ao atualizar participante" };
  }
}

/**
 * Deletar participante
 */
export async function deleteParticipant(participantId: string) {
  try {
    await requireAdmin();
    await db.delete(participants).where(eq(participants.id, participantId));
    return { success: true, data: participantId };
  } catch (error) {
    console.error("Erro ao deletar participante:", error);
    return { success: false, error: "Erro ao deletar participante" };
  }
}
