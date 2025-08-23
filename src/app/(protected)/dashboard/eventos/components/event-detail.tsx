"use client";

import { Modal } from "@/components/Modal";
import { Event } from "@/db/schema";
import {
  Calendar,
  CalendarDays,
  Clock,
  Edit,
  MapPin,
  Settings,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
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

  if (!event) return null;

  const handleStatusChange = (newStatus: string) => {
    if (onEventUpdated) {
      onEventUpdated({
        ...event,
        status: newStatus,
        updatedAt: new Date(),
      });
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
                  onClick={() => handleStatusChange("published")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Publicar Evento
                </button>
              )}

              {event.status === "published" && (
                <button
                  onClick={() => handleStatusChange("ongoing")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Marcar como Em Curso
                </button>
              )}

              {event.status === "ongoing" && (
                <button
                  onClick={() => handleStatusChange("completed")}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  Marcar como Concluído
                </button>
              )}

              {["published", "ongoing"].includes(event.status) && (
                <button
                  onClick={() => handleStatusChange("cancelled")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Cancelar Evento
                </button>
              )}

              <button
                onClick={() => handleStatusChange("draft")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Voltar a Rascunho
              </button>
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
  );
};

export default EventDetailsModal;
