"use server";

import { db } from "@/server/database";
import {
  eventEvaluations,
  events,
  judges,
  participants,
} from "@/server/database/schema";
import { and, desc, eq, sql } from "drizzle-orm";

export interface EventRanking {
  participantId: string;
  participantName: string;
  averageScore: number;
  totalScores: number;
  evaluations: Array<{
    judgeId: string;
    judgeName: string;
    score: number;
    notes?: string | null;
  }>;
  position: number;
}

export interface EventRankingData {
  event: {
    id: string;
    name: string;
    description: string | null;
    type: string;
    category: string;
    startDate: Date;
    location: string;
    status: string;
  };
  rankings: EventRanking[];
  phases: Array<{
    type: string;
    name: string;
    status: string;
    participantCount: number;
  }>;
  totalParticipants: number;
  evaluatedParticipants: number;
}

/**
 * Busca ranking de um evento específico
 */
export async function getEventRanking(eventId: string): Promise<{
  success: boolean;
  data?: EventRankingData;
  error?: string;
}> {
  try {
    // Buscar informações do evento
    const eventResult = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        type: events.type,
        category: events.category,
        startDate: events.startDate,
        location: events.location,
        status: events.status,
      })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (eventResult.length === 0) {
      return {
        success: false,
        error: "Evento não encontrado",
      };
    }

    const event = eventResult[0];

    // Buscar avaliações do evento com informações dos participantes e juízes
    const evaluationsResult = await db
      .select({
        participantId: eventEvaluations.participantId,
        participantName: participants.name,
        judgeId: eventEvaluations.judgeId,
        judgeName: judges.name,
        score: eventEvaluations.score,
        notes: eventEvaluations.notes,
      })
      .from(eventEvaluations)
      .innerJoin(
        participants,
        eq(eventEvaluations.participantId, participants.id)
      )
      .innerJoin(judges, eq(eventEvaluations.judgeId, judges.id))
      .where(
        and(
          eq(eventEvaluations.eventId, eventId),
          eq(eventEvaluations.isPublished, true)
        )
      )
      .orderBy(desc(eventEvaluations.score));

    // Agrupar avaliações por participante
    const participantEvaluations = new Map<
      string,
      {
        participantName: string;
        evaluations: Array<{
          judgeId: string;
          judgeName: string;
          score: number;
          notes?: string | null;
        }>;
      }
    >();

    evaluationsResult.forEach((evaluation) => {
      const participantId = evaluation.participantId;

      if (!participantEvaluations.has(participantId)) {
        participantEvaluations.set(participantId, {
          participantName: evaluation.participantName,
          evaluations: [],
        });
      }

      participantEvaluations.get(participantId)!.evaluations.push({
        judgeId: evaluation.judgeId,
        judgeName: evaluation.judgeName,
        score: evaluation.score,
        notes: evaluation.notes,
      });
    });

    // Calcular rankings
    const rankings: EventRanking[] = Array.from(
      participantEvaluations.entries()
    )
      .map(([participantId, data]) => {
        const totalScores = data.evaluations.length;
        const averageScore =
          totalScores > 0
            ? data.evaluations.reduce(
                (sum, evaluation) => sum + evaluation.score,
                0
              ) / totalScores
            : 0;

        return {
          participantId,
          participantName: data.participantName,
          averageScore: Math.round(averageScore * 100) / 100, // Arredondar para 2 casas decimais
          totalScores,
          evaluations: data.evaluations,
          position: 0, // Será calculado depois da ordenação
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore) // Ordenar por média decrescente
      .map((ranking, index) => ({
        ...ranking,
        position: index + 1,
      }));

    // Buscar fases do festival (eventos relacionados por categoria)
    const phasesResult = await db
      .select({
        type: events.type,
        status: events.status,
        participantCount: sql<number>`count(distinct ${eventEvaluations.participantId})`,
      })
      .from(events)
      .leftJoin(eventEvaluations, eq(events.id, eventEvaluations.eventId))
      .where(
        and(eq(events.category, event.category), eq(events.isPublic, true))
      )
      .groupBy(events.type, events.status)
      .orderBy(
        sql`case 
          when ${events.type} = 'classificatoria' then 1
          when ${events.type} = 'semi-final' then 2
          when ${events.type} = 'final' then 3
          else 4
        end`
      );

    const phases = phasesResult.map((phase) => ({
      type: phase.type,
      name: getPhaseLabel(phase.type),
      status: phase.status,
      participantCount: phase.participantCount || 0,
    }));

    const totalParticipants = participantEvaluations.size;
    const evaluatedParticipants = rankings.filter(
      (r) => r.totalScores > 0
    ).length;

    return {
      success: true,
      data: {
        event,
        rankings,
        phases,
        totalParticipants,
        evaluatedParticipants,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar ranking do evento:", error);
    return {
      success: false,
      error: "Erro ao buscar ranking",
    };
  }
}

/**
 * Busca rankings de todos os eventos públicos
 */
export async function getAllEventRankings(): Promise<{
  success: boolean;
  events?: Array<{
    id: string;
    name: string;
    type: string;
    category: string;
    status: string;
    startDate: Date;
    participantCount: number;
    evaluatedCount: number;
    topParticipant?:
      | {
          name: string;
          score: number;
        }
      | undefined;
  }>;
  error?: string;
}> {
  try {
    // Buscar eventos públicos com informações de ranking
    const eventsResult = await db
      .select({
        id: events.id,
        name: events.name,
        type: events.type,
        category: events.category,
        status: events.status,
        startDate: events.startDate,
        participantCount: sql<number>`count(distinct ${eventEvaluations.participantId})`,
        evaluatedCount: sql<number>`count(case when ${eventEvaluations.isPublished} = true then 1 end)`,
      })
      .from(events)
      .leftJoin(eventEvaluations, eq(events.id, eventEvaluations.eventId))
      .where(eq(events.isPublic, true))
      .groupBy(events.id)
      .orderBy(events.startDate);

    // Para cada evento, buscar o participante com melhor pontuação
    const eventsWithRankings = await Promise.all(
      eventsResult.map(async (event) => {
        const topParticipantResult = await db
          .select({
            participantName: participants.name,
            averageScore: sql<number>`avg(${eventEvaluations.score})`,
          })
          .from(eventEvaluations)
          .innerJoin(
            participants,
            eq(eventEvaluations.participantId, participants.id)
          )
          .where(
            and(
              eq(eventEvaluations.eventId, event.id),
              eq(eventEvaluations.isPublished, true)
            )
          )
          .groupBy(eventEvaluations.participantId, participants.name)
          .orderBy(desc(sql`avg(${eventEvaluations.score})`))
          .limit(1);

        return {
          ...event,
          topParticipant:
            topParticipantResult.length > 0
              ? {
                  name: topParticipantResult[0].participantName,
                  score:
                    Math.round(topParticipantResult[0].averageScore * 100) /
                    100,
                }
              : undefined,
        };
      })
    );

    return {
      success: true,
      events: eventsWithRankings,
    };
  } catch (error) {
    console.error("Erro ao buscar rankings:", error);
    return {
      success: false,
      error: "Erro ao buscar rankings",
    };
  }
}

function getPhaseLabel(type: string): string {
  const labels: Record<string, string> = {
    classificatoria: "Classificatória",
    "semi-final": "Semi-Final",
    final: "Final",
  };
  return labels[type] || type;
}
