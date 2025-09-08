"use server";

import { eq } from "drizzle-orm";

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

export async function updateMyProfile(input: { name: string; email: string }) {
  const { user } = await requireAuth();
  const id = (user as any).id as string;

  const name = (input.name || "").trim();
  const email = (input.email || "").trim().toLowerCase();
  if (!name || !email) {
    return { success: false as const, error: "Nome e email são obrigatórios" };
  }

  try {
    const [updated] = await db
      .update(users)
      .set({ name, email })
      .where(eq(users.id, id))
      .returning();

    return { success: true as const, data: updated };
  } catch (e: any) {
    const msg = e?.message || "Erro ao atualizar perfil";
    if (msg.includes("unique") || msg.toLowerCase().includes("duplicate")) {
      return { success: false as const, error: "Email já está em uso" };
    }
    return { success: false as const, error: "Erro ao atualizar perfil" };
  }
}

