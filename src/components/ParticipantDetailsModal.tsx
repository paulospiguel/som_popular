"use client";

import { Modal } from "@/components/Modal";
import { Avatar } from "@/components/ui/avatar";
import { Participant } from "@/server/database/schema";
import {
  Calendar,
  CheckCircle,
  Mail,
  Phone,
  Star,
  User,
  XCircle,
} from "lucide-react";

interface ParticipantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: Participant | null;
  showEventActions?: boolean;
  onRemoveFromEvent?: () => void;
  onSendNotification?: () => void;
}

export function ParticipantDetailsModal({
  isOpen,
  onClose,
  participant,
  showEventActions = false,
  onRemoveFromEvent,
  onSendNotification,
}: ParticipantDetailsModalProps) {
  if (!participant) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      approved: "text-green-600 bg-green-100",
      pending: "text-yellow-600 bg-yellow-100",
      rejected: "text-red-600 bg-red-100",
    };
    return colors[status as keyof typeof colors] || "text-gray-600 bg-gray-100";
  };

  const getStatusText = (status: string) => {
    const texts = {
      approved: "Aprovado",
      pending: "Pendente",
      rejected: "Rejeitado",
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getExperienceText = (experience: string) => {
    const texts = {
      iniciante: "Iniciante",
      intermedio: "Intermédio",
      avancado: "Avançado",
    };
    return texts[experience as keyof typeof texts] || experience;
  };

  const getCategoryText = (category: string) => {
    const texts = {
      fado: "Fado",
      guitarra: "Guitarra Portuguesa",
      cavaquinho: "Cavaquinho",
      concertina: "Concertina",
      viola: "Viola Campaniça",
      cante: "Cante Alentejano",
    };
    return texts[category as keyof typeof texts] || category;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Participante"
      subtitle={participant.name}
      icon={<User className="w-6 h-6 text-blue-600" />}
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* Header com Avatar e Info Principal */}
        <div className="flex items-start space-x-4">
          <Avatar
            name={participant.name}
            src={participant.avatar}
            size="xl"
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-cinza-chumbo">
              {participant.name}
            </h3>
            <div className="flex items-center space-x-3 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  participant.status
                )}`}
              >
                {participant.status === "approved" && (
                  <CheckCircle className="w-3 h-3 mr-1" />
                )}
                {participant.status === "rejected" && (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                {getStatusText(participant.status)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                <Star className="w-3 h-3 mr-1" />
                {getExperienceText(participant.experience)}
              </span>
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-cinza-chumbo mb-3">
            Informações de Contato
          </h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-cinza-chumbo">{participant.email}</span>
            </div>
            {participant.phone && (
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-cinza-chumbo">{participant.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Informações Artísticas */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-cinza-chumbo mb-3">
            Informações Artísticas
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Categoria:
              </label>
              <p className="text-cinza-chumbo">
                {getCategoryText(participant.category)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Nível de Experiência:
              </label>
              <p className="text-cinza-chumbo">
                {getExperienceText(participant.experience)}
              </p>
            </div>
            {participant.additionalInfo && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Informações Adicionais:
                </label>
                <p className="text-cinza-chumbo text-sm">
                  {participant.additionalInfo}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Necessidades Especiais */}
        {participant.hasSpecialNeeds && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-cinza-chumbo mb-2">
              Necessidades Especiais
            </h4>
            <p className="text-cinza-chumbo text-sm">
              {participant.specialNeedsDescription || "Não especificado"}
            </p>
          </div>
        )}

        {/* Informações de Registro */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-cinza-chumbo mb-3">
            Informações de Registro
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <label className="font-medium text-gray-600">
                Data de Registro:
              </label>
              <div className="flex items-center text-cinza-chumbo">
                <Calendar className="w-4 h-4 mr-1" />
                {participant.registrationDate?.toLocaleDateString("pt-PT")}
              </div>
            </div>
            {participant.approvedAt && (
              <div>
                <label className="font-medium text-gray-600">
                  Data de Aprovação:
                </label>
                <div className="flex items-center text-cinza-chumbo">
                  <Calendar className="w-4 h-4 mr-1" />
                  {participant.approvedAt.toLocaleDateString("pt-PT")}
                </div>
              </div>
            )}
            {participant.rejectedAt && (
              <div className="md:col-span-2">
                <label className="font-medium text-gray-600">
                  Motivo da Rejeição:
                </label>
                <p className="text-red-600 text-sm">
                  {participant.rejectionReason}
                </p>
                <p className="text-gray-500 text-xs">
                  Rejeitado em{" "}
                  {participant.rejectedAt.toLocaleDateString("pt-PT")} por{" "}
                  {participant.rejectedBy}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notas */}
        {participant.notes && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-cinza-chumbo mb-2">
              Notas Internas
            </h4>
            <p className="text-cinza-chumbo text-sm whitespace-pre-wrap">
              {participant.notes}
            </p>
          </div>
        )}

        {/* Ações do Evento (se aplicável) */}
        {showEventActions && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-cinza-chumbo mb-3">
              Ações do Evento
            </h4>
            <div className="flex space-x-3">
              {onSendNotification && (
                <button
                  onClick={onSendNotification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Enviar Notificação
                </button>
              )}
              {onRemoveFromEvent && (
                <button
                  onClick={onRemoveFromEvent}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Remover do Evento
                </button>
              )}
            </div>
          </div>
        )}

        {/* Botão Fechar */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
