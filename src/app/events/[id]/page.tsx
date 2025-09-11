"use client";

import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Music,
  Share2,
  Star,
  Target,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicEventById } from "@/server/events-public";

const EVENT_TYPE_LABELS = {
  classificatoria: "Classificatória",
  "semi-final": "Semi-Final",
  final: "Final",
};

// Cores alinhadas com EventsSection (tons 100, sem borda)
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

// Cores alinhadas com EventsSection
const STATUS_COLORS = {
  not_open: "bg-gray-100 text-gray-800",
  open: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-800",
  full: "bg-yellow-100 text-yellow-800",
};

// Ícones alinhados com EventsSection
const STATUS_ICONS = {
  not_open: Clock,
  open: Users,
  closed: Calendar,
  full: Trophy,
};

// Ajuste para aparência mais suave e coesa
const PHASE_COLORS = {
  classificatoria: "bg-blue-100 text-blue-800",
  "semi-final": "bg-orange-100 text-orange-800",
  final: "bg-red-100 text-red-800",
};

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string>("");

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const result = await getPublicEventById(eventId);

      if (result.success && result.event) {
        setEvent(result.event);
      } else {
        setError(result.error || "Evento não encontrado");
      }
    } catch (error) {
      setError("Erro ao carregar evento");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/events/${eventId}`;
    const eventTitle = event?.name || "Evento Som Popular";
    const eventDescription =
      event?.description || "Participe neste evento incrível!";

    try {
      // Tentar usar a Web Share API (disponível em dispositivos móveis)
      if (navigator.share) {
        await navigator.share({
          title: eventTitle,
          text: eventDescription,
          url: eventUrl,
        });
        setShareStatus("Partilhado com sucesso!");
      } else {
        // Fallback: copiar para clipboard
        await navigator.clipboard.writeText(eventUrl);
        setShareStatus("Link copiado para a área de transferência!");
      }
    } catch (error) {
      // Se falhar, usar fallback de copiar
      try {
        await navigator.clipboard.writeText(eventUrl);
        setShareStatus("Link copiado para a área de transferência!");
      } catch (clipboardError) {
        // Último recurso: mostrar o link
        setShareStatus("Link: " + eventUrl);
      }
    }

    // Limpar a mensagem após 3 segundos
    setTimeout(() => setShareStatus(""), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-verde-muito-suave/30 to-dourado-muito-claro/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cinza-chumbo">Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-verde-muito-suave/30 to-dourado-muito-claro/30 flex items-center justify-center px-6">
        <div className="text-center max-w-md mx-auto">
          <Button onClick={() => router.back()} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-cinza-chumbo mb-4">
            Evento não encontrado
          </h1>
          <p className="text-cinza-chumbo/80 mb-6">
            {error ||
              "O evento solicitado não foi encontrado ou não está disponível."}
          </p>
          <Link href="/">
            <Button className="festival-button">Voltar à Página Inicial</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDateOnly = (date: Date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const StatusIcon =
    STATUS_ICONS[event.registrationStatus as keyof typeof STATUS_ICONS];

  const getDaysUntilEvent = () => {
    const now = new Date();
    const eventDate = new Date(event.startDate);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilEvent = getDaysUntilEvent();

  // Gerar cronograma baseado no tipo de evento
  const generateEventSchedule = () => {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : null;

    const schedule = [];

    if (event.type === "classificatoria") {
      schedule.push({
        phase: "classificatoria",
        title: "Fase Classificatória",
        description: "Apresentações dos participantes para seleção",
        startDate: startDate,
        endDate:
          endDate || new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 dias se não houver endDate
        icon: Target,
        color: PHASE_COLORS.classificatoria,
      });
    } else if (event.type === "semi-final") {
      schedule.push({
        phase: "semi-final",
        title: "Semi-Final",
        description: "Competição entre participantes selecionados",
        startDate: startDate,
        endDate:
          endDate || new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000), // +1 dia
        icon: Award,
        color: PHASE_COLORS["semi-final"],
      });
    } else if (event.type === "final") {
      schedule.push({
        phase: "final",
        title: "Final",
        description: "Disputa final pelos prémios principais",
        startDate: startDate,
        endDate:
          endDate || new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000), // +1 dia
        icon: Trophy,
        color: PHASE_COLORS.final,
      });
    }

    return schedule;
  };

  const eventSchedule = generateEventSchedule();

  return (
    <div className="min-h-screen bg-gradient-to-br from-verde-muito-suave/30 to-dourado-muito-claro/30">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button onClick={() => router.back()} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Header do Evento */}
        <div className="festival-card p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="flex-1 w-full">
              {/* Badges de Status */}
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  className={
                    EVENT_TYPE_COLORS[
                      event.type as keyof typeof EVENT_TYPE_COLORS
                    ]
                  }
                >
                  {
                    EVENT_TYPE_LABELS[
                      event.type as keyof typeof EVENT_TYPE_COLORS
                    ]
                  }
                </Badge>
                <Badge
                  className={
                    STATUS_COLORS[
                      event.registrationStatus as keyof typeof STATUS_COLORS
                    ]
                  }
                >
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {
                    STATUS_LABELS[
                      event.registrationStatus as keyof typeof STATUS_COLORS
                    ]
                  }
                </Badge>
              </div>

              {/* Título */}
              <h1 className="festival-title text-3xl md:text-4xl mb-4 text-verde-suave">
                {event.name}
              </h1>

              {/* Descrição */}
              {event.description && (
                <p className="text-cinza-chumbo/80 mb-6 leading-relaxed">
                  {event.description}
                </p>
              )}

              {/* Informações Principais */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-3 text-cinza-chumbo">
                  <MapPin className="w-5 h-5 text-dourado-claro" />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center gap-3 text-cinza-chumbo">
                  <Music className="w-5 h-5 text-dourado-claro" />
                  <span className="capitalize">{event.category}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Datas de Inscrição */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cinza-chumbo mb-3">
                      Período de Inscrições
                    </h3>

                    {event.registrationStartDate && (
                      <div className="flex items-center gap-6 text-sm text-cinza-chumbo/70">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            Início:{" "}
                            {formatDateOnly(event.registrationStartDate)}
                          </span>
                        </div>
                      </div>
                    )}

                    {event.registrationEndDate && (
                      <div className="flex items-center gap-6 text-sm text-cinza-chumbo/70">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>
                            Fim: {formatDateOnly(event.registrationEndDate)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Datas do Evento */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cinza-chumbo mb-3">
                      Datas do Evento
                    </h3>

                    {event.startDate && (
                      <div className="flex items-center gap-6 text-sm text-cinza-chumbo/70">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Início: {formatDateOnly(event.startDate)}</span>
                        </div>
                      </div>
                    )}

                    {event.endDate && (
                      <div className="flex items-center gap-6 text-sm text-cinza-chumbo/70">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Fim: {formatDateOnly(event.endDate)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contador de Dias */}
              {daysUntilEvent > 0 && (
                <div className="bg-verde-suave/10 rounded-lg p-4 inline-block border border-verde-suave/20">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-verde-suave" />
                    <div>
                      <p className="text-sm text-verde-suave">Faltam</p>
                      <p className="text-xl font-bold text-verde-suave">
                        {daysUntilEvent} dias
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar com Informações Rápidas */}
            <div className="lg:w-72 space-y-4 w-full">
              {/* Prémios */}
              {event.prizes && (
                <div className="festival-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-dourado-claro" />
                    <h3 className="font-semibold text-cinza-chumbo">Prémios</h3>
                  </div>
                  <div className="space-y-1">
                    {event.prizes
                      .split(",")
                      .map((prize: string, index: number) => (
                        <div key={index} className="text-sm text-cinza-chumbo/80">
                          • {prize.trim()}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Estatísticas */}
              <div className="festival-card p-4">
                <h3 className="font-semibold flex items-center gap-2 text-cinza-chumbo mb-3">
                  <Users className="w-5 h-5 mr-2 text-dourado-claro" />
                  <span>Participantes inscritos</span>
                </h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-verde-suave">
                    {event.currentParticipants}
                  </div>
                  {event.maxParticipants && (
                    <div className="text-sm text-cinza-chumbo/70">
                      de {event.maxParticipants} vagas
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cronograma do Evento */}
        <div className="festival-card p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-cinza-chumbo mb-6 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-dourado-claro" />
            Cronograma do Evento
          </h2>

          {/* Fases do Evento */}
          <div className="space-y-6">
            {eventSchedule.map((phase) => {
              const PhaseIcon = phase.icon;
              return (
                <div key={phase.phase} className="flex items-start gap-4">
                  {/* Indicador de Fase */}
                  <div className={`w-12 h-12 rounded-full ${phase.color} flex items-center justify-center flex-shrink-0`}>
                    <PhaseIcon className="w-6 h-6" />
                  </div>

                  {/* Detalhes da Fase */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-cinza-chumbo">
                        {phase.title}
                      </h3>
                      <Badge className={phase.color}>
                        {
                          EVENT_TYPE_LABELS[
                            phase.phase as keyof typeof EVENT_TYPE_LABELS
                          ]
                        }
                      </Badge>
                    </div>

                    <p className="text-cinza-chumbo/80 mb-3">{phase.description}</p>

                    <div className="flex items-center gap-6 text-sm text-cinza-chumbo/70">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Início: {formatDateOnly(phase.startDate)}</span>
                      </div>
                      {phase.endDate && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Fim: {formatDateOnly(phase.endDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seção de Inscrição */}
        {event.canRegister && (
          <div className="festival-card p-6 md:p-8 text-center mb-8">
            <h2 className="text-2xl font-bold text-cinza-chumbo mb-4">
              Inscreva-se Agora
            </h2>
            <p className="text-cinza-chumbo/80 mb-6 max-w-2xl mx-auto">
              Não perca a oportunidade de participar neste evento incrível! A
              inscrição é gratuita e o processo é rápido.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/participant-registration?event=${event.id}`}>
                <Button className="festival-button text-lg px-8 py-3">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Inscrever-se
                </Button>
              </Link>

              <Button
                onClick={handleShare}
                variant="outline"
                className="text-lg px-8 py-3 relative"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Partilhar
                {shareStatus && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-verde-suave text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
                    {shareStatus}
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Regulamento (se existir) */}
        {event.rules && (
          <div className="festival-card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-cinza-chumbo mb-4">
              Regulamento
            </h2>
            <div className="bg-white/60 rounded-lg p-6 border border-gray-200">
              <div className="whitespace-pre-wrap text-cinza-chumbo leading-relaxed">
                {event.rules}
              </div>
            </div>
          </div>
        )}

        {/* Footer Simples */}
        <div className="mt-8 text-center text-cinza-chumbo/70">
          <p className="text-sm">
            © 2024 Festival Som Popular. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
