"use server";

import { and, eq, ilike, sql, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/infra/database";
import {
  eventJudges,
  judges,
  uploads,
  type NewJudge,
} from "@/infra/database/schema";

/**
 * Criar novo jurado
 */
export async function createJudge(
  data: Omit<NewJudge, "id" | "createdAt" | "updatedAt">
) {
  try {
    const [judge] = await db
      .insert(judges)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: judge };
  } catch (error) {
    console.error("Erro ao criar jurado:", error);
    return { success: false, error: "Erro ao criar jurado" };
  }
}

/**
 * Listar todos os jurados
 * @param filters - Filtros para buscar jurados
 * @returns Lista de jurados
 */
export async function getJudges(filters?: {
  id?: string;
  isActive?: boolean;
  search?: string;
}) {
  try {
    const whereClause: SQL<any> = sql`1=1`;

    if (filters?.id) {
      whereClause.append(eq(judges.id, filters.id));
    }

    if (filters?.search) {
      whereClause.append(ilike(judges.name, `%${filters.search}%`));
    }

    const allJudges = await db.select().from(judges).where(whereClause);
    return { success: true, data: allJudges };
  } catch (error) {
    console.error("Erro ao buscar jurados:", error);
    return { success: false, error: "Erro ao buscar jurados" };
  }
}

/**
 * Listar todos os jurados ativos
 */
export async function getActiveJudges() {
  try {
    const judgesList = await db
      .select()
      .from(judges)
      .where(eq(judges.isActive, true));

    return { success: true, data: judgesList };
  } catch (error) {
    console.error("Erro ao buscar jurados:", error);
    return { success: false, error: "Erro ao buscar jurados" };
  }
}

/**
 * Associar jurado a um evento
 */
export async function addJudgeToEvent(eventId: string, judgeId: string) {
  try {
    // Verificar se já existe associação
    const existing = await db
      .select()
      .from(eventJudges)
      .where(
        and(eq(eventJudges.eventId, eventId), eq(eventJudges.judgeId, judgeId))
      );

    if (existing.length > 0) {
      return { success: false, error: "Jurado já associado ao evento" };
    }

    const [eventJudge] = await db
      .insert(eventJudges)
      .values({
        eventId,
        judgeId,
        createdAt: new Date(),
      })
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: eventJudge };
  } catch (error) {
    console.error("Erro ao associar jurado ao evento:", error);
    return { success: false, error: "Erro ao associar jurado" };
  }
}

/**
 * Remover jurado de um evento
 */
export async function removeJudgeFromEvent(eventId: string, judgeId: string) {
  try {
    await db
      .delete(eventJudges)
      .where(
        and(eq(eventJudges.eventId, eventId), eq(eventJudges.judgeId, judgeId))
      );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover jurado do evento:", error);
    return { success: false, error: "Erro ao remover jurado" };
  }
}

/**
 * Obter jurados de um evento
 */
export async function getEventJudges(eventId: string) {
  try {
    const eventJudgesList = await db
      .select({
        judge: judges,
        eventJudge: eventJudges,
        photoImage: uploads,
      })
      .from(eventJudges)
      .innerJoin(judges, eq(eventJudges.judgeId, judges.id))
      .leftJoin(uploads, eq(judges.photoImageId, uploads.id))
      .where(eq(eventJudges.eventId, eventId));

    return { success: true, data: eventJudgesList };
  } catch (error) {
    console.error("Erro ao buscar jurados do evento:", error);
    return { success: false, error: "Erro ao buscar jurados" };
  }
}

/**
 * Atualizar jurado
 */
export async function updateJudge(
  judgeId: string,
  data: Partial<Omit<NewJudge, "id" | "createdAt">>
) {
  try {
    const [judge] = await db
      .update(judges)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(judges.id, judgeId))
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: judge };
  } catch (error) {
    console.error("Erro ao atualizar jurado:", error);
    return { success: false, error: "Erro ao atualizar jurado" };
  }
}

/**
 * Desativar jurado
 */
export async function deactivateJudge(judgeId: string) {
  try {
    const [judge] = await db
      .update(judges)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(judges.id, judgeId))
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: judge };
  } catch (error) {
    console.error("Erro ao desativar jurado:", error);
    return { success: false, error: "Erro ao desativar jurado" };
  }
}

/**
 * Deletar jurado
 */
export async function deleteJudge(judgeId: string) {
  try {
    await db.delete(judges).where(eq(judges.id, judgeId));
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar jurado:", error);
    return { success: false, error: "Erro ao deletar jurado" };
  }
}
