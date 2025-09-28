"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ModalForm, ModalNew } from "@/components/ModalNew";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APPROVAL_MODES_VALUES } from "@/constants";
import { useConfirm } from "@/hooks/use-confirm";
import { useSonner } from "@/hooks/use-sonner";
import { copyEvent, deleteEvent, updateEvent } from "@/server/events";
import { Event } from "@/types";
import { EventFormData, eventFormSchema } from "@/validators/events";

import { EventActionsMenu } from "./EventActionsMenu";
import EventFieldError from "./EventFieldError";
import { EventFormFields } from "./EventFormFields";
import { EventInternalNotesSection } from "./EventInternalNotesSection";
import { EventJodgesSection } from "./EventJodgesSection";
import { EventParticipantsSection } from "./EventParticipantsSection";
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
      ...event,
      startDate: event?.startDate || new Date(),
      isPublic: event?.isPublic ?? true,
      requiresApproval: event?.requiresApproval ?? false,
      approvalMode: event?.approvalMode ?? APPROVAL_MODES_VALUES.AUTOMATIC,
      status: event?.status || "draft",
    };
  }, [event]);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitted, isDirty },
  } = form;

  const formValues = watch();

  useEffect(() => {
    if (isSubmitted && Object.keys(errors).length > 0) {
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

      const errorMessages = Object.entries(errors).map(([field, error]) => {
        const fieldName = fieldNames[field] || field;
        const message = (error as any)?.message || "Campo inválido";
        return `${fieldName}: ${message}`;
      });

      if (errorMessages.length === 1) {
        showError(errorMessages[0]);
      } else if (errorMessages.length > 1) {
        showError(`Erros encontrados:\n• ${errorMessages.join("\n• ")}`);
      } else {
        showError("Por favor, preencha todos os campos obrigatórios");
      }
    }
  }, [isSubmitted, errors, showError]);

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

  useEffect(() => {
    if (event && initialValues) {
      reset(initialValues);
    }
  }, [event, reset, initialValues]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    } else {
      setIsEditing(mode === "create");
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (isEditing && event) {
      reset(initialValues);
    }
  }, [isEditing, event, reset, initialValues]);

  if (!event && !creating) return null;

  const handleCancelEdit = () => {
    if (!isEditing || creating) {
      reset(initialValues);
      onClose();
    } else {
      setIsEditing(false);
      reset(initialValues);
    }
  };

  const convertFormDataToEventData = (data: EventFormData) => {
    return {
      ...data,
      status: data.status || "draft",
      isPublic: data.isPublic ?? true,
      requiresApproval: data.requiresApproval ?? false,
    } as Event;
  };

  const handleSaveEvent = async (data: EventFormData) => {
    if (!event) return;
    try {
      const eventData = convertFormDataToEventData(data);
      const result = await updateEvent(event.id, eventData);
      if (result.success) {
        showSuccess("Evento atualizado com sucesso!");
        if (onEventUpdated && result.data) {
          onEventUpdated(result.data);
        }
        setIsEditing(false);
        onClose();
      } else {
        showError(result.error || "Erro ao atualizar evento");
      }
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      showError("Erro ao atualizar evento");
    }
  };

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      await handleSaveEvent(data);
    } catch (error) {
      console.error("Erro na submissão do formulário:", error);
      showError("Erro ao processar formulário");
    }
  };

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
      onCopyEvent={handleCopyEvent}
      onToggleVisibility={handleToggleVisibility}
      onPauseEvent={handlePauseEvent}
      onDeleteEvent={handleDeleteEvent}
    />
  ) : null;

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
              eventId={event?.id || ""}
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

            {/* Notas Internas */}
            <EventInternalNotesSection
              control={control}
              isEditing={isEditing}
              formValues={formValues}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Jurados */}
              <EventJodgesSection
                control={control}
                isEditing={isEditing}
                formValues={formValues}
                eventId={event?.id || ""}
                eventName={event?.name || ""}
              />

              {/* Participantes */}
              <EventParticipantsSection
                eventId={event?.id || ""}
                control={control}
                isEditing={isEditing}
                formValues={formValues}
                eventName={event?.name || ""}
              />
            </div>
            {/* Footer Ações */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
              >
                {isEditing ? "Cancelar" : "Fechar"}
              </Button>
              {isEditing && (
                <Button
                  type="submit"
                  disabled={loading || !isDirty}
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
