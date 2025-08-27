"use client";

import { getAllEventRankings } from "@/actions/rankings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Crown,
  Home,
  Star,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const EVENT_TYPE_LABELS = {
  classificatoria: "Classificatória",
  "semi-final": "Semi-Final",
  final: "Final",
};

const EVENT_TYPE_COLORS = {
  classificatoria: "bg-blue-100 text-blue-800",
  "semi-final": "bg-orange-100 text-orange-800",
  final: "bg-red-100 text-red-800",
};

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-blue-100 text-blue-800",
  ongoing: "bg-green-100 text-green-800",
  completed: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABELS = {
  draft: "Rascunho",
  published: "Publicado",
  ongoing: "Em Curso",
  completed: "Concluído",
  cancelled: "Cancelado",
};

export default function RankingPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      setLoading(true);
      const result = await getAllEventRankings();
      if (result.success && result.events) {
        setEvents(result.events);
      } else {
        setError(result.error || "Erro ao carregar rankings");
      }
    } catch (error) {
      setError("Erro ao carregar rankings");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const groupEventsByCategory = () => {
    const grouped = events.reduce(
      (acc, event) => {
        if (!acc[event.category]) {
          acc[event.category] = [];
        }
        acc[event.category].push(event);
        return acc;
      },
      {} as Record<string, any[]>
    );

    // Ordenar eventos dentro de cada categoria por tipo e data
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a: any, b: any) => {
        const typeOrder = { classificatoria: 1, "semi-final": 2, final: 3 };
        const aOrder = typeOrder[a.type as keyof typeof typeOrder] || 4;
        const bOrder = typeOrder[b.type as keyof typeof typeOrder] || 4;

        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }

        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      });
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cinza-chumbo">Carregando rankings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-cinza-chumbo/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-cinza-chumbo mb-4">{error}</h1>
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

  const groupedEvents = groupEventsByCategory();

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
            <h1 className="text-3xl font-bold text-cinza-chumbo mb-2 flex items-center">
              <Trophy className="w-8 h-8 mr-3 text-amarelo-suave" />
              Rankings do Festival
            </h1>
            <p className="text-cinza-chumbo/70">
              Acompanhe os resultados de todas as fases do Festival Som Popular
            </p>
          </div>
        </div>

        {/* Tabs por Categoria */}
        {Object.keys(groupedEvents).length > 0 ? (
          <Tabs defaultValue={Object.keys(groupedEvents)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-auto mb-6">
              {Object.keys(groupedEvents).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex items-center space-x-2 capitalize"
                >
                  <Trophy className="w-4 h-4" />
                  <span>{category}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(groupedEvents).map(([category, categoryEvents]) => (
              <TabsContent
                key={category}
                value={category}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(categoryEvents as any[])?.map((event: any) => (
                    <div key={event.id} className="festival-card p-6">
                      {/* Header do Evento */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-cinza-chumbo mb-2 line-clamp-2">
                            {event.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge
                              className={
                                EVENT_TYPE_COLORS[
                                  event.type as keyof typeof EVENT_TYPE_COLORS
                                ] || "bg-gray-100 text-gray-800"
                              }
                            >
                              {EVENT_TYPE_LABELS[
                                event.type as keyof typeof EVENT_TYPE_LABELS
                              ] || event.type}
                            </Badge>
                            <Badge
                              className={
                                STATUS_COLORS[
                                  event.status as keyof typeof STATUS_COLORS
                                ] || "bg-gray-100 text-gray-800"
                              }
                            >
                              {STATUS_LABELS[
                                event.status as keyof typeof STATUS_LABELS
                              ] || event.status}
                            </Badge>
                          </div>
                        </div>

                        {event.topParticipant && (
                          <div className="ml-4 text-center">
                            <Crown className="w-8 h-8 text-amarelo-suave mx-auto mb-1" />
                            <div className="text-xs text-cinza-chumbo/70">
                              Líder
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Informações do Evento */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-cinza-chumbo">
                          <Calendar className="w-4 h-4 mr-2 text-dourado-claro" />
                          <span>{formatDate(new Date(event.startDate))}</span>
                        </div>

                        <div className="flex items-center text-sm text-cinza-chumbo">
                          <Users className="w-4 h-4 mr-2 text-dourado-claro" />
                          <span>
                            {event.evaluatedCount > 0
                              ? `${event.evaluatedCount} avaliados`
                              : `${event.participantCount} participantes`}
                          </span>
                        </div>
                      </div>

                      {/* Líder Atual */}
                      {event.topParticipant ? (
                        <div className="bg-amarelo-suave/10 p-3 rounded-lg mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-cinza-chumbo/70 mb-1">
                                🥇 Primeiro Lugar
                              </div>
                              <div className="font-semibold text-cinza-chumbo">
                                {event.topParticipant.name}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-amarelo-suave">
                                <Star className="w-4 h-4 mr-1" />
                                <span className="font-bold">
                                  {event.topParticipant.score}
                                </span>
                              </div>
                              <div className="text-xs text-cinza-chumbo/70">
                                pontos
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4 text-center">
                          <div className="text-sm text-cinza-chumbo/70">
                            {event.status === "completed"
                              ? "Sem avaliações publicadas"
                              : "Avaliações em andamento"}
                          </div>
                        </div>
                      )}

                      {/* Ação */}
                      <Link href={`/ranking/${event.id}`}>
                        <Button size="sm" className="w-full">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Ver Ranking Completo
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="festival-card p-8 text-center">
            <Trophy className="w-16 h-16 text-cinza-chumbo/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-cinza-chumbo mb-2">
              Nenhum Ranking Disponível
            </h3>
            <p className="text-cinza-chumbo/70 mb-6">
              Os rankings serão publicados após o início das avaliações dos
              eventos.
            </p>
            <Link href="/">
              <Button className="festival-button">
                Ver Eventos Disponíveis
              </Button>
            </Link>
          </div>
        )}

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
