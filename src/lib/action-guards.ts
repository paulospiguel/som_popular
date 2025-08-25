"use server";

import { ROLES } from "@/constants";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Verificar se o usuário está autenticado
 */
export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  return { session, user: session.user };
}

/**
 * Verificar se o usuário é administrador
 */
export async function requireAdmin() {
  const { session, user } = await requireAuth();

  const userRole = (user as any).role ?? ROLES.OPERATOR;
  if (userRole !== ROLES.ADMIN) {
    throw new Error(
      "Acesso negado: Apenas administradores podem realizar esta ação"
    );
  }

  return { session, user, role: userRole };
}

/**
 * Verificar se o usuário é admin ou operador (pode acessar sistema de votação)
 */
export async function requireOperatorOrAdmin() {
  const { session, user } = await requireAuth();

  const userRole = (user as any).role ?? ROLES.OPERATOR;
  if (userRole !== ROLES.ADMIN && userRole !== ROLES.OPERATOR) {
    throw new Error("Acesso negado: Permissões insuficientes");
  }

  return { session, user, role: userRole };
}

/**
 * Verificar permissões de uma ação específica
 */
export async function checkActionPermission(
  requiredRole: string = ROLES.OPERATOR
) {
  const { session, user } = await requireAuth();

  const userRole = (user as any).role ?? ROLES.OPERATOR;

  switch (requiredRole) {
    case ROLES.ADMIN:
      if (userRole !== ROLES.ADMIN) {
        throw new Error(
          "Acesso negado: Apenas administradores podem realizar esta ação"
        );
      }
      break;
    case ROLES.OPERATOR:
      if (userRole !== ROLES.ADMIN && userRole !== ROLES.OPERATOR) {
        throw new Error("Acesso negado: Permissões insuficientes");
      }
      break;
    default:
      throw new Error("Role inválido especificado");
  }

  return { session, user, role: userRole };
}
