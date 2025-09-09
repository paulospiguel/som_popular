"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/action-guards";
import { db } from "@/server/database";
import { events, type Event, type NewEvent } from "@/server/database/schema";

/**
 * Criar novo evento
 */
export async function createEvent(
  data: Omit<NewEvent, "id" | "createdAt" | "updatedAt">
) {
  try {
    // Verificar permissões de admin
    const { user } = await requireAdmin();

    const [event] = await db
      .insert(events)
      .values({
        ...data,
        createdBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/dashboard/events");
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
    // Buscar evento atual para verificar status
    const [existing] = await db.select().from(events).where(eq(events.id, id));
    if (!existing) {
      return { success: false as const, error: "Evento não encontrado" };
    }

    const payload: Partial<Event> = { ...data };

    // Se não estiver em rascunho, bloquear alterações em campos críticos
    if (existing.status !== "draft") {
      const criticalKeys: Array<keyof Event> = [
        "type",
        "category",
        "startDate",
        "endDate",
        "registrationStartDate",
        "registrationEndDate",
        "maxParticipants",
        "status",
      ];
      for (const key of criticalKeys) {
        if (key in payload) {
          delete payload[key];
        }
      }
    }

    if (Object.keys(payload).length === 0) {
      // Nada a atualizar
      return { success: true as const, data: existing };
    }

    const [event] = await db
      .update(events)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();

    revalidatePath("/dashboard/events");
    return { success: true as const, data: event };
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return { success: false as const, error: "Erro ao atualizar evento" };
  }
}

/**
 * Eliminar evento (apenas rascunhos)
 */
export async function deleteEvent(id: string) {
  try {
    // Verificar permissões de admin
    await requireAdmin();

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
        error: `Não é possível excluir evento com status "${existingEvent.status}". Apenas eventos em rascunho podem ser excluídos.`,
      };
    }

    // Excluir o evento
    await db.delete(events).where(eq(events.id, id));

    revalidatePath("/dashboard/events");
    return {
      success: true,
      message: "Evento excluído com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao excluir evento";
    return { success: false, error: errorMessage };
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
    await requireAdmin();

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

    revalidatePath("/dashboard/events");
    revalidatePath("/votings");

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
    await requireAdmin();

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

    revalidatePath("/dashboard/events");
    revalidatePath("/votings");

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

    revalidatePath("/dashboard/events");
    revalidatePath("/votings");

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

    revalidatePath("/dashboard/events");
    revalidatePath("/votings");

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

    revalidatePath("/dashboard/events");
    revalidatePath("/votings");

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

/**
 * Copiar evento (criar uma cópia como rascunho)
 */
export async function copyEvent(id: string) {
  try {
    // Verificar permissões de admin
    const { user } = await requireAdmin();

    // Buscar o evento original
    const [originalEvent] = await db
      .select()
      .from(events)
      .where(eq(events.id, id));

    if (!originalEvent) {
      return { success: false, error: "Evento não encontrado" };
    }

    // Criar cópia do evento com status draft
    const copiedEventData: Omit<NewEvent, "id" | "createdAt" | "updatedAt"> = {
      name: `${originalEvent.name} (Cópia)`,
      description: originalEvent.description,
      location: originalEvent.location,
      maxParticipants: originalEvent.maxParticipants,
      startDate: originalEvent.startDate,
      endDate: originalEvent.endDate,
      registrationStartDate: originalEvent.registrationStartDate,
      registrationEndDate: originalEvent.registrationEndDate,
      isPublic: false, // Sempre privado na cópia
      requiresApproval: originalEvent.requiresApproval,
      rules: originalEvent.rules,
      prizes: originalEvent.prizes,
      rulesFile: originalEvent.rulesFile,
      notes: originalEvent.notes,
      status: "draft", // Sempre como rascunho
      category: originalEvent.category,
      type: originalEvent.type,
      currentParticipants: 0, // Resetar participantes
      createdBy: user.id,
    };

    const [copiedEvent] = await db
      .insert(events)
      .values({
        ...copiedEventData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/dashboard/events");
    return {
      success: true,
      data: copiedEvent,
      message: "Evento copiado com sucesso! A cópia foi criada como rascunho.",
    };
  } catch (error) {
    console.error("Erro ao copiar evento:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao copiar evento";
    return { success: false, error: errorMessage };
  }
}
