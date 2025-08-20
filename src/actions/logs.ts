"use server";

import { SystemLogger, type LogAction, type LogStatus } from "@/lib/logger";
import { headers } from "next/headers";

interface LogActionParams {
  action: LogAction;
  userEmail?: string;
  userId?: string;
  details?: Record<string, any>;
  status?: LogStatus;
  message?: string;
}

/**
 * Server Action para registar logs do sistema
 */
export async function logSystemAction(params: LogActionParams) {
  try {
    const headersList = await headers(); // Mantém o await
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
