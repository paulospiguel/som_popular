import { getUploadById } from "@/server/uploads.actions";

/**
 * Busca informações de upload por ID
 */
export async function getUploadInfoById(uploadId: string | null | undefined) {
  if (!uploadId) {
    return null;
  }

  try {
    const result = await getUploadById(uploadId);
    if (result.success && result.upload) {
      return {
        id: result.upload.id,
        url: result.upload.publicUrl,
        name: result.upload.originalName,
        size: result.upload.fileSize,
        type: result.upload.mimeType,
        uploadedAt: new Date(result.upload.createdAt || new Date()),
        isPublic: result.upload.isPublic,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching upload info:", error);
    return null;
  }
}

/**
 * Busca múltiplas informações de upload por IDs
 */
export async function getMultipleUploadsInfo(
  uploadIds: (string | null | undefined)[]
) {
  const validIds = uploadIds.filter((id): id is string => !!id);

  if (validIds.length === 0) {
    return [];
  }

  try {
    const results = await Promise.all(
      validIds.map(async (id) => {
        const result = await getUploadById(id);
        if (result.success && result.upload) {
          return {
            id: result.upload.id,
            url: result.upload.publicUrl,
            name: result.upload.originalName,
            size: result.upload.fileSize,
            type: result.upload.mimeType,
            uploadedAt: new Date(result.upload.createdAt || new Date()),
            isPublic: result.upload.isPublic,
          };
        }
        return null;
      })
    );

    return results.filter(
      (result): result is NonNullable<typeof result> => result !== null
    );
  } catch (error) {
    console.error("Error fetching multiple uploads info:", error);
    return [];
  }
}

/**
 * Converte upload ID para URL pública
 */
export async function getUploadUrlById(
  uploadId: string | null | undefined
): Promise<string | null> {
  const uploadInfo = await getUploadInfoById(uploadId);
  return uploadInfo?.url || null;
}

/**
 * Converte múltiplos upload IDs para URLs públicas
 */
export async function getUploadUrlsByIds(
  uploadIds: (string | null | undefined)[]
): Promise<string[]> {
  const uploadsInfo = await getMultipleUploadsInfo(uploadIds);
  return uploadsInfo.map((upload) => upload.url);
}
