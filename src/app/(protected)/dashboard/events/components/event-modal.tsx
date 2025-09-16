"use client";

import {
  Calendar,
  CalendarDays,
  Clock,
  Edit,
  FileText,
  MapPin,
  Save,
  SaveOff,
  Trophy,
  Users,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Modal } from "@/components/Modal";
import { AvatarGroup } from "@/components/ui/avatar-group";
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
import { EVENT_CATEGORIES, EVENT_TYPES } from "@/constants";
import { Event } from "@/infra/database/schema";
import { generateContent } from "@/server/ai/generate";
import { createEvent, updateEvent } from "@/server/events";

type Mode = "create" | "edit";

interface EventModalProps {
  isOpen: boolean;
  mode: Mode;
  onClose: () => void;
  event?: Event | null;
  onSaved?: (event: Event) => void;
}

function formatDate(d: Date | null | undefined) {
  if (!d) return "";
  return d.toLocaleDateString("pt-PT");
}
function formatTime(d: Date | null | undefined) {
  if (!d) return "";
  return d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

export default function EventModal({
  isOpen,
  mode,
  onClose,
  event,
  onSaved,
}: EventModalProps) {
  const { showToast } = useToast();
  const creating = mode === "create";

  const defaults = useMemo(
    () => ({
      name: "",
      description: "",
      type: "" as any,
      category: "" as any,
      location: "",
      maxParticipants: null as number | null,
      startDate: new Date(),
      endDate: null as Date | null,
      registrationStartDate: null as Date | null,
      registrationEndDate: null as Date | null,
      isPublic: true,
      requiresApproval: false,
      rules: "",
      rulesFile: "",
      prizes: "",
      notes: "",
      status: "draft" as Event["status"],
    }),
    []
  );

  const [isEditing, setIsEditing] = useState(creating);
  const [edited, setEdited] = useState<Partial<Event>>({ ...defaults });
  const viewEvent = { ...(event as any), ...edited } as Event;

  useEffect(() => {
    if (isOpen) {
      setIsEditing(creating);
      if (creating) {
        setEdited({ ...defaults });
      } else if (event) {
        setEdited({
          name: event.name,
          description: event.description || "",
          type: event.type,
          category: event.category,
          location: event.location,
          maxParticipants: event.maxParticipants,
          startDate: event.startDate,
          endDate: event.endDate,
          registrationStartDate: event.registrationStartDate,
          registrationEndDate: event.registrationEndDate,
          isPublic: event.isPublic,
          requiresApproval: event.requiresApproval,
          rules: event.rules || "",
          rulesFile: event.rulesFile || "",
          prizes: event.prizes || "",
          notes: event.notes || "",
          status: event.status,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, creating, event?.id]);

  const autoRegistrationIfMissing = (payload: any) => {
    if (
      !payload.registrationStartDate &&
      !payload.registrationEndDate &&
      payload.startDate
    ) {
      const end = new Date(payload.startDate);
      end.setHours(end.getHours() - 1);
      payload.registrationEndDate = end;
    }
  };

  const handleSave = async () => {
    const payload: any = {
      ...edited,
      prizes: edited.prizes || "",
    };
    autoRegistrationIfMissing(payload);

    try {
      const result = creating
        ? await createEvent({
            ...(payload as any),
            currentParticipants: 0,
            createdBy: "admin",
          })
        : await updateEvent((event as Event).id, payload);

      if (result.success && result.data) {
        setIsEditing(false);
        setEdited({ ...result.data });
        onSaved?.(result.data);
        showToast({
          type: "success",
          title: "Sucesso!",
          description: creating
            ? "Evento criado com sucesso!"
            : "Evento atualizado com sucesso!",
        });
      } else {
        showToast({
          type: "error",
          title: "Erro",
          description: result.error || "Operação falhou",
        });
      }
    } catch (e) {
      console.error(e);
      showToast({
        type: "error",
        title: "Erro",
        description: "Erro ao salvar evento",
      });
    }
  };

  const handleAIGenerate = async () => {
    const objective =
      typeof window !== "undefined"
        ? window.prompt(
            "Descreva o objetivo do evento para gerar conteúdo (opcional):",
            viewEvent.name || ""
          )
        : "";
    try {
      const baseContext: Record<string, any> = {
        title: viewEvent.name,
        startDate: String(viewEvent.startDate || ""),
        location: viewEvent.location,
        category: viewEvent.category,
        type: viewEvent.type,
      };
      // Gerar descrição
      const description = await generateContent({
        prompt: `Gerar uma descrição curta e atrativa para um evento do festival. Objetivo: ${objective || "evento cultural"}.`,
        context: { ...baseContext, fields: ["description"] },
      });
      // Gerar regras
      const rules = await generateContent({
        prompt: `Escreva regras resumidas e claras para o evento descrito.`,
        context: { ...baseContext, fields: ["rules"] },
      });

      setEdited((prev) => ({
        ...prev,
        description: description ?? prev.description,
        rules: rules ?? prev.rules,
      }));
      showToast({
        type: "success",
        title: "Conteúdo gerado",
        description: "Descrição e regulamento sugeridos.",
      });
    } catch (e) {
      console.error(e);
      showToast({
        type: "error",
        title: "Erro",
        description: "Falha ao gerar conteúdo com IA",
      });
    }
  };

  const headerActions = (
    <>
      {isEditing ? (
        <>
          <button
            onClick={handleSave}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors group"
            title={creating ? "Criar evento" : "Salvar alterações"}
          >
            <Save className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
          </button>
          <button
            title="Cancelar edição"
            onClick={() => {
              if (creating) {
                setEdited({ ...defaults });
              } else if (event) {
                setEdited({
                  name: event.name,
                  description: event.description || "",
                  type: event.type,
                  category: event.category,
                  location: event.location,
                  maxParticipants: event.maxParticipants,
                  startDate: event.startDate,
                  endDate: event.endDate,
                  registrationStartDate: event.registrationStartDate,
                  registrationEndDate: event.registrationEndDate,
                  isPublic: event.isPublic,
                  requiresApproval: event.requiresApproval,
                  rules: event.rules || "",
                  rulesFile: event.rulesFile || "",
                  prizes: event.prizes || "",
                  notes: event.notes || "",
                  status: event.status,
                });
              }
              setIsEditing(false);
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <SaveOff className="w-5 h-5 text-red-500 group-hover:text-red-700" />
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
          title="Editar evento"
        >
          <Edit className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setIsEditing(creating);
      }}
      title={creating ? "Criar Evento" : "Detalhes do Evento"}
      subtitle={(edited.name as string) || event?.name || ""}
      icon={<Calendar className="w-6 h-6 text-verde-suave" />}
      size="large"
      headerActions={headerActions}
    >
      <div className="p-8 space-y-8">
        {/* Nome e Ações de IA */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-cinza-chumbo/70 font-medium">
              Nome do Evento
            </label>
            <button
              onClick={handleAIGenerate}
              className="inline-flex items-center gap-2 px-2 py-1 text-xs border rounded-md hover:bg-gray-50"
            >
              <Wand2 className="w-3.5 h-3.5" /> Gerar com IA
            </button>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={edited.name as string}
              onChange={(e) =>
                setEdited((p) => ({ ...p, name: e.target.value }))
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-verde-suave focus:border-transparent"
              placeholder="Ex: Concurso de Talentos - Classificatória"
            />
          ) : (
            <h2 className="text-xl font-semibold text-cinza-chumbo">
              {viewEvent.name}
            </h2>
          )}
        </div>

        {/* Status e informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-cinza-chumbo/70 font-medium">
              Tipo de Evento
            </label>
            {isEditing ? (
              <Select
                value={(edited.type as any) || ""}
                onValueChange={(v) =>
                  setEdited((p) => ({ ...p, type: v as any }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value as any}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="font-semibold text-cinza-chumbo">
                {EVENT_TYPES.find((t) => t.value === viewEvent.type)?.label ||
                  viewEvent.type}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-cinza-chumbo/70 font-medium">
              Modalidade
            </label>
            {isEditing ? (
              <Select
                value={(edited.category as any) || ""}
                onValueChange={(v) =>
                  setEdited((p) => ({ ...p, category: v as any }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value as any}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="font-semibold text-cinza-chumbo">
                {EVENT_CATEGORIES.find((c) => c.value === viewEvent.category)
                  ?.label || viewEvent.category}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-cinza-chumbo/70 font-medium">
              Local
            </label>
            {isEditing ? (
              <input
                type="text"
                value={edited.location as string}
                onChange={(e) =>
                  setEdited((p) => ({ ...p, location: e.target.value }))
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Local do evento..."
              />
            ) : (
              <p className="font-semibold text-cinza-chumbo flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> {viewEvent.location}
              </p>
            )}
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="text-sm text-cinza-chumbo/70 font-medium">
            Descrição
          </label>
          {isEditing ? (
            <textarea
              value={(edited.description as string) || ""}
              onChange={(e) =>
                setEdited((p) => ({ ...p, description: e.target.value }))
              }
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Descrição do evento..."
            />
          ) : (
            <p className="mt-1 text-cinza-chumbo whitespace-pre-wrap">
              {viewEvent.description || "Sem descrição"}
            </p>
          )}
        </div>

        {/* Participantes e Datas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-cinza-chumbo/70 font-medium flex items-center">
              <Users className="w-4 h-4 mr-1" /> Participantes
            </label>
            {isEditing ? (
              <input
                type="number"
                value={edited.maxParticipants ?? ""}
                onChange={(e) =>
                  setEdited((p) => ({
                    ...p,
                    maxParticipants: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Máximo de participantes (opcional)"
                min={1}
              />
            ) : (
              <p className="font-semibold text-cinza-chumbo">
                {viewEvent.currentParticipants}
                {viewEvent.maxParticipants
                  ? ` / ${viewEvent.maxParticipants}`
                  : ""}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-cinza-chumbo/70 font-medium flex items-center">
              <CalendarDays className="w-4 h-4 mr-1" /> Data e Hora de Início
            </label>
            {isEditing ? (
              <DateTimePicker
                date={edited.startDate as Date}
                onDateChange={(date) =>
                  setEdited((p) => ({ ...p, startDate: date || new Date() }))
                }
              />
            ) : (
              <p className="font-semibold text-cinza-chumbo">
                {formatDate(viewEvent.startDate)}{" "}
                <span className="text-sm text-cinza-chumbo/70">
                  às {formatTime(viewEvent.startDate)}
                </span>
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-cinza-chumbo/70 font-medium">
              Data e Hora de Fim
            </label>
            {isEditing ? (
              <DateTimePicker
                date={(edited.endDate as Date) || undefined}
                onDateChange={(date) =>
                  setEdited((p) => ({ ...p, endDate: date || null }))
                }
              />
            ) : viewEvent.endDate ? (
              <p className="font-semibold text-cinza-chumbo">
                {formatDate(viewEvent.endDate)}{" "}
                <span className="text-sm text-cinza-chumbo/70">
                  às {formatTime(viewEvent.endDate)}
                </span>
              </p>
            ) : (
              <p className="text-sm text-cinza-chumbo/50 italic">
                Não definido
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-cinza-chumbo/70 font-medium flex items-center">
              <Clock className="w-4 h-4 mr-1" /> Início das Inscrições
            </label>
            {isEditing ? (
              <DateTimePicker
                date={(edited.registrationStartDate as Date) || undefined}
                onDateChange={(date) =>
                  setEdited((p) => ({
                    ...p,
                    registrationStartDate: date || null,
                  }))
                }
              />
            ) : viewEvent.registrationStartDate ? (
              <p className="font-semibold text-cinza-chumbo">
                {formatDate(viewEvent.registrationStartDate)}{" "}
                <span className="text-sm text-cinza-chumbo/70">
                  às {formatTime(viewEvent.registrationStartDate)}
                </span>
              </p>
            ) : (
              <p className="text-sm text-cinza-chumbo/50 italic">
                Não definido
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-cinza-chumbo/70 font-medium">
              Fim das Inscrições
            </label>
            {isEditing ? (
              <DateTimePicker
                date={(edited.registrationEndDate as Date) || undefined}
                onDateChange={(date) =>
                  setEdited((p) => ({
                    ...p,
                    registrationEndDate: date || null,
                  }))
                }
              />
            ) : viewEvent.registrationEndDate ? (
              <p className="font-semibold text-cinza-chumbo">
                {formatDate(viewEvent.registrationEndDate)}{" "}
                <span className="text-sm text-cinza-chumbo/70">
                  às {formatTime(viewEvent.registrationEndDate)}
                </span>
              </p>
            ) : (
              <p className="text-sm text-cinza-chumbo/50 italic">
                Não definido
              </p>
            )}
          </div>
        </div>

        {/* Regulamento */}
        <div>
          <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" /> Regulamento
          </h4>
          {isEditing ? (
            <RichTextEditor
              value={(edited.rules as string) || ""}
              onChange={(val) => setEdited((p) => ({ ...p, rules: val }))}
              placeholder="Digite o regulamento do evento..."
              className="w-full"
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <RichTextEditor
                value={(viewEvent.rules as string) || ""}
                onChange={() => {}}
                readOnly
                showHtml
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Prémios */}
        <div>
          <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2" /> Prémios
          </h4>
          {isEditing ? (
            <TagsInput
              disabled={false}
              value={
                (edited.prizes as string)?.split(",").filter(Boolean) || []
              }
              onChange={(value) =>
                setEdited((p) => ({ ...p, prizes: value.join(",") }))
              }
              name="prizes"
              placeHolder="Prémios do evento..."
              maxTagsCount={5}
              icon={Trophy}
            />
          ) : (
            <div className="space-y-2">
              {(viewEvent.prizes as string) ? (
                <div className="flex flex-wrap gap-2">
                  {(viewEvent.prizes as string)
                    .split(",")
                    .filter(Boolean)
                    .map((prize, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium shadow-sm"
                      >
                        <Trophy className="w-4 h-4 mr-2 text-amber-100" />
                        {prize.trim()}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sem prémios definidos</p>
              )}
            </div>
          )}
        </div>

        {/* Participantes (somente visualizar) */}
        {!creating && (
          <div>
            <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" /> Participantes do Evento
            </h4>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              {/* Placeholder para manter consistência visual */}
              <AvatarGroup
                items={[]}
                maxVisible={8}
                size="md"
                type="participants"
              />
            </div>
          </div>
        )}

        {/* Footer Ações */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isEditing ? "Cancelar" : "Fechar"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-verde-suave text-white rounded-lg hover:bg-verde-suave/90 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />{" "}
              {creating ? "Criar Evento" : "Salvar Alterações"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
