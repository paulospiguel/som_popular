"use server";

import { createId } from "@paralleldrive/cuid2";
import { asc, eq, ilike, or } from "drizzle-orm";

import { ROLES } from "@/constants";
import { requireMaster } from "@/lib/action-guards";
import { db } from "@/server/database";
import { user as usersTable } from "@/server/database/auth-schema";

export type AppUser = typeof usersTable.$inferSelect;

export async function listUsers(query?: string) {
  await requireMaster();

  const where = query
    ? or(
        ilike(usersTable.name, `%${query}%`),
        ilike(usersTable.email, `%${query}%`)
      )
    : undefined;

  const rows = await db
    .select()
    .from(usersTable)
    .where(where)
    .orderBy(asc(usersTable.name));

  return { success: true as const, data: rows };
}

export async function createUserAction(input: {
  name: string;
  email: string;
  role: string;
}) {
  await requireMaster();

  const role = input.role as string;
  if (![ROLES.OPERATOR, ROLES.ADMIN, ROLES.MASTER].includes(role as any)) {
    return { success: false as const, error: "Role inválida" };
  }

  const id = createId();
  try {
    const [row] = await db
      .insert(usersTable)
      .values({
        id,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        role,
        isActive: true,
        emailVerified: false,
        image: null,
      } as any)
      .returning();
    return { success: true as const, data: row };
  } catch (e: any) {
    return {
      success: false as const,
      error: e?.message?.includes("unique")
        ? "Email já cadastrado"
        : "Erro ao criar utilizador",
    };
  }
}

export async function updateUserRoleAction(input: {
  id: string;
  role: string;
}) {
  const { user: current } = await requireMaster();
  if (input.id === (current as any).id) {
    return {
      success: false as const,
      error: "Não pode alterar o seu próprio papel",
    };
  }
  const role = input.role as string;
  if (![ROLES.OPERATOR, ROLES.ADMIN, ROLES.MASTER].includes(role as any)) {
    return { success: false as const, error: "Role inválida" };
  }
  const [row] = await db
    .update(usersTable)
    .set({ role })
    .where(eq(usersTable.id, input.id))
    .returning();
  return { success: true as const, data: row };
}

export async function setUserActiveAction(input: {
  id: string;
  active: boolean;
}) {
  const { user: current } = await requireMaster();
  if (input.id === (current as any).id) {
    return { success: false as const, error: "Não pode inativar a si mesmo" };
  }
  const [row] = await db
    .update(usersTable)
    .set({ isActive: input.active })
    .where(eq(usersTable.id, input.id))
    .returning();
  return { success: true as const, data: row };
}

export async function deleteUserAction(id: string) {
  const { user: current } = await requireMaster();
  if (id === (current as any).id) {
    return { success: false as const, error: "Não pode remover a si mesmo" };
  }
  await db.delete(usersTable).where(eq(usersTable.id, id));
  return { success: true as const };
}
