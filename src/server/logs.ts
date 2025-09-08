"use server";

import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/server/database";
import {
  eventLogs,
  systemLogs,
  type NewEventLog,
  type NewSystemLog,
} from "@/server/database/schema";

/**
 * Criar log do sistema
 */
export async function createSystemLog(
  data: Omit<NewSystemLog, "id" | "createdAt">
) {
  try {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    const [log] = await db
      .insert(systemLogs)
      .values({
        ...data,
        createdAt: new Date(),
      })
      .returning();

    return { success: true, data: log };
  } catch (error) {
    console.error("Erro ao criar log do sistema:", error);
    return { success: false, error: "Erro ao criar log do sistema" };
  }
}

/**
 * Criar log de evento
 */
export async function createEventLog(
  data: Omit<NewEventLog, "id" | "createdAt">
) {
  try {
    const [log] = await db
      .insert(eventLogs)
      .values({
        ...data,
        createdAt: new Date(),
      })
      .returning();

    return { success: true, data: log };
  } catch (error) {
    console.error("Erro ao criar log de evento:", error);
    return { success: false, error: "Erro ao criar log de evento" };
  }
}

/**
 * Obter logs do sistema com filtros
 */
export async function getSystemLogs(options?: {
  severity?: string;
  category?: string;
  status?: string;
  limit?: number;
}) {
  try {
    const whereConditions = [];

    // Aplicar filtros (severity temporariamente desabilitado)
    if (options?.category) {
      whereConditions.push(eq(systemLogs.category, options.category));
    }
    if (options?.status) {
      whereConditions.push(eq(systemLogs.status, options.status));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const logs = await db
      .select()
      .from(systemLogs)
      .where(whereClause)
      .orderBy(desc(systemLogs.createdAt))
      .limit(options?.limit || 100);

    return { success: true, data: logs };
  } catch (error) {
    console.error("Erro ao buscar logs do sistema:", error);
    return { success: false, error: "Erro ao buscar logs do sistema" };
  }
}

/**
 * Obter logs de eventos com filtros
 */
export async function getEventLogs(options?: {
  eventId?: string;
  severity?: string;
  category?: string;
  status?: string;
  limit?: number;
}) {
  try {
    const whereConditions = [];

    // Aplicar filtros (severity temporariamente desabilitado)
    if (options?.eventId) {
      whereConditions.push(eq(eventLogs.eventId, options.eventId));
    }
    // Note: eventLogs table doesn't have category and status fields

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const logs = await db
      .select()
      .from(eventLogs)
      .where(whereClause)
      .orderBy(desc(eventLogs.createdAt))
      .limit(options?.limit || 100);

    return { success: true, data: logs };
  } catch (error) {
    console.error("Erro ao buscar logs de eventos:", error);
    return { success: false, error: "Erro ao buscar logs de eventos" };
  }
}

/**
 * Obter estatísticas dos logs
 */
export async function getLogsStats() {
  try {
    // Contagem por categoria para uso no componente de UI
    const categoryRows = await db
      .select({
        category: systemLogs.category,
        count: sql<number>`count(*)`,
      })
      .from(systemLogs)
      .groupBy(systemLogs.category);

    // Mapeia resultados para objeto esperado pelo componente
    const categories = [
      "auth",
      "security",
      "user_action",
      "system",
      "email",
    ] as const;

    const stats: Record<string, number> = { total: 0 } as Record<string, number>;

    for (const cat of categories) stats[cat] = 0;

    for (const row of categoryRows) {
      const cat = row.category as (typeof categories)[number];
      if (categories.includes(cat)) {
        stats[cat] = (stats[cat] || 0) + (row.count || 0);
        stats.total += row.count || 0;
      } else {
        // Categoria não reconhecida: acumula apenas no total
        stats.total += row.count || 0;
      }
    }

    // Contagem de críticos/maiores pendentes (sistema) + críticos/maiores (eventos)
    const pendingCriticalSystem = await db
      .select({ count: sql<number>`count(*)` })
      .from(systemLogs)
      .where(
        and(
          eq(systemLogs.status, "pending"),
          inArray(systemLogs.severity, ["critical", "major"])
        )
      );

    const criticalEvent = await db
      .select({ count: sql<number>`count(*)` })
      .from(eventLogs)
      .where(inArray(eventLogs.severity, ["critical", "major"]));

    const pendingCritical =
      (pendingCriticalSystem[0]?.count || 0) + (criticalEvent[0]?.count || 0);

    return {
      success: true,
      data: {
        ...stats,
        pendingCritical,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas dos logs:", error);
    return { success: false, error: "Erro ao buscar estatísticas dos logs" };
  }
}

/**
 * Atualizar status de um log
 */
export async function updateLogStatus(
  logId: string,
  status: string,
  logType: "system" | "event"
) {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  try {
    if (logType === "system") {
      const [log] = await db
        .update(systemLogs)
        .set({ status })
        .where(eq(systemLogs.id, logId))
        .returning();
      return { success: true, data: log };
    } else {
      // eventLogs table doesn't have status field
      return {
        success: false,
        error: "Event logs don't support status updates",
      };
    }
  } catch (error) {
    console.error("Erro ao atualizar status do log:", error);
    return { success: false, error: "Erro ao atualizar status do log" };
  }
}

export async function logPasswordReset({
  email,
  status,
  message,
  metadata = {},
}: {
  email: string;
  status: string;
  message?: string;
  metadata?: Record<string, any>;
}) {
  return createSystemLog({
    action: "password_reset_attempt",
    category: "auth",
    status: status,
    metadata: JSON.stringify({
      ...metadata,
      email,
    }),
    message,
  });
}
