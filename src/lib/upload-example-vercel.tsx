/**
 * Exemplo de uso do sistema de upload com Vercel Blob
 * Este arquivo demonstra como usar as diferentes funções de upload
 */

"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import {
  uploadDocument,
  uploadEventDocument,
  uploadFile,
  uploadParticipantPhoto,
  uploadRegulationFile,
} from "@/server/upload-vercel";

export function UploadExampleVercel() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const { showToast } = useToast();

  const handleFileUpload = async (
    file: File,
    uploadFunction: (file: File) => Promise<any>
  ) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadFunction(file);
      setUploadResult(result);

      if (result.success) {
        showToast({
          type: "success",
          title: "Upload realizado com sucesso!",
          description: `Arquivo: ${result.filename}`,
        });
      } else {
        showToast({
          type: "error",
          title: "Erro no upload",
          description: result.error || "Erro desconhecido",
        });
      }
    } catch (error) {
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

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    uploadFunction: (file: File) => Promise<any>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, uploadFunction);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Exemplo de Upload com Vercel Blob</CardTitle>
          <CardDescription>
            Demonstração das diferentes funções de upload disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload de Foto de Participante */}
          <div className="space-y-2">
            <Label htmlFor="participant-photo">
              Foto de Participante (JPG, PNG, WEBP - 5MB)
            </Label>
            <Input
              id="participant-photo"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => handleFileChange(e, uploadParticipantPhoto)}
              disabled={isUploading}
            />
          </div>

          {/* Upload de Regulamento PDF */}
          <div className="space-y-2">
            <Label htmlFor="regulation-file">Regulamento (PDF - 20MB)</Label>
            <Input
              id="regulation-file"
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, uploadRegulationFile)}
              disabled={isUploading}
            />
          </div>

          {/* Upload de Documento de Evento */}
          <div className="space-y-2">
            <Label htmlFor="event-document">
              Documento de Evento (PDF, DOC, XLS - 15MB)
            </Label>
            <Input
              id="event-document"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={(e) => handleFileChange(e, uploadEventDocument)}
              disabled={isUploading}
            />
          </div>

          {/* Upload de Documento Geral */}
          <div className="space-y-2">
            <Label htmlFor="general-document">
              Documento Geral (Qualquer tipo - 50MB)
            </Label>
            <Input
              id="general-document"
              type="file"
              onChange={(e) => handleFileChange(e, uploadDocument)}
              disabled={isUploading}
            />
          </div>

          {/* Upload Customizado */}
          <div className="space-y-2">
            <Label htmlFor="custom-upload">Upload Customizado</Label>
            <Input
              id="custom-upload"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file, (file) =>
                    uploadFile(file, {
                      folder: "custom",
                      allowedTypes: ["image/*", "application/pdf"],
                      maxSize: 10 * 1024 * 1024, // 10MB
                      renameFile: true,
                      metadata: { uploadedBy: "example-user" },
                    })
                  );
                }
              }}
              disabled={isUploading}
            />
          </div>

          {/* Resultado do Upload */}
          {uploadResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Resultado do Upload:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
            </div>
          )}

          {/* Status do Upload */}
          {isUploading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Fazendo upload...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre o Vercel Blob */}
      <Card>
        <CardHeader>
          <CardTitle>Vantagens do Vercel Blob</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Simplicidade:</strong> Configuração automática no
              Vercel
            </li>
            <li>
              ✅ <strong>Escalabilidade:</strong> Cresce automaticamente com sua
              aplicação
            </li>
            <li>
              ✅ <strong>Performance:</strong> CDN global para entrega rápida
            </li>
            <li>
              ✅ <strong>Segurança:</strong> URLs públicas seguras e controladas
            </li>
            <li>
              ✅ <strong>Custo-efetivo:</strong> Pague apenas pelo que usar
            </li>
            <li>
              ✅ <strong>Integração:</strong> Funciona perfeitamente com Next.js
            </li>
            <li>
              ✅ <strong>Tipos de arquivo:</strong> Suporte a imagens,
              documentos, áudio, vídeo
            </li>
            <li>
              ✅ <strong>Tamanho:</strong> Até 100MB por arquivo
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
