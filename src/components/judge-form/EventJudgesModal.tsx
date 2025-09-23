"use client";

import { Check, Plus, Search, UserCheck, UserMinus, X } from "lucide-react";
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
  useAddJudgeToEvent,
  useEventJudges,
  useJudges,
  useRemoveJudgeFromEvent,
} from "@/hooks/use-judges";

import { JudgeForm } from "./index";

interface EventJudgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
}

export const EventJudgesModal = ({
  isOpen,
  onClose,
  eventId,
  eventName,
}: EventJudgesModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedJudgeIds, setSelectedJudgeIds] = useState<string[]>([]);

  const { data: allJudgesResult, isLoading: isLoadingJudges } = useJudges({
    search: searchTerm ?? undefined,
  });

  const { data: eventJudgesResult, isLoading: isLoadingEventJudges } =
    useEventJudges(eventId);
  const addJudgeToEventMutation = useAddJudgeToEvent();
  const removeJudgeFromEventMutation = useRemoveJudgeFromEvent();
  const confirm = useConfirm();

  const allJudges = allJudgesResult?.data || [];
  const eventJudges = eventJudgesResult?.data || [];

  const availableJudges = allJudges.filter(
    (judge) => !eventJudges.some((ej) => ej.judge.id === judge.id)
  );

  const handleAddJudge = async (judgeId: string) => {
    try {
      const result = await addJudgeToEventMutation.mutateAsync({
        eventId,
        judgeId,
      });

      if (result.success) {
        toast.success("Jurado adicionado ao evento!");
      } else {
        toast.error(result.error || "Erro ao adicionar jurado");
      }
    } catch (error) {
      console.error("Erro ao adicionar jurado:", error);
      toast.error("Erro ao adicionar jurado");
    }
  };

  const handleRemoveJudge = async (judgeId: string) => {
    const confirmed = await confirm.confirm({
      title: "Remover jurado",
      description: "Tem certeza que deseja remover este jurado do evento?",
      confirmText: "Sim, remover",
      cancelText: "Cancelar",
      destructive: true,
      icon: <UserMinus className="w-5 h-5 text-red-500" />,
    });

    if (!confirmed) return;

    try {
      const result = await removeJudgeFromEventMutation.mutateAsync({
        eventId,
        judgeId,
      });

      if (result.success) {
        toast.success("Jurado removido do evento!");
      } else {
        toast.error(result.error || "Erro ao remover jurado");
      }
    } catch (error) {
      console.error("Erro ao remover jurado:", error);
      toast.error("Erro ao remover jurado");
    }
  };

  const handleCreateJudgeSuccess = () => {
    setShowCreateForm(false);
    toast.success("Jurado criado com sucesso!");
  };

  const handleSelectJudge = (judgeId: string) => {
    setSelectedJudgeIds((prev) =>
      prev.includes(judgeId)
        ? prev.filter((id) => id !== judgeId)
        : [...prev, judgeId]
    );
  };

  const handleAddSelectedJudges = async () => {
    if (selectedJudgeIds.length === 0) return;

    try {
      await Promise.all(
        selectedJudgeIds.map((judgeId) =>
          addJudgeToEventMutation.mutateAsync({ eventId, judgeId })
        )
      );

      setSelectedJudgeIds([]);
      toast.success(
        `${selectedJudgeIds.length} jurado(s) adicionado(s) com sucesso!`
      );
    } catch (error) {
      console.error("Erro ao adicionar jurados:", error);
      toast.error("Erro ao adicionar jurados");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] max-w-none px-6">
        <DrawerHeader>
          <DrawerTitle className="flex justify-center items-center gap-2">
            <UserCheck className="w-5 h-5" />
            <span>Gerenciar Jurados - {eventName}</span>
          </DrawerTitle>
          <DrawerDescription>
            Adicione ou remova jurados para este evento. Você pode criar novos
            jurados ou selecionar dos existentes.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-6 h-full">
          {/* Controles */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar jurados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 h-12"
            >
              <Plus className="w-4 h-4" />
              Novo Jurado
            </Button>
          </div>

          {/* Formulário de criação */}
          {showCreateForm && (
            <div className="border relative rounded-lg p-4 bg-gray-50">
              <ScrollArea className="h-96 max-w-none">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Criar Novo Jurado</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateForm(false)}
                    className="absolute top-2 right-2"
                    aria-label="Fechar formulário de criação de jurado"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <JudgeForm
                  onSuccess={handleCreateJudgeSuccess}
                  onCancel={() => setShowCreateForm(false)}
                  isModal={true}
                />
              </ScrollArea>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Jurados Disponíveis */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-cinza-chumbo">
                  Jurados Disponíveis ({availableJudges.length})
                </h4>
                {selectedJudgeIds.length > 0 && (
                  <Button
                    onClick={handleAddSelectedJudges}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Selecionados ({selectedJudgeIds.length})
                  </Button>
                )}
              </div>

              <ScrollArea className="h-96 border rounded-lg">
                <div className="p-4 space-y-2">
                  {isLoadingJudges ? (
                    <div className="text-center py-8 text-gray-500">
                      Carregando jurados...
                    </div>
                  ) : availableJudges.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <UserCheck className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhum jurado disponível</p>
                      <p className="text-sm">
                        Crie um novo jurado para começar
                      </p>
                    </div>
                  ) : (
                    availableJudges.map((judge) => (
                      <div
                        key={judge.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedJudgeIds.includes(judge.id)
                            ? "bg-blue-50 border-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelectJudge(judge.id)}
                      >
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={judge.photoImageId || ""} />
                            <AvatarFallback>
                              {getInitials(judge.name)}
                            </AvatarFallback>
                          </Avatar>
                          {selectedJudgeIds.includes(judge.id) && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {judge.name}
                          </p>
                          {judge.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {judge.description}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddJudge(judge.id);
                          }}
                          disabled={addJudgeToEventMutation.isPending}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Jurados do Evento */}
            <div className="space-y-4">
              <h4 className="font-semibold text-cinza-chumbo">
                Jurados do Evento ({eventJudges.length})
              </h4>

              <ScrollArea className="h-96 border rounded-lg">
                <div className="p-4 space-y-2">
                  {isLoadingEventJudges ? (
                    <div className="text-center py-8 text-gray-500">
                      Carregando jurados do evento...
                    </div>
                  ) : eventJudges.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <UserMinus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhum jurado adicionado</p>
                      <p className="text-sm">
                        Selecione jurados da lista ao lado
                      </p>
                    </div>
                  ) : (
                    eventJudges.map(({ judge }) => (
                      <div
                        key={judge.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={judge.photoImageId || ""} />
                          <AvatarFallback>
                            {getInitials(judge.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {judge.name}
                          </p>
                          {judge.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {judge.description}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveJudge(judge.id)}
                          disabled={removeJudgeFromEventMutation.isPending}
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};
