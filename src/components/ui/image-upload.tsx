import { cn } from "@/lib/utils";
import { Upload, X, User } from "lucide-react";
import { useRef, useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  maxSize?: number; // em MB
  acceptedTypes?: string[];
}

export const ImageUpload = ({
  value,
  onChange,
  className,
  maxSize = 5, // 5MB por defeito
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null);

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

    // Converter para base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
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
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
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

        {value ? (
          <div className="flex items-center justify-center">
            <div className="relative">
              <img
                src={value}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <User size={24} className="text-gray-400" />
            </div>
            <Upload className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Clica para fazer upload</p>
            <p className="text-xs text-gray-400 mt-1">
              ou arrasta e larga uma imagem aqui
            </p>
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG ou WebP (máx. {maxSize}MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};