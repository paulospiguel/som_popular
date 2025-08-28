"use client";

import { getPublicEvents, type PublicEvent } from "@/actions/events-public";
import { Button } from "@/components/ui/button";
import { Calendar, Music, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface EventStatus {
  totalEvents: number;
  openRegistrations: number;
  nextEventDate: Date | null;
  nextEventName: string | null;
  totalParticipants: number;
}

export default function CurrentStatusCard() {
  const [status, setStatus] = useState<EventStatus>({
    totalEvents: 0,
    openRegistrations: 0,
    nextEventDate: null,
    nextEventName: null,
    totalParticipants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentStatus();
  }, []);

  const loadCurrentStatus = async () => {
    try {
      setLoading(true);
      const result = await getPublicEvents();

      console.log("Resultado getPublicEvents:", result);

      if (result.success && result.events) {
        const now = new Date();
        console.log("Data atual:", now);
        console.log("Eventos encontrados:", result.events.length);

        // Calcular estatísticas
        const openEvents = result.events.filter(
          (event: PublicEvent) =>
            event.registrationStatus === "open" && event.canRegister
        );

        console.log("Eventos com inscrições abertas:", openEvents.length);
        console.log(
          "Status dos eventos:",
          result.events.map((e: PublicEvent) => ({
            name: e.name,
            status: e.status,
            registrationStatus: e.registrationStatus,
            canRegister: e.canRegister,
          }))
        );

        const nextEvent = result.events
          .filter((event: PublicEvent) => new Date(event.startDate) > now)
          .sort(
            (a: PublicEvent, b: PublicEvent) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )[0];

        // Calcular total de participantes (aproximado)
        const totalParticipants = result.events.reduce(
          (sum: number, event: PublicEvent) => sum + event.currentParticipants,
          0
        );

        setStatus({
          totalEvents: result.events.length,
          openRegistrations: openEvents.length,
          nextEventDate: nextEvent ? new Date(nextEvent.startDate) : null,
          nextEventName: nextEvent?.name || null,
          totalParticipants,
        });
      } else {
        console.log("Erro ou sem eventos:", result.error);
      }
    } catch (error) {
      console.error("Erro ao carregar status:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getStatusColor = () => {
    if (status.openRegistrations > 0) return "text-green-600";
    if (status.totalEvents > 0) return "text-orange-600";
    return "text-gray-600";
  };

  const getStatusText = () => {
    if (status.openRegistrations > 0) return "Inscrições Abertas";
    if (status.totalEvents > 0) return "Eventos em Preparação";
    return "Aguardando Eventos";
  };

  const getStatusIcon = () => {
    if (status.openRegistrations > 0) return "bg-green-500";
    if (status.totalEvents > 0) return "bg-orange-500";
    return "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="festival-card p-8 max-w-md mx-auto bg-slate-50">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cinza-chumbo/70">Carregando status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="festival-card p-8 max-w-md mx-auto bg-slate-50">
      <h3 className="festival-subtitle text-lg font-semibold mb-4 text-terra">
        Estado Atual
      </h3>

      {/* Status Principal */}
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div
          className={`w-4 h-4 ${getStatusIcon()} rounded-full animate-pulse`}
        ></div>
        <span className={`font-semibold text-lg ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Estatísticas */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-cinza-chumbo/70 flex items-center">
            <Music className="w-4 h-4 mr-2" />
            Total de Eventos
          </span>
          <span className="font-semibold text-cinza-chumbo">
            {status.totalEvents}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-cinza-chumbo/70 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Inscrições Abertas
          </span>
          <span className="font-semibold text-green-600">
            {status.openRegistrations}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-cinza-chumbo/70 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Total de Participantes
          </span>
          <span className="font-semibold text-cinza-chumbo">
            {status.totalParticipants}
          </span>
        </div>
      </div>

      {/* Próximo Evento */}
      {status.nextEventDate && status.nextEventName && (
        <div className="bg-verde-suave/10 border border-verde-suave/20 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-verde-suave" />
            <span className="text-sm font-medium text-verde-suave">
              Próximo Evento
            </span>
          </div>
          <p className="text-sm font-semibold text-cinza-chumbo mb-1">
            {status.nextEventName}
          </p>
          <p className="text-xs text-cinza-chumbo/70">
            {formatDate(status.nextEventDate)}
          </p>
        </div>
      )}

      {/* Ações */}
      <div className="space-y-2">
        {status.openRegistrations > 0 && (
          <Link href="/participant-registration" className="block">
            <Button className="w-full festival-button text-sm py-2">
              <Users className="w-4 h-4 mr-2" />
              Inscrever-se Agora
            </Button>
          </Link>
        )}

        <Link href="/#eventos" className="block">
          <Button variant="outline" className="w-full text-sm py-2">
            <Calendar className="w-4 h-4 mr-2" />
            Ver Todos os Eventos
          </Button>
        </Link>
      </div>

      {/* Atualização */}
      <p className="text-xs text-cinza-chumbo/50 text-center mt-3">
        Última atualização:{" "}
        {new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
