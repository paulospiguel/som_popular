"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Plus, Trophy, Upload } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Modal } from "@/components/Modal";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { APPROVAL_MODES, EVENT_CATEGORIES, EVENT_TYPES } from "@/constants";
import { Event } from "@/server/database/schema";
import { createEvent } from "@/server/events";

// Schema de validação para eventos
const eventSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  type: z.enum(EVENT_TYPES.map((type) => type.value)),
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

  const eventDefaultValues = useMemo(
    () => ({
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
    }),
    []
  );

  const form = useForm<{ [k: string]: any }>({
    resolver: zodResolver(eventSchema),
    defaultValues: eventDefaultValues,
  });

  const onSubmit = async (value: any) => {
    try {
      const validatedData = eventSchema.parse(value);

      const result = await createEvent({
        ...validatedData,
        currentParticipants: 0,
        status: "draft",
        createdBy: "admin",
      });

      if (result.success && result.data) {
        onEventAdded(result.data);
        form.reset(eventDefaultValues);
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
    }
  };

  return (
    <Modal
      size="large"
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Novo Evento"
      icon={<Calendar className="w-6 h-6 text-verde-suave" />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h4 className="font-semibold text-cinza-chumbo mb-4">
              Informações Básicas
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome do Evento */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nome do Evento *</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors`}
                        placeholder="Ex: Concurso de Fado - Classificatória"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Evento */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Evento *</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {EVENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoria */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidade *</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {EVENT_CATEGORIES.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Local */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local *</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                        placeholder="Ex: Auditório Municipal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Máximo de Participantes */}
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Participantes</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        min={1}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                        placeholder="Deixe vazio para sem limite"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descrição */}
            <div className="mt-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors resize-none"
                        placeholder="Descrição do evento..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Datas e Horários */}
          <div>
            <h4 className="font-semibold text-cinza-chumbo mb-4">
              Datas e Horários
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data/Hora de Início */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora de Início *</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        onDateChange={(date: Date | undefined) =>
                          field.onChange(date || new Date())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data/Hora de Fim */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora de Fim</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value || undefined}
                        onDateChange={(date: Date | undefined) =>
                          field.onChange(date)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Início das Inscrições */}
              <FormField
                control={form.control}
                name="registrationStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início das Inscrições</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value || undefined}
                        onDateChange={(date: Date | undefined) =>
                          field.onChange(date)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fim das Inscrições */}
              <FormField
                control={form.control}
                name="registrationEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fim das Inscrições</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value || undefined}
                        onDateChange={(date: Date | undefined) =>
                          field.onChange(date)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          id="isPublic"
                          checked={!!field.value}
                          onCheckedChange={(checked: boolean) =>
                            field.onChange(!!checked)
                          }
                        />
                      </FormControl>
                      <FormLabel htmlFor="isPublic" className="!m-0">
                        Evento público (visível para todos)
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requer Aprovação */}
              <FormField
                control={form.control}
                name="requiresApproval"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          id="requiresApproval"
                          checked={!!field.value}
                          onCheckedChange={(checked: boolean) =>
                            field.onChange(!!checked)
                          }
                        />
                      </FormControl>
                      <FormLabel htmlFor="requiresApproval" className="!m-0">
                        Inscrições requerem aprovação
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Modalidade de Aprovação */}
              {form.watch("requiresApproval") && (
                <div className="ml-6">
                  <FormField
                    control={form.control}
                    name="approvalMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modalidade de Aprovação</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione a modalidade" />
                            </SelectTrigger>
                            <SelectContent>
                              {APPROVAL_MODES.map((mode) => (
                                <SelectItem key={mode.value} value={mode.value}>
                                  <div>
                                    <div className="font-medium">
                                      {mode.label}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {mode.description}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
              <div>
                <FormLabel>Regulamento</FormLabel>

                {/* Botão de importar arquivo */}
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".pdf,.txt,.doc,.docx";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
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

                <FormField
                  control={form.control}
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RichTextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Digite o regulamento do evento..."
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Prémios */}
              <div>
                <FormLabel>Prémios</FormLabel>
                <FormField
                  control={form.control}
                  name="prizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TagsInput
                          placeHolder="Adicionar prêmios (ex: 1º Lugar: 500€ + Troféu)"
                          value={
                            field.value
                              ? field.value.split(",").filter(Boolean)
                              : []
                          }
                          onChange={(tags: string[]) =>
                            field.onChange(tags.join(","))
                          }
                          maxTagsCount={5}
                          icon={Trophy}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notas */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Internas</FormLabel>
                    <FormControl>
                      <textarea
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors resize-none"
                        placeholder="Notas internas sobre o evento..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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
              disabled={form.formState.isSubmitting}
              className="px-6 py-2 bg-verde-suave text-white rounded-lg hover:bg-verde-suave/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {form.formState.isSubmitting ? (
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
      </Form>
    </Modal>
  );
};

export default AddEventModal;
