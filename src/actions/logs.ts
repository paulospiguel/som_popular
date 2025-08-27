"use server";

import { db } from "@/database";
import { systemLogs } from "@/database/schema";
import { SystemLogger, type LogAction, type LogStatus } from "@/lib/logger";
import { and, desc, eq, gte, like, sql } from "drizzle-orm";
import { headers } from "next/headers";

interface LogActionParams {
  action: LogAction;
  userEmail?: string;
  userId?: string;
  details?: Record<string, any>;
  status?: LogStatus;
  message?: string;
}

interface GetLogsParams {
  category?: string;
  status?: string;
  search?: string;
  dateFilter?: string;
  limit?: number;
  offset?: number;
}

/**
 * Server Action para registar logs do sistema
 */
export async function logSystemAction(params: LogActionParams) {
  try {
    const headersList = await headers();
    const requestInfo = {
      ipAddress:
        headersList.get("x-forwarded-for") ||
        headersList.get("x-real-ip") ||
        "unknown",
      userAgent: headersList.get("user-agent") || "unknown",
    };

    await SystemLogger.logAuth({
      ...params,
      ...requestInfo,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Erro no Server Action de logs:", error);
    return { success: false, error: "Erro ao registar log" };
  }
}

/**
 * Server Action específico para logs de recuperação de senha
 */
export async function logPasswordResetAction({
  email,
  status,
  message,
  details,
}: {
  email: string;
  status: LogStatus;
  message?: string;
  details?: Record<string, any>;
}) {
  return await logSystemAction({
    action: "password_reset_attempt",
    userEmail: email.trim(),
    status,
    message: message || "",
    details: details || {},
  });
}

/**
 * Server Action para buscar logs do sistema
 */
export async function getSystemLogs(params: GetLogsParams = {}) {
  try {
    const {
      category,
      status,
      search,
      dateFilter,
      limit = 100,
      offset = 0,
    } = params;

    let whereConditions = [];

    // Filtro por categoria
    if (category && category !== "all") {
      whereConditions.push(eq(systemLogs.category, category));
    }

    // Filtro por status
    if (status && status !== "all") {
      whereConditions.push(eq(systemLogs.status, status));
    }

    // Filtro por data
    if (dateFilter && dateFilter !== "all") {
      const now = new Date();
      let filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      whereConditions.push(gte(systemLogs.createdAt, filterDate));
    }

    // Filtro por busca
    if (search) {
      whereConditions.push(like(systemLogs.action, `%${search}%`));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const logs = await db
      .select()
      .from(systemLogs)
      .where(whereClause)
      .orderBy(desc(systemLogs.createdAt))
      .limit(limit)
      .offset(offset);

    return { success: true, logs };
  } catch (error) {
    console.error("❌ Erro ao buscar logs:", error);
    return { success: false, error: "Erro ao buscar logs" };
  }
}

/**
 * Server Action para obter estatísticas dos logs
 */
export async function getLogsStats() {
  try {
    const [
      totalLogs,
      authLogs,
      securityLogs,
      userActionLogs,
      systemLogsCount,
      emailLogs,
    ] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(systemLogs),
      db
        .select({ count: sql`count(*)` })
        .from(systemLogs)
        .where(eq(systemLogs.category, "auth")),
      db
        .select({ count: sql`count(*)` })
        .from(systemLogs)
        .where(eq(systemLogs.category, "security")),
      db
        .select({ count: sql`count(*)` })
        .from(systemLogs)
        .where(eq(systemLogs.category, "user_action")),
      db
        .select({ count: sql`count(*)` })
        .from(systemLogs)
        .where(eq(systemLogs.category, "system")),
      db
        .select({ count: sql`count(*)` })
        .from(systemLogs)
        .where(eq(systemLogs.category, "email")),
    ]);

    return {
      success: true,
      stats: {
        total: totalLogs[0]?.count || 0,
        auth: authLogs[0]?.count || 0,
        security: securityLogs[0]?.count || 0,
        userAction: userActionLogs[0]?.count || 0,
        system: systemLogsCount[0]?.count || 0,
        email: emailLogs[0]?.count || 0,
      },
    };
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas dos logs:", error);
    return { success: false, error: "Erro ao buscar estatísticas" };
  }
}
