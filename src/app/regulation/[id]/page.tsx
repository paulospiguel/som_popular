"use client";

import { AlertCircle, ArrowLeft, FileText, Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import PDFViewer from "@/components/PDFViewer";
import { Button } from "@/components/ui/button";
import { getPublicEventById, PublicEvent } from "@/server/events-public";

interface RegulationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RegulationPage({ params }: RegulationPageProps) {
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params;
        setEventId(resolvedParams.id);
      } catch (err) {
        setError("Erro ao carregar parâmetros");
        setLoading(false);
      }
    };

    getParams();
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const result = await getPublicEventById(eventId);

        if (result.success && result.event) {
          setEvent(result.event);
        } else {
          setError(result.error || "Evento não encontrado");
        }
      } catch (err) {
        setError("Erro ao carregar o evento");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro py-12">
        <div className="container mx-auto px-4">
          <div className="festival-card p-6 max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-suave mx-auto mb-4"></div>
            <p className="text-cinza-chumbo">Carregando regulamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro py-12">
        <div className="container mx-auto px-4">
          <div className="festival-card p-6 max-w-4xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-cinza-chumbo mb-4">
              Erro ao carregar regulamento
            </h1>
            <p className="text-cinza-chumbo/70 mb-6">
              {error || "Evento não encontrado"}
            </p>
            <Link href="/">
              <Button className="festival-button">
                <Home className="w-4 h-4 mr-2" />
                Voltar à Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro py-12">
      <div className="container mx-auto px-4">
        <Link
          href={`/events/${eventId}`}
          className="inline-flex items-center text-verde-suave hover:text-verde-escuro mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Evento
        </Link>

        <div className="festival-card p-6 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 text-verde-suave mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-cinza-chumbo mb-2">
              Regulamento - {event.name}
            </h1>
            <p className="text-cinza-chumbo/70">
              {event.description ||
                "Festival Som Popular - Prefeitura Municipal do Centenário do Sul"}
            </p>
          </div>

          {/* PDF Viewer */}
          <div className="mb-6">
            <PDFViewer
              pdfUrl={event.rulesFile}
              title={`Regulamento - ${event.name}`}
              fileName={
                event.rulesFile
                  ? event.rulesFile.split("/").pop() || "regulamento.pdf"
                  : "regulamento.pdf"
              }
              height="800px"
            />

            {/* Exibir regras do evento se disponíveis e não houver PDF */}
            {!event.rulesFile && event.rules && (
              <div className="mt-6 bg-white border border-cinza-chumbo/20 rounded-lg p-6">
                <h4 className="font-bold text-verde-suave mb-4 text-center">
                  REGRAS DO EVENTO
                </h4>
                <div className="bg-gray-50 p-4 rounded border">
                  <pre className="whitespace-pre-wrap text-cinza-chumbo/80 font-sans text-sm">
                    {event.rules}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4">
            {event.canRegister && (
              <Link href={`/events/${eventId}/registration`} className="flex-1">
                <Button className="festival-button w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Aceitar e Registrar-se
                </Button>
              </Link>
            )}

            <Link href={`/events/${eventId}`} className="flex-1">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Evento
              </Button>
            </Link>
          </div>

          {/* Informações de Contato */}
          <div className="mt-8 pt-6 border-t border-cinza-chumbo/20">
            <h3 className="text-lg font-semibold text-cinza-chumbo mb-4">
              Dúvidas sobre o Regulamento?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-cinza-chumbo mb-1">
                  Secretaria de Cultura
                </h4>
                <p className="text-cinza-chumbo/70">
                  cultura@centenariodosul.com.br
                </p>
              </div>
              <div>
                <h4 className="font-medium text-cinza-chumbo mb-1">Telefone</h4>
                <p className="text-cinza-chumbo/70">(XX) XXXX-XXXX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
