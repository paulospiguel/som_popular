"use server";

import { db } from "@/database";
import {
  evaluationSessions,
  eventEvaluations,
  eventJudges,
  judges,
  participants,
  type NewEvaluationSession,
  type NewEventEvaluation,
} from "@/database/schema";
import { requireOperatorOrAdmin } from "@/lib/action-guards";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Criar nova avaliação
 */
export async function createEvaluation(
  data: Omit<NewEventEvaluation, "id" | "createdAt" | "updatedAt">
) {
  try {
    // Verificar permissões (admin ou operador)
    await requireOperatorOrAdmin();

    const [evaluation] = await db
      .insert(eventEvaluations)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/votacoes");
    return { success: true, data: evaluation };
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao guardar avaliação";
    return { success: false, error: errorMessage };
  }
}

/**
 * Obter avaliações de um evento
 */
export async function getEventEvaluations(eventId: string) {
  try {
    const evaluations = await db
      .select()
      .from(eventEvaluations)
      .where(eq(eventEvaluations.eventId, eventId))
      .orderBy(desc(eventEvaluations.createdAt));

    return { success: true, data: evaluations };
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    return { success: false, error: "Erro ao buscar avaliações" };
  }
}

/**
 * Obter avaliações de um participante
 */
export async function getParticipantEvaluations(
  participantId: string,
  eventId: string
) {
  try {
    const evaluations = await db
      .select()
      .from(eventEvaluations)
      .where(
        and(
          eq(eventEvaluations.participantId, participantId),
          eq(eventEvaluations.eventId, eventId)
        )
      )
      .orderBy(desc(eventEvaluations.createdAt));

    return { success: true, data: evaluations };
  } catch (error) {
    console.error("Erro ao buscar avaliações do participante:", error);
    return { success: false, error: "Erro ao buscar avaliações" };
  }
}

/**
 * Iniciar sessão de avaliação
 */
export async function startEvaluationSession(
  data: Omit<NewEvaluationSession, "id" | "startedAt">
) {
  try {
    // Terminar sessões ativas do mesmo juiz
    await db
      .update(evaluationSessions)
      .set({
        isActive: false,
        endedAt: new Date(),
      })
      .where(
        and(
          eq(evaluationSessions.judgeId, data.judgeId),
          eq(evaluationSessions.isActive, true)
        )
      );

    // Criar nova sessão
    const [session] = await db
      .insert(evaluationSessions)
      .values({
        ...data,
        startedAt: new Date(),
      })
      .returning();

    return { success: true, data: session };
  } catch (error) {
    console.error("Erro ao iniciar sessão:", error);
    return { success: false, error: "Erro ao iniciar sessão de avaliação" };
  }
}

/**
 * Terminar sessão de avaliação
 */
export async function endEvaluationSession(sessionId: string) {
  try {
    const [session] = await db
      .update(evaluationSessions)
      .set({
        isActive: false,
        endedAt: new Date(),
      })
      .where(eq(evaluationSessions.id, sessionId))
      .returning();

    return { success: true, data: session };
  } catch (error) {
    console.error("Erro ao terminar sessão:", error);
    return { success: false, error: "Erro ao terminar sessão" };
  }
}

/**
 * Obter sessão ativa do juiz
 */
export async function getActiveSession(judgeId: string) {
  try {
    const [session] = await db
      .select()
      .from(evaluationSessions)
      .where(
        and(
          eq(evaluationSessions.judgeId, judgeId),
          eq(evaluationSessions.isActive, true)
        )
      )
      .orderBy(desc(evaluationSessions.startedAt));

    return { success: true, data: session };
  } catch (error) {
    console.error("Erro ao buscar sessão ativa:", error);
    return { success: false, error: "Erro ao buscar sessão" };
  }
}

/**
 * Obter participantes com informações de avaliação para um evento
 */
export async function getEventParticipantsWithEvaluations(eventId: string) {
  try {
    // Buscar todos os participantes ativos
    const allParticipants = await db
      .select()
      .from(participants)
      .where(eq(participants.status, "approved"));

    // Para cada participante, buscar suas avaliações se existirem
    const participantsList = await Promise.all(
      allParticipants.map(async (participant) => {
        // Buscar avaliações do participante para este evento
        const evaluations = await db
          .select({
            evaluation: eventEvaluations,
            judge: judges,
          })
          .from(eventEvaluations)
          .innerJoin(judges, eq(eventEvaluations.judgeId, judges.id))
          .where(
            and(
              eq(eventEvaluations.eventId, eventId),
              eq(eventEvaluations.participantId, participant.id)
            )
          );

        const avgScore =
          evaluations.length > 0
            ? evaluations.reduce((sum, e) => sum + e.evaluation.score, 0) /
              evaluations.length
            : 0;

        return {
          id: participant.id,
          name: participant.name,
          category: participant.category,
          order: 1, // TODO: Implementar ordem de apresentação
          totalEvaluations: evaluations.length,
          avgScore: Math.round(avgScore * 100) / 100,
          evaluations,
        };
      })
    );

    return { success: true, data: participantsList };
  } catch (error) {
    console.error("Erro ao buscar participantes com avaliações:", error);
    return { success: false, error: "Erro ao buscar dados" };
  }
}

/**
 * Verificar se todos os jurados avaliaram um participante
 */
export async function checkParticipantEvaluationStatus(
  eventId: string,
  participantId: string
) {
  try {
    // Buscar total de jurados do evento
    const eventJudgesList = await db
      .select()
      .from(eventJudges)
      .where(eq(eventJudges.eventId, eventId));

    // Buscar avaliações existentes do participante
    const existingEvaluations = await db
      .select()
      .from(eventEvaluations)
      .where(
        and(
          eq(eventEvaluations.eventId, eventId),
          eq(eventEvaluations.participantId, participantId)
        )
      );

    const totalJudges = eventJudgesList.length;
    const completedEvaluations = existingEvaluations.length;
    const isComplete = completedEvaluations >= totalJudges;

    // Calcular média se completo
    const avgScore = isComplete
      ? existingEvaluations.reduce((sum, e) => sum + e.score, 0) /
        completedEvaluations
      : 0;

    return {
      success: true,
      data: {
        totalJudges,
        completedEvaluations,
        isComplete,
        avgScore: Math.round(avgScore * 100) / 100,
        missingJudges: totalJudges - completedEvaluations,
      },
    };
  } catch (error) {
    console.error("Erro ao verificar status de avaliação:", error);
    return { success: false, error: "Erro ao verificar status" };
  }
}

/**
 * Obter estatísticas de avaliação de um evento
 */
export async function getEventEvaluationStats(eventId: string) {
  try {
    // Total de jurados
    const totalJudges = await db
      .select()
      .from(eventJudges)
      .where(eq(eventJudges.eventId, eventId));

    // Total de participantes
    const totalParticipants = await db
      .select({ participantId: eventEvaluations.participantId })
      .from(eventEvaluations)
      .where(eq(eventEvaluations.eventId, eventId))
      .groupBy(eventEvaluations.participantId);

    // Total de avaliações
    const totalEvaluations = await db
      .select()
      .from(eventEvaluations)
      .where(eq(eventEvaluations.eventId, eventId));

    const expectedEvaluations = totalJudges.length * totalParticipants.length;
    const completedEvaluations = totalEvaluations.length;
    const progressPercentage =
      expectedEvaluations > 0
        ? Math.round((completedEvaluations / expectedEvaluations) * 100)
        : 0;

    return {
      success: true,
      data: {
        totalJudges: totalJudges.length,
        totalParticipants: totalParticipants.length,
        completedEvaluations,
        expectedEvaluations,
        progressPercentage,
        isComplete: completedEvaluations >= expectedEvaluations,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return { success: false, error: "Erro ao buscar estatísticas" };
  }
}

/**
 * Publicar resultados de um evento
 */
export async function publishEventResults(eventId: string) {
  try {
    // Marcar todas as avaliações como publicadas
    await db
      .update(eventEvaluations)
      .set({ isPublished: true })
      .where(eq(eventEvaluations.eventId, eventId));

    revalidatePath("/dashboard/evento-em-curso");
    revalidatePath("/dashboard/eventos");
    revalidatePath("/votacoes");

    return { success: true };
  } catch (error) {
    console.error("Erro ao publicar resultados:", error);
    return { success: false, error: "Erro ao publicar resultados" };
  }
}
