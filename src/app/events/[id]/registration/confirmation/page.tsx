"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Download,
  Home,
  Mail,
  MapPin,
  QrCode,
  Share2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RegistrationConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.id as string;
  const registrationId = searchParams.get("registration");
  const participantId = searchParams.get("participant");

  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Para demonstração, vamos simular os dados da inscrição
    // Em uma implementação real, você buscaria os dados usando registrationId
    loadRegistrationData();
  }, [registrationId, participantId]);

  const loadRegistrationData = async () => {
    try {
      setLoading(true);
      // Simulação de dados - em produção, usar uma API específica
      const mockRegistration = {
        id: registrationId,
        participantName: "Participante Exemplo",
        eventName: "Festival Som Popular - Classificatória",
        eventId: eventId,
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de hoje
        eventLocation: "Auditório Municipal",
        status: "registered",
        registrationDate: new Date(),
        qrData: JSON.stringify({
          registrationId,
          participantId,
          eventId,
          timestamp: new Date().toISOString(),
        }),
      };

      setRegistration(mockRegistration);
    } catch (error) {
      setError("Erro ao carregar dados da inscrição");
    } finally {
      setLoading(false);
    }
  };

  const generateQRCodeSVG = (data: string) => {
    // Implementação simples de QR code usando SVG
    // Em produção, usar uma biblioteca apropriada
    const size = 200;
    const modules = 25; // Simplicidade para demonstração
    const moduleSize = size / modules;

    // Gerar padrão simples baseado no hash dos dados
    const hash = data.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    let squares = [];
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        const shouldFill = (hash + i * j) % 3 === 0;
        if (shouldFill) {
          squares.push(
            <rect
              key={`${i}-${j}`}
              x={i * moduleSize}
              y={j * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill="#000000"
            />
          );
        }
      }
    }

    return (
      <svg
        width={size}
        height={size}
        className="border border-gray-300 rounded-lg"
      >
        <rect width={size} height={size} fill="#ffffff" />
        {squares}
        {/* Corners para aparência de QR code */}
        <rect x="0" y="0" width="50" height="50" fill="#000" />
        <rect x="10" y="10" width="30" height="30" fill="#fff" />
        <rect x="15" y="15" width="20" height="20" fill="#000" />

        <rect x={size - 50} y="0" width="50" height="50" fill="#000" />
        <rect x={size - 40} y="10" width="30" height="30" fill="#fff" />
        <rect x={size - 35} y="15" width="20" height="20" fill="#000" />

        <rect x="0" y={size - 50} width="50" height="50" fill="#000" />
        <rect x="10" y={size - 40} width="30" height="30" fill="#fff" />
        <rect x="15" y={size - 35} width="20" height="20" fill="#000" />
      </svg>
    );
  };

  const handleDownloadCredential = () => {
    // Em uma implementação real, gerar um PDF com os dados da credencial
    toast.success("Funcionalidade de download em desenvolvimento");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Inscrição Festival Som Popular",
          text: `Inscrição confirmada para ${registration.eventName}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback para copiar para clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copiado para a área de transferência");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cinza-chumbo">Carregando confirmação...</p>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cinza-chumbo mb-4">
            {error || "Inscrição não encontrada"}
          </h1>
          <Link href="/">
            <Button className="festival-button-secondary">
              <Home className="w-4 h-4 mr-2" />
              Voltar à Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-verde-suave hover:text-verde-claro mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Home
          </Link>
        </div>

        {/* Confirmação de Sucesso */}
        <div className="max-w-4xl mx-auto">
          <div className="festival-card p-8 text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-cinza-chumbo mb-2">
              Inscrição Confirmada!
            </h1>
            <p className="text-lg text-cinza-chumbo/80 mb-6">
              Sua inscrição foi processada com sucesso. Guarde este comprovante
              como sua credencial de participação.
            </p>

            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
              Inscrição #{registration.id?.slice(-8).toUpperCase()}
            </Badge>
          </div>

          {/* Credencial Digital */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informações da Inscrição */}
            <div className="festival-card p-6">
              <h2 className="text-xl font-bold text-cinza-chumbo mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-verde-suave" />
                Detalhes da Inscrição
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-cinza-chumbo/70">
                    Participante
                  </label>
                  <p className="font-semibold text-cinza-chumbo">
                    {registration.participantName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-cinza-chumbo/70">
                    Evento
                  </label>
                  <p className="font-semibold text-cinza-chumbo">
                    {registration.eventName}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-dourado-claro" />
                  <div>
                    <label className="text-sm font-medium text-cinza-chumbo/70">
                      Data do Evento
                    </label>
                    <p className="font-semibold text-cinza-chumbo">
                      {formatDate(registration.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-dourado-claro" />
                  <div>
                    <label className="text-sm font-medium text-cinza-chumbo/70">
                      Local
                    </label>
                    <p className="font-semibold text-cinza-chumbo">
                      {registration.eventLocation}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-cinza-chumbo/70">
                    Data da Inscrição
                  </label>
                  <p className="font-semibold text-cinza-chumbo">
                    {formatDate(registration.registrationDate)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-cinza-chumbo/70">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge className="bg-green-100 text-green-800">
                      Confirmado
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="festival-card p-6">
              <h2 className="text-xl font-bold text-cinza-chumbo mb-6 flex items-center">
                <QrCode className="w-5 h-5 mr-2 text-verde-suave" />
                Credencial Digital
              </h2>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  {generateQRCodeSVG(registration.qrData)}
                </div>

                <p className="text-sm text-cinza-chumbo/70 mb-6">
                  Apresente este QR code no dia do evento para confirmar sua
                  participação. Pode imprimir ou mostrar no telemóvel.
                </p>

                {/* Ações */}
                <div className="space-y-3">
                  <Button
                    onClick={handleDownloadCredential}
                    className="w-full festival-button"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Credencial PDF
                  </Button>

                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partilhar Inscrição
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Instruções */}
          <div className="festival-card p-6 mt-8">
            <h3 className="text-lg font-bold text-cinza-chumbo mb-4">
              Próximos Passos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-verde-suave/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-verde-suave" />
                </div>
                <h4 className="font-semibold text-cinza-chumbo mb-2">
                  Confirmação por Email
                </h4>
                <p className="text-sm text-cinza-chumbo/70">
                  Receberá um email de confirmação com todos os detalhes nos
                  próximos minutos.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-dourado-claro/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-dourado-claro" />
                </div>
                <h4 className="font-semibold text-cinza-chumbo mb-2">
                  Prepare-se para o Evento
                </h4>
                <p className="text-sm text-cinza-chumbo/70">
                  Chegue 30 minutos antes do horário marcado e traga seu
                  instrumento.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-amarelo-suave/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-6 h-6 text-amarelo-suave" />
                </div>
                <h4 className="font-semibold text-cinza-chumbo mb-2">
                  Apresente sua Credencial
                </h4>
                <p className="text-sm text-cinza-chumbo/70">
                  Use o QR code acima para fazer check-in no dia do evento.
                </p>
              </div>
            </div>
          </div>

          {/* Links Adicionais */}
          <div className="text-center mt-8 space-y-4">
            <Link href="/consulta-inscricao">
              <Button variant="outline" className="mr-4">
                Consultar Outras Inscrições
              </Button>
            </Link>

            <Link href="/">
              <Button className="festival-button-secondary">
                <Home className="w-4 h-4 mr-2" />
                Voltar à Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
