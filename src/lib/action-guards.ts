"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ROLES } from "@/constants";
import { auth } from "@/lib/auth";

/**
 * Verificar se o usuário está autenticado
 */
export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Bloquear utilizadores inativos
  if (session.user?.isActive === false) {
    redirect("/auth/login?error=account_inactive");
  }

  return { session, user: session.user };
}

/**
 * Verificar se o usuário é administrador
 */
export async function requireAdmin() {
  const { session, user } = await requireAuth();

  const userRole = user.role ?? ROLES.OPERATOR;
  if (userRole !== ROLES.ADMIN && userRole !== ROLES.MASTER) {
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

  const userRole = user.role ?? ROLES.OPERATOR;
  if (
    userRole !== ROLES.ADMIN &&
    userRole !== ROLES.MASTER &&
    userRole !== ROLES.OPERATOR
  ) {
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

  const userRole = user.role ?? ROLES.OPERATOR;

  switch (requiredRole) {
    case ROLES.MASTER:
      if (userRole !== ROLES.MASTER) {
        throw new Error("Acesso negado: Apenas master pode realizar esta ação");
      }
      break;
    case ROLES.ADMIN:
      if (userRole !== ROLES.ADMIN && userRole !== ROLES.MASTER) {
        throw new Error(
          "Acesso negado: Apenas administradores podem realizar esta ação"
        );
      }
      break;
    case ROLES.OPERATOR:
      if (
        userRole !== ROLES.ADMIN &&
        userRole !== ROLES.MASTER &&
        userRole !== ROLES.OPERATOR
      ) {
        throw new Error("Acesso negado: Permissões insuficientes");
      }
      break;
    default:
      throw new Error("Role inválido especificado");
  }

  return { session, user, role: userRole };
}

/**
 * Verificar se o usuário é Master
 */
export async function requireMaster() {
  const { session, user } = await requireAuth();
  const userRole = user.role ?? ROLES.OPERATOR;
  if (userRole !== ROLES.MASTER) {
    throw new Error("Acesso negado: Apenas Master pode aceder a esta página");
  }
  return { session, user, role: userRole };
}
