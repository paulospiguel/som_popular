"use client";

import { AlertCircle, Download, ExternalLink, FileText } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface PDFViewerProps {
  pdfUrl: string | null;
  title: string;
  fileName?: string;
  height?: string;
}

export default function PDFViewer({
  pdfUrl,
  title,
  fileName = "regulamento.pdf",
  height = "800px",
}: PDFViewerProps) {
  const [pdfError, setPdfError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handlePdfLoad = () => {
    setIsLoading(false);
    setPdfError(false);
  };

  const handlePdfError = () => {
    setIsLoading(false);
    setPdfError(true);
  };

  const openPdfInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  if (!pdfUrl) {
    return (
      <div className="bg-white border border-cinza-chumbo/20 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-cinza-chumbo/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-500">{fileName}</span>
            </div>
          </div>
        </div>
        <div className="relative" style={{ height }}>
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-center p-8">
            <div>
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-2">
                Regulamento não disponível
              </h3>
              <p className="text-cinza-chumbo/70 mb-4">
                O regulamento em PDF ainda não foi carregado para este evento.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-cinza-chumbo/20 rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-cinza-chumbo/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-verde-suave" />
            <span className="font-medium text-cinza-chumbo">{fileName}</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={openPdfInNewTab}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir em Nova Aba
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = fileName;
                link.click();
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-suave mx-auto mb-4"></div>
              <p className="text-cinza-chumbo">Carregando PDF...</p>
            </div>
          </div>
        )}

        {pdfError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-center p-8">
            <div>
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-2">
                Erro ao carregar PDF
              </h3>
              <p className="text-cinza-chumbo/70 mb-4">
                Não foi possível carregar o regulamento. Tente abrir em uma nova
                aba ou baixar o arquivo.
              </p>
              <div className="flex space-x-2 justify-center">
                <Button variant="outline" onClick={openPdfInNewTab}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir em Nova Aba
                </Button>
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = pdfUrl;
                    link.download = fileName;
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title={title}
            onLoad={handlePdfLoad}
            onError={handlePdfError}
            style={{ display: isLoading ? "none" : "block" }}
          />
        )}
      </div>
    </div>
  );
}
