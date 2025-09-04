"use client";

import {
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Save,
  Upload,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES } from "@/constants";
import { useSession } from "@/lib/auth-client";
import { getEventById } from "@/server/events";
import {
  createEvaluation,
  getEventEvaluationStats,
  getEventParticipantsWithEvaluations,
  publishEventResults,
} from "@/server/events/evaluations";
import { getEventJudges } from "@/server/judges";

interface Judge {
  id: string;
  name: string;
  description: string | null;
}

interface Participant {
  id: string;
  name: string;
  category: string;
  order: number;
  totalEvaluations: number;
  avgScore: number;
  evaluations: Array<{
    evaluation: {
      id: string;
      eventId: string;
      participantId: string;
      judgeId: string;
      sessionId: string | null;
      technicalScore: number;
      artisticScore: number;
      presentationScore: number;
      totalScore: number;
      feedback: string | null;
      isPublic: boolean;
      evaluatedAt: Date | null;
    };
    judge: Judge;
  }>;
}

interface JudgeEvaluation {
  judgeId: string;
  judgeName: string;
  score: number;
  notes: string | null;
  isComplete: boolean;
}

interface EvaluationStats {
  totalJudges: number;
  totalParticipants: number;
  completedEvaluations: number;
  expectedEvaluations: number;
  progressPercentage: number;
  isComplete: boolean;
}

interface Event {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  description?: string;
  location?: string;
  eventDate?: Date;
}

export default function VotingEventPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;

  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [selectedJudge, setSelectedJudge] = useState<string>("");
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentNotes, setCurrentNotes] = useState<string>("");
  const [evaluationStats, setEvaluationStats] =
    useState<EvaluationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const loadEventData = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    try {
      // Carregar dados do evento
      const eventResult = await getEventById(eventId);
      if (!eventResult.success || !eventResult.data) {
        router.push("/votings");
        return;
      }

      setCurrentEvent(eventResult?.data as Event);

      // Carregar dados em paralelo
      const [judgesResult, participantsResult, statsResult] = await Promise.all(
        [
          getEventJudges(eventId),
          getEventParticipantsWithEvaluations(eventId),
          getEventEvaluationStats(eventId),
        ]
      );

      if (judgesResult.success && judgesResult.data) {
        setJudges(judgesResult.data.map((j) => j.judge));
      }

      if (participantsResult.success && participantsResult?.data) {
        setParticipants(participantsResult.data);
      }

      if (statsResult.success && statsResult.data) {
        setEvaluationStats(statsResult.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do evento:", error);
      router.push("/votings");
    } finally {
      setLoading(false);
    }
  }, [eventId, router]);

  useEffect(() => {
    // Verificar permissões de acesso
    if (!session) {
      router.push("/auth/login");
      return;
    }

    const userRole = session?.user?.role || ROLES.OPERATOR;
    if (userRole !== ROLES.ADMIN && userRole !== ROLES.OPERATOR) {
      router.push("/auth/login");
      return;
    }

    // Verificar se temos um eventId válido
    if (!eventId) {
      router.push("/votings");
      return;
    }

    loadEventData();
  }, [session, router, eventId, loadEventData]);

  const currentParticipant = participants[currentParticipantIndex];

  const getParticipantJudgeEvaluations = (): JudgeEvaluation[] => {
    if (!currentParticipant) return [];

    return judges.map((judge) => {
      const existing = currentParticipant.evaluations.find(
        (e) => e.evaluation.judgeId === judge.id
      );

      return {
        judgeId: judge.id,
        judgeName: judge.name,
        score: existing?.evaluation.totalScore || 0,
        notes: existing?.evaluation.feedback || null,
        isComplete: !!existing,
      };
    });
  };

  const getAverageScore = (): number => {
    const judgeEvaluations = getParticipantJudgeEvaluations();
    const completedEvaluations = judgeEvaluations.filter((e) => e.isComplete);

    if (completedEvaluations.length === 0) return 0;

    const sum = completedEvaluations.reduce((acc, e) => acc + e.score, 0);
    return Math.round((sum / completedEvaluations.length) * 100) / 100;
  };

  const handleSaveEvaluation = async () => {
    if (!currentParticipant || !selectedJudge || !session?.user || !eventId)
      return;

    setSaving(true);
    try {
      const result = await createEvaluation({
        eventId: eventId,
        participantId: currentParticipant.id,
        judgeId: selectedJudge,
        sessionId: null,
        technicalScore: currentScore,
        artisticScore: currentScore,
        presentationScore: currentScore,
        totalScore: currentScore,
        feedback: currentNotes,
        isPublic: false,
      });

      if (result.success) {
        // Recarregar dados
        await loadEventData();

        // Limpar formulário
        setSelectedJudge("");
        setCurrentScore(0);
        setCurrentNotes("");

        alert("Avaliação guardada com sucesso!");
      } else {
        alert("Erro ao guardar avaliação");
      }
    } catch (error) {
      console.error("Erro ao guardar avaliação:", error);
      alert("Erro ao guardar avaliação");
    } finally {
      setSaving(false);
    }
  };

  const handlePublishResults = async () => {
    if (!eventId) return;

    const result = await publishEventResults(eventId);
    if (result.success) {
      alert("Resultados publicados com sucesso!");
      await loadEventData();
    } else {
      alert("Erro ao publicar resultados");
    }
  };

  const handlePreviousParticipant = () => {
    if (currentParticipantIndex > 0) {
      setCurrentParticipantIndex(currentParticipantIndex - 1);
      setSelectedJudge("");
      setCurrentScore(0);
      setCurrentNotes("");
    }
  };

  const handleNextParticipant = () => {
    if (currentParticipantIndex < participants.length - 1) {
      setCurrentParticipantIndex(currentParticipantIndex + 1);
      setSelectedJudge("");
      setCurrentScore(0);
      setCurrentNotes("");
    }
  };

  const getAvailableJudges = (): Judge[] => {
    if (!currentParticipant) return [];

    const evaluatedJudgeIds = currentParticipant.evaluations.map(
      (e) => e.evaluation.judgeId
    );
    return judges.filter((judge) => !evaluatedJudgeIds.includes(judge.id));
  };

  if (!session || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-suave mx-auto mb-4"></div>
          <p>A carregar sistema de votação...</p>
        </div>
      </div>
    );
  }

  // Se não encontrou o evento, será redirecionado pelo loadEventData

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header com Estatísticas */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <Link
                  href="/votings"
                  className="flex items-center space-x-2 text-cinza-chumbo hover:text-verde-suave transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Voltar à Seleção</span>
                </Link>
                <div className="h-6 w-px bg-cinza-chumbo/20"></div>
                <h1 className="text-2xl font-bold text-cinza-chumbo">
                  {currentEvent?.name || "Carregando..."}
                </h1>
              </div>
              <p className="text-cinza-chumbo/70">
                Operador: {session.user?.name || session.user?.email}
              </p>
            </div>

            <div className="flex items-center space-x-2 text-verde-suave">
              <Clock className="w-5 h-5" />
              <span className="font-medium">
                {currentEvent?.status?.toUpperCase() || "ATIVO"}
              </span>
            </div>
          </div>

          {/* Estatísticas */}
          {evaluationStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-cinza-chumbo">
                  {evaluationStats.totalJudges}
                </div>
                <div className="text-sm text-cinza-chumbo/70">Jurados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cinza-chumbo">
                  {evaluationStats.totalParticipants}
                </div>
                <div className="text-sm text-cinza-chumbo/70">
                  Participantes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-verde-suave">
                  {evaluationStats.completedEvaluations}
                </div>
                <div className="text-sm text-cinza-chumbo/70">Avaliações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amarelo-dourado">
                  {evaluationStats.progressPercentage}%
                </div>
                <div className="text-sm text-cinza-chumbo/70">Progresso</div>
              </div>
            </div>
          )}
        </div>

        {/* Verificar se há dados para mostrar */}
        {currentEvent?.id &&
          (participants.length === 0 || judges.length === 0) &&
          !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Configuração Necessária
                  </h3>
                  {participants.length === 0 && (
                    <p className="text-yellow-700 mb-2">
                      • Não há participantes registados neste evento.
                    </p>
                  )}
                  {judges.length === 0 && (
                    <p className="text-yellow-700 mb-2">
                      • Não há jurados associados a este evento.
                    </p>
                  )}
                  <p className="text-yellow-700 text-sm">
                    Para iniciar as votações, é necessário ter participantes e
                    jurados configurados.
                  </p>
                </div>
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navegação de Participantes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-cinza-chumbo">
                  Participante {currentParticipantIndex + 1} de{" "}
                  {participants.length}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreviousParticipant}
                    disabled={currentParticipantIndex === 0}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextParticipant}
                    disabled={
                      currentParticipantIndex === participants.length - 1
                    }
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {currentParticipant && (
                <div className="p-4 bg-gray-50 rounded-lg mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-verde-suave rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-cinza-chumbo">
                        {currentParticipant.name}
                      </h3>
                      <p className="text-sm text-cinza-chumbo/70">
                        {currentParticipant.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amarelo-dourado">
                        {getAverageScore()}/100
                      </div>
                      <div className="text-xs text-cinza-chumbo/70">
                        Média Atual
                      </div>
                    </div>
                  </div>

                  {/* Status das Avaliações por Jurado */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-cinza-chumbo mb-3">
                      Avaliações por Jurado:
                    </h4>
                    {getParticipantJudgeEvaluations().map((judgeEval) => (
                      <div
                        key={judgeEval.judgeId}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          judgeEval.isComplete
                            ? "bg-verde-suave/10 border border-verde-suave/20"
                            : "bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {judgeEval.isComplete ? (
                            <CheckCircle className="w-5 h-5 text-verde-suave" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="font-medium">
                            {judgeEval.judgeName}
                          </span>
                        </div>
                        <div className="text-right">
                          {judgeEval.isComplete ? (
                            <div className="font-bold text-verde-suave">
                              {judgeEval.score}/100
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              Pendente
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulário de Nova Avaliação */}
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-cinza-chumbo mb-4">
                  Adicionar Nova Avaliação
                </h3>

                {getAvailableJudges().length === 0 ? (
                  <div className="text-center py-8 text-cinza-chumbo/70">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-verde-suave" />
                    <p>Todos os jurados já avaliaram este participante!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Seleção do Jurado */}
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Selecionar Jurado:
                      </label>
                      <Select
                        value={selectedJudge}
                        onValueChange={(value) => setSelectedJudge(value)}
                      >
                        <SelectTrigger className="w-full min-h-12">
                          <SelectValue placeholder="Escolha um jurado..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableJudges().map((judge) => (
                            <SelectItem key={judge.id} value={judge.id}>
                              {judge.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Nota */}
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Nota (0-100):
                      </label>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={currentScore}
                          onChange={(e) =>
                            setCurrentScore(parseInt(e.target.value))
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex justify-between text-xs text-cinza-chumbo/70 w-full">
                            <span>0</span>
                            <span>25</span>
                            <span>50</span>
                            <span>75</span>
                            <span>100</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-2xl font-bold text-amarelo-dourado">
                            {currentScore}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Observações */}
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Observações (opcional):
                      </label>
                      <textarea
                        value={currentNotes}
                        onChange={(e) => setCurrentNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-suave focus:border-transparent"
                        placeholder="Comentários do jurado sobre a performance..."
                      />
                    </div>

                    {/* Botão Guardar */}
                    <button
                      onClick={handleSaveEvaluation}
                      disabled={!selectedJudge || saving}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-verde-suave text-white rounded-lg hover:bg-verde-suave/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>A guardar...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Guardar Avaliação</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Painel Lateral - Resumo */}
          <div className="space-y-6">
            {/* Progresso Geral */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-4">
                Progresso Geral
              </h3>

              {evaluationStats && (
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-verde-suave h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${evaluationStats.progressPercentage}%`,
                      }}
                    ></div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-cinza-chumbo">
                      {evaluationStats.completedEvaluations}/
                      {evaluationStats.expectedEvaluations}
                    </div>
                    <div className="text-sm text-cinza-chumbo/70">
                      Avaliações Concluídas
                    </div>
                  </div>

                  {evaluationStats.isComplete && (
                    <div className="text-center p-4 bg-verde-suave/10 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-verde-suave mx-auto mb-2" />
                      <p className="text-verde-suave font-medium">
                        Todas as avaliações foram concluídas!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Lista de Jurados */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-4">
                Jurados do Evento
              </h3>

              <div className="space-y-3">
                {judges.map((judge) => (
                  <div
                    key={judge.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-amarelo-dourado rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-cinza-chumbo">
                        {judge.name}
                      </div>
                      {judge.description && (
                        <div className="text-sm text-cinza-chumbo/70">
                          {judge.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-4">
                Ações
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handlePublishResults}
                  disabled={!evaluationStats?.isComplete}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-amarelo-dourado text-white rounded-lg hover:bg-amarelo-dourado/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-5 h-5" />
                  <span>Publicar Resultados</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-cinza-chumbo rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="w-5 h-5" />
                  <span>Relatório Detalhado</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
