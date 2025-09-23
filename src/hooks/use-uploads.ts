import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { invalidateUploadQueries } from "@/lib/query-client";
import {
  checkFileExists,
  getFileInfoFromUrl,
  removeFile,
} from "@/server/upload-vercel";
import {
  getUploadById,
  getUploadsByEntity,
  getUploadsByFolder,
} from "@/server/uploads";

// Query Keys
export const uploadKeys = {
  all: ["uploads"] as const,
  details: () => [...uploadKeys.all, "detail"] as const,
  detail: (id: string) => [...uploadKeys.details(), id] as const,
  byUrl: (url: string) => [...uploadKeys.all, "url", url] as const,
  byEntity: (entityType: string, entityId: string) =>
    [...uploadKeys.all, "entity", entityType, entityId] as const,
  byFolder: (folder: string) => [...uploadKeys.all, "folder", folder] as const,
};

// Hook para buscar informações de upload por URL
export function useUploadByUrl(url: string) {
  return useQuery({
    queryKey: uploadKeys.byUrl(url),
    queryFn: () => getFileInfoFromUrl(url),
    enabled: !!url,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para buscar upload por ID
export function useUploadById(uploadId: string) {
  return useQuery({
    queryKey: uploadKeys.detail(uploadId),
    queryFn: () => getUploadById(uploadId),
    enabled: !!uploadId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para buscar uploads por entidade
export function useUploadsByEntity(entityType: string, entityId: string) {
  console.log("useUploadsByEntity - Called with:", { entityType, entityId });

  return useQuery({
    queryKey: uploadKeys.byEntity(entityType, entityId),
    queryFn: () => {
      console.log("useUploadsByEntity - Query function called with:", {
        entityType,
        entityId,
      });
      return getUploadsByEntity(entityType, entityId);
    },
    enabled: !!entityType && !!entityId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar uploads por pasta
export function useUploadsByFolder(folder: string) {
  return useQuery({
    queryKey: uploadKeys.byFolder(folder),
    queryFn: () => getUploadsByFolder(folder),
    enabled: !!folder,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para verificar se arquivo existe
export function useCheckFileExists(filePath: string) {
  return useQuery({
    queryKey: [...uploadKeys.all, "exists", filePath],
    queryFn: () => checkFileExists(filePath),
    enabled: !!filePath,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para remover arquivo
export function useRemoveFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filePath: string) => removeFile(filePath),
    onSuccess: (_, filePath) => {
      invalidateUploadQueries();
      // Invalidar queries relacionadas ao arquivo específico
      queryClient.invalidateQueries({
        queryKey: [...uploadKeys.all, "exists", filePath],
      });
    },
  });
}

// Hook para invalidar cache de uploads
export function useInvalidateUploads() {
  const queryClient = useQueryClient();

  return () => {
    console.log("useInvalidateUploads - Invalidating upload queries");
    console.log("useInvalidateUploads - Stack trace:", new Error().stack);
    invalidateUploadQueries();
    queryClient.invalidateQueries({ queryKey: uploadKeys.all });
  };
}
