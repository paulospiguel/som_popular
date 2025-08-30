import { db } from "../server/database";
import { systemLogs, type NewSystemLog } from "../server/database/schema";

// Tipos de ações que podemos logar
export type LogAction =
  | "password_reset_attempt"
  | "password_reset_success"
  | "login_attempt"
  | "login_success"
  | "login_failed"
  | "registration_attempt"
  | "registration_success"
  | "registration_failed"
  | "email_verification"
  | "session_created"
  | "session_expired"
  | "unauthorized_access"
  | "api_error";

// Categorias de logs
export type LogCategory =
  | "auth"
  | "security"
  | "user_action"
  | "system"
  | "email";

// Status do log
export type LogStatus = "success" | "failed" | "pending" | "warning";

interface LogParams {
  action: LogAction;
  category?: LogCategory;
  userEmail?: string;
  userId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status?: LogStatus;
  message?: string;
}

/**
 * Serviço centralizado de logs do sistema
 */
export class SystemLogger {
  /**
   * Registar uma ação no sistema
   */
  static async log(params: LogParams): Promise<void> {
    try {
      const logEntry: NewSystemLog = {
        action: params.action,
        category: params.category || "system",
        ipAddress: params.ipAddress || null,
        status: params.status || "pending",
        message: params.message || null,
      };

      await db.insert(systemLogs).values(logEntry);

      // Log também no console para desenvolvimento
      console.log(`📋 [${params.category?.toUpperCase()}] ${params.action}:`, {
        email: params.userEmail,
        status: params.status,
        message: params.message,
      });
    } catch (error) {
      // Não queremos que erros de log quebrem a aplicação
      console.error("❌ Erro ao registar log:", error);
    }
  }

  /**
   * Logs específicos para autenticação
   */
  static async logAuth(
    params: Omit<LogParams, "category"> & {
      userEmail?: string | undefined | undefined;
      userId?: string | undefined | undefined;
    }
  ) {
    return this.log({ ...params, category: "auth" });
  }

  /**
   * Logs específicos para segurança
   */
  static async logSecurity(params: Omit<LogParams, "category">) {
    return this.log({ ...params, category: "security" });
  }

  /**
   * Logs específicos para emails
   */
  static async logEmail(params: Omit<LogParams, "category">) {
    return this.log({ ...params, category: "email" });
  }

  /**
   * Helper para extrair IP e User Agent do request
   */
  static getRequestInfo(request?: Request) {
    if (!request) return {};

    return {
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    };
  }
}
