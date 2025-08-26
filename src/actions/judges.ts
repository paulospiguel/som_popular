"use server";

import { db } from "@/database";
import { eventJudges, judges, type NewJudge } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
 */
export async function getJudges() {
  try {
    const allJudges = await db.select().from(judges);
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
      })
      .from(eventJudges)
      .innerJoin(judges, eq(eventJudges.judgeId, judges.id))
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
 * Criar jurados de exemplo
 */
export async function createSampleJudges() {
  try {
    const sampleJudges = [
      {
        name: "Mariza Silva",
        description: "Fadista profissional e professora de canto",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "António Ferreira",
        description: "Guitarrista de fado com 30 anos de experiência",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Maria Santos",
        description: "Crítica musical e especialista em fado",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "João Oliveira",
        description: "Produtor musical e compositor",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ana Costa",
        description: "Violinista e professora de música",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const createdJudges = await db
      .insert(judges)
      .values(sampleJudges)
      .returning();

    revalidatePath("/dashboard");
    return {
      success: true,
      data: createdJudges,
      message: `${createdJudges.length} jurados criados com sucesso!`,
    };
  } catch (error) {
    console.error("Erro ao criar jurados de exemplo:", error);
    return { success: false, error: "Erro ao criar jurados de exemplo" };
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
