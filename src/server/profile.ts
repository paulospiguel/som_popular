"use server";

import bcrypt from "bcryptjs";
import { and, eq, isNotNull } from "drizzle-orm";

import { requireAuth } from "@/lib/action-guards";
import { db } from "@/server/database";
import { user as users } from "@/server/database/auth-schema";

export async function getMyProfile() {
  const { user } = await requireAuth();
  return {
    success: true as const,
    data: {
      id: (user as any).id as string,
      name: user.name || "",
      email: user.email,
      image: (user as any).image || null,
    },
  };
}

export async function updateMyProfile(input: {
  name: string;
  image?: string | null;
}) {
  const { user } = await requireAuth();
  const id = (user as any).id as string;

  const name = (input.name || "").trim();
  const image = (input.image ?? null) as string | null;
  if (!name) {
    return { success: false as const, error: "Nome é obrigatório" };
  }

  try {
    const [updated] = await db
      .update(users)
      .set({ name, image })
      .where(eq(users.id, id))
      .returning();

    return { success: true as const, data: updated };
  } catch (e: any) {
    return { success: false as const, error: "Erro ao atualizar perfil" };
  }
}

export async function changeMyPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const { user } = await requireAuth();
  const id = (user as any).id as string;

  const currentPassword = (input.currentPassword || "").trim();
  const newPassword = (input.newPassword || "").trim();

  if (!currentPassword || !newPassword) {
    return {
      success: false as const,
      error: "Informe a senha atual e a nova senha",
    };
  }
  if (newPassword.length < 6) {
    return {
      success: false as const,
      error: "A nova senha deve ter pelo menos 6 caracteres",
    };
  }

  // procurar conta local com password
  const { account } = await import("@/server/database/auth-schema");
  const rows = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, id), isNotNull(account.password)))
    .limit(1);

  if (rows.length === 0) {
    return {
      success: false as const,
      error: "Conta não permite alteração de senha. Use 'Esqueci minha senha'",
    };
  }

  const acc = rows[0] as any;
  const ok = await bcrypt.compare(currentPassword, acc.password);
  if (!ok) {
    return { success: false as const, error: "Senha atual incorreta" };
  }

  const hash = await bcrypt.hash(newPassword, 10);
  const updated = await db
    .update(account)
    .set({ password: hash })
    .where(eq(account.id, acc.id))
    .returning();

  return { success: true as const, data: { id: updated[0].id } };
}
