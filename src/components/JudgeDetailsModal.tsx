"use client";

import { Calendar, CheckCircle, Star, UserCheck, XCircle } from "lucide-react";

import { Modal } from "@/components/Modal";
import { Avatar } from "@/components/ui/avatar";
import { Judge } from "@/server/database/schema";

interface JudgeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  judge: Judge | null;
  showEventActions?: boolean;
  onRemoveFromEvent?: () => void;
  onSendNotification?: () => void;
}

export function JudgeDetailsModal({
  isOpen,
  onClose,
  judge,
  showEventActions = false,
  onRemoveFromEvent,
  onSendNotification,
}: JudgeDetailsModalProps) {
  if (!judge) return null;

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Ativo" : "Inativo";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Jurado"
      subtitle={judge.name}
      icon={<UserCheck className="w-6 h-6 text-verde-suave" />}
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* Header com Avatar e Info Principal */}
        <div className="flex items-start space-x-4">
          <Avatar name={judge.name} size="xl" className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-cinza-chumbo">
              {judge.name}
            </h3>
            <div className="flex items-center space-x-3 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  judge.isActive
                )}`}
              >
                {judge.isActive ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                {getStatusText(judge.isActive)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-verde-suave/20 text-verde-suave">
                <Star className="w-3 h-3 mr-1" />
                Jurado
              </span>
            </div>
          </div>
        </div>

        {/* Descrição/Especialidade */}
        {judge.description && (
          <div className="bg-verde-muito-suave rounded-lg p-4">
            <h4 className="font-semibold text-cinza-chumbo mb-3">
              Especialidade e Experiência
            </h4>
            <p className="text-cinza-chumbo text-sm leading-relaxed">
              {judge.description}
            </p>
          </div>
        )}

        {/* Notas */}
        {judge.notes && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-cinza-chumbo mb-3">
              Notas Internas
            </h4>
            <p className="text-cinza-chumbo text-sm whitespace-pre-wrap">
              {judge.notes}
            </p>
          </div>
        )}

        {/* Informações de Sistema */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-cinza-chumbo mb-3">
            Informações do Sistema
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <label className="font-medium text-gray-600">
                Data de Criação:
              </label>
              <div className="flex items-center text-cinza-chumbo">
                <Calendar className="w-4 h-4 mr-1" />
                {judge.createdAt?.toLocaleDateString("pt-PT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div>
              <label className="font-medium text-gray-600">
                Última Atualização:
              </label>
              <div className="flex items-center text-cinza-chumbo">
                <Calendar className="w-4 h-4 mr-1" />
                {judge.updatedAt?.toLocaleDateString("pt-PT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Informações de Competência */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-semibold text-cinza-chumbo mb-3">
            Competência como Jurado
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status de Ativação:</span>
              <span
                className={`font-medium ${judge.isActive ? "text-green-600" : "text-red-600"}`}
              >
                {judge.isActive
                  ? "Ativo para avaliações"
                  : "Temporariamente inativo"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tipo de Jurado:</span>
              <span className="font-medium text-cinza-chumbo">
                Especialista em Música Tradicional
              </span>
            </div>
            {judge.description && (
              <div className="pt-2 border-t">
                <span className="text-gray-600 text-xs">
                  Áreas de Especialidade baseadas na descrição do perfil
                </span>
              </div>
            )}
          </div>
        </div>

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
