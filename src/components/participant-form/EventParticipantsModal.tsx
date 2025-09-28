"use client";

import {
  Check,
  Plus,
  Search,
  SquareArrowOutUpRightIcon,
  UserCheck,
  UserMinus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfirm } from "@/hooks/use-confirm";
import {
  useEventParticipants,
  useParticipants,
  useRegisterParticipantInEvent,
  useRemoveParticipantFromEvent,
} from "@/hooks/use-participants";
import { getInitials } from "@/lib/helpers";
import { getExperienceText } from "@/lib/utils";

interface EventParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
}

export const EventParticipantsModal = ({
  isOpen,
  onClose,
  eventId,
  eventName,
}: EventParticipantsModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<
    string[]
  >([]);

  const { data: allParticipantsResult, isLoading: isLoadingParticipants } =
    useParticipants({
      status: "approved",
      search: searchTerm || undefined,
    });

  const {
    data: eventParticipantsResult,
    isLoading: isLoadingEventParticipants,
  } = useEventParticipants(eventId);

  const registerParticipantInEventMutation = useRegisterParticipantInEvent();
  const removeParticipantFromEventMutation = useRemoveParticipantFromEvent();
  const { confirm, ConfirmDialog } = useConfirm();

  const allParticipants = allParticipantsResult?.data || [];
  const eventParticipants = eventParticipantsResult?.data || [];

  const availableParticipants = allParticipants.filter(
    (participant) => !eventParticipants.some((ep) => ep.id === participant.id)
  );

  const handleAddParticipant = async (participantId: string) => {
    try {
      const result = await registerParticipantInEventMutation.mutateAsync({
        eventId,
        participantId,
      });

      if (result.success) {
        toast.success("Participante adicionado ao evento!");
      } else {
        toast.error(result.error || "Erro ao adicionar participante");
      }
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
      toast.error("Erro ao adicionar participante");
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    const confirmed = await confirm({
      title: "Remover participante",
      description:
        "Tem certeza que deseja remover este participante do evento?",
      confirmText: "Sim, remover",
      cancelText: "Cancelar",
      destructive: true,
      icon: <UserMinus className="w-5 h-5 text-red-500" />,
    });

    if (!confirmed) {
      return;
    }

    try {
      const result = await removeParticipantFromEventMutation.mutateAsync({
        eventId,
        participantId,
      });

      console.log("Componente: Resultado da mutation", result);

      if (result.success) {
        toast.success("Participante removido do evento!");
      } else {
        toast.error(result.error || "Erro ao remover participante");
      }
    } catch (error) {
      console.error("Componente: Erro ao remover participante:", error);
      toast.error("Erro ao remover participante");
    }
  };

  const handleSelectParticipant = (participantId: string) => {
    setSelectedParticipantIds((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleAddSelectedParticipants = async () => {
    if (selectedParticipantIds.length === 0) return;

    try {
      await Promise.all(
        selectedParticipantIds.map((participantId) =>
          registerParticipantInEventMutation.mutateAsync({
            eventId,
            participantId,
          })
        )
      );

      setSelectedParticipantIds([]);
      toast.success(
        `${selectedParticipantIds.length} participante(s) adicionado(s) com sucesso!`
      );
    } catch (error) {
      console.error("Erro ao adicionar participantes:", error);
      toast.error("Erro ao adicionar participantes");
    }
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[90vh] max-w-none px-6">
          <DrawerHeader>
            <DrawerTitle className="flex justify-center items-center gap-2">
              <UserCheck className="w-5 h-5" />
              <span>Gerenciar Participantes - {eventName}</span>
            </DrawerTitle>
            <DrawerDescription>
              Adicione ou remova participantes para este evento. Selecione dos
              participantes aprovados.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-6 h-full">
            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar participantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Link
                className=" group flex items-center gap-2 h-12 bg-verde-suave text-white px-4 py-2 rounded-lg hover:bg-verde-suave/90 transition-colors"
                href="/dashboard/participants?open=add"
                target="_blank"
              >
                <SquareArrowOutUpRightIcon className="w-4 h-4 rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                Adicionar Participante
              </Link>
            </div>

            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Participantes Disponíveis */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-cinza-chumbo">
                      Participantes Disponíveis ({availableParticipants.length})
                    </h4>
                    {selectedParticipantIds.length > 0 && (
                      <Button
                        onClick={handleAddSelectedParticipants}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Selecionados ({selectedParticipantIds.length})
                      </Button>
                    )}
                  </div>

                  <ScrollArea className="h-96 border rounded-lg">
                    <div className="p-4 space-y-2">
                      {isLoadingParticipants ? (
                        <div className="text-center py-8 text-gray-500">
                          Carregando participantes...
                        </div>
                      ) : availableParticipants.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <UserCheck className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>Nenhum participante disponível</p>
                          <p className="text-sm">
                            Todos os participantes aprovados já estão no evento
                          </p>
                        </div>
                      ) : (
                        availableParticipants.map((participant, index) => (
                          <div
                            key={`available-${participant.id}-${index}`}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedParticipantIds.includes(participant.id)
                                ? "bg-blue-50 border-blue-200"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() =>
                              handleSelectParticipant(participant.id)
                            }
                          >
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={participant?.photoImage?.publicUrl || ""}
                                />
                                <AvatarFallback>
                                  {getInitials(participant.name)}
                                </AvatarFallback>
                              </Avatar>
                              {selectedParticipantIds.includes(
                                participant.id
                              ) && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {participant.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {participant.email}
                                {" | "}
                                {getExperienceText(participant.experience)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddParticipant(participant.id);
                              }}
                              disabled={
                                registerParticipantInEventMutation.isPending
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Participantes do Evento */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-cinza-chumbo">
                    Participantes do Evento ({eventParticipants.length})
                  </h4>

                  <ScrollArea className="h-96 border rounded-lg">
                    <div className="p-4 space-y-2">
                      {isLoadingEventParticipants ? (
                        <div className="text-center py-8 text-gray-500">
                          Carregando participantes do evento...
                        </div>
                      ) : eventParticipants.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <UserMinus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>Nenhum participante adicionado</p>
                          <p className="text-sm">
                            Selecione participantes da lista ao lado
                          </p>
                        </div>
                      ) : (
                        eventParticipants.map((participant, index) => (
                          <div
                            key={`event-${participant.id}-${index}`}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={participant.photoImage?.publicUrl || ""}
                              />
                              <AvatarFallback>
                                {getInitials(participant.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {participant.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {participant.email}
                                {" | "}
                                {getExperienceText(participant.experience)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleRemoveParticipant(participant.id)
                              }
                              disabled={
                                removeParticipantFromEventMutation.isPending
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <UserMinus className="w-3 h-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={onClose}>Fechar</Button>
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>

      <ConfirmDialog />
    </>
  );
};
