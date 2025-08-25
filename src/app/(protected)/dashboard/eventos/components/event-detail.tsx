"use client";

import {
  cancelEvent,
  completeEvent,
  publishEvent,
  revertToDraft,
  startEvent,
} from "@/actions/events";
import {
  addJudgeToEvent,
  createJudge,
  createSampleJudges,
  getEventJudges,
  getJudges,
  removeJudgeFromEvent,
} from "@/actions/judges";
import { createTestData } from "@/actions/seed-data";
import { Modal } from "@/components/Modal";
import { Event } from "@/db/schema";
import {
  Calendar,
  CalendarDays,
  Clock,
  Edit,
  MapPin,
  Plus,
  Settings,
  Trophy,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  formatEventDate,
  formatEventTime,
  getCategoryText,
  getStatusColor,
  getStatusText,
  getTypeText,
  isEventActive,
  isRegistrationOpen,
} from "../utils";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEventUpdated?: (event: Event) => void;
}

const EventDetailsModal = ({
  isOpen,
  onClose,
  event,
  onEventUpdated,
}: EventDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventJudges, setEventJudges] = useState<any[]>([]);
  const [allJudges, setAllJudges] = useState<any[]>([]);
  const [showJudgesModal, setShowJudgesModal] = useState(false);
  const [loadingJudges, setLoadingJudges] = useState(false);
  const [showCreateJudgeForm, setShowCreateJudgeForm] = useState(false);
  const [newJudgeName, setNewJudgeName] = useState("");
  const [newJudgeDescription, setNewJudgeDescription] = useState("");

  // Carregar jurados quando o modal abrir
  useEffect(() => {
    if (isOpen && event) {
      loadEventJudges();
    }
  }, [isOpen, event]);

  if (!event) return null;

  const handleAction = async (
    action: () => Promise<any>,
    actionName: string
  ) => {
    setLoading(true);
    try {
      const result = await action();
      if (result.success) {
        alert(result.message || `${actionName} realizado com sucesso!`);
        if (onEventUpdated && result.data) {
          onEventUpdated(result.data);
        }
      } else {
        alert(result.error || `Erro ao realizar ${actionName}`);
      }
    } catch (error) {
      console.error(`Erro ao ${actionName}:`, error);
      alert(`Erro ao realizar ${actionName}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () =>
    handleAction(() => publishEvent(event.id, "admin"), "publicar evento");

  const handleStart = () =>
    handleAction(() => startEvent(event.id, "admin"), "iniciar evento");

  const handleComplete = () =>
    handleAction(() => completeEvent(event.id, "admin"), "concluir evento");

  const handleCancel = () => {
    const reason = prompt("Motivo do cancelamento (opcional):");
    if (reason !== null) {
      // User didn't click cancel
      handleAction(
        () => cancelEvent(event.id, "admin", reason || undefined),
        "cancelar evento"
      );
    }
  };

  const handleRevertToDraft = () =>
    handleAction(
      () => revertToDraft(event.id, "admin"),
      "voltar para rascunho"
    );

  const loadEventJudges = async () => {
    if (!event) return;

    setLoadingJudges(true);
    try {
      const result = await getEventJudges(event.id);
      if (result.success && result.data) {
        setEventJudges(result.data);
      }
    } catch (error) {
      console.error("Erro ao carregar jurados:", error);
    } finally {
      setLoadingJudges(false);
    }
  };

  const loadAllJudges = async () => {
    try {
      const result = await getJudges();
      if (result.success && result.data) {
        setAllJudges(result.data);
      }
    } catch (error) {
      console.error("Erro ao carregar todos os jurados:", error);
    }
  };

  const handleAddJudge = async (judgeId: string) => {
    if (!event) return;

    try {
      const result = await addJudgeToEvent(event.id, judgeId);
      if (result.success) {
        await loadEventJudges();
        alert("Jurado adicionado com sucesso!");
      } else {
        alert("Erro ao adicionar jurado");
      }
    } catch (error) {
      console.error("Erro ao adicionar jurado:", error);
      alert("Erro ao adicionar jurado");
    }
  };

  const handleRemoveJudge = async (judgeId: string) => {
    if (!event) return;

    if (!confirm("Tem certeza que deseja remover este jurado do evento?")) {
      return;
    }

    try {
      const result = await removeJudgeFromEvent(event.id, judgeId);
      if (result.success) {
        await loadEventJudges();
        alert("Jurado removido com sucesso!");
      } else {
        alert("Erro ao remover jurado");
      }
    } catch (error) {
      console.error("Erro ao remover jurado:", error);
      alert("Erro ao remover jurado");
    }
  };

  const openJudgesModal = async () => {
    await loadAllJudges();
    setShowJudgesModal(true);
  };

  const availableJudges = allJudges.filter(
    (judge) => !eventJudges.some((ej) => ej.judge.id === judge.id)
  );

  const handleCreateTestJudges = async () => {
    try {
      // Tentar primeiro criar jurados simples
      const result = await createSampleJudges();
      if (result.success) {
        await loadAllJudges();
        alert(result.message || "Jurados criados com sucesso!");
      } else {
        // Se falhar, tentar criar dados de teste completos
        const fallbackResult = await createTestData();
        if (fallbackResult.success) {
          await loadAllJudges();
          alert("Jurados de teste criados com sucesso!");
        } else {
          alert("Erro ao criar jurados");
        }
      }
    } catch (error) {
      console.error("Erro ao criar jurados:", error);
      alert("Erro ao criar jurados");
    }
  };

  const handleCreateQuickJudge = async (name: string, description: string) => {
    try {
      const result = await createJudge({ name, description, isActive: true });
      if (result.success) {
        await loadAllJudges();
        alert("Jurado criado com sucesso!");
      } else {
        alert("Erro ao criar jurado");
      }
    } catch (error) {
      console.error("Erro ao criar jurado:", error);
      alert("Erro ao criar jurado");
    }
  };

  const headerActions = (
    <>
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
        title={isEditing ? "Cancelar edição" : "Editar evento"}
      >
        <Edit className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
      </button>
    </>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setIsEditing(false);
        }}
        title="Detalhes do Evento"
        subtitle={event.name}
        icon={<Calendar className="w-6 h-6 text-verde-suave" />}
        size="large"
        headerActions={headerActions}
      >
        <div className="p-8">
          <div className="space-y-8">
            {/* Status e Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Status do Evento
                </label>
                <div className="mt-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {getStatusText(event.status)}
                  </span>
                  {isEventActive(event) && (
                    <span className="ml-2 inline-block px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      Em curso
                    </span>
                  )}
                  {isRegistrationOpen(event) && (
                    <span className="ml-2 inline-block px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                      Inscrições abertas
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Tipo de Evento
                </label>
                <p className="font-semibold text-cinza-chumbo">
                  {getTypeText(event.type)}
                </p>
              </div>

              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Categoria
                </label>
                <p className="font-semibold text-cinza-chumbo">
                  {getCategoryText(event.category)}
                </p>
              </div>
            </div>

            {/* Descrição */}
            {event.description && (
              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Descrição
                </label>
                <p className="mt-1 text-cinza-chumbo whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {/* Local e Participantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Local
                </label>
                <p className="font-semibold text-cinza-chumbo">
                  {event.location}
                </p>
              </div>

              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Participantes
                </label>
                <p className="font-semibold text-cinza-chumbo">
                  {event.currentParticipants}
                  {event.maxParticipants && ` / ${event.maxParticipants}`}
                  <span className="text-sm text-cinza-chumbo/70 ml-1">
                    {event.maxParticipants ? "inscritos" : "(sem limite)"}
                  </span>
                </p>
              </div>
            </div>

            {/* Datas do Evento */}
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2" />
                Datas do Evento
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Data e Hora de Início
                  </label>
                  <p className="font-semibold text-cinza-chumbo">
                    {formatEventDate(event.startDate)}
                  </p>
                  <p className="text-sm text-cinza-chumbo/70">
                    às {formatEventTime(event.startDate)}
                  </p>
                </div>

                {event.endDate && (
                  <div>
                    <label className="text-sm text-cinza-chumbo/70 font-medium">
                      Data e Hora de Fim
                    </label>
                    <p className="font-semibold text-cinza-chumbo">
                      {formatEventDate(event.endDate)}
                    </p>
                    <p className="text-sm text-cinza-chumbo/70">
                      às {formatEventTime(event.endDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Período de Inscrições */}
            {(event.registrationStartDate || event.registrationEndDate) && (
              <div>
                <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Período de Inscrições
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.registrationStartDate && (
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Início das Inscrições
                      </label>
                      <p className="font-semibold text-cinza-chumbo">
                        {formatEventDate(event.registrationStartDate)}
                      </p>
                      <p className="text-sm text-cinza-chumbo/70">
                        às {formatEventTime(event.registrationStartDate)}
                      </p>
                    </div>
                  )}

                  {event.registrationEndDate && (
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Fim das Inscrições
                      </label>
                      <p className="font-semibold text-cinza-chumbo">
                        {formatEventDate(event.registrationEndDate)}
                      </p>
                      <p className="text-sm text-cinza-chumbo/70">
                        às {formatEventTime(event.registrationEndDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Configurações */}
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configurações
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Visibilidade
                  </label>
                  <p className="font-semibold text-cinza-chumbo">
                    {event.isPublic ? "Público" : "Privado"}
                  </p>
                  <p className="text-xs text-cinza-chumbo/70">
                    {event.isPublic
                      ? "Visível para todos os utilizadores"
                      : "Visível apenas para administradores"}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Aprovação de Inscrições
                  </label>
                  <p className="font-semibold text-cinza-chumbo">
                    {event.requiresApproval ? "Requer aprovação" : "Automática"}
                  </p>
                  <p className="text-xs text-cinza-chumbo/70">
                    {event.requiresApproval
                      ? "Inscrições precisam ser aprovadas"
                      : "Inscrições são aprovadas automaticamente"}
                  </p>
                </div>
              </div>
            </div>

            {/* Regulamento */}
            {event.rules && (
              <div>
                <h4 className="font-semibold text-cinza-chumbo mb-4">
                  Regulamento
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-cinza-chumbo whitespace-pre-wrap text-sm">
                    {event.rules}
                  </p>
                </div>
              </div>
            )}

            {/* Prémios */}
            {event.prizes && (
              <div>
                <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Prémios
                </h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-cinza-chumbo whitespace-pre-wrap text-sm">
                    {event.prizes}
                  </p>
                </div>
              </div>
            )}

            {/* Jurados do Evento */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-cinza-chumbo flex items-center">
                  <UserCheck className="w-5 h-5 mr-2" />
                  Jurados do Evento
                </h4>
                <button
                  onClick={openJudgesModal}
                  className="flex items-center space-x-2 bg-verde-suave text-white px-3 py-2 rounded-lg hover:bg-verde-suave/90 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Jurado</span>
                </button>
              </div>

              {loadingJudges ? (
                <div className="text-center py-4">
                  <p className="text-cinza-chumbo/70">Carregando jurados...</p>
                </div>
              ) : eventJudges.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-cinza-chumbo/70 mb-4">
                    Nenhum jurado atribuído a este evento
                  </p>
                  <button
                    onClick={openJudgesModal}
                    className="text-verde-suave hover:text-verde-suave/80 font-medium"
                  >
                    Adicionar o primeiro jurado
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventJudges.map((eventJudge) => (
                    <div
                      key={eventJudge.judge.id}
                      className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-cinza-chumbo">
                            {eventJudge.judge.name}
                          </h5>
                          {eventJudge.judge.description && (
                            <p className="text-sm text-cinza-chumbo/70 mt-1">
                              {eventJudge.judge.description}
                            </p>
                          )}
                          <p className="text-xs text-blue-600 mt-2">
                            Adicionado em{" "}
                            {new Date(eventJudge.createdAt).toLocaleDateString(
                              "pt-PT"
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveJudge(eventJudge.judge.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Remover jurado"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notas Internas */}
            {event.notes && (
              <div>
                <h4 className="font-semibold text-cinza-chumbo mb-4">
                  Notas Internas
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-cinza-chumbo whitespace-pre-wrap text-sm">
                    {event.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Ações Rápidas */}
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-4">
                Ações Rápidas
              </h4>
              <div className="flex flex-wrap gap-3">
                {event.status === "draft" && (
                  <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "A publicar..." : "Publicar Evento"}
                  </button>
                )}

                {event.status === "published" && (
                  <button
                    onClick={handleStart}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "A iniciar..." : "Marcar como Em Curso"}
                  </button>
                )}

                {event.status === "ongoing" && (
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "A concluir..." : "Marcar como Concluído"}
                  </button>
                )}

                {["published", "ongoing"].includes(event.status) && (
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "A cancelar..." : "Cancelar Evento"}
                  </button>
                )}

                {event.status !== "ongoing" && (
                  <button
                    onClick={handleRevertToDraft}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "A reverter..." : "Voltar a Rascunho"}
                  </button>
                )}
              </div>
            </div>

            {/* Informações de Auditoria */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-cinza-chumbo mb-4">
                Informações de Auditoria
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <label className="text-cinza-chumbo/70 font-medium">
                    Criado por
                  </label>
                  <p className="text-cinza-chumbo">{event.createdBy}</p>
                </div>
                <div>
                  <label className="text-cinza-chumbo/70 font-medium">
                    Data de Criação
                  </label>
                  <p className="text-cinza-chumbo">
                    {event.createdAt?.toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-cinza-chumbo/70 font-medium">
                    Última Atualização
                  </label>
                  <p className="text-cinza-chumbo">
                    {event.updatedAt?.toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de Seleção de Jurados */}
      <Modal
        isOpen={showJudgesModal}
        onClose={() => setShowJudgesModal(false)}
        title="Adicionar Jurados ao Evento"
        subtitle={`Gerir jurados para: ${event?.name}`}
        icon={<UserCheck className="w-6 h-6 text-verde-suave" />}
        size="lg"
      >
        <div className="p-6">
          {allJudges.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-2">
                Nenhum jurado encontrado
              </h3>
              <p className="text-cinza-chumbo/70 mb-6">
                Não há jurados na base de dados. Crie alguns jurados primeiro.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleCreateTestJudges}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Criar 5 Jurados de Exemplo
                </button>
                <button
                  onClick={() => setShowCreateJudgeForm(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Novo Jurado
                </button>
              </div>
            </div>
          ) : availableJudges.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-2">
                Todos os jurados já foram adicionados
              </h3>
              <p className="text-cinza-chumbo/70 mb-6">
                Não há mais jurados disponíveis para adicionar a este evento.
              </p>
              <button
                onClick={() => setShowCreateJudgeForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Novo Jurado
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-cinza-chumbo mb-4">
                Jurados Disponíveis ({availableJudges.length})
              </h3>
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {availableJudges.map((judge) => (
                  <div
                    key={judge.id}
                    className="border border-gray-200 p-4 rounded-lg hover:border-verde-suave transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-cinza-chumbo">
                          {judge.name}
                        </h4>
                        {judge.description && (
                          <p className="text-sm text-cinza-chumbo/70 mt-1">
                            {judge.description}
                          </p>
                        )}
                        {judge.notes && (
                          <p className="text-xs text-gray-500 mt-2">
                            Notas: {judge.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddJudge(judge.id)}
                        className="ml-4 bg-verde-suave text-white px-3 py-2 rounded-lg hover:bg-verde-suave/90 transition-colors text-sm"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulário de Criação Rápida */}
          {showCreateJudgeForm && (
            <div className="mt-6 p-4 border-t border-gray-200">
              <h3 className="font-semibold text-cinza-chumbo mb-4">
                Criar Novo Jurado
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-1">
                    Nome do Jurado
                  </label>
                  <input
                    type="text"
                    value={newJudgeName}
                    onChange={(e) => setNewJudgeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-suave focus:border-verde-suave"
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-1">
                    Descrição/Especialidade
                  </label>
                  <input
                    type="text"
                    value={newJudgeDescription}
                    onChange={(e) => setNewJudgeDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-suave focus:border-verde-suave"
                    placeholder="Ex: Fadista profissional e professora de canto"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      if (newJudgeName.trim()) {
                        handleCreateQuickJudge(
                          newJudgeName.trim(),
                          newJudgeDescription.trim()
                        );
                        setNewJudgeName("");
                        setNewJudgeDescription("");
                        setShowCreateJudgeForm(false);
                      }
                    }}
                    className="px-4 py-2 bg-verde-suave text-white rounded-lg hover:bg-verde-suave/90 transition-colors"
                    disabled={!newJudgeName.trim()}
                  >
                    Criar Jurado
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateJudgeForm(false);
                      setNewJudgeName("");
                      setNewJudgeDescription("");
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            {!showCreateJudgeForm &&
              allJudges.length > 0 &&
              availableJudges.length > 0 && (
                <button
                  onClick={() => setShowCreateJudgeForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  + Criar Novo Jurado
                </button>
              )}
            <div className="flex-1"></div>
            <button
              onClick={() => {
                setShowJudgesModal(false);
                setShowCreateJudgeForm(false);
                setNewJudgeName("");
                setNewJudgeDescription("");
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EventDetailsModal;
