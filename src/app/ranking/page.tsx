"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEventRankings } from "@/server/rankings";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
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
  classificatoria: "bg-blue-50 text-blue-700 border-blue-200",
  "semi-final": "bg-orange-50 text-orange-700 border-orange-200",
  final: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_COLORS = {
  draft: "bg-gray-50 text-gray-700 border-gray-200",
  published: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-green-50 text-green-700 border-green-200",
  completed: "bg-purple-50 text-purple-700 border-purple-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABELS = {
  draft: "Rascunho",
  published: "Publicado",
  ongoing: "Em Curso",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const STATUS_ICONS = {
  draft: Clock,
  published: Clock,
  ongoing: Clock,
  completed: CheckCircle,
  cancelled: Clock,
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

  const groupEventsByStatus = () => {
    const grouped = {
      ongoing: [] as any[],
      completed: [] as any[],
      other: [] as any[],
    };

    events.forEach((event) => {
      if (event.status === "ongoing") {
        grouped.ongoing.push(event);
      } else if (event.status === "completed") {
        grouped.completed.push(event);
      } else {
        grouped.other.push(event);
      }
    });

    // Ordenar eventos dentro de cada grupo por tipo e data
    Object.keys(grouped).forEach((status) => {
      grouped[status as keyof typeof grouped].sort((a: any, b: any) => {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando rankings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Voltar à Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const groupedEvents = groupEventsByStatus();
  const hasEvents =
    groupedEvents.ongoing.length > 0 || groupedEvents.completed.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Home
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Trophy className="w-8 h-8 mr-3 text-yellow-600" />
              Rankings do Festival
            </h1>
            <p className="text-gray-600">
              Acompanhe os resultados de todas as fases do Festival Som Popular
            </p>
          </div>
        </div>

        {/* Tabs por Status */}
        {hasEvents ? (
          <Tabs defaultValue="ongoing" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
              <TabsTrigger value="ongoing" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Em Andamento
                {groupedEvents.ongoing.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {groupedEvents.ongoing.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Concluídos
                {groupedEvents.completed.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {groupedEvents.completed.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Tab: Eventos em Andamento */}
            <TabsContent value="ongoing" className="space-y-6">
              {groupedEvents.ongoing.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {groupedEvents.ongoing.map((event: any) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Nenhum Evento em Andamento
                  </h3>
                  <p className="text-gray-600">
                    Não há eventos com avaliações em andamento no momento.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Tab: Eventos Concluídos */}
            <TabsContent value="completed" className="space-y-6">
              {groupedEvents.completed.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {groupedEvents.completed.map((event: any) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Nenhum Evento Concluído
                  </h3>
                  <p className="text-gray-600">
                    Os rankings serão publicados após a conclusão dos eventos.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum Ranking Disponível
            </h3>
            <p className="text-gray-600 mb-6">
              Os rankings serão publicados após o início das avaliações dos
              eventos.
            </p>
            <Link href="/">
              <Button>Ver Eventos Disponíveis</Button>
            </Link>
          </div>
        )}

        {/* Link para Home */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Voltar à Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Componente de Card de Evento
function EventCard({ event }: { event: any }) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const StatusIcon = STATUS_ICONS[event.status as keyof typeof STATUS_ICONS];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header do Evento */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
            {event.name}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge
              className={
                EVENT_TYPE_COLORS[
                  event.type as keyof typeof EVENT_TYPE_COLORS
                ] || "bg-gray-50 text-gray-700 border-gray-200"
              }
            >
              {EVENT_TYPE_LABELS[
                event.type as keyof typeof EVENT_TYPE_LABELS
              ] || event.type}
            </Badge>
            <Badge
              className={
                STATUS_COLORS[event.status as keyof typeof STATUS_COLORS] ||
                "bg-gray-50 text-gray-700 border-gray-200"
              }
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {STATUS_LABELS[event.status as keyof typeof STATUS_LABELS] ||
                event.status}
            </Badge>
          </div>
        </div>

        {event.topParticipant && (
          <div className="ml-4 text-center">
            <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Líder</div>
          </div>
        )}
      </div>

      {/* Informações do Evento */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
          <span>{formatDate(event.startDate)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 text-green-600" />
          <span>
            {event.evaluatedCount > 0
              ? `${event.evaluatedCount} avaliados`
              : `${event.participantCount} participantes`}
          </span>
        </div>
      </div>

      {/* Líder Atual */}
      {event.topParticipant ? (
        <div className="bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-yellow-700 mb-1">
                🥇 Primeiro Lugar
              </div>
              <div className="font-semibold text-gray-900">
                {event.topParticipant.name}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-yellow-600">
                <Star className="w-4 h-4 mr-1" />
                <span className="font-bold">{event.topParticipant.score}</span>
              </div>
              <div className="text-xs text-yellow-700">pontos</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded-lg mb-4 text-center border border-gray-200">
          <div className="text-sm text-gray-600">
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
  );
}
