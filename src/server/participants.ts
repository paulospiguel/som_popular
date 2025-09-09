"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/action-guards";
import { sendEmail } from "@/lib/mailer/resend";
import { db } from "@/server/database";
import {
  eventRegistrations,
  events,
  participants,
} from "@/server/database/schema";

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
 * Buscar todos os participantes (qualquer status)
 */
export async function getAllParticipants() {
  try {
    const allParticipants = await db.select().from(participants);

    return { success: true, data: allParticipants };
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
      // não falhar a ação por causa do email
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
      .set({ archived: true, notes: reason, updatedAt: new Date() })
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
    await requireAdmin();

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
