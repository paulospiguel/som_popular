"use client";

import { ArrowRight, Calendar, Clock, MapPin, Users, Vote } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ROLES } from "@/constants";
import { useSession } from "@/lib/auth-client";
import {
  formatDateTime,
  getCategoryText,
  getEventTypeText,
  getStatusColor,
  getStatusText,
} from "@/lib/utils";
import { getEvents } from "@/server/events";
import { Event } from "@/types";

export default function VotingsSelectionPage() {
  const { data: session, isPending } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ProtectedProvider já faz a validação de permissões
    if (!isPending && session) {
      loadEvents();
    }
  }, [session, isPending]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      console.log("Iniciando carregamento de eventos...");

      // Carregar todos os eventos e filtrar pelo status
      const eventsResult = await getEvents();

      console.log("Resultado dos eventos:", eventsResult);

      if (eventsResult.success && eventsResult.data) {
        // Filtrar apenas eventos publicados ou em curso
        const availableEvents = eventsResult.data.filter(
          (event) => event.status === "ongoing" || event.status === "published"
        );

        console.log("Eventos disponíveis encontrados:", availableEvents.length);
        setEvents(availableEvents);
      } else {
        console.log("Nenhum evento encontrado ou erro");
        setEvents([]);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-suave mx-auto mb-4"></div>
          <p>A carregar eventos...</p>
        </div>
      </div>
    );
  }

  // Se não há sessão após o carregamento, será redirecionado pelo useEffect
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-cinza-chumbo mb-2 flex items-center">
                <Vote className="w-7 h-7 mr-3 text-verde-suave" />
                Sistema de Votação
              </h1>
              <p className="text-cinza-chumbo/70">
                Selecione um evento para iniciar o processo de votação
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-cinza-chumbo/70">Operador</p>
              <p className="font-semibold text-verde-suave">
                {session.user?.name || session.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Eventos */}
        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-cinza-chumbo mb-2">
              Nenhum Evento Disponível
            </h2>
            <p className="text-cinza-chumbo/70 mb-6">
              Não há eventos publicados ou em curso no momento. Para iniciar as
              votações, é necessário ter um evento ativo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {session.user?.role === ROLES.ADMIN && (
                <Link
                  href="/dashboard/events"
                  className="px-4 py-2 bg-verde-suave text-white rounded-lg hover:bg-verde-suave/90 transition-colors inline-flex items-center justify-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Ir para Gestão de Eventos
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-cinza-chumbo">
                          {event.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            event.status
                          )}`}
                        >
                          {getStatusText(event.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-cinza-chumbo/70 mb-3">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {getEventTypeText(event.type)}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {getCategoryText(event.category)}
                        </span>
                        {event.location && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-cinza-chumbo/80 text-sm">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-center space-x-2">
                      <Button
                        disabled={event.status !== "ongoing"}
                        variant="primary"
                        className="flex items-center space-x-2 h-12 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                        size="md"
                        shape="default"
                        appearance="default"
                        onClick={() => router.push(`/votings/${event.id}`)}
                      >
                        <span>Iniciar Votação</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>

                      {new Date(event.startDate) > new Date() && (
                        <div className="mt-2">
                          <p className="text-sm italic text-cinza-chumbo/70">
                            Inicia em:{" "}
                            {event.startDate.toLocaleDateString("pt-PT", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informações adicionais */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-cinza-chumbo/60">
                      <span>
                        Criado em{" "}
                        {event.createdAt
                          ? new Date(event.createdAt).toLocaleDateString(
                              "pt-PT",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "Data desconhecida"}
                      </span>
                      {event.startDate && (
                        <span className="text-cinza-chumbo/70">
                          Início em: {formatDateTime(new Date(event.startDate))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rodapé com informações */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Vote className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Como funciona o sistema de votação
              </h3>
              <p className="text-sm text-blue-700">
                Selecione um evento para acessar o sistema de votação
                específico. Cada evento tem seus próprios participantes, jurados
                e critérios de avaliação. O progresso é salvo automaticamente e
                pode ser retomado a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
