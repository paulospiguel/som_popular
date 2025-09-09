import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ROLES } from "@/constants";
import { auth } from "@/lib/auth";

/** Verificar se o utilizador tem permissão para aceder ao modo evento */
export async function checkEventModeAccess() {
  const session = await auth.api.getSession({ headers: await headers() }); // ✅

  if (!session?.user) redirect("/auth/login");

  // Todos os utilizadores autenticados podem aceder ao modo evento
  const userRole = (session.user as any).role ?? ROLES.OPERATOR;
  return { user: session.user, role: userRole };
}

/** Verificar se o utilizador é administrador */
export async function checkAdminAccess() {
  const session = await auth.api.getSession({ headers: await headers() }); // ✅

  if (!session?.user) redirect("/auth/login");

  const userRole = (session.user as any).role ?? ROLES.OPERATOR;
  if (userRole !== ROLES.ADMIN) redirect("/dashboard");

  return { user: session.user, role: userRole };
}
