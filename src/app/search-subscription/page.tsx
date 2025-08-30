"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRegistrationByEmail } from "@/server/events-public";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Home,
  QrCode,
  Search,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_COLORS = {
  registered: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-gray-100 text-gray-800",
};

const STATUS_LABELS = {
  registered: "Inscrito",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  no_show: "Não Compareceu",
};

const STATUS_ICONS = {
  registered: CheckCircle,
  confirmed: CheckCircle,
  cancelled: XCircle,
  no_show: Clock,
};

export default function RegistrationLookupPage() {
  const [email, setEmail] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor, insira um email");
      return;
    }

    try {
      setLoading(true);
      const result = await getRegistrationByEmail(email);

      if (result.success && result.registrations) {
        setRegistrations(result.registrations);
        setSearched(true);
        if (result.registrations.length === 0) {
          toast.info("Nenhuma inscrição encontrada para este email");
        }
      } else {
        toast.error(result.error || "Erro ao buscar inscrições");
        setRegistrations([]);
        setSearched(true);
      }
    } catch (error) {
      toast.error("Erro ao buscar inscrições");
      setRegistrations([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCodeSVG = (data: string, size = 120) => {
    const modules = 21;
    const moduleSize = size / modules;

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
        className="border border-gray-200 rounded"
      >
        <rect width={size} height={size} fill="#ffffff" />
        {squares}
        {/* Corners */}
        <rect x="0" y="0" width="30" height="30" fill="#000" />
        <rect x="5" y="5" width="20" height="20" fill="#fff" />
        <rect x="10" y="10" width="10" height="10" fill="#000" />

        <rect x={size - 30} y="0" width="30" height="30" fill="#000" />
        <rect x={size - 25} y="5" width="20" height="20" fill="#fff" />
        <rect x={size - 20} y="10" width="10" height="10" fill="#000" />

        <rect x="0" y={size - 30} width="30" height="30" fill="#000" />
        <rect x="5" y={size - 25} width="20" height="20" fill="#fff" />
        <rect x="10" y={size - 20} width="10" height="10" fill="#000" />
      </svg>
    );
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

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

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

          <div className="festival-card p-6">
            <h1 className="text-3xl font-bold text-cinza-chumbo mb-2">
              Consultar Inscrição
            </h1>
            <p className="text-cinza-chumbo/70">
              Encontre suas inscrições nos eventos do Festival Som Popular
            </p>
          </div>
        </div>

        {/* Formulário de Busca */}
        <div className="festival-card p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                Email de Inscrição
              </label>
              <div className="flex space-x-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite o email usado na inscrição..."
                  className="flex-1"
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="festival-button"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Resultados */}
        {searched && (
          <div>
            {registrations.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold text-cinza-chumbo mb-6">
                  Inscrições Encontradas ({registrations.length})
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {registrations.map((registration) => {
                    const StatusIcon =
                      STATUS_ICONS[
                        registration.status as keyof typeof STATUS_ICONS
                      ];

                    return (
                      <div key={registration.id} className="festival-card p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-cinza-chumbo mb-1">
                              {registration.eventName}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="w-4 h-4" />
                              <Badge
                                className={
                                  STATUS_COLORS[
                                    registration.status as keyof typeof STATUS_COLORS
                                  ]
                                }
                              >
                                {
                                  STATUS_LABELS[
                                    registration.status as keyof typeof STATUS_LABELS
                                  ]
                                }
                              </Badge>
                            </div>
                          </div>

                          <div className="ml-4">
                            {generateQRCodeSVG(registration.qrData)}
                          </div>
                        </div>

                        {/* Informações do Evento */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-sm text-cinza-chumbo">
                            <User className="w-4 h-4 mr-2 text-verde-suave" />
                            <span className="font-medium">
                              {registration.participantName}
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-cinza-chumbo">
                            <Calendar className="w-4 h-4 mr-2 text-dourado-claro" />
                            <span>
                              {formatDate(new Date(registration.eventDate))}
                            </span>
                          </div>
                        </div>

                        {/* Detalhes da Inscrição */}
                        <div className="border-t pt-4">
                          <div className="grid grid-cols-2 gap-4 text-xs text-cinza-chumbo/70">
                            <div>
                              <span className="font-medium">
                                ID da Inscrição:
                              </span>
                              <br />#{registration.id.slice(-8).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-medium">
                                Data da Inscrição:
                              </span>
                              <br />
                              {formatDateShort(
                                new Date(registration.registrationDate)
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="mt-4 pt-4 border-t">
                          <Link
                            href={`/eventos/${registration.eventId}/inscricao/confirmacao?registration=${registration.id}`}
                          >
                            <Button
                              size="sm"
                              className="w-full"
                              variant="outline"
                            >
                              <QrCode className="w-4 h-4 mr-2" />
                              Ver Credencial Completa
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="festival-card p-8 text-center">
                <AlertCircle className="w-16 h-16 text-cinza-chumbo/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-cinza-chumbo mb-2">
                  Nenhuma Inscrição Encontrada
                </h3>
                <p className="text-cinza-chumbo/70 mb-6">
                  Não encontramos inscrições para o email{" "}
                  <strong>{email}</strong>.
                  <br />
                  Verifique se o email está correto ou se você já se inscreveu
                  em algum evento.
                </p>

                <div className="space-y-3">
                  <Link href="/">
                    <Button className="festival-button">
                      Ver Eventos Disponíveis
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setEmail("");
                      setSearched(false);
                      setRegistrations([]);
                    }}
                  >
                    Tentar Outro Email
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informações de Ajuda */}
        <div className="festival-card p-6 mt-8">
          <h3 className="text-lg font-bold text-cinza-chumbo mb-4">
            Precisa de Ajuda?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-2">
                Email Não Encontrado?
              </h4>
              <p className="text-cinza-chumbo/70">
                Verifique se o email usado está correto. Use exatamente o mesmo
                email que usou na inscrição.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-2">
                Problemas com QR Code?
              </h4>
              <p className="text-cinza-chumbo/70">
                Se o QR code não funcionar no evento, mostre o ID da inscrição
                para nossa equipe.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-2">
                Cancelar Inscrição?
              </h4>
              <p className="text-cinza-chumbo/70">
                Entre em contato conosco pelo menos 24 horas antes do evento
                para cancelamentos.
              </p>
            </div>
          </div>
        </div>

        {/* Link para Home */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button className="festival-button-secondary">
              <Home className="w-4 h-4 mr-2" />
              Voltar à Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
