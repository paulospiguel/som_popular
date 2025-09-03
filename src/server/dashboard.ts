"use server";

import { and, eq, gte, sql } from "drizzle-orm";

import { db } from "@/server/database";
import {
  eventEvaluations,
  eventJudges,
  events,
  participants,
} from "@/server/database/schema";

// Função auxiliar para converter status em texto legível
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    draft: "Rascunho",
    published: "Publicado",
    ongoing: "Em Curso",
    completed: "Concluído",
    cancelled: "Cancelado",
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
  };
  return statusMap[status] || status;
}

export interface DashboardStats {
  totalParticipants: number;
  newParticipantsThisWeek: number;
  activeEvents: number;
  pendingEvents: number;
  totalEvaluations: number;
  completedEvaluations: number;
  pendingActions: number;
  recentActivity: Array<{
    type: "participant" | "event" | "evaluation" | "status_change";
    message: string;
    timestamp: Date;
    details?: any;
  }>;
}

export async function getDashboardStats(): Promise<{
  success: boolean;
  data?: DashboardStats;
  error?: string;
}> {
  try {
    // Calcular datas para esta semana
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Total de participantes
    const totalParticipantsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(participants)
      .where(eq(participants.status, "approved"));

    const totalParticipants = totalParticipantsResult[0]?.count || 0;

    // Novos participantes esta semana
    const newParticipantsThisWeekResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(participants)
      .where(
        and(
          eq(participants.status, "approved"),
          gte(participants.createdAt, startOfWeek)
        )
      );

    const newParticipantsThisWeek =
      newParticipantsThisWeekResult[0]?.count || 0;

    // Eventos ativos (publicados ou em curso)
    const activeEventsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(sql`${events.status} IN ('published', 'ongoing')`);

    const activeEvents = activeEventsResult[0]?.count || 0;

    // Eventos pendentes (rascunho)
    const pendingEventsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(eq(events.status, "draft"));

    const pendingEvents = pendingEventsResult[0]?.count || 0;

    // Total de avaliações esperadas
    const totalEvaluationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(eventJudges);

    const totalEvaluations = totalEvaluationsResult[0]?.count || 0;

    // Avaliações completadas
    const completedEvaluationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(eventEvaluations);

    const completedEvaluations = completedEvaluationsResult[0]?.count || 0;

    // Pendências (eventos que precisam de atenção)
    const pendingActions = Math.max(
      pendingEvents,
      totalEvaluations - completedEvaluations
    );

    // Buscar atividade recente real e mais diversificada
    const recentParticipants = await db
      .select({
        id: participants.id,
        name: participants.name,
        createdAt: participants.createdAt,
        status: participants.status,
      })
      .from(participants)
      .orderBy(sql`${participants.createdAt} DESC`)
      .limit(5);

    const recentEvents = await db
      .select({
        id: events.id,
        name: events.name,
        createdAt: events.createdAt,
        status: events.status,
        updatedAt: events.updatedAt,
      })
      .from(events)
      .orderBy(sql`${events.updatedAt || events.createdAt} DESC`)
      .limit(5);

    // Buscar avaliações recentes
    const recentEvaluations = await db
      .select({
        id: eventEvaluations.id,
        eventId: eventEvaluations.eventId,
        judgeId: eventEvaluations.judgeId,
        participantId: eventEvaluations.participantId,
        score: eventEvaluations.score,
        createdAt: eventEvaluations.createdAt,
      })
      .from(eventEvaluations)
      .orderBy(sql`${eventEvaluations.createdAt} DESC`)
      .limit(3);

    // Buscar nomes dos eventos para as avaliações
    const eventIds = [...new Set(recentEvaluations.map((e) => e.eventId))];
    const eventNames =
      eventIds.length > 0
        ? await db
            .select({
              id: events.id,
              name: events.name,
            })
            .from(events)
            .where(sql`${events.id} IN (${eventIds.join(",")})`)
        : [];

    // Buscar nomes dos participantes para as avaliações
    const participantIds = [
      ...new Set(recentEvaluations.map((e) => e.participantId)),
    ];
    const participantNames =
      participantIds.length > 0
        ? await db
            .select({
              id: participants.id,
              name: participants.name,
            })
            .from(participants)
            .where(sql`${participants.id} IN (${participantIds.join(",")})`)
        : [];

    // Construir atividade recente
    const recentActivity: Array<{
      type: "participant" | "event" | "evaluation" | "status_change";
      message: string;
      timestamp: Date;
      details?: any;
    }> = [];

    // Adicionar participantes recentes com diferentes status
    recentParticipants.forEach((participant) => {
      if (participant.createdAt) {
        let message = "";
        if (participant.status === "pending") {
          message = `Nova inscrição pendente: ${participant.name}`;
        } else if (participant.status === "approved") {
          message = `Inscrição aprovada: ${participant.name}`;
        } else if (participant.status === "rejected") {
          message = `Inscrição rejeitada: ${participant.name}`;
        }

        recentActivity.push({
          type: "participant",
          message,
          timestamp: participant.createdAt,
          details: { status: participant.status },
        });
      }
    });

    // Adicionar eventos recentes com mudanças de status
    recentEvents.forEach((event) => {
      if (event.createdAt) {
        const isNew = event.createdAt === event.updatedAt;
        const action = isNew ? "criado" : "atualizado";
        const statusText = getStatusText(event.status);

        recentActivity.push({
          type: "event",
          message: `Evento "${event.name}" ${action} (${statusText})`,
          timestamp: event.updatedAt || event.createdAt,
          details: { status: event.status, isNew },
        });
      }
    });

    // Adicionar avaliações recentes
    recentEvaluations.forEach((evaluation) => {
      if (evaluation.createdAt) {
        const eventName =
          eventNames.find((ev) => ev.id === evaluation.eventId)?.name ||
          "Evento";
        const participantName =
          participantNames.find((p) => p.id === evaluation.participantId)
            ?.name || "Participante";

        recentActivity.push({
          type: "evaluation",
          message: `Avaliação registrada: ${participantName} no evento "${eventName}"`,
          timestamp: evaluation.createdAt,
          details: { score: evaluation.score },
        });
      }
    });

    // Ordenar por timestamp mais recente
    recentActivity.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    const stats: DashboardStats = {
      totalParticipants,
      newParticipantsThisWeek,
      activeEvents,
      pendingEvents,
      totalEvaluations,
      completedEvaluations,
      pendingActions,
      recentActivity,
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas da dashboard:", error);
    return {
      success: false,
      error: "Erro ao buscar estatísticas",
    };
  }
}
