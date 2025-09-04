"use client";

import { useForm } from "@tanstack/react-form";
import { Calendar, Plus, Trophy, Upload } from "lucide-react";
import { useState } from "react";
import z from "zod";

import { Modal } from "@/components/Modal";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker } from "@/components/ui/date-picker";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/components/ui/tags-input";
import { useToast } from "@/components/ui/toast";
import { APPROVAL_MODES, EVENT_CATEGORIES } from "@/constants";
import { Event } from "@/server/database/schema";
import { createEvent } from "@/server/events";

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
  approvalMode: z.enum(["automatic", "manual"]),
  rules: z.string().optional(),
  rulesFile: z.any().optional(),
  prizes: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const prizes = val.split(",").filter(Boolean);
      return prizes.length <= 5;
    }, "Máximo de 5 prémios permitidos"),
  notes: z.string().optional(),
});

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
  const { showToast } = useToast();
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
      approvalMode: "automatic" as const,
      rules: "",
      rulesFile: undefined,
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
          onClose();
          showToast({
            type: "success",
            title: "Sucesso!",
            description: "Evento criado com sucesso!",
          });
        } else {
          showToast({
            type: "error",
            title: "Erro",
            description: result.error || "Erro ao criar evento",
          });
        }
      } catch (error) {
        console.error("Erro ao criar evento:", error);
        showToast({
          type: "error",
          title: "Erro",
          description: "Erro ao criar evento",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const FieldError = ({ field }: { field: any }): React.ReactElement | null => {
    return field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
      <p className="text-red-500 text-sm mt-1">
        {field.state.meta.errors.join(", ")}
      </p>
    ) : null;
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
            >
              {(field) => (
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
            </form.Field>

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
            >
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Tipo de Evento *
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value: string) =>
                      field.handleChange(value as any)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_CATEGORIES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

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
            >
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Modalidade *
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value: string) =>
                      field.handleChange(value as any)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

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
            >
              {(field) => (
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
            </form.Field>

            {/* Máximo de Participantes */}
            <form.Field name="maxParticipants">
              {(field) => (
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
            </form.Field>
          </div>

          {/* Descrição */}
          <form.Field name="description">
            {(field) => (
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
          </form.Field>
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
            >
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Data e Hora de Início *
                  </label>
                  <DateTimePicker
                    date={field.state.value}
                    onDateChange={(date: Date | undefined) =>
                      field.handleChange(date || new Date())
                    }
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            {/* Data/Hora de Fim */}
            <form.Field name="endDate">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Data e Hora de Fim
                  </label>
                  <DateTimePicker
                    date={field.state.value || undefined}
                    onDateChange={(date: Date | undefined) =>
                      field.handleChange(date)
                    }
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            {/* Início das Inscrições */}
            <form.Field name="registrationStartDate">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Início das Inscrições
                  </label>
                  <DateTimePicker
                    date={field.state.value || undefined}
                    onDateChange={(date: Date | undefined) =>
                      field.handleChange(date)
                    }
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            {/* Fim das Inscrições */}
            <form.Field name="registrationEndDate">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Fim das Inscrições
                  </label>
                  <DateTimePicker
                    date={field.state.value || undefined}
                    onDateChange={(date: Date | undefined) =>
                      field.handleChange(date)
                    }
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>
        </div>

        {/* Configurações */}
        <div>
          <h4 className="font-semibold text-cinza-chumbo mb-4">
            Configurações
          </h4>

          <div className="space-y-4">
            {/* Evento Público */}
            <form.Field name="isPublic">
              {(field) => (
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="isPublic"
                    checked={field.state.value}
                    onCheckedChange={(checked: boolean) =>
                      field.handleChange(!!checked)
                    }
                  />
                  <label
                    htmlFor="isPublic"
                    className="text-sm text-cinza-chumbo"
                  >
                    Evento público (visível para todos)
                  </label>
                </div>
              )}
            </form.Field>

            {/* Requer Aprovação */}
            <form.Field name="requiresApproval">
              {(field) => (
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="requiresApproval"
                    checked={field.state.value}
                    onCheckedChange={(checked: boolean) =>
                      field.handleChange(!!checked)
                    }
                  />
                  <label
                    htmlFor="requiresApproval"
                    className="text-sm text-cinza-chumbo"
                  >
                    Inscrições requerem aprovação
                  </label>
                </div>
              )}
            </form.Field>

            {/* Modalidade de Aprovação */}
            {form.state.values.requiresApproval && (
              <form.Field
                name="approvalMode"
                validators={{
                  onChange: (value) => {
                    try {
                      eventSchema.shape.approvalMode.parse(value.value);
                      return undefined;
                    } catch (error) {
                      return (error as z.ZodError).issues[0].message;
                    }
                  },
                }}
              >
                {(field) => (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                      Modalidade de Aprovação
                    </label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value: string) =>
                        field.handleChange(value as any)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {APPROVAL_MODES.map((mode) => (
                          <SelectItem key={mode.value} value={mode.value}>
                            <div>
                              <div className="font-medium">{mode.label}</div>
                              <div className="text-xs text-gray-500">
                                {mode.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            )}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div>
          <h4 className="font-semibold text-cinza-chumbo mb-4">
            Informações Adicionais
          </h4>

          <div className="space-y-4">
            {/* Regulamento */}
            <form.Field name="rules">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Regulamento
                  </label>

                  {/* Botão de importar arquivo */}
                  <div className="mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".pdf,.txt,.doc,.docx";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) {
                            // Aqui você pode implementar a lógica para ler o arquivo
                            // Por enquanto, vamos apenas mostrar o nome do arquivo
                            showToast({
                              type: "success",
                              title: "Arquivo selecionado",
                              description: `Arquivo "${file.name}" selecionado. Implementar leitura do conteúdo.`,
                            });
                          }
                        };
                        input.click();
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Importar Arquivo (PDF, TXT, Word)
                    </button>
                  </div>

                  <RichTextEditor
                    value={field.state.value || ""}
                    onChange={field.handleChange}
                    placeholder="Digite o regulamento do evento..."
                    className="w-full"
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            {/* Prémios */}
            <form.Field name="prizes">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Prémios
                  </label>

                  {/* TagsInput para prêmios */}
                  <TagsInput
                    placeHolder="Adicionar prêmios (ex: 1º Lugar: 500€ + Troféu)"
                    value={
                      field.state.value
                        ? field.state.value.split(",").filter(Boolean)
                        : []
                    }
                    onChange={(tags: string[]) =>
                      field.handleChange(tags.join(","))
                    }
                    maxTagsCount={5}
                    icon={Trophy}
                  />

                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            {/* Notas */}
            <form.Field name="notes">
              {(field) => (
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
            </form.Field>
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
