import { Camera, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { uploadParticipantPhoto } from "@/server/upload";

interface DiscreteImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  maxSize?: number; // em MB
  acceptedTypes?: string[];
  placeholder?: string;
}

export const DiscreteImageUpload = ({
  value,
  onChange,
  className,
  maxSize = 3, // 3MB por defeito
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  placeholder = "Adicionar foto",
}: DiscreteImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // Validar tipo de ficheiro
      if (!acceptedTypes.includes(file.type)) {
        setError("Tipo de ficheiro não suportado. Use JPG, PNG ou WebP.");
        return;
      }

      // Validar tamanho
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Ficheiro muito grande. Máximo ${maxSize}MB.`);
        return;
      }

      // Fazer upload para o servidor
      const result = await uploadParticipantPhoto(file);

      if (result.success && result.url) {
        onChange(result.url);
        toast.success("Foto enviada com sucesso!");
      } else {
        setError(result.error || "Erro ao fazer upload da foto");
        toast.error("Erro ao enviar foto");
      }
    } catch (error) {
      setError("Erro inesperado ao fazer upload");
      toast.error("Erro ao enviar foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
          value && "border-solid border-green-500"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex items-center justify-center p-4 text-blue-600">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Enviando foto...</span>
            </div>
          </div>
        ) : value ? (
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-3">
              <img
                src={value}
                alt="Foto preview"
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <div className="text-sm">
                <p className="font-medium text-cinza-chumbo">Foto adicionada</p>
                <p className="text-cinza-chumbo/60">Clique para alterar</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 text-gray-500 hover:text-gray-700 transition-colors">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span className="text-sm font-medium">{placeholder}</span>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
