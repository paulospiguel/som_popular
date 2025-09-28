"use client";

import { Download, Eye, FileText, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useInvalidateUploads, useUploadsByEntity } from "@/hooks/use-uploads";
import { getUploadInfoById } from "@/lib/upload-helpers";
import {
  uploadDocument,
  uploadRegulationFile,
} from "@/server/upload-vercel.actions";

interface EventFileUploadProps {
  eventId: string;
  onFileUploaded?: (fileUrl: string, fileInfo: UploadedFile) => void;
  onFileRemoved?: (fileUrl: string) => void;
  initialFiles?: string[]; // Agora contém IDs de upload, não URLs
  maxFiles?: number;
  allowedTypes?: string[];
  maxSize?: number;
  folder?: "events" | "regulations" | "documents";
  title?: string;
  description?: string;
}

interface UploadedFile {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  isPublic: boolean;
}

export function EventFileUpload({
  eventId,
  onFileUploaded,
  onFileRemoved,
  initialFiles = [],
  maxFiles = 5,
  allowedTypes = [
    "application/pdf",
    "image/*",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  maxSize = 20 * 1024 * 1024, // 20MB
  folder = "events",
  title = "Arquivos do Evento",
  description = "Faça upload de documentos relacionados ao evento",
}: EventFileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  // Debug: Log do eventId
  console.log("EventFileUpload - Component rendered with eventId:", eventId);
  console.log(
    "EventFileUpload - Component rendered with initialFiles:",
    initialFiles
  );

  // Usar React Query para buscar uploads do evento
  const {
    data: eventUploads,
    isLoading,
    error,
  } = useUploadsByEntity("event", eventId);
  const invalidateUploads = useInvalidateUploads();

  // Debug: Log dos dados retornados
  console.log("EventFileUpload - eventUploads:", eventUploads);
  console.log("EventFileUpload - isLoading:", isLoading);
  console.log("EventFileUpload - error:", error);

  // Converter uploads do React Query para o formato local
  useEffect(() => {
    console.log("EventFileUpload - useEffect triggered with:", {
      eventUploads,
      initialFiles,
    });

    if (eventUploads?.success && eventUploads.uploads) {
      console.log(
        "EventFileUpload - Converting uploads from React Query:",
        eventUploads.uploads
      );
      const convertedFiles: UploadedFile[] = eventUploads.uploads.map(
        (upload) => ({
          id: upload.id,
          url: upload.publicUrl,
          name: upload.originalName,
          size: upload.fileSize,
          type: upload.mimeType,
          uploadedAt: new Date(upload.createdAt || new Date()),
          isPublic: upload.isPublic,
        })
      );
      console.log("EventFileUpload - Converted files:", convertedFiles);
      setFiles(convertedFiles);
    } else if (initialFiles.length > 0) {
      console.log("EventFileUpload - Using fallback files:", initialFiles);
      // Fallback para arquivos iniciais se não houver dados do React Query
      // Agora initialFiles contém IDs de upload, não URLs
      const processFallbackFiles = async () => {
        const fallbackFiles: UploadedFile[] = [];

        for (const fileId of initialFiles) {
          if (fileId) {
            const uploadInfo = await getUploadInfoById(fileId);
            if (uploadInfo) {
              fallbackFiles.push(uploadInfo);
            } else {
              // Se não conseguir buscar por ID, criar um arquivo básico
              fallbackFiles.push({
                id: fileId,
                url: "", // URL será preenchida quando necessário
                name: "Arquivo",
                size: 0,
                type: "application/octet-stream",
                uploadedAt: new Date(),
                isPublic: true,
              });
            }
          }
        }

        console.log("EventFileUpload - Fallback files:", fallbackFiles);
        setFiles(fallbackFiles);
      };

      processFallbackFiles();
    } else {
      console.log("EventFileUpload - No files found, setting empty array");
      setFiles([]);
    }
  }, [eventUploads, initialFiles]);

  const handleFileUpload = async (file: File) => {
    console.log(
      "EventFileUpload - handleFileUpload called with file:",
      file.name
    );
    console.log("EventFileUpload - Current files count:", files.length);
    console.log("EventFileUpload - Max files:", maxFiles);

    if (files.length >= maxFiles) {
      showToast({
        type: "error",
        title: "Limite atingido",
        description: `Máximo de ${maxFiles} arquivos permitidos`,
      });
      return;
    }

    // Validar tipo de arquivo
    const isValidType = allowedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      showToast({
        type: "error",
        title: "Tipo de arquivo inválido",
        description: `Apenas ${allowedTypes.join(", ")} são permitidos`,
      });
      return;
    }

    // Validar tamanho
    if (file.size > maxSize) {
      showToast({
        type: "error",
        title: "Arquivo muito grande",
        description: `Tamanho máximo: ${Math.round(maxSize / 1024 / 1024)}MB`,
      });
      return;
    }

    setIsUploading(true);
    try {
      let result;

      console.log("EventFileUpload - Starting upload with folder:", folder);
      console.log("EventFileUpload - File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Escolher função de upload baseada na pasta
      switch (folder) {
        case "regulations":
          console.log("EventFileUpload - Using uploadRegulationFile");
          result = await uploadRegulationFile(file);
          break;
        case "documents":
          console.log("EventFileUpload - Using uploadDocument");
          result = await uploadDocument(file);
          break;
        default:
          console.log(
            "EventFileUpload - Using uploadFile with eventId:",
            eventId
          );
          // Usar uploadFile diretamente para poder passar o eventId
          const { uploadFile } = await import("@/server/upload-vercel");
          result = await uploadFile(file, {
            folder: "events",
            allowedTypes: allowedTypes,
            maxSize: maxSize,
            renameFile: true,
            relatedEntityType: "event",
            relatedEntityId: eventId,
            isPublic: true,
          });
      }

      if (result.success && result.url) {
        const newFile: UploadedFile = {
          id: result.uploadId || Date.now().toString(),
          url: result.url,
          name: result.filename || file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          isPublic: true,
        };

        setFiles((prev) => [...prev, newFile]);

        console.log("EventFileUpload - Upload successful, invalidating cache");
        // Invalidar cache do React Query
        invalidateUploads();

        showToast({
          type: "success",
          title: "Upload realizado",
          description: `Arquivo "${file.name}" enviado com sucesso`,
        });

        onFileUploaded?.(result.url, newFile);
      } else {
        showToast({
          type: "error",
          title: "Erro no upload",
          description: result.error || "Erro desconhecido",
        });
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      showToast({
        type: "error",
        title: "Erro no upload",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = (fileId: string) => {
    console.log(
      "EventFileUpload - handleFileRemove called with fileId:",
      fileId
    );
    const fileToRemove = files.find((f) => f.id === fileId);
    if (fileToRemove) {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));

      console.log("EventFileUpload - File removed, invalidating cache");
      // Invalidar cache do React Query
      invalidateUploads();

      onFileRemoved?.(fileToRemove.url);

      showToast({
        type: "success",
        title: "Arquivo removido",
        description: `Arquivo "${fileToRemove.name}" removido da lista`,
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type === "application/pdf") return "📄";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("excel") || type.includes("spreadsheet")) return "📊";
    if (type.includes("powerpoint") || type.includes("presentation"))
      return "📈";
    return "📎";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Área de Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Arraste e solte arquivos aqui
          </p>
          <p className="text-gray-500 mb-4">
            ou clique para selecionar arquivos
          </p>
          <input
            type="file"
            accept={allowedTypes.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file);
              }
            }}
            className="hidden"
            id="file-upload"
            disabled={isUploading || files.length >= maxFiles}
          />
          <Button
            asChild
            disabled={isUploading || files.length >= maxFiles}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Selecionar Arquivo
                </>
              )}
            </label>
          </Button>
        </div>

        {/* Informações de Limite */}
        <div className="text-sm text-gray-500 text-center">
          {files.length} de {maxFiles} arquivos • Máximo{" "}
          {Math.round(maxSize / 1024 / 1024)}MB por arquivo
        </div>

        {/* Lista de Arquivos */}
        {isLoading ? (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Carregando arquivos...</p>
          </div>
        ) : files.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">
              Arquivos Enviados ({files.length})
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>
                          {file.uploadedAt.toLocaleDateString("pt-PT")}
                        </span>
                        {file.isPublic && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">
                              Público
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(file.url, "_blank")}
                      title="Visualizar arquivo"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = file.url;
                        link.download = file.name;
                        link.click();
                      }}
                      title="Download arquivo"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileRemove(file.id)}
                      title="Remover arquivo"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum arquivo enviado ainda</p>
            <p className="text-sm">
              Faça upload de documentos relacionados ao evento
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
