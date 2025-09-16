"use client";

import { FileText } from "lucide-react";
import { Control, Controller } from "react-hook-form";

import CompactUpload from "@/components/file-upload/compact-upload";
import { FormField } from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useToast } from "@/components/ui/toast";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { uploadFile } from "@/server/upload";
import { EventFormData } from "@/types";

interface EventRegulationSectionProps {
  control: Control<EventFormData>;
  isEditing: boolean;
  formValues: EventFormData;
}

export function EventRegulationSection({
  control,
  isEditing,
  formValues,
}: EventRegulationSectionProps) {
  const { showToast } = useToast();
  const handleFilesChange = async (files: FileWithPreview[]) => {
    try {
      if (!files[0]?.file) {
        return null;
      }
      const result = await uploadFile(files[0]?.file as File, {
        folder: "regulations",
        allowedTypes: ["application/pdf"],
        maxSize: 1 * 1024 * 1024,
        renameFile: false,
      });
      console.log(result);
      if (result.success) {
        return result.path;
      }
      return null;
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro ao carregar regulamento",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao carregar regulamento",
      });
      return null;
    }
  };

  return (
    <div>
      <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2" /> Regulamento
      </h4>
      {isEditing ? (
        <div className="space-y-4">
          <FormField
            control={control}
            name="rulesFile"
            render={({ field }) => (
              <CompactUpload
                maxFiles={1}
                placeholder="Adicionar regulamento do evento (PDF) - Máximo 1MB"
                key={field.value}
                maxSize={1 * 1024 * 1024}
                multiple={false}
                accept=".pdf"
                onFilesChange={handleFilesChange}
              />
            )}
          />

          <Controller
            control={control}
            name="rules"
            render={({ field }) => (
              <RichTextEditor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Digite o regulamento do evento..."
                className="w-full"
              />
            )}
          />
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <RichTextEditor
            value={formValues.rules || ""}
            onChange={() => {}}
            readOnly
            showHtml
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
