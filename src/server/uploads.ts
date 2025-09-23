"use server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/infra/database";
import { uploads, type NewUpload, type Upload } from "@/infra/database/schema";

/**
 * Criar registro de upload no banco de dados
 */
export async function createUploadRecord(
  uploadData: Omit<NewUpload, "id" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; upload?: Upload; error?: string }> {
  try {
    console.log("createUploadRecord - Creating upload with data:", uploadData);
    console.log("createUploadRecord - Stack trace:", new Error().stack);

    const [upload] = await db
      .insert(uploads)
      .values({
        ...uploadData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log("createUploadRecord - Created upload:", upload);

    return { success: true, upload };
  } catch (error) {
    console.error("Erro ao criar registro de upload:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar upload",
    };
  }
}

/**
 * Buscar upload por ID
 */
export async function getUploadById(
  id: string
): Promise<{ success: boolean; upload?: Upload; error?: string }> {
  try {
    console.log("getUploadById - Searching for ID:", id);

    const [upload] = await db
      .select()
      .from(uploads)
      .where(eq(uploads.id, id))
      .limit(1);

    console.log("getUploadById - Found upload:", upload);

    if (!upload) {
      console.log("getUploadById - Upload not found");
      return { success: false, error: "Upload não encontrado" };
    }

    return { success: true, upload };
  } catch (error) {
    console.error("Erro ao buscar upload:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar upload",
    };
  }
}

/**
 * Buscar upload por URL pública
 */
export async function getUploadByUrl(
  publicUrl: string
): Promise<{ success: boolean; upload?: Upload; error?: string }> {
  try {
    const [upload] = await db
      .select()
      .from(uploads)
      .where(eq(uploads.publicUrl, publicUrl))
      .limit(1);

    if (!upload) {
      return { success: false, error: "Upload não encontrado" };
    }

    return { success: true, upload };
  } catch (error) {
    console.error("Erro ao buscar upload por URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar upload",
    };
  }
}

/**
 * Buscar uploads por entidade relacionada
 */
export async function getUploadsByEntity(
  entityType: string,
  entityId: string
): Promise<{ success: boolean; uploads?: Upload[]; error?: string }> {
  try {
    console.log("getUploadsByEntity - Searching for:", {
      entityType,
      entityId,
    });

    const uploadsList = await db
      .select()
      .from(uploads)
      .where(
        and(
          eq(uploads.relatedEntityType, entityType),
          eq(uploads.relatedEntityId, entityId),
          eq(uploads.isArchived, false)
        )
      )
      .orderBy(desc(uploads.createdAt));

    console.log("getUploadsByEntity - Found uploads:", uploadsList);

    return { success: true, uploads: uploadsList };
  } catch (error) {
    console.error("Erro ao buscar uploads por entidade:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar uploads",
    };
  }
}

/**
 * Buscar uploads por pasta
 */
export async function getUploadsByFolder(
  folder: string
): Promise<{ success: boolean; uploads?: Upload[]; error?: string }> {
  try {
    const uploadsList = await db
      .select()
      .from(uploads)
      .where(and(eq(uploads.folder, folder), eq(uploads.isArchived, false)))
      .orderBy(desc(uploads.createdAt));

    return { success: true, uploads: uploadsList };
  } catch (error) {
    console.error("Erro ao buscar uploads por pasta:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar uploads",
    };
  }
}

/**
 * Atualizar upload
 */
export async function updateUpload(
  id: string,
  updateData: Partial<Omit<Upload, "id" | "createdAt">>
): Promise<{ success: boolean; upload?: Upload; error?: string }> {
  try {
    const [upload] = await db
      .update(uploads)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(uploads.id, id))
      .returning();

    if (!upload) {
      return { success: false, error: "Upload não encontrado" };
    }

    return { success: true, upload };
  } catch (error) {
    console.error("Erro ao atualizar upload:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao atualizar upload",
    };
  }
}

/**
 * Arquivar upload (soft delete)
 */
export async function archiveUpload(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(uploads)
      .set({
        isArchived: true,
        updatedAt: new Date(),
      })
      .where(eq(uploads.id, id));

    return { success: true };
  } catch (error) {
    console.error("Erro ao arquivar upload:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao arquivar upload",
    };
  }
}

/**
 * Deletar upload permanentemente
 */
export async function deleteUpload(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(uploads).where(eq(uploads.id, id));
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar upload:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao deletar upload",
    };
  }
}

/**
 * Buscar uploads por usuário
 */
export async function getUploadsByUser(
  userId: string
): Promise<{ success: boolean; uploads?: Upload[]; error?: string }> {
  try {
    const uploadsList = await db
      .select()
      .from(uploads)
      .where(and(eq(uploads.uploadedBy, userId), eq(uploads.isArchived, false)))
      .orderBy(desc(uploads.createdAt));

    return { success: true, uploads: uploadsList };
  } catch (error) {
    console.error("Erro ao buscar uploads por usuário:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar uploads",
    };
  }
}

/**
 * Buscar uploads públicos
 */
export async function getPublicUploads(
  limit: number = 50
): Promise<{ success: boolean; uploads?: Upload[]; error?: string }> {
  try {
    const uploadsList = await db
      .select()
      .from(uploads)
      .where(and(eq(uploads.isPublic, true), eq(uploads.isArchived, false)))
      .orderBy(desc(uploads.createdAt))
      .limit(limit);

    return { success: true, uploads: uploadsList };
  } catch (error) {
    console.error("Erro ao buscar uploads públicos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar uploads",
    };
  }
}
