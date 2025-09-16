"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ModalForm, ModalNew } from "@/components/ModalNew";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfirm } from "@/hooks/use-confirm";
import { useSonner } from "@/hooks/use-sonner";
import { copyEvent, deleteEvent, updateEvent } from "@/server/events";
import { Event, EventFormData, eventFormSchema } from "@/types";

import { EventActionsMenu } from "./EventActionsMenu";
import EventFieldError from "./EventFieldError";
import { EventFormFields } from "./EventFormFields";
import { EventPrizesSection } from "./EventPrizesSection";
import { EventRegulationSection } from "./EventRegulationSection";
import { EventSettingsSection } from "./EventSettingsSection";

interface EventModalNewProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  event: Event | null;
  onEventUpdated?: (event: Event) => void;
}

export function EventModalNew({
  isOpen,
  onClose,
  mode,
  event = null,
  onEventUpdated,
}: EventModalNewProps) {
  const [isEditing, setIsEditing] = useState(mode === "create");
  const [loading, setLoading] = useState(false);
  const creating = mode === "create";

  const { showSuccess, showError } = useSonner();
  const { confirm, ConfirmDialog } = useConfirm();

  const initialValues = useMemo(() => {
    return {
      name: event?.name || "",
      subtitle: event?.subtitle || "",
      description: event?.description || undefined,
      location: event?.location || "",
      type: event?.type || "",
      category: event?.category || "",
      maxParticipants: event?.maxParticipants || undefined,
      startDate: event?.startDate || new Date(),
      endDate: event?.endDate || undefined,
      registrationStartDate: event?.registrationStartDate || undefined,
      registrationEndDate: event?.registrationEndDate || undefined,
      isPublic: event?.isPublic ?? true,
      requiresApproval: event?.requiresApproval ?? false,
      rules: event?.rules || undefined,
      prizes: event?.prizes || undefined,
      rulesFile: event?.rulesFile || undefined,
      notes: event?.notes || undefined,
      status: event?.status || "draft",
    };
  }, [event]);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
    mode: "onChange", // Validação em tempo real
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitted },
  } = form;

  // Usar watch para obter os valores atuais do formulário
  const formValues = watch();

  // Monitorar erros de validação quando o formulário é submetido
  useEffect(() => {
    console.log("Erros atuais:", errors);
    console.log("isSubmitted:", isSubmitted);
    if (isSubmitted && Object.keys(errors).length > 0) {
      // Mapear nomes dos campos para português
      const fieldNames: { [key: string]: string } = {
        name: "Nome do Evento",
        subtitle: "Etapa do Evento",
        type: "Tipo de Evento",
        category: "Modalidade",
        location: "Local",
        startDate: "Data de Início",
        endDate: "Data de Fim",
        registrationStartDate: "Início das Inscrições",
        registrationEndDate: "Fim das Inscrições",
        maxParticipants: "Máximo de Participantes",
        description: "Descrição",
        rules: "Regulamento",
        prizes: "Prémios",
        notes: "Notas",
      };

      // Processar erros e criar mensagens específicas
      const errorMessages = Object.entries(errors).map(([field, error]) => {
        const fieldName = fieldNames[field] || field;
        const message = error?.message || "Campo inválido";
        return `${fieldName}: ${message}`;
      });

      // Mostrar erros específicos
      if (errorMessages.length === 1) {
        showError(errorMessages[0]);
      } else if (errorMessages.length > 1) {
        showError(`Erros encontrados:\n• ${errorMessages.join("\n• ")}`);
      } else {
        showError("Por favor, preencha todos os campos obrigatórios");
      }
    }
  }, [isSubmitted, errors, showError]);

  // Tratamento de erro global para capturar erros do Zod
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.name === "ZodError") {
        event.preventDefault();
        console.error("ZodError capturado:", event.error);
        showError("Erro de validação. Verifique os campos obrigatórios.");
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [showError]);

  // Resetar formulário quando o evento mudar
  useEffect(() => {
    if (event && initialValues) {
      reset(initialValues);
    }
  }, [event, reset, initialValues]);

  // Resetar estado de edição quando o modal for fechado ou quando o modo mudar
  useEffect(() => {
    if (!isOpen) {
      // Quando o modal fechar, sempre resetar para modo view (exceto create)
      setIsEditing(false);
    } else {
      // Quando o modal abrir, definir o estado baseado no modo
      setIsEditing(mode === "create");
    }
  }, [isOpen, mode]);

  // Garantir que o formulário seja resetado quando alternar para modo de edição
  useEffect(() => {
    if (isEditing && event) {
      reset(initialValues);
    }
  }, [isEditing, event, reset, initialValues]);

  if (!event && !creating) return null;

  // Função para converter dados do formulário para o formato do banco
  const convertFormDataToEventData = (data: EventFormData) => {
    return {
      name: data.name,
      description: data.description || null,
      subtitle: data.subtitle || null,
      type: data.type,
      category: data.category,
      location: data.location,
      maxParticipants: data.maxParticipants || null,
      startDate: data.startDate,
      endDate: data.endDate || null,
      registrationStartDate: data.registrationStartDate || null,
      registrationEndDate: data.registrationEndDate || null,
      status: data.status || "draft",
      isPublic: data.isPublic ?? true,
      requiresApproval: data.requiresApproval ?? false,
      rules: data.rules || null,
      rulesFile: data.rulesFile || null,
      prizes: data.prizes || null,
      notes: data.notes || null,
    };
  };

  // Função para salvar edições do evento
  const handleSaveEvent = async (data: EventFormData) => {
    if (!event) return;
    console.log("data:", data);
    try {
      const eventData = convertFormDataToEventData(data);
      const result = await updateEvent(event.id, eventData);
      if (result.success) {
        showSuccess("Evento atualizado com sucesso!");
        if (onEventUpdated && result.data) {
          onEventUpdated(result.data);
        }
        setIsEditing(false);
        onClose(); // Fechar o modal após salvar
      } else {
        showError(result.error || "Erro ao atualizar evento");
      }
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      showError("Erro ao atualizar evento");
    }
  };

  // Função wrapper para tratar erros de validação
  const handleFormSubmit = async (data: EventFormData) => {
    try {
      await handleSaveEvent(data);
    } catch (error) {
      console.error("Erro na submissão do formulário:", error);
      showError("Erro ao processar formulário");
    }
  };

  // Funções para ações do menu
  const handleCopyEvent = async () => {
    if (!event) return;

    try {
      const confirmed = await confirm({
        title: "Copiar Evento",
        description:
          "Deseja criar uma cópia deste evento? A cópia será criada como rascunho e poderá ser editada livremente.",
        confirmText: "Sim, copiar",
        cancelText: "Cancelar",
      });

      console.log("Confirm result:", confirmed);

      if (!confirmed) return;

      setLoading(true);
      const result = await copyEvent(event.id);

      if (result.success) {
        showSuccess(result.message || "Evento copiado com sucesso!");
        if (onEventUpdated && result.data) {
          onEventUpdated(result.data);
        }
        onClose();
      } else {
        showError(result.error || "Erro ao copiar evento");
      }
    } catch (error) {
      console.error("Erro ao copiar evento:", error);
      showError("Erro ao copiar evento");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event) return;

    const confirmed = await confirm({
      title: "Excluir Evento",
      description: `Tem certeza que deseja excluir o evento "${event.name}"? Esta ação é irreversível e só é permitida para eventos em rascunho.`,
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      destructive: true,
    });

    if (!confirmed) return;

    try {
      const result = await deleteEvent(event.id);

      if (result.success) {
        showSuccess(result.message || "Evento excluído com sucesso!");
        onEventUpdated?.(event);
        onClose();
      } else {
        showError(result.error || "Erro ao excluir evento");
      }
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      showError("Erro ao excluir evento");
    }
  };

  // Funções para ações do menu
  const handleToggleVisibility = () => {
    showSuccess("Funcionalidade de visibilidade será implementada em breve!");
  };

  const handlePauseEvent = () => {
    showSuccess("Funcionalidade de pausar será implementada em breve!");
  };

  const headerActions = event ? (
    <EventActionsMenu
      isEditing={isEditing}
      event={event}
      onEdit={() => setIsEditing(true)}
      onSave={handleSubmit(handleSaveEvent)}
      onCancelEdit={() => {
        setIsEditing(false);
        reset(initialValues);
      }}
      onCopyEvent={handleCopyEvent}
      onToggleVisibility={handleToggleVisibility}
      onPauseEvent={handlePauseEvent}
      onDeleteEvent={handleDeleteEvent}
    />
  ) : null;

  const handleAIGenerate = () => {
    showSuccess("Funcionalidade de IA será implementada em breve!");
  };

  return (
    <ModalNew
      isOpen={isOpen}
      onClose={onClose}
      title={creating ? "Criar Evento" : "Detalhes do Evento"}
      subtitle={formValues.name || event?.name || ""}
      icon={<Calendar className="w-6 h-6 text-verde-suave" />}
      size="large"
      headerActions={headerActions}
    >
      <ModalForm onSubmit={handleSubmit(handleFormSubmit)}>
        <Form {...form}>
          <div className="p-8 space-y-8">
            {/* Nome e Ações de IA */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center justify-end mb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAIGenerate}
                  className="inline-flex items-center gap-2"
                >
                  <Wand2 className="w-3.5 h-3.5" /> Gerar com IA
                </Button>
              </div>

              <div className="w-full">
                <div className="flex flex-col gap-2">
                  <div className="gap-2 flex flex-col">
                    <Label isRequired htmlFor="name">
                      Nome do Evento
                    </Label>
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          className={`text-lg font-medium w-full`}
                          error={errors.name?.message}
                          placeholder="Ex: Concurso de Talentos - Classificatória"
                          viewMode={!isEditing}
                        />
                      )}
                    />
                    <EventFieldError error={errors.name?.message} />
                  </div>
                  <div className="gap-2 flex flex-col">
                    <Label htmlFor="subtitle">Etapa do Evento</Label>
                    <FormField
                      control={control}
                      name="subtitle"
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value || ""}
                          type="text"
                          className={`text-lg font-medium w-full`}
                          placeholder="Ex: Primeira Edição"
                          error={errors.subtitle?.message}
                          viewMode={!isEditing}
                        />
                      )}
                    />
                    <EventFieldError error={errors.subtitle?.message} />
                  </div>
                </div>
              </div>
            </div>

            {/* Campos do formulário */}
            <EventFormFields
              control={control}
              isEditing={isEditing}
              formValues={formValues}
              currentParticipants={event?.currentParticipants || 0}
              errors={errors}
            />

            {/* Regulamento */}
            <EventRegulationSection
              control={control}
              isEditing={isEditing}
              formValues={formValues}
            />

            {/* Configurações */}
            <EventSettingsSection
              control={control}
              isEditing={isEditing}
              formValues={formValues}
              errors={errors}
            />

            {/* Prémios */}
            <EventPrizesSection
              control={control}
              isEditing={isEditing}
              formValues={formValues}
            />

            {/* Footer Ações */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>
                {isEditing ? "Cancelar" : "Fechar"}
              </Button>
              {isEditing && (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-verde-suave hover:bg-verde-suave/90"
                >
                  {loading
                    ? "Salvando..."
                    : creating
                      ? "Criar Evento"
                      : "Salvar Alterações"}
                </Button>
              )}
            </div>
          </div>
        </Form>
      </ModalForm>
      <ConfirmDialog />
    </ModalNew>
  );
}
