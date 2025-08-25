"use client";

import { createEvent } from "@/actions/events";
import { Modal } from "@/components/Modal";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/db/schema";
import { Updater, useForm } from "@tanstack/react-form";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import z from "zod";

// Schema de validação para eventos
const eventSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  type: z.enum([
    "classificatoria",
    "semi-final",
    "final",
    "workshop",
    "masterclass",
  ]),
  category: z.enum(["pop", "rock", "sertanejo", "samba", "forró", "livre"]),
  location: z.string().min(3, "Local é obrigatório"),
  maxParticipants: z.number().min(1).optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  registrationStartDate: z.date().optional(),
  registrationEndDate: z.date().optional(),
  isPublic: z.boolean(),
  requiresApproval: z.boolean(),
  rules: z.string().optional(),
  prizes: z.string().optional(),
  notes: z.string().optional(),
});

const eventTypes = [
  { label: "Classificatória", value: "classificatoria" },
  { label: "Semi-Final", value: "semi-final" },
  { label: "Final", value: "final" },
  { label: "Workshop", value: "workshop" },
  { label: "Masterclass", value: "masterclass" },
] as const;

const eventCategories = [
  { label: "Fado", value: "fado" },
  { label: "Guitarra Portuguesa", value: "guitarra" },
  { label: "Cavaquinho", value: "cavaquinho" },
  { label: "Concertina", value: "concertina" },
  { label: "Viola Campaniça", value: "viola" },
  { label: "Cante Alentejano", value: "cante" },
] as const;

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: (event: Event) => void;
}

const AddEventModal = ({
  isOpen,
  onClose,
  onEventAdded,
}: AddEventModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      type: "" as const,
      category: "" as const,
      location: "",
      maxParticipants: undefined as number | undefined,
      startDate: new Date(),
      endDate: undefined as Date | undefined,
      registrationStartDate: undefined as Date | undefined,
      registrationEndDate: undefined as Date | undefined,
      isPublic: true,
      requiresApproval: false,
      rules: "",
      prizes: "",
      notes: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const validatedData = eventSchema.parse(value);

        const result = await createEvent({
          ...validatedData,
          currentParticipants: 0,
          status: "draft",
          createdBy: "admin", // TODO: pegar do contexto de autenticação
        });

        if (result.success && result.data) {
          onEventAdded(result.data);
          form.reset();
          alert("Evento criado com sucesso!");
        } else {
          alert(result.error || "Erro ao criar evento");
        }
      } catch (error) {
        console.error("Erro ao criar evento:", error);
        alert("Erro ao criar evento");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const FieldError = ({ field }: { field: any }) => {
    return field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
      <p className="text-red-500 text-sm mt-1">
        {field.state.meta.errors.join(", ")}
      </p>
    ) : null;
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  return (
    <Modal
      size="large"
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Novo Evento"
      icon={<Calendar className="w-6 h-6 text-verde-suave" />}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Informações Básicas */}
        <div>
          <h4 className="font-semibold text-cinza-chumbo mb-4">
            Informações Básicas
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome do Evento */}
            <form.Field
              name="name"
              validators={{
                onChange: (value) => {
                  try {
                    eventSchema.shape.name.parse(value.value);
                    return undefined;
                  } catch (error) {
                    return (error as z.ZodError).issues[0].message;
                  }
                },
              }}
              children={(field) => (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Nome do Evento *
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors ${
                      field.state.meta.errors.length > 0
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                    placeholder="Ex: Concurso de Fado - Classificatória"
                  />
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Tipo de Evento */}
            <form.Field
              name="type"
              validators={{
                onChange: (value) => {
                  try {
                    eventSchema.shape.type.parse(value.value);
                    return undefined;
                  } catch (error) {
                    return (error as z.ZodError).issues[0].message;
                  }
                },
              }}
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Tipo de Evento *
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as Updater<"">)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Categoria */}
            <form.Field
              name="category"
              validators={{
                onChange: (value) => {
                  try {
                    eventSchema.shape.category.parse(value.value);
                    return undefined;
                  } catch (error) {
                    return (error as z.ZodError).issues[0].message;
                  }
                },
              }}
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Categoria *
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as Updater<"">)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Local */}
            <form.Field
              name="location"
              validators={{
                onChange: (value) => {
                  try {
                    eventSchema.shape.location.parse(value.value);
                    return undefined;
                  } catch (error) {
                    return (error as z.ZodError).issues[0].message;
                  }
                },
              }}
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Local *
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors ${
                      field.state.meta.errors.length > 0
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                    placeholder="Ex: Auditório Municipal"
                  />
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Máximo de Participantes */}
            <form.Field
              name="maxParticipants"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Máximo de Participantes
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={field.state.value || ""}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseInt(e.target.value)
                        : undefined;
                      field.handleChange(value);
                    }}
                    onBlur={field.handleBlur}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                    placeholder="Deixe vazio para sem limite"
                  />
                  <FieldError field={field} />
                </div>
              )}
            />
          </div>

          {/* Descrição */}
          <form.Field
            name="description"
            children={(field) => (
              <div className="mt-4">
                <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                  Descrição
                </label>
                <textarea
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors resize-none"
                  placeholder="Descrição do evento..."
                />
                <FieldError field={field} />
              </div>
            )}
          />
        </div>

        {/* Datas e Horários */}
        <div>
          <h4 className="font-semibold text-cinza-chumbo mb-4">
            Datas e Horários
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data/Hora de Início */}
            <form.Field
              name="startDate"
              validators={{
                onChange: (value) => {
                  try {
                    eventSchema.shape.startDate.parse(value.value);
                    return undefined;
                  } catch (error) {
                    return (error as z.ZodError).issues[0].message;
                  }
                },
              }}
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Data e Hora de Início *
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDateForInput(field.state.value)}
                    onChange={(e) =>
                      field.handleChange(new Date(e.target.value))
                    }
                    onBlur={field.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors ${
                      field.state.meta.errors.length > 0
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                  />
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Data/Hora de Fim */}
            <form.Field
              name="endDate"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Data e Hora de Fim
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      field.state.value
                        ? formatDateForInput(field.state.value)
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value
                        ? new Date(e.target.value)
                        : undefined;
                      field.handleChange(value);
                    }}
                    onBlur={field.handleBlur}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                  />
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Início das Inscrições */}
            <form.Field
              name="registrationStartDate"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Início das Inscrições
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      field.state.value
                        ? formatDateForInput(field.state.value)
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value
                        ? new Date(e.target.value)
                        : undefined;
                      field.handleChange(value);
                    }}
                    onBlur={field.handleBlur}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                  />
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Fim das Inscrições */}
            <form.Field
              name="registrationEndDate"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Fim das Inscrições
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      field.state.value
                        ? formatDateForInput(field.state.value)
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value
                        ? new Date(e.target.value)
                        : undefined;
                      field.handleChange(value);
                    }}
                    onBlur={field.handleBlur}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                  />
                  <FieldError field={field} />
                </div>
              )}
            />
          </div>
        </div>

        {/* Configurações */}
        <div>
          <h4 className="font-semibold text-cinza-chumbo mb-4">
            Configurações
          </h4>

          <div className="space-y-4">
            {/* Evento Público */}
            <form.Field
              name="isPublic"
              children={(field) => (
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="isPublic"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                  />
                  <label
                    htmlFor="isPublic"
                    className="text-sm text-cinza-chumbo"
                  >
                    Evento público (visível para todos)
                  </label>
                </div>
              )}
            />

            {/* Requer Aprovação */}
            <form.Field
              name="requiresApproval"
              children={(field) => (
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="requiresApproval"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                  />
                  <label
                    htmlFor="requiresApproval"
                    className="text-sm text-cinza-chumbo"
                  >
                    Inscrições requerem aprovação
                  </label>
                </div>
              )}
            />
          </div>
        </div>

        {/* Informações Adicionais */}
        <div>
          <h4 className="font-semibold text-cinza-chumbo mb-4">
            Informações Adicionais
          </h4>

          <div className="space-y-4">
            {/* Regulamento */}
            <form.Field
              name="rules"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Regulamento
                  </label>
                  <textarea
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors resize-none"
                    placeholder="Regulamento do evento..."
                  />
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Prémios */}
            <form.Field
              name="prizes"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Prémios
                  </label>
                  <textarea
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors resize-none"
                    placeholder="Ex: 1º Lugar: 500€ + Troféu\n2º Lugar: 300€ + Medalha\n3º Lugar: 200€ + Medalha"
                  />
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Notas */}
            <form.Field
              name="notes"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Notas Internas
                  </label>
                  <textarea
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors resize-none"
                    placeholder="Notas internas sobre o evento..."
                  />
                  <FieldError field={field} />
                </div>
              )}
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-verde-suave text-white rounded-lg hover:bg-verde-suave/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>A criar...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Criar Evento</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEventModal;
