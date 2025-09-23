"use client";

import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Control, Controller, useFormContext } from "react-hook-form";

import TableUpload from "@/components/file-upload/table-upload";
import { FormField } from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useToast } from "@/components/ui/toast";
import { FileMetadata } from "@/hooks/use-file-upload";
import { useUploadById } from "@/hooks/use-uploads";
import { addFileIdToEvent } from "@/server/events";
import { uploadRegulationFile } from "@/server/upload-vercel";
import { EventFormData } from "@/validators/events";

interface EventRegulationSectionProps {
  control: Control<EventFormData>;
  isEditing: boolean;
  formValues: EventFormData;
  eventId: string;
}

export function EventRegulationSection({
  control,
  isEditing,
  formValues,
  eventId,
}: EventRegulationSectionProps) {
  const [isPending, setIsPending] = useState(false);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const { showToast } = useToast();

  const { setValue } = useFormContext();

  const { data: fileInfo, isLoading } = useUploadById(
    formValues.rulesFileId || ""
  );

  const handleFilesChange = async (files: File[]): Promise<void> => {
    setIsPending(true);

    const file = files[0];

    setFiles(
      files.map((file) => ({
        id: file.name + Date.now(),
        url: file.webkitRelativePath,
        name: file.name,
        size: file.size,
        type: file.type,
      }))
    );

    if (!file) {
      setIsPending(false);
      return;
    }

    try {
      const result = await uploadRegulationFile(file);

      if (result.success && result.uploadId && eventId) {
        await addFileIdToEvent(eventId, result.uploadId);
      }

      if (!result.success) {
        showToast({
          type: "error",
          title: "Erro ao carregar regulamento",
          description: result.error || "Erro ao carregar regulamento",
        });
        return;
      }
      setValue("rulesFileId", result.uploadId);
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro ao carregar regulamento",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao carregar regulamento",
      });
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (fileInfo) {
      const file = {
        id: fileInfo.upload?.id || "",
        url: fileInfo.upload?.publicUrl || "",
        name: fileInfo.upload?.originalName || "",
        size: fileInfo.upload?.fileSize || 0,
        type: fileInfo.upload?.mimeType || "",
      };

      setFiles([file]);
    }
  }, [fileInfo]);

  return (
    <div>
      <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2" /> Regulamento
      </h4>
      {isEditing ? (
        <div className="space-y-4">
          <FormField
            control={control}
            name="rulesFileId"
            render={({ field }) => (
              <TableUpload
                isUploading={isPending || isLoading}
                initialFiles={files}
                onFilesChange={handleFilesChange}
                accept=".pdf"
                maxFiles={1}
                multiple={false}
                placeholder="Adicionar regulamento do evento (PDF) - Máximo 1MB"
                key={field.value}
                maxSize={1 * 1024 * 1024}
              />
            )}
          />

          {!files.length && (
            <Controller
              control={control}
              name="rulesText"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Digite o regulamento do evento..."
                  className="w-full"
                />
              )}
            />
          )}
        </div>
      ) : (
        <>
          {fileInfo?.upload?.publicUrl && (
            <div>
              <a
                href={fileInfo.upload.publicUrl || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 group"
              >
                <Download className="w-5 h-5 mr-2 group-hover:text-verde-suave" />{" "}
                <span className="text-sm group-hover:text-verde-suave">
                  {fileInfo.upload.originalName}
                </span>
              </a>
            </div>
          )}

          {!fileInfo?.upload?.publicUrl && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <RichTextEditor
                value={formValues.rulesText || ""}
                onChange={() => {}}
                readOnly
                showHtml
                className="w-full"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
