"use server";

import { db } from "@/database";
import { events, type Event, type NewEvent } from "@/database/schema";
import { checkAdminAccess } from "@/lib/auth-guards";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Criar novo evento
 */
export async function createEvent(
  data: Omit<NewEvent, "id" | "createdAt" | "updatedAt">
) {
  try {
    // Verificar permissões de admin
    const { user } = await checkAdminAccess();

    const [event] = await db
      .insert(events)
      .values({
        ...data,
        createdBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/dashboard/eventos");
    return { success: true, data: event };
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao criar evento";
    return { success: false, error: errorMessage };
  }
}

/**
 * Obter todos os eventos
 */
export async function getEvents() {
  try {
    const allEvents = await db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt));
    return { success: true, data: allEvents };
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return { success: false, error: "Erro ao buscar eventos" };
  }
}

/**
 * Obter evento por ID
 */
export async function getEventById(id: string) {
  try {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return { success: true, data: event };
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return { success: false, error: "Evento não encontrado" };
  }
}

/**
 * Atualizar evento
 */
export async function updateEvent(id: string, data: Partial<Event>) {
  try {
    const [event] = await db
      .update(events)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();

    revalidatePath("/dashboard/eventos");
    return { success: true, data: event };
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return { success: false, error: "Erro ao atualizar evento" };
  }
}

/**
 * Eliminar evento
 */
export async function deleteEvent(id: string) {
  try {
    await db.delete(events).where(eq(events.id, id));
    revalidatePath("/dashboard/eventos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao eliminar evento:", error);
    return { success: false, error: "Erro ao eliminar evento" };
  }
}

/**
 * Obter eventos ativos (em curso)
 */
export async function getActiveEvents() {
  try {
    const activeEvents = await db
      .select()
      .from(events)
      .where(eq(events.status, "ongoing"))
      .orderBy(desc(events.startDate));

    return { success: true, data: activeEvents };
  } catch (error) {
    console.error("Erro ao buscar eventos ativos:", error);
    return { success: false, error: "Erro ao buscar eventos ativos" };
  }
}

/**
 * Publicar evento (alterar status de draft para published)
 */
export async function publishEvent(id: string, _publishedBy: string) {
  try {
    // Verificar permissões de admin
    await checkAdminAccess();

    // Verificar se o evento existe e está em rascunho
    const [existingEvent] = await db
      .select()
      .from(events)
      .where(eq(events.id, id));

    if (!existingEvent) {
      return { success: false, error: "Evento não encontrado" };
    }

    if (existingEvent.status !== "draft") {
      return {
        success: false,
        error: `Não é possível publicar evento com status "${existingEvent.status}"`,
      };
    }

    // Atualizar status para publicado
    const [event] = await db
      .update(events)
      .set({
        status: "published",
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    revalidatePath("/dashboard/eventos");
    revalidatePath("/votacoes");

    return {
      success: true,
      data: event,
      message: "Evento publicado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao publicar evento:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao publicar evento";
    return { success: false, error: errorMessage };
  }
}

/**
 * Colocar evento em curso (alterar status para ongoing)
 */
export async function startEvent(id: string, _startedBy: string) {
  try {
    // Verificar permissões de admin
    await checkAdminAccess();

    // Verificar se o evento existe e está publicado
    const [existingEvent] = await db
      .select()
      .from(events)
      .where(eq(events.id, id));

    if (!existingEvent) {
      return { success: false, error: "Evento não encontrado" };
    }

    if (existingEvent.status !== "published") {
      return {
        success: false,
        error: `Não é possível iniciar evento com status "${existingEvent.status}"`,
      };
    }

    // Atualizar status para em curso
    const [event] = await db
      .update(events)
      .set({
        status: "ongoing",
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    revalidatePath("/dashboard/eventos");
    revalidatePath("/votacoes");

    return {
      success: true,
      data: event,
      message: "Evento iniciado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao iniciar evento:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao iniciar evento";
    return { success: false, error: errorMessage };
  }
}

/**
 * Concluir evento (alterar status para completed)
 */
export async function completeEvent(id: string, _completedBy: string) {
  try {
    // Verificar se o evento existe e está em curso
    const [existingEvent] = await db
      .select()
      .from(events)
      .where(eq(events.id, id));

    if (!existingEvent) {
      return { success: false, error: "Evento não encontrado" };
    }

    if (existingEvent.status !== "ongoing") {
      return {
        success: false,
        error: `Não é possível concluir evento com status "${existingEvent.status}"`,
      };
    }

    // Atualizar status para concluído
    const [event] = await db
      .update(events)
      .set({
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    revalidatePath("/dashboard/eventos");
    revalidatePath("/votacoes");

    return {
      success: true,
      data: event,
      message: "Evento concluído com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao concluir evento:", error);
    return { success: false, error: "Erro ao concluir evento" };
  }
}

/**
 * Cancelar evento
 */
export async function cancelEvent(
  id: string,
  _cancelledBy: string,
  reason?: string
) {
  try {
    // Verificar se o evento existe
    const [existingEvent] = await db
      .select()
      .from(events)
      .where(eq(events.id, id));

    if (!existingEvent) {
      return { success: false, error: "Evento não encontrado" };
    }

    if (!["published", "ongoing"].includes(existingEvent.status)) {
      return {
        success: false,
        error: `Não é possível cancelar evento com status "${existingEvent.status}"`,
      };
    }

    // Atualizar status para cancelado
    const [event] = await db
      .update(events)
      .set({
        status: "cancelled",
        notes: reason
          ? `${existingEvent.notes || ""}\nCancelado: ${reason}`.trim()
          : existingEvent.notes,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    revalidatePath("/dashboard/eventos");
    revalidatePath("/votacoes");

    return {
      success: true,
      data: event,
      message: "Evento cancelado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao cancelar evento:", error);
    return { success: false, error: "Erro ao cancelar evento" };
  }
}

/**
 * Voltar evento para rascunho
 */
export async function revertToDraft(id: string, _revertedBy: string) {
  try {
    // Verificar se o evento existe
    const [existingEvent] = await db
      .select()
      .from(events)
      .where(eq(events.id, id));

    if (!existingEvent) {
      return { success: false, error: "Evento não encontrado" };
    }

    if (existingEvent.status === "ongoing") {
      return {
        success: false,
        error: "Não é possível voltar a rascunho um evento em curso",
      };
    }

    // Atualizar status para rascunho
    const [event] = await db
      .update(events)
      .set({
        status: "draft",
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    revalidatePath("/dashboard/eventos");
    revalidatePath("/votacoes");

    return {
      success: true,
      data: event,
      message: "Evento voltou para rascunho!",
    };
  } catch (error) {
    console.error("Erro ao voltar evento para rascunho:", error);
    return { success: false, error: "Erro ao voltar evento para rascunho" };
  }
}

/**
 * Obter eventos publicados
 */
export async function getPublishedEvents() {
  try {
    const publishedEvents = await db
      .select()
      .from(events)
      .where(eq(events.status, "published"))
      .orderBy(desc(events.startDate));

    return { success: true, data: publishedEvents };
  } catch (error) {
    console.error("Erro ao buscar eventos publicados:", error);
    return { success: false, error: "Erro ao buscar eventos publicados" };
  }
}

export async function getEventStats() {
  try {
    const eventStats = await db.select().from(events);
    return { success: true, data: eventStats };
  } catch (error) {
    console.error("Erro ao buscar estatísticas de eventos:", error);
    return { success: false, error: "Erro ao buscar estatísticas de eventos" };
  }
}
