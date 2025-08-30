"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicEvents, type PublicEvent } from "@/server/events-public";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Music,
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

const STATUS_LABELS = {
  not_open: "Inscrições em Breve",
  open: "Inscrições Abertas",
  closed: "Inscrições Encerradas",
  full: "Lotado",
};

const STATUS_COLORS = {
  not_open: "bg-gray-100 text-gray-800",
  open: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-800",
  full: "bg-yellow-100 text-yellow-800",
};

const STATUS_ICONS = {
  not_open: Clock,
  open: Users,
  closed: Calendar,
  full: Trophy,
};

export default function EventsSection() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const result = await getPublicEvents();
      if (result.success && result.events) {
        setEvents(result.events);
      } else {
        setError(result.error || "Erro ao carregar eventos");
      }
    } catch (error) {
      setError("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  };

  const getNextEvents = () => {
    const now = new Date();
    return events.filter((event) => event.startDate > now).slice(0, 3);
  };

  const getCurrentEvents = () => {
    const now = new Date();
    return events.filter(
      (event) =>
        event.startDate <= now &&
        (!event.endDate || event.endDate > now) &&
        event.status === "ongoing"
    );
  };

  if (loading) {
    return (
      <section className="py-20 px-6 bg-gradient-to-br from-verde-muito-suave/30 to-dourado-muito-claro/30">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-cinza-chumbo">Carregando eventos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6 bg-gradient-to-br from-verde-muito-suave/30 to-dourado-muito-claro/30">
        <div className="container mx-auto text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadEvents} className="mt-4">
            Tentar Novamente
          </Button>
        </div>
      </section>
    );
  }

  const currentEvents = getCurrentEvents();
  const nextEvents = getNextEvents();

  return (
    <section
      id="eventos"
      className="py-20 px-6 bg-gradient-to-br from-verde-muito-suave/30 to-dourado-muito-claro/30"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="festival-title text-3xl md:text-4xl mb-4 text-verde-suave">
            Eventos do Festival
          </h2>
          <p className="festival-subtitle text-base md:text-lg text-cinza-chumbo max-w-2xl mx-auto">
            Acompanhe as diferentes fases do festival e inscreva-se nos eventos
          </p>
        </div>

        {/* Eventos Atuais */}
        {currentEvents.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-cinza-chumbo mb-6 flex items-center">
              <Music className="w-6 h-6 mr-2 text-verde-suave" />
              Acontecendo Agora
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event) => (
                <EventCard key={event.id} event={event} isCurrentEvent />
              ))}
            </div>
          </div>
        )}

        {/* Próximos Eventos */}
        {nextEvents.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-cinza-chumbo mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-dourado-claro" />
              Próximos Eventos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nextEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Ver Todos os Eventos */}
        {events.length > 3 && (
          <div className="text-center">
            <Link href="/eventos">
              <Button className="festival-button-secondary">
                Ver Todos os Eventos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* Estado sem eventos */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-cinza-chumbo/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-cinza-chumbo mb-2">
              Nenhum evento disponível
            </h3>
            <p className="text-cinza-chumbo/70">
              Novos eventos serão anunciados em breve
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

interface EventCardProps {
  event: PublicEvent;
  isCurrentEvent?: boolean;
}

function EventCard({ event, isCurrentEvent = false }: EventCardProps) {
  const StatusIcon = STATUS_ICONS[event.registrationStatus];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <Link href={`/events/${event.id}`} className="block">
      <div
        className={`festival-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
          isCurrentEvent
            ? "border-2 border-verde-suave bg-verde-suave/5 hover:bg-verde-suave/10"
            : "hover:scale-105"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-bold text-lg text-cinza-chumbo mb-2 line-clamp-2">
              {event.name}
            </h4>
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
              <Badge variant="outline" className="capitalize">
                {event.category}
              </Badge>
            </div>
          </div>
          {isCurrentEvent && (
            <div className="text-verde-suave">
              <div className="w-3 h-3 bg-verde-suave rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Descrição */}
        {event.description && (
          <p className="text-sm text-cinza-chumbo/80 mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Informações do Evento */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-cinza-chumbo">
            <Calendar className="w-4 h-4 mr-2 text-dourado-claro" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center text-sm text-cinza-chumbo">
            <MapPin className="w-4 h-4 mr-2 text-dourado-claro" />
            <span>{event.location}</span>
          </div>
          {event.maxParticipants && (
            <div className="flex items-center text-sm text-cinza-chumbo">
              <Users className="w-4 h-4 mr-2 text-dourado-claro" />
              <span>
                {event.currentParticipants} / {event.maxParticipants}{" "}
                participantes
              </span>
            </div>
          )}
        </div>

        {/* Status de Inscrição */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <StatusIcon className="w-4 h-4" />
            <Badge className={STATUS_COLORS[event.registrationStatus]}>
              {STATUS_LABELS[event.registrationStatus]}
            </Badge>
          </div>
        </div>

        {/* Ações */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            Ver Detalhes
          </Button>
          {event.canRegister && (
            <Button
              size="sm"
              className="flex-1 festival-button"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/events/${event.id}/registration`;
              }}
            >
              Inscrever-me
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
