"use client";

import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Crown,
  Home,
  MapPin,
  Medal,
  Star,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventRanking, type EventRankingData } from "@/server/rankings";
import { Switch } from "@/components/ui/switch";

const PHASE_STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-blue-100 text-blue-800",
  ongoing: "bg-green-100 text-green-800",
  completed: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function EventRankingPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [rankingData, setRankingData] = useState<EventRankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRanking();
  }, [eventId]);

  const loadRanking = async () => {
    try {
      setLoading(true);
      const result = await getEventRanking(eventId);
      if (result.success && result.data) {
        setRankingData(result.data);
      } else {
        setError(result.error || "Erro ao carregar ranking");
      }
    } catch (error) {
      setError("Erro ao carregar ranking");
    } finally {
      setLoading(false);
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

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-cinza-chumbo">
            {position}
          </span>
        );
    }
  };

  const getPositionStyle = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cinza-chumbo">Carregando ranking...</p>
        </div>
      </div>
    );
  }

  if (error || !rankingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-cinza-chumbo/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-cinza-chumbo mb-4">
            {error || "Ranking não encontrado"}
          </h1>
          <div className="space-x-4">
            <Link href="/ranking">
              <Button className="festival-button-secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Rankings
              </Button>
            </Link>
            <Link href="/">
              <Button className="festival-button">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { event, rankings, phases, totalParticipants, evaluatedParticipants } =
    rankingData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/ranking"
            className="inline-flex items-center text-verde-suave hover:text-verde-claro mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Rankings
          </Link>

          <div className="festival-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-cinza-chumbo mb-2 flex items-center">
                  <Trophy className="w-8 h-8 mr-3 text-amarelo-suave" />
                  {event.name}
                </h1>
                <p className="text-cinza-chumbo/70 mb-4">
                  {event.description || "Ranking do evento"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-dourado-claro" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-dourado-claro" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-dourado-claro" />
                    <span className="capitalize">{event.category}</span>
                  </div>
                </div>
              </div>

              <div className="ml-6 text-right space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border">
                  <span className="text-sm text-cinza-chumbo">Modo Placar</span>
                  <Switch
                    onCheckedChange={(checked) => {
                      if (checked) router.push(`/live-ranking?event=${eventId}`);
                    }}
                  />
                </div>
                <div className="text-center">
                  <Badge className="mb-2 capitalize">{event.type}</Badge>
                  <div className="text-sm text-cinza-chumbo/70">
                    {evaluatedParticipants} de {totalParticipants} avaliados
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Ranking Principal */}
          <div className="xl:col-span-3">
            <div className="festival-card p-6">
              <h2 className="text-2xl font-bold text-cinza-chumbo mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-verde-suave" />
                Classificação Geral
              </h2>

              {rankings.length > 0 ? (
                <div className="space-y-4">
                  {rankings.map((participant) => (
                    <div
                      key={participant.participantId}
                      className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getPositionStyle(participant.position)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Posição */}
                          <div className="flex items-center justify-center w-12 h-12">
                            {getPositionIcon(participant.position)}
                          </div>

                          {/* Informações do Participante */}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-cinza-chumbo">
                              {participant.participantName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-cinza-chumbo/70">
                              <span>{participant.totalScores} avaliações</span>
                              <span>
                                Média: {participant.averageScore} pontos
                              </span>
                            </div>
                          </div>

                          {/* Pontuação */}
                          <div className="text-right">
                            <div className="flex items-center text-2xl font-bold text-amarelo-suave">
                              <Star className="w-6 h-6 mr-2" />
                              {participant.averageScore}
                            </div>
                            <div className="text-sm text-cinza-chumbo/70">
                              pontos
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detalhes das Avaliações */}
                      {participant.evaluations.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {participant.evaluations.map((evaluation, idx) => (
                              <div
                                key={`${evaluation.judgeId}-${idx}`}
                                className="bg-white/50 p-3 rounded-lg"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-sm text-cinza-chumbo">
                                      {evaluation.judgeName}
                                    </div>
                                    {evaluation.notes && (
                                      <div className="text-xs text-cinza-chumbo/70 mt-1">
                                        {evaluation.notes}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-verde-suave">
                                      {evaluation.score}
                                    </div>
                                    <div className="text-xs text-cinza-chumbo/70">
                                      pts
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-cinza-chumbo/50 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-cinza-chumbo mb-2">
                    Nenhuma Avaliação Publicada
                  </h3>
                  <p className="text-cinza-chumbo/70">
                    As avaliações serão publicadas após a conclusão do evento.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Fases do Festival */}
          <div className="xl:col-span-1">
            <div className="festival-card p-6">
              <h3 className="text-lg font-bold text-cinza-chumbo mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-verde-suave" />
                Fases do Festival
              </h3>

              <div className="space-y-3">
                {phases.map((phase) => (
                  <div
                    key={phase.type}
                    className="p-3 rounded-lg border bg-white/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-cinza-chumbo">
                        {phase.name}
                      </div>
                      <Badge
                        className={
                          PHASE_STATUS_COLORS[
                            phase.status as keyof typeof PHASE_STATUS_COLORS
                          ]
                        }
                      >
                        {phase.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-cinza-chumbo/70">
                      {phase.participantCount} participantes
                    </div>
                  </div>
                ))}
              </div>

              {/* Estatísticas */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold text-cinza-chumbo mb-3">
                  Estatísticas
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cinza-chumbo/70">
                      Total de Participantes:
                    </span>
                    <span className="font-medium">{totalParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cinza-chumbo/70">Avaliados:</span>
                    <span className="font-medium">{evaluatedParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cinza-chumbo/70">Progresso:</span>
                    <span className="font-medium">
                      {totalParticipants > 0
                        ? Math.round(
                            (evaluatedParticipants / totalParticipants) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Links de Navegação */}
            <div className="mt-6 space-y-3">
              <Link href="/ranking" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Todos os Rankings
                </Button>
              </Link>

              <Link href="/" className="block">
                <Button className="festival-button-secondary w-full" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar à Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
