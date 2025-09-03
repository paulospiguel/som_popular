"use client";

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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRegistrationByEmail } from "@/server/events-public";

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle,
  cancelled: XCircle,
  completed: CheckCircle,
};

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const STATUS_LABELS = {
  pending: "Pendente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Concluída",
};

export default function RegistrationLookupPage() {
  const [email, setEmail] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "short",
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

  const generateQRCodeSVG = (data: string) => {
    const size = 120;
    const modules = 21;
    const moduleSize = size / modules;

    const hash = data.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const squares = [];
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        const index = i * modules + j;
        const shouldFill = (hash + index) % 3 === 0;
        if (shouldFill) {
          squares.push(
            <rect
              key={`${i}-${j}`}
              x={i * moduleSize}
              y={j * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill="#000"
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor, insira um email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await getRegistrationByEmail(email);

      if (result.success && result.registrations) {
        setRegistrations(result.registrations);
        if (result.registrations.length === 0) {
          setError("Nenhuma inscrição encontrada para este email");
        }
      } else {
        setError(result.error || "Erro ao buscar inscrições");
        setRegistrations([]);
      }
    } catch (error) {
      setError("Erro interno do servidor");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center text-verde-suave hover:text-verde-escuro mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Home
        </Link>

        <div className="festival-card p-6">
          <h1 className="text-3xl font-bold text-cinza-chumbo mb-2">
            Consultar Inscrições
          </h1>
          <p className="text-cinza-chumbo/70 mb-8">
            Digite seu email para consultar todas as suas inscrições em eventos
          </p>

          <form
            onSubmit={handleSearch}
            className="festival-card p-6 max-w-xl mx-auto mb-8"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                  Email de Cadastro
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="festival-button w-full"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Buscando...
                  </div>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Inscrições
                  </>
                )}
              </Button>
            </div>
          </form>

          {loading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-cinza-chumbo">Buscando suas inscrições...</p>
            </div>
          )}

          {error && (
            <div className="festival-card p-6 max-w-2xl mx-auto">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-cinza-chumbo mb-2">
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
                    <Button className="festival-button w-full">
                      <Home className="w-4 h-4 mr-2" />
                      Ver Eventos Disponíveis
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setError("");
                      setEmail("");
                    }}
                    className="w-full"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Tentar Outro Email
                  </Button>
                </div>
              </div>
            </div>
          )}

          {registrations.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-cinza-chumbo text-center">
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
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-cinza-chumbo mb-2">
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

                      <div className="space-y-2 mb-4">
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

                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
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

                      <Link
                        href={`/events/${registration.eventId}/registration/confirmation?registration=${registration.id}`}
                      >
                        <Button size="sm" className="w-full" variant="outline">
                          <QrCode className="w-4 h-4 mr-2" />
                          Ver Credencial Completa
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Ajuda */}
        <div className="festival-card p-6 mt-8">
          <h3 className="text-lg font-semibold text-cinza-chumbo mb-4">
            Precisa de Ajuda?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-2">
                Email Correto?
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
      </div>
    </div>
  );
}
